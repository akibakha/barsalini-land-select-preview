/**
 * Photograph-informed procedural concept models, not scanned product geometry.
 * Every visible part is a real mesh. No product photograph is mapped onto a plane.
 * THREE is supplied by the viewer so the page loads a single Three.js instance.
 */
export function createBag(THREE, requestedId = 'velour') {
  const known = ['velour', 'forma', 'sera', 'linea', 'luna', 'piega', 'volume', 'riva', 'amuleto', 'cilindro'];
  const id = known.includes(requestedId) ? requestedId : 'velour';
  const group = new THREE.Group();
  group.name = `Barsalini ${id} — sculpted concept`;
  const PI = Math.PI;
  const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const mix = (a, b, t) => a + (b - a) * t;
  const signedPow = (v, p) => Math.sign(v) * Math.pow(Math.abs(v), p);

  // Small deterministic texture, generated from grain rather than product imagery.
  function grainTexture(kind) {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    let state = 73471;
    const rand = () => ((state = (state * 16807) % 2147483647) - 1) / 2147483646;
    ctx.fillStyle = '#888'; ctx.fillRect(0, 0, 256, 256);
    if (kind === 'straw') {
      ctx.fillStyle = '#9d8d70'; ctx.fillRect(0, 0, 256, 256);
      for (let y = -12; y < 270; y += 12) {
        for (let x = -20; x < 280; x += 22) {
          ctx.save(); ctx.translate(x + ((y / 12) % 2) * 11, y);
          ctx.rotate(((y / 12) % 2 ? -1 : 1) * .48);
          const c = 150 + rand() * 75;
          ctx.fillStyle = `rgb(${c},${c * .93},${c * .77})`;
          ctx.beginPath(); ctx.ellipse(0, 0, 13, 4.7, 0, 0, PI * 2); ctx.fill();
          ctx.strokeStyle = 'rgba(70,50,25,.23)'; ctx.lineWidth = .6; ctx.stroke(); ctx.restore();
        }
      }
    } else {
      const dots = kind === 'suede' ? 27000 : 13000;
      for (let i = 0; i < dots; i++) {
        const c = Math.floor(70 + rand() * 110);
        ctx.fillStyle = `rgba(${c},${c},${c},${kind === 'suede' ? .4 : .5})`;
        const r = kind === 'suede' ? .25 + rand() * .8 : .5 + rand() * 1.8;
        ctx.beginPath(); ctx.ellipse(rand() * 256, rand() * 256, r, r * .65, rand() * PI, 0, PI * 2); ctx.fill();
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(kind === 'straw' ? 6 : 5, kind === 'straw' ? 3 : 5);
    texture.anisotropy = 4;
    return texture;
  }
  const leatherGrain = grainTexture('leather');
  const suedeGrain = grainTexture('suede');
  const colors = {
    velour: '#3b3023', forma: '#493025', sera: '#a57643', linea: '#4d2025',
    luna: '#443029', piega: '#af6e39', volume: '#67574b', riva: '#c9ac78',
    amuleto: '#622530', cilindro: '#a74e2d',
  };
  const suede = id === 'velour' || id === 'sera';
  const leather = new THREE.MeshStandardMaterial({ color: colors[id], roughness: suede ? .96 : .52, metalness: 0, bumpMap: suede ? suedeGrain : leatherGrain, bumpScale: suede ? .014 : .009 });
  const trim = new THREE.MeshStandardMaterial({ color: id === 'velour' ? '#201d1a' : colors[id], roughness: .48, metalness: 0, bumpMap: leatherGrain, bumpScale: .006 });
  const edge = new THREE.MeshStandardMaterial({ color: id === 'velour' ? '#28231b' : new THREE.Color(colors[id]).multiplyScalar(.63), roughness: .65 });
  const lining = new THREE.MeshStandardMaterial({ color: id === 'riva' ? '#a48a60' : '#2d241e', roughness: 1, side: THREE.DoubleSide });
  const gold = new THREE.MeshStandardMaterial({ color: '#c2a36b', roughness: .28, metalness: .85 });
  const silver = new THREE.MeshStandardMaterial({ color: '#d8d5cb', roughness: .24, metalness: .9 });
  const hardware = id === 'velour' ? silver : gold;
  const stitchMaterial = new THREE.LineBasicMaterial({ color: id === 'velour' ? '#76634b' : new THREE.Color(colors[id]).lerp(new THREE.Color('#dcc4a0'), .33), transparent: true, opacity: .7 });

  function mesh(geo, mat, name) {
    const object = new THREE.Mesh(geo, mat);
    object.name = name || 'Leather panel';
    object.castShadow = true; object.receiveShadow = true;
    group.add(object); return object;
  }
  function curve(points, closed = false) {
    return new THREE.CatmullRomCurve3(points.map(p => p.isVector3 ? p : V(...p)), closed, 'centripetal');
  }
  function pipe(points, radius = .012, mat = edge, closed = false, name = 'Bound leather seam', segments = 72, radial = 5) {
    return mesh(new THREE.TubeGeometry(curve(points, closed), segments, radius, radial, closed), mat, name);
  }
  function stitches(points, closed = false, spacing = .045) {
    const c = curve(points, closed), count = Math.max(8, Math.round(c.getLength() / spacing));
    const pos = [];
    for (let i = 0; i < count; i++) {
      for (const t of [(i + .14) / count, (i + .7) / count]) { const p = c.getPointAt(t); pos.push(p.x, p.y, p.z); }
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const line = new THREE.LineSegments(geo, stitchMaterial); line.name = 'Saddle stitching'; group.add(line); return line;
  }
  function ring(x, y, z, radius = .085, rotY = 0, material = hardware) {
    const r = mesh(new THREE.TorusGeometry(radius, .019, 7, 28), material, 'Metal attachment ring');
    r.position.set(x, y, z); r.rotation.y = rotY; return r;
  }
  function roundBox(w, h, d, material, x = 0, y = 0, z = 0, radius = .025, name = 'Leather tab') {
    const r = Math.min(radius, w * .48, h * .48);
    const s = new THREE.Shape();
    s.moveTo(-w/2+r, -h/2); s.lineTo(w/2-r, -h/2); s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);
    s.lineTo(w/2,h/2-r); s.quadraticCurveTo(w/2,h/2,w/2-r,h/2); s.lineTo(-w/2+r,h/2);
    s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r); s.lineTo(-w/2,-h/2+r); s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
    const geo = new THREE.ExtrudeGeometry(s, { depth: d, steps: 1, bevelEnabled: true, bevelThickness: .008, bevelSize: .008, bevelSegments: 2, curveSegments: 8 });
    geo.translate(0,0,-d/2); const m = mesh(geo,material,name); m.position.set(x,y,z); return m;
  }
  function strap(points, width = .13, thickness = .035, material = trim, sewn = true, name = 'Leather shoulder strap') {
    const c = curve(points), n = 72, positions = [], uvs = [], indices = [], edges = [[], []];
    for (let i = 0; i <= n; i++) {
      const t = i/n, p = c.getPoint(t), tan = c.getTangent(t).normalize();
      let side = V(-tan.y,tan.x,0).normalize();
      if (side.lengthSq() < .5) side = V(1,0,0);
      const normal = new THREE.Vector3().crossVectors(tan,side).normalize();
      for (let k = 0; k < 8; k++) {
        const a = k / 8 * PI * 2;
        const q = p.clone().addScaledVector(side, Math.cos(a)*width/2).addScaledVector(normal, Math.sin(a)*thickness/2);
        positions.push(q.x,q.y,q.z); uvs.push(t*3,k/8);
      }
      edges[0].push(p.clone().addScaledVector(side,width*.37).addScaledVector(normal,thickness*.52));
      edges[1].push(p.clone().addScaledVector(side,-width*.37).addScaledVector(normal,thickness*.52));
      if(i<n)for(let k=0;k<8;k++){const a=i*8+k,b=i*8+(k+1)%8,c1=(i+1)*8+k,d=(i+1)*8+(k+1)%8;indices.push(a,b,c1,b,d,c1);}
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3)); geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geo.setIndex(indices);geo.computeVertexNormals();
    const m = mesh(geo,material,name);
    if(sewn){stitches(edges[0],false,.045);stitches(edges[1],false,.045);} return m;
  }

  function pathShape(commands) {
    const s = new THREE.Shape();
    for (const [method,...args] of commands) s[method](...args);
    return s;
  }
  // Rounded, subtly inflated front and back panels plus an actual side gusset.
  function pillow(shape, depth, opts = {}) {
    const N = opts.segments || 112, R = opts.rings || 17;
    const outline = shape.getSpacedPoints(N).slice(0,N);
    const center = opts.center || {x:0,y: .7};
    const bevel = Math.min(depth*.29, opts.bevel || .12);
    const pos=[],uv=[],idx=[];
    function point(i,r,side) {
      const o=outline[i%N],x=mix(center.x,o.x,r),y=mix(center.y,o.y,r);
      let z = depth/2-bevel*(1-Math.sqrt(Math.max(0,1-Math.pow(r,14))));
      z += (opts.bulge || 0)*Math.pow(Math.sin(PI*r),2);
      if(opts.wrinkle) z += opts.wrinkle(x,y,side)*Math.pow(Math.sin(PI*r),.7);
      if(opts.depthProfile) z *= opts.depthProfile(x,y);
      return V(x,y,side*z);
    }
    for(const side of [1,-1]) {
      const offset=pos.length/3;
      for(let j=0;j<=R;j++)for(let i=0;i<N;i++){const p=point(i,j/R,side);pos.push(p.x,p.y,p.z);uv.push(p.x/3+.5,p.y/3);}
      for(let j=0;j<R;j++)for(let i=0;i<N;i++){
        const a=offset+j*N+i,b=offset+(j+1)*N+i,c=offset+(j+1)*N+(i+1)%N,d=offset+j*N+(i+1)%N;
        if(side===1)idx.push(a,b,c,a,c,d);else idx.push(a,c,b,a,d,c);
      }
    }
    const back=(R+1)*N;
    for(let i=0;i<N;i++){const a=R*N+i,b=R*N+(i+1)%N,c=back+R*N+i,d=back+R*N+(i+1)%N;idx.push(a,c,b,b,c,d);}
    const geo = new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();
    mesh(geo,opts.material || leather, opts.name || 'Sculpted leather body');
    const seam = side => outline.map((_,i)=>point(i,.986,side));
    if(opts.seams!==false)for(const side of [1,-1]){pipe(seam(side),.012,edge,true,'Raised perimeter piping',N);stitches(outline.map((_,i)=>point(i,.965,side)),true);}
    return { point, seam, outline, depth };
  }

  function satchelShape(w,h,topRatio=.9,bottomRadius=.14) {
    const a=w/2,b=a*topRatio,r=bottomRadius;
    return pathShape([
      ['moveTo',-a+r,0],['lineTo',a-r,0],['quadraticCurveTo',a,0,a,r],
      ['bezierCurveTo',a,h*.4,b+.07,h*.86,b,h-.08],['quadraticCurveTo',b-.02,h,b-.13,h],
      ['lineTo',-b+.13,h],['quadraticCurveTo',-b,h,-b-.02,h-.12],
      ['bezierCurveTo',-b-.08,h*.72,-a,h*.35,-a,r],['quadraticCurveTo',-a,0,-a+r,0],
    ]);
  }
  function flap(w,top,bottom,depth,style='round',material=leather) {
    const h=top-bottom,a=w/2;
    const s=pathShape([
      ['moveTo',-a,top-.06],['quadraticCurveTo',-a,top+.025,-a+.1,top+.025],
      ['lineTo',a-.1,top+.025],['quadraticCurveTo',a,top+.025,a,top-.06],
      ['lineTo',a-.055,bottom+.2],
      ...(style==='envelope'?[['quadraticCurveTo',a-.1,bottom+.1,.12,bottom],['quadraticCurveTo',0,bottom-.05,-.12,bottom],['lineTo',-a+.1,bottom+.25]]:[['quadraticCurveTo',a-.07,bottom+.03,a-.28,bottom+.015],['quadraticCurveTo',0,bottom-.09,-a+.28,bottom+.015],['quadraticCurveTo',-a+.07,bottom+.03,-a+.055,bottom+.2]]),
      ['closePath'],
    ]);
    const outline=s.getSpacedPoints(100);
    const geo=new THREE.ShapeGeometry(s,24); const p=geo.attributes.position;
    for(let i=0;i<p.count;i++){const y=p.getY(i),t=clamp((top-y)/Math.max(h,.1));p.setZ(i,depth/2+.038+Math.sin(t*PI)*.025);}
    geo.computeVertexNormals();const mat=material.clone();mat.side=THREE.DoubleSide;mesh(geo,mat,'Overlapping curved flap');
    const seam=outline.map(p=>V(p.x,p.y,depth/2+.04+Math.sin(clamp((top-p.y)/h)*PI)*.025));
    pipe(seam,.013,edge,true,'Flap edge binding',100);stitches(outline.map(p=>V(p.x*.982,p.y+.016,depth/2+.06)),true);
    return {top,bottom};
  }
  function zipper(points, material=hardware, width=.03) {
    const c=curve(points), n=Math.max(28,Math.round(c.getLength()/.035));
    pipe(points,width*.7,edge,false,'Zipper tape',n,4);
    const geo=new THREE.BoxGeometry(.018,.013,width*.92);
    const teeth=new THREE.InstancedMesh(geo,material,n*2);teeth.name='Individual metal zipper teeth';teeth.castShadow=true;
    const dummy=new THREE.Object3D();
    for(let i=0;i<n;i++)for(let row=0;row<2;row++){
      const t=(i+(row?.5:0))/(n-.5),p=c.getPointAt(Math.min(1,t));
      dummy.position.copy(p);dummy.position.z+=(row===0?-1:1)*width*.48;dummy.position.y+=.012;
      dummy.rotation.z=Math.atan2(c.getTangentAt(Math.min(1,t)).y,c.getTangentAt(Math.min(1,t)).x);dummy.updateMatrix();teeth.setMatrixAt(i*2+row,dummy.matrix);
    }group.add(teeth);
    const p=c.getPointAt(.035);roundBox(.09,.045,.06,material,p.x,p.y+.025,p.z,.015,'Zipper slider');
    const pull=roundBox(.055,.22,.018,material,p.x-.06,p.y-.07,p.z+.04,.013,'Hinged zip pull');pull.rotation.z=-.3;
  }
  function patch(x,y,z,w=.25,h=.42,side=1) {
    const s=pathShape([['moveTo',-w*.34,h/2],['lineTo',w*.34,h/2],['lineTo',w/2,-h*.35],['quadraticCurveTo',0,-h*.61,-w/2,-h*.35],['closePath']]);
    const g=new THREE.ExtrudeGeometry(s,{depth:.022,bevelEnabled:true,bevelSegments:2,bevelThickness:.007,bevelSize:.007,curveSegments:8});g.translate(0,0,-.011);g.translate(x,y,z);
    mesh(g,trim,'Stitched handle anchor');stitches(s.getSpacedPoints(32).map(p=>V(x+p.x*.88,y+p.y*.9,z+side*.026)),true,.035);
  }
  function feet(width,depth) {for(const x of [-width*.34,width*.34])for(const z of [-depth*.3,depth*.3]){const f=mesh(new THREE.SphereGeometry(.046,12,8),hardware,'Protective base foot');f.scale.set(1,.4,1);f.position.set(x,.002,z);}}
  function handle(points,width=.11){strap(points,width,.055,trim,true,'Rolled leather handle');}
  function buckle(x,y,z,width=.17,height=.2,rotation=0){
    const p=[[-width/2,-height/2],[width/2,-height/2],[width/2,height/2],[-width/2,height/2]].map(([a,b])=>[x+a*Math.cos(rotation)-b*Math.sin(rotation),y+a*Math.sin(rotation)+b*Math.cos(rotation),z]);
    pipe(p,.018,hardware,true,'Brass strap buckle',32,7);pipe([[x-width*.4,y,z],[x+width*.4,y,z]],.012,hardware,false,'Buckle tongue',4,6);
  }

  // Open shell: separately modelled outer leather, visible lining and bound lip.
  function tote({w=3,h=1.9,d=.8,topScale=1,sag=.2,soft=.025,straw=false,bottomScale=.83}) {
    const N=112,R=28,positions=[],uv=[],indices=[];
    const sample=(u,t,inset=0)=>{
      const a=u*PI*2,c=Math.cos(a),s=Math.sin(a),n=straw?3.3:4.1;
      const easing=Math.sin(clamp(t/.13)*PI/2);
      const wid=w/2*mix(bottomScale,topScale,t)*(.94+.06*easing)-inset;
      const dep=d/2*(.89+.11*Math.sin(PI*t))*(.87+.13*easing)-inset*.7;
      let x=wid*signedPow(c,2/n),z=dep*signedPow(s,2/n);
      const y=.035+h*t-sag*(1-Math.pow(Math.abs(c),.65))*Math.pow(t,5);
      const folds=soft*Math.sin(11*x+1.7)*Math.sin(PI*t)*Math.pow(Math.abs(s),3);
      z+=Math.sign(z)*(folds+.045*Math.sin(PI*t)*Math.pow(Math.abs(s),5));
      return V(x,y,z);
    };
    for(let j=0;j<=R;j++)for(let i=0;i<=N;i++){const p=sample(i/N,j/R);positions.push(p.x,p.y,p.z);uv.push(i/N*2,j/R);}
    for(let j=0;j<R;j++)for(let i=0;i<N;i++){const a=j*(N+1)+i,b=a+1,c=a+N+1,e=c+1;indices.push(a,c,b,b,c,e);}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();
    let mat=leather;
    if(straw){const tex=grainTexture('straw');mat=new THREE.MeshStandardMaterial({color:'#d6b987',map:tex,bumpMap:tex,bumpScale:.042,roughness:.95});}
    mesh(geo,mat,straw?'Woven basket shell':'Soft open tote body');
    const inner=geo.clone(),p=inner.attributes.position;
    for(let j=0;j<=R;j++)for(let i=0;i<=N;i++){const v=sample(i/N,j/R,.045);v.y-=.016;p.setXYZ(j*(N+1)+i,v.x,v.y,v.z);}inner.computeVertexNormals();mesh(inner,lining,'Interior lining');
    const lip=[];for(let i=0;i<N;i++)lip.push(sample(i/N,1));pipe(lip,straw?.042:.023,straw?trim:edge,true,'Bound opening rim',N,6);
    const bottom=[];for(let i=0;i<N;i++)bottom.push(sample(i/N,0));pipe(bottom,.022,edge,true,'Base binding',N);
    // A real interior floor, kept below the open lip.
    const floor=mesh(new THREE.CircleGeometry(1,64),lining,'Interior bottom');floor.rotation.x=-PI/2;floor.scale.set(w*.43,d*.43,1);floor.position.y=.055;
    if(straw){
      // Relief rows read as physical basket weave even in a side silhouette.
      for(let row=1;row<28;row++){
        const pts=[];for(let i=0;i<96;i++){const p=sample(i/96,row/28);p.x*=1.002;p.z*=1.008;p.y+=.007*Math.sin(i/96*PI*2*35+row*PI);pts.push(p);}
        pipe(pts,.009,mat,true,'Braided straw row',96,3);
      }
    }
    return {sample};
  }

  if(id==='velour') {
    const w=3,h=1.23,d=.67;
    pillow(satchelShape(w,h,.94,.075),d,{center:{x:0,y:.59},bevel:.075,bulge:.012,depthProfile:(x,y)=>1-.95*Math.pow(clamp((y-.75)/.48),2),wrinkle:(x,y)=>.008*Math.sin(x*8+y*3)*Math.sin(y*PI/h),name:'Low wide suede satchel'});
    for(const side of [1,-1]){
      const z=side*.355;
      for(const x of [-.65,.65])patch(x,.56,z,.33,.49,side);
      handle([[-.65,.76,z],[-.76,1.54,z*.94],[-.86,2.38,z*.88],[-.7,3.23,z*.83],[0,3.75,z*.76],[.7,3.23,z*.83],[.86,2.38,z*.88],[.76,1.54,z*.94],[.65,.76,z]],.076);
    }
    zipper([[-1.42,1.12,0],[-1.34,1.225,0],[-.7,1.244,0],[.7,1.244,0],[1.34,1.225,0],[1.42,1.12,0]],silver,.027);
    for(const side of [-1,1]){
      const x=side*1.475;
      strap([[x,1.1,-.04],[x+side*.04,.93,-.07],[x+side*.03,.77,-.07]],.11,.027,trim,false,'Side zipper keeper');
    }
    // Small original metal motif, deliberately not a fabricated text logo.
    for(const x of [-.027,.027]){const emblem=ring(x,.975,.348,.026,0,silver);emblem.scale.set(.78,1,1);}
    roundBox(.12,.012,.012,silver,0,.944,.351,.003,'Small metallic emblem');
    const tag=roundBox(.18,.46,.036,trim,.82,.47,.387,.045,'Hanging leather tag');tag.rotation.z=.48;
    ring(.75,.33,.389,.043,0,silver);
    strap([[.65,.84,.36],[.77,.69,.43],[.91,.52,.44]],.055,.023,trim,false,'Tag loop');
    roundBox(.14,.11,.57,trim,0,3.74,0,.02,'Handle keeper');
    // The gusset seam remains visible when the viewer turns the bag sideways.
    for(const sx of [-1,1])pipe([[sx*1.39,1.13,-.07],[sx*1.47,.75,-.25],[sx*1.47,.14,-.29],[sx*1.45,.07,0],[sx*1.47,.14,.29],[sx*1.47,.75,.25],[sx*1.39,1.13,.07]],.011,edge,false,'Side gusset piping',70);
  } else if(id==='forma'||id==='linea'||id==='amuleto') {
    const forma=id==='forma',linea=id==='linea';
    const w=forma?2.8:linea?3:2.35,h=forma?1.96:linea?1.13:1.65,d=forma?.9:linea?.57:.65;
    pillow(satchelShape(w,h,forma?.78:.91,forma?.12:.19),d,{center:{x:0,y:h*.49},bevel:.115,bulge:.027});
    flap(w*(forma?.79:.91),h+.015,h*(forma?.59:linea?.47:.52),d);
    if(forma){
      handle([[-.7,h+.01,0],[-.66,2.48,0],[-.43,2.87,0],[0,3.04,0],[.43,2.87,0],[.66,2.48,0],[.7,h+.01,0]],.12);
      for(const x of [-.7,.7])roundBox(.19,.07,.18,trim,x,h+.02,0,.025,'Handle collar');
      const clasp=mesh(new THREE.CylinderGeometry(.055,.055,.36,24),gold,'Cylindrical gold clasp');clasp.rotation.z=PI/2;clasp.position.set(0,h*.59,d/2+.09);
      feet(w,d);
    }else if(linea){
      for(const x of [-1.08,1.08])ring(x,h+.04,0,.07);
      handle([[-1.08,h+.1,0],[-.78,1.73,0],[0,2.17,0],[.78,1.73,0],[1.08,h+.1,0]],.11);
      roundBox(.31,.16,.065,gold,0,h*.47,d/2+.08,.075,'Oval brass clasp');
    }else{
      for(const x of [-1.14,1.14])ring(x,h-.05,0,.102,PI/2);
      strap([[-1.14,h+.02,0],[-1.29,2.25,-.09],[-.9,3.18,-.18],[0,3.55,-.22],[.9,3.05,-.13],[1.21,2.3,-.03],[1.14,h+.02,0]],.13,.035,trim,true);
      buckle(-1.15,2.59,.005,.19,.23,-.4);
      roundBox(.31,.48,.03,trim,0,h*.48,d/2+.05,.07,'Clasp leather tab');
      roundBox(.33,.34,.09,gold,0,h*.52,d/2+.105,.035,'Faceted gold square clasp');
      roundBox(.22,.23,.015,gold,0,h*.52,d/2+.16,.012,'Raised clasp face');
    }
    // Side gusset has a folded inward apex, not a solid rectangular extrusion.
    for(const sx of [-1,1])pipe([[sx*w*.42,h-.12,-d*.25],[sx*w*.44,h*.65,-d*.4],[sx*w*.47,.2,-d*.35],[sx*w*.48,.11,0],[sx*w*.47,.2,d*.35],[sx*w*.44,h*.65,d*.4],[sx*w*.42,h-.12,d*.25]],.015,trim,false,'Folded gusset edge',64);
  }else if(id==='sera'||id==='luna'){
    const isSera=id==='sera';
    const w=isSera?2.8:2.65,h=isSera?2.07:1.85,d=isSera?.86:.72;
    const shape=pathShape([
      ['moveTo',-.58,0],['bezierCurveTo',.18,-.035,.84,.005,1.08,.18],
      ['bezierCurveTo',1.49,.46,1.36,1.08,1.14,h],
      ['bezierCurveTo',1.05,h+.08,.96,h-.23,.8,h-.38],
      ['bezierCurveTo',.52,h-.76,.18,h-.85,0,h-.85],
      ['bezierCurveTo',-.38,h-.85,-.76,h-.64,-.96,h-.17],
      ['quadraticCurveTo',-1.08,h+.1,-1.17,h-.04],
      ['bezierCurveTo',-1.49,.91,-1.5,.48,-1.16,.17],['quadraticCurveTo',-.95,0,-.58,0],
    ]);
    pillow(shape,d,{center:{x:0,y:.57},bevel:.14,bulge:isSera?.055:.036,wrinkle:isSera?(x,y)=>.04*Math.sin(x*4+y*3)*Math.sin(y*2):undefined});
    const top=[[-1.12,h-.015,0],[-.94,h-.19,0],[-.7,h-.55,0],[-.35,h-.8,0],[0,h-.85,0],[.4,h-.77,0],[.8,h-.38,0],[1.12,h,0]];
    zipper(top,hardware,.028);
    for(const x of [-1.12,1.12]){ring(x,h+.05,0,.094);patch(x,h-.13,d*.2,.18,.31);}
    strap([[-1.12,h+.12,0],[-.79,h+.8,0],[0,h+1.32,-.02],[.76,h+.8,0],[1.12,h+.12,0]],isSera?.25:.18,.04,trim,true);
    if(!isSera){buckle(-.7,h+.9,.04,.22,.23,-.48);for(let i=0;i<4;i++){const p=mesh(new THREE.CircleGeometry(.014,8),edge,'Strap adjustment hole');p.position.set(-.89+i*.045,h+.56+i*.085,.026);}}
  }else if(id==='piega'){
    const shape=pathShape([['moveTo',-1.16,.04],['quadraticCurveTo',0,-.055,1.15,.04],['bezierCurveTo',1.64,.1,1.55,.56,1.36,.94],['lineTo',1.1,1.42],['quadraticCurveTo',0,1.29,-1.1,1.42],['lineTo',-1.36,.94],['bezierCurveTo',-1.65,.56,-1.59,.12,-1.16,.04]]);
    pillow(shape,.83,{center:{x:0,y:.62},rings:29,segments:140,bevel:.14,bulge:.055,wrinkle:(x,y)=>{
      const t=clamp(y/1.45);return .105*Math.sin((x+.15*Math.sin(y*3))*13)*Math.pow(Math.sin(PI*t),.8)*(.35+.65*t);
    },name:'Gathered soft leather clutch'});
    flap(2.35,1.47,.87,.88,'envelope');
    // Gathered leather rolls at the outer corners.
    for(const sx of [-1,1])pipe([[sx*1.1,1.38,-.04],[sx*1.3,1.1,-.14],[sx*1.39,.72,-.21],[sx*1.34,.42,-.2]],.035,trim,false,'Folded side pleat',32,6);
  }else if(id==='volume'){
    const {sample}=tote({w:2.95,h:1.95,d:.95,topScale:.96,bottomScale:.89,sag:.33,soft:.047});
    for(const side of [-1,1]){
      const z=side*.4;
      strap([[-.82,1.42,z],[-.61,2.32,z*.91],[-.32,3.22,z*.84],[0,3.55,z*.8],[.31,3.22,z*.84],[.64,2.32,z*.91],[.84,1.42,z]],.19,.045,trim,true,'Long tote handle');
      for(const sx of [-1,1]){
        const pts=[[sx*1.23,.14,side*.38],[sx*1.07,.75,side*.47],[sx*.87,1.39,side*.45],[sx*.73,1.85,side*.4]];
        pipe(pts,.013,edge,false,'Long panel seam',50);stitches(pts.map(([x,y,z])=>[x+.018,y,z+side*.009]),false);
      }
    }
  }else if(id==='riva'){
    trim.color.set('#e1d9bf');trim.roughness=.95;
    tote({w:2.8,h:1.82,d:1.05,topScale:1.08,bottomScale:.78,sag:.025,soft:0,straw:true});
    for(const side of [-1,1]){
      const z=side*.53;
      // Relaxed short handles hang across the basket, as in the reference.
      strap([[-.66,1.82,z],[-.65,1.31,z+side*.11],[-.38,.92,z+side*.18],[0,.82,z+side*.2],[.39,.95,z+side*.18],[.65,1.32,z+side*.11],[.67,1.82,z]],.17,.036,trim,true,'Woven canvas handle');
      for(const x of [-.66,.67]){roundBox(.2,.21,.035,trim,x,1.74,z,.025,'Canvas handle reinforcement');stitches([[x-.065,1.67,z+side*.025],[x+.065,1.81,z+side*.025],[x-.065,1.81,z+side*.025],[x+.065,1.67,z+side*.025]],false,.03);}
    }
  }else if(id==='cilindro'){
    const w=2.75,r=.59,y=.61;
    // Barrel axis is horizontal; both circular end caps have their own piping.
    const geo=new THREE.CylinderGeometry(r,r,w-.16,72,10,false);geo.rotateZ(PI/2);
    const p=geo.attributes.position;
    for(let i=0;i<p.count;i++){const x=p.getX(i),bulge=1+.045*Math.cos(x/(w/2)*PI/2);p.setY(i,p.getY(i)*bulge+y);p.setZ(i,p.getZ(i)*bulge);}geo.computeVertexNormals();mesh(geo,leather,'Horizontal leather barrel');
    for(const side of [-1,1]){
      const cap=mesh(new THREE.SphereGeometry(1,48,24),leather,'Padded circular end');cap.scale.set(.1,r,r);cap.position.set(side*(w/2-.08),y,0);
      const pts=[];for(let i=0;i<72;i++){const a=i/72*PI*2;pts.push([side*(w/2-.015),y+Math.cos(a)*r*.96,Math.sin(a)*r*.96]);}
      pipe(pts,.018,edge,true,'Circular end piping',72);stitches(pts.map(([x,yy,z])=>[x+side*.007,y+(yy-y)*.96,z*.96]),true);
      ring(side*1.09,1.27,0,.095);
      const tab=roundBox(.16,.36,.038,trim,side*1.12,1.03,.35,.055,'Strap attachment tab');tab.rotation.z=side*.18;
      const rivet=mesh(new THREE.SphereGeometry(.028,12,8),gold,'Brass attachment rivet');rivet.scale.z=.3;rivet.position.set(side*1.12,1.02,.38);
    }
    zipper([[-1.2,1.19,0],[-.7,1.235,0],[0,1.24,0],[.7,1.235,0],[1.2,1.19,0]],gold,.03);
    strap([[-1.09,1.36,0],[-.75,2.15,0],[0,2.94,0],[.75,2.15,0],[1.09,1.36,0]],.17,.038,trim,true);
  }

  // Normalize centering and floor contact without changing relative proportions.
  group.updateMatrixWorld(true);
  const bounds=new THREE.Box3().setFromObject(group),center=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3());
  group.position.set(-center.x,-bounds.min.y,-center.z);
  group.userData = {
    id, label: id[0].toUpperCase()+id.slice(1),
    representation: 'Procedural 3D concept reconstructed from product photographs; not a measurement-accurate scan.',
    dimensions: {width:size.x,height:size.y,depth:size.z},
    front: '+Z', floor: 0,
  };
  return group;
}
