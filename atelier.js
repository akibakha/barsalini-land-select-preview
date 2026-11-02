/* Three authored poses, one persistent scene. Swap only decoded images. */
'use strict';
let modelProductId='camel-tote',modelFrame=0,modelZoomed=false,modelRequest=0;
const modelPoseNames=['Анфас','В движении','В профиль'];
const modelReducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const modelImageCache=new Map();
const modelAnimations=new Set();
let modelDisplayedFrame=0,modelDisplayedProduct='',modelSwipeStart=null;

function modelAnimate(element,keyframes,options){
 if(modelReducedMotion.matches||!element.animate)return null;
 const animation=element.animate(keyframes,options);modelAnimations.add(animation);
 const release=()=>modelAnimations.delete(animation);
 animation.addEventListener('finish',release,{once:true});animation.addEventListener('cancel',release,{once:true});
 return animation;
}
function decodeModelImage(src){
 if(modelImageCache.has(src)){const cached=modelImageCache.get(src);modelImageCache.delete(src);modelImageCache.set(src,cached);return cached;}
 const promise=new Promise((resolve,reject)=>{
  const image=new Image();image.decoding='async';
  image.onload=()=>{if(image.decode)image.decode().then(()=>resolve(image),reject);else resolve(image);};
  image.onerror=()=>reject(new Error('Image unavailable'));image.src=src;
 }).catch(error=>{modelImageCache.delete(src);throw error;});
 modelImageCache.set(src,promise);
 while(modelImageCache.size>9)modelImageCache.delete(modelImageCache.keys().next().value);
 return promise;
}
function modelFallback(p){return `assets/${imageFor(p)}.webp`;}
function modelFlight(source,p){
 if(modelReducedMotion.matches||!source)return;
 const image=source.querySelector('img')||source.closest('.product-card')?.querySelector('.product-image-button img')||$('detailPhoto');
 const rect=(image||source).getBoundingClientRect();
 if(!rect.width||!rect.height)return;
 const start={left:rect.left,top:rect.top,width:rect.width,height:rect.height};
 requestAnimationFrame(()=>{
  const dialog=$('modelDialog');if(!dialog.open)return;
  const scene=dialog.querySelector('.model-photo-viewport').getBoundingClientRect();
  const bounds=dialog.getBoundingClientRect(),size=Math.min(112,start.width,start.height);
  const left=start.left+(start.width-size)/2,top=start.top+(start.height-size)/2;
  const targetX=scene.left+scene.width*.56,targetY=scene.top+scene.height*.62;
  const flight=document.createElement('img');flight.className='model-bag-flight';flight.alt='';flight.setAttribute('aria-hidden','true');
  flight.src=`assets/${imageFor(p)}.webp`;flight.style.cssText=`left:${left-bounds.left+dialog.scrollLeft}px;top:${top-bounds.top+dialog.scrollTop}px;width:${size}px;height:${size}px`;
  dialog.append(flight);
  const animation=modelAnimate(flight,[{transform:'translate(0,0) scale(1) rotate(-3deg)',opacity:.95},{transform:`translate(${(targetX-left)*.55}px,${(targetY-top)*.35-34}px) scale(.78) rotate(5deg)`,opacity:.9,offset:.55},{transform:`translate(${targetX-left}px,${targetY-top}px) scale(.35) rotate(0deg)`,opacity:0}],{duration:760,easing:'cubic-bezier(.23,.7,.24,1)'});
  if(animation){animation.finished.catch(()=>{}).then(()=>flight.remove());}else flight.remove();
 });
}
function showModel(id,source){
 const p=products.find(p=>p.id===id);if(!p)return;
 modelProductId=id;modelFrame=0;modelZoomed=false;
 // Capture the source before opening closes a product dialog.
 modelFlight(source,p);renderModel();openDialog('modelDialog');
}
function selectModel(id,source){
 const p=products.find(p=>p.id===id);if(!p)return;
 if(modelProductId===id)return;
 modelProductId=id;modelZoomed=false;
 // Preserve the pose when comparing bags.
 modelFlight(source,p);renderModel();
}
function updateModelZoom(){
 const viewport=$('modelDialog').querySelector('.model-photo-viewport');
 viewport.classList.toggle('is-zoomed',modelZoomed);
 $('modelZoom').textContent=modelZoomed?'Общий план':'Приблизить образ';
 $('modelZoom').setAttribute('aria-pressed',String(modelZoomed));
 if(!modelZoomed)viewport.scrollTo(0,0);
}
function toggleModelZoom(){modelZoomed=!modelZoomed;updateModelZoom();}
function modelLoadStatus(message,error=false){
 $('modelLoadState').hidden=!message;$('modelStatus').textContent=message;
 $('modelLoadState').classList.toggle('is-error',error);$('modelRetry').hidden=!error;
 $('modelDialog').querySelector('.model-photo-viewport').setAttribute('aria-busy',String(Boolean(message)&&!error));
}
function commitModelImage(decoded,p,frame,fallback=false){
 const current=$('modelPhoto'),stage=current.parentElement;
 const direction=frame===modelDisplayedFrame||modelDisplayedProduct!==p.id?1:frame>modelDisplayedFrame?1:-1;
 // Complete any older transition before layering a new decoded frame.
 stage.querySelectorAll('.model-photo-outgoing').forEach(image=>image.remove());
 current.getAnimations().forEach(animation=>animation.cancel());
 const incoming=decoded.cloneNode();incoming.id='modelPhoto';incoming.draggable=false;
 incoming.alt=fallback?`${p.name} — резервное изображение коллекции`:`${p.name} — ${modelPoseNames[frame].toLowerCase()}, визуализация образа`;
 current.removeAttribute('id');current.className='model-photo-outgoing';current.setAttribute('aria-hidden','true');
 stage.append(incoming);
 $('modelName').textContent=p.name;$('modelColor').textContent=`${p.color} · ${p.caption}`;
 $('modelSource').textContent='Визуализация образа';$('modelPrice').textContent=money(p.price);
 $('modelAdd').dataset.add=p.id;$('modelAdd').textContent='Добавить в корзину';
 $('modelAdd').disabled=false;
 modelDisplayedFrame=frame;modelDisplayedProduct=p.id;
 $('modelPoseLabel').textContent=fallback?'Из коллекции':modelPoseNames[frame];
 $('modelNumber').textContent=fallback?'Резервный кадр':`${String(frame+1).padStart(2,'0')} / 03`;
 if(modelReducedMotion.matches){current.remove();return;}
 const animation=modelAnimate(incoming,[{opacity:0,transform:`translateX(${direction*22}px) scale(1.015)`},{opacity:1,transform:'translateX(0) scale(1)'}],{duration:650,easing:'cubic-bezier(.22,.7,.22,1)'});
 modelAnimate(current,[{opacity:1,transform:'translateX(0)'},{opacity:0,transform:`translateX(${-direction*15}px)`}],{duration:650,easing:'cubic-bezier(.22,.7,.22,1)'});
 if(animation)animation.finished.catch(()=>{}).then(()=>current.remove());else current.remove();
}
function renderModel(){
 const p=products.find(p=>p.id===modelProductId);if(!p)return;
 const photos=modelPhotos(p);modelFrame=(modelFrame+photos.length)%photos.length;
 const frame=modelFrame,request=++modelRequest,src=`assets/${photos[frame]}.webp`;
 updateModelZoom();
 $('modelAdd').disabled=true;
 if(!$('modelChoices').children.length){
  $('modelChoices').innerHTML=products.map(q=>`<button class="model-choice" type="button" data-model-pick="${q.id}" aria-pressed="false" aria-label="${q.name}, ${q.color}"><img src="assets/${imageFor(q)}.webp" width="120" height="120" loading="lazy" alt=""><span>${q.name}</span></button>`).join('');
 }
 $('modelChoices').querySelectorAll('[data-model-pick]').forEach(button=>{
  const active=button.dataset.modelPick===p.id;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));
 });
 if($('modelPoses').dataset.product!==p.id){
  $('modelPoses').dataset.product=p.id;
  $('modelPoses').innerHTML=photos.map((photo,index)=>`<button type="button" class="model-pose" data-model-pose="${index}" aria-pressed="false"><span class="model-pose-image"><img src="assets/${photo}.webp" width="96" height="128" alt="" decoding="async"><span aria-hidden="true">${String(index+1).padStart(2,'0')}</span></span><span>${modelPoseNames[index]}</span></button>`).join('');
  $('modelPoses').querySelectorAll('img').forEach(image=>image.addEventListener('error',()=>{image.hidden=true;},{once:true}));
 }
 $('modelPoses').querySelectorAll('[data-model-pose]').forEach(button=>{const active=Number(button.dataset.modelPose)===frame;button.setAttribute('aria-pressed',String(active));});
 modelLoadStatus(`Готовим образ · ${modelPoseNames[frame].toLowerCase()}…`);
 decodeModelImage(src).then(image=>{
  if(request!==modelRequest||!$('modelDialog').open)return;
  commitModelImage(image,p,frame);modelLoadStatus('');
  // Only warm this bag's adjacent poses, never all 45 images at once.
  photos.forEach(photo=>decodeModelImage(`assets/${photo}.webp`).catch(()=>{}));
 }).catch(async()=>{
  if(request!==modelRequest||!$('modelDialog').open)return;
  try{
   const fallback=await decodeModelImage(modelFallback(p));
   if(request!==modelRequest||!$('modelDialog').open)return;
   commitModelImage(fallback,p,frame,true);
   modelLoadStatus('Образ пока недоступен. Показываем изображение из коллекции.',true);
  }catch{
   if(request===modelRequest&&$('modelDialog').open)modelLoadStatus('Образ не загрузился. Сохранён предыдущий кадр.',true);
  }
 });
}

