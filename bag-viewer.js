/** Shared continuous, geometric 3D viewer. No frame sequence or image crossfade. */
let dependencies;
const load = () => dependencies ||= Promise.all([
  import('./vendor/three.module.js'), import('./bag-models.js?v=20261021-3d1'),
  import('./vendor/RoomEnvironment.js')
]);
export async function createBagViewer(host, id, options = {}) {
  const [T, {createBag}, {RoomEnvironment}] = await load();
  let renderer;
  try {
    renderer = new T.WebGLRenderer({antialias: true, alpha: false, powerPreference: 'low-power'});
  } catch { throw new Error('Этот браузер не смог запустить 3D. Фотографии доступны в соседней вкладке.'); }
  const canvas = renderer.domElement;
  canvas.className = 'bag-webgl';
  canvas.setAttribute('aria-hidden', 'true');
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  const scene = new T.Scene();
  scene.background = new T.Color('#eeeae3');
  const camera = new T.PerspectiveCamera(32, 1, .05, 100);
  const pmrem = new T.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .04);
  scene.environment = environment.texture;
  scene.environmentIntensity = .72;
  room.dispose(); pmrem.dispose();
  scene.add(new T.HemisphereLight(0xffffff, 0xc0af96, 1.5));
  const key = new T.DirectionalLight(0xfff8ed, 3.2);
  key.position.set(-3.5, 7, 5); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, {left:-4,right:4,top:5,bottom:-4,near:.1,far:18});
  key.shadow.bias = -.0005; key.shadow.normalBias = .025; key.shadow.radius = 5;
  scene.add(key);
  const fill = new T.DirectionalLight(0xe7edff, 1.3); fill.position.set(5, 3, -3); scene.add(fill);
  const ground = new T.Mesh(new T.PlaneGeometry(50,50), new T.ShadowMaterial({opacity:.12}));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -.018; ground.receiveShadow = true; scene.add(ground);
  let bag, dimensions = new T.Vector3(), target = new T.Vector3(), fit = 8;
  let theta = .24, desiredTheta = .24, phi = 1.4, desiredPhi = 1.4, zoom = 1, desiredZoom = 1;
  let auto = false, visible = true, disposed = false, lost = false, raf = 0, previous = 0, noticeTime = 0;
  let moved = false, pointers = new Map(), pinchDistance = 0;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = T.MathUtils.clamp;
  const angle = () => ((Math.round(T.MathUtils.radToDeg(theta)) % 360) + 360) % 360;
  function disposeObject(object) {
    const geometries = new Set(), materials = new Set(), textures = new Set();
    object.traverse(child => {
      if(child.geometry) geometries.add(child.geometry);
      const ms = Array.isArray(child.material) ? child.material : [child.material];
      ms.filter(Boolean).forEach(m => {materials.add(m); Object.values(m).forEach(v => {if(v?.isTexture) textures.add(v)});});
    });
    geometries.forEach(g=>g.dispose()); materials.forEach(m=>m.dispose()); textures.forEach(t=>t.dispose());
  }
  function setModel(nextId) {
    if(disposed) return;
    const next = createBag(T, nextId);
    if(bag) { scene.remove(bag); disposeObject(bag); }
    bag = next;
    bag.traverse(o => {if(o.isMesh) {o.castShadow=true; o.receiveShadow=true;}});
    scene.add(bag);
    const box = new T.Box3().setFromObject(bag);
    box.getSize(dimensions); box.getCenter(target);
    reset(); resize();
  }
  function resize() {
    if(disposed) return;
    const {width,height} = host.getBoundingClientRect();
    if(!width || !height) return;
    renderer.setSize(width,height,false); camera.aspect = width/height; camera.updateProjectionMatrix();
    const tangent = Math.tan(T.MathUtils.degToRad(camera.fov/2));
    // Include depth and a full rotation's widest span so no side disappears at 90°.
    const width3d = Math.hypot(dimensions.x,dimensions.z);
    fit = Math.max(dimensions.y/(2*tangent),width3d/(2*tangent*camera.aspect))*1.24 + dimensions.z*.4;
    wake();
  }
  function render(now) {
    raf = 0;
    if(disposed || lost || !visible || document.hidden) {previous=0;return;}
    const delta = Math.min((now-(previous||now))/1000,.05); previous=now;
    if(auto && !pointers.size) desiredTheta += delta*.24;
    const ease = reduceMotion ? 1 : 1-Math.exp(-delta*15);
    theta += (desiredTheta-theta)*ease; phi += (desiredPhi-phi)*ease; zoom += (desiredZoom-zoom)*ease;
    const r=fit/zoom, sin=Math.sin(phi);
    camera.position.set(target.x + r*sin*Math.sin(theta), target.y + r*Math.cos(phi), target.z + r*sin*Math.cos(theta));
    camera.lookAt(target); renderer.render(scene,camera);
    if(now-noticeTime>90) {noticeTime=now; options.onChange?.({angle:angle(),zoom,tilt:Math.round(90-T.MathUtils.radToDeg(phi)),auto});}
    if(auto || pointers.size || Math.abs(desiredTheta-theta)>.00005 || Math.abs(desiredPhi-phi)>.00005 || Math.abs(desiredZoom-zoom)>.00005) wake();
    else previous=0;
  }
  function wake() { if(!raf && !disposed && !lost && visible && !document.hidden) raf=requestAnimationFrame(render); }
  function setAuto(value) {auto=Boolean(value); options.onAutoChange?.(auto); wake();}
  function reset() {desiredTheta=.24; desiredPhi=1.4; desiredZoom=1; setAuto(false); wake();}
  function setAngle(degrees) {
    const currentDegrees=T.MathUtils.radToDeg(desiredTheta);
    const difference=(((degrees-currentDegrees+180)%360)+360)%360-180;
    desiredTheta += T.MathUtils.degToRad(difference); setAuto(false); wake();
  }
  function zoomBy(amount) {desiredZoom=clamp(desiredZoom+amount,.85,2.8);wake();}
  const controller=new AbortController(); const signal=controller.signal;
  function on(target,event,handler,opts={}) {target.addEventListener(event,handler,{...opts,signal});}
  on(canvas,'pointerdown',e=>{
    if(e.button !== 0 && e.pointerType==='mouse') return;
    e.preventDefault(); host.focus({preventScroll:true}); setAuto(false); moved=false;
    pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}); canvas.setPointerCapture(e.pointerId);
    if(pointers.size===2) {const p=[...pointers.values()]; pinchDistance=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);}
    host.classList.add('is-dragging'); wake();
  });
  on(canvas,'pointermove',e=>{
    const old=pointers.get(e.pointerId); if(!old) return;
    if(e.pointerType==='mouse' && e.buttons===0) {pointers.clear();host.classList.remove('is-dragging');return;}
    const dx=e.clientX-old.x,dy=e.clientY-old.y;
    pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pointers.size===2) {
      const p=[...pointers.values()], distance=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);
      if(pinchDistance>0) desiredZoom=clamp(desiredZoom*distance/pinchDistance,.85,2.8);
      pinchDistance=distance;
    } else {desiredTheta -= dx*.009;desiredPhi=clamp(desiredPhi-dy*.007,.18,Math.PI-.25);}
    if(Math.abs(dx)+Math.abs(dy)>1)moved=true;
    wake();
  });
  const release=e=>{pointers.delete(e.pointerId);pinchDistance=0;if(!pointers.size)host.classList.remove('is-dragging');wake();};
  ['pointerup','pointercancel','lostpointercapture'].forEach(event=>on(canvas,event,release));
  on(window,'blur',()=>{pointers.clear();host.classList.remove('is-dragging');});
  if(options.wheel) on(canvas,'wheel',e=>{e.preventDefault();zoomBy(-e.deltaY*.0015);},{passive:false});
  on(host,'keydown',e=>{
    if(e.target!==host) return;
    let used=true;
    if(e.key==='ArrowLeft') desiredTheta-=.18;
    else if(e.key==='ArrowRight') desiredTheta+=.18;
    else if(e.key==='ArrowUp') desiredPhi=clamp(desiredPhi-.13,.18,Math.PI-.25);
    else if(e.key==='ArrowDown') desiredPhi=clamp(desiredPhi+.13,.18,Math.PI-.25);
    else if(e.key==='+'||e.key==='=')zoomBy(.2);
    else if(e.key==='-')zoomBy(-.2);
    else if(e.key==='Home')reset();else used=false;
    if(used){e.preventDefault();setAuto(false);wake();}
  });
  on(canvas,'dblclick',()=>reset());
  on(canvas,'webglcontextlost',e=>{e.preventDefault();lost=true;cancelAnimationFrame(raf);raf=0;host.classList.remove('is-3d-ready');options.onError?.('3D-просмотр приостановлен браузером. Откройте его повторно.');});
  on(document,'visibilitychange',()=>{previous=0;wake();});
  const resizeObserver=new ResizeObserver(resize); resizeObserver.observe(host);
  setModel(id); host.append(canvas); host.classList.add('is-3d-ready');resize();
  return {
    setModel, setAngle, zoomBy, reset, setAuto,
    step:radians=>{desiredTheta+=radians;setAuto(false);wake();},
    setVisible:value=>{visible=Boolean(value);previous=0;if(!visible){cancelAnimationFrame(raf);raf=0;}else wake();},
    resize,
    dispose(){if(disposed)return;disposed=true;controller.abort();resizeObserver.disconnect();cancelAnimationFrame(raf);disposeObject(bag);ground.geometry.dispose();ground.material.dispose();environment.dispose();renderer.dispose();renderer.forceContextLoss();canvas.remove();host.classList.remove('is-3d-ready','is-dragging');}
  };
}