const modelDialog=$('modelDialog'),modelViewport=modelDialog.querySelector('.model-photo-viewport');
modelDialog.addEventListener('keydown',event=>{
 if((event.key==='ArrowLeft'||event.key==='ArrowRight')&&!/INPUT|TEXTAREA|SELECT/.test(event.target.tagName)){
  if(modelZoomed&&event.target===modelViewport)return;
  event.preventDefault();modelFrame+=event.key==='ArrowRight'?1:-1;modelZoomed=false;renderModel();
 }
});
modelViewport.addEventListener('pointerdown',event=>{
 if(modelZoomed||event.button!==0||event.target.closest('button'))return;
 modelSwipeStart={x:event.clientX,y:event.clientY,pointerId:event.pointerId};
});
modelViewport.addEventListener('pointerup',event=>{
 if(!modelSwipeStart||modelSwipeStart.pointerId!==event.pointerId)return;
 const dx=event.clientX-modelSwipeStart.x,dy=event.clientY-modelSwipeStart.y;modelSwipeStart=null;
 if(Math.abs(dx)>48&&Math.abs(dx)>Math.abs(dy)*1.3){modelFrame+=dx<0?1:-1;modelZoomed=false;renderModel();}
});
modelViewport.addEventListener('pointercancel',()=>{modelSwipeStart=null;});
modelDialog.addEventListener('close',()=>{
 if(modelDialog.open)return;
 modelRequest++;modelSwipeStart=null;
 modelAnimations.forEach(animation=>animation.cancel());modelAnimations.clear();
 modelDialog.querySelectorAll('.model-bag-flight,.model-photo-outgoing').forEach(node=>node.remove());
});
function stopModelMotion(){if(modelReducedMotion.matches){modelAnimations.forEach(animation=>animation.cancel());modelAnimations.clear();modelDialog.querySelectorAll('.model-bag-flight,.model-photo-outgoing').forEach(node=>node.remove());}}
if(modelReducedMotion.addEventListener)modelReducedMotion.addEventListener('change',stopModelMotion);else modelReducedMotion.addListener(stopModelMotion);
