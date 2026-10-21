import {createBagViewer} from './bag-viewer.js?v=20261021-3d2';

const catalog = [
 ['forma','Forma'],['sera','Sera'],['linea','Linea'],['luna','Luna'],['piega','Piega'],
 ['volume','Volume'],['riva','Riva'],['amuleto','Amuleto'],['cilindro','Cilindro'],['velour','Velour']
];
const realViews = [['front','Спереди'],['back','Сзади'],['side','Сбоку'],['inside','Внутри'],['detail','Детали'],['top','Верх и застёжка']];
const dialog = document.createElement('dialog');
dialog.id = 'spinDialog';
dialog.className = 'spin-dialog';
dialog.setAttribute('aria-labelledby','spinTitle');
dialog.setAttribute('aria-describedby','spinSource spinHint');
dialog.innerHTML = `
 <div class="spin-header"><div><p class="eyebrow">THE STUDY OF FORM</p><h2 id="spinTitle"></h2></div><button class="close spin-close" type="button" aria-label="Закрыть обзор">×</button></div>
 <div class="spin-mode-row"><div class="spin-modes" role="group" aria-label="Режим просмотра"><button type="button" data-spin-mode="3d" aria-pressed="true">Объём · 360°</button><button type="button" data-spin-mode="photos" aria-pressed="false">Фотографии</button></div><p id="spinSource" class="spin-source"></p></div>
 <div class="spin-viewport" tabindex="0" role="group" aria-label="Объёмная модель сумки. Стрелки: вращение и наклон. Плюс и минус: масштаб. Home: исходный вид." aria-describedby="spinHint">
  <img class="spin-image" alt="" draggable="false">
  <span class="spin-loading" role="status" hidden>Подготавливаем объём…</span>
  <button type="button" class="spin-arrow spin-prev" aria-label="Повернуть влево">←</button><button type="button" class="spin-arrow spin-next" aria-label="Повернуть вправо">→</button><span class="spin-angle" aria-hidden="true"></span>
 </div>
 <div class="spin-controls"><p id="spinHint" class="spin-hint"></p><div class="spin-tools" role="group" aria-label="Управление просмотром"><button type="button" data-spin-zoom="-0.25" aria-label="Отдалить">−</button><output class="spin-scale" aria-label="Масштаб">100%</output><button type="button" data-spin-zoom="0.25" aria-label="Приблизить">+</button><button type="button" class="spin-reset" aria-label="Исходный ракурс и масштаб">Сброс</button><button type="button" class="spin-auto" aria-pressed="false">Автоповорот</button><button type="button" class="spin-fullscreen" aria-label="Развернуть обзор" aria-pressed="false">⤢</button></div></div>
 <div class="spin-thumbnails" role="group" aria-label="Выбор вида"></div>
 <div class="spin-message-row"><p class="spin-message" role="status"></p><button type="button" class="spin-retry underlink" hidden>Повторить загрузку 3D</button></div>`;
document.body.append(dialog);
const $ = selector => dialog.querySelector(selector);
const viewport = $('.spin-viewport'), photo = $('.spin-image'), loading = $('.spin-loading'), message = $('.spin-message');
let viewer = null, model = catalog[9], mode = '3d', generation = 0, photoIndex = 0, photoZoom = 1;
let returnFocus, originatingDialog;
function photos() { return model[0] === 'velour' ? realViews.map(([view,label])=>({url:`assets/velour-${view}.webp`,label})) : [{url:`assets/${model[0]}.webp`,label:'Каталожный вид'}]; }
function busy(value) { loading.hidden=!value; viewport.setAttribute('aria-busy',String(value)); }
function autoState(value) { $('.spin-auto').textContent=value?'Пауза':'Автоповорот'; $('.spin-auto').setAttribute('aria-pressed',String(value)); }
function failure(error) { busy(false); message.textContent=error?.message || error || '3D временно недоступно. Можно посмотреть фотографии.'; $('.spin-retry').hidden=false; }
function clearViewer() { generation++; viewer?.dispose(); viewer=null; busy(false); autoState(false); }
function renderPhoto() {
 const items=photos(); photoIndex=(photoIndex+items.length)%items.length;
 photo.src=items[photoIndex].url; photo.alt=`${model[1]} — ${items[photoIndex].label}`;
 photo.style.transform=`scale(${photoZoom})`; $('.spin-scale').textContent=`${Math.round(photoZoom*100)}%`;
 $('.spin-angle').textContent=`${photoIndex+1} / ${items.length}`;
 dialog.querySelectorAll('[data-photo]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.photo)===photoIndex)));
 $('.spin-prev').disabled=$('.spin-next').disabled=items.length<2;
}
async function show3D() {
 const ticket=++generation; busy(true); message.textContent=''; $('.spin-retry').hidden=true;
 photo.src=`assets/${model[0]}.webp`; photo.alt=`${model[1]} — каталожный вид`; photo.style.transform='';
 try {
  const instance=await createBagViewer(viewport,model[0],{wheel:true,
   onChange:state=>{if(ticket!==generation)return; $('.spin-angle').textContent=`${String(state.angle).padStart(3,'0')}° / 360°`; $('.spin-scale').textContent=`${Math.round(state.zoom*100)}%`;},
   onAutoChange:autoState,onError:failure});
  if(ticket!==generation || !dialog.open || mode!=='3d') {instance.dispose();return;}
  viewer=instance; busy(false);
 } catch(error) {if(ticket===generation)failure(error);}
}
function setMode(next) {
 clearViewer(); mode=next; photoIndex=0; photoZoom=1; message.textContent=''; $('.spin-retry').hidden=true;
 dialog.classList.toggle('is-photo-mode',mode==='photos');
 dialog.querySelectorAll('[data-spin-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.spinMode===mode)));
 $('.spin-auto').hidden=mode==='photos'; $('.spin-angle').textContent='';
 viewport.setAttribute('aria-label',mode==='3d'?'Объёмная модель сумки. Стрелки: вращение и наклон. Плюс и минус: масштаб. Home: исходный вид.':'Фотографии сумки. Стрелки: предыдущее и следующее фото. Плюс и минус: масштаб. Home: исходный масштаб.');
 $('.spin-prev').disabled=$('.spin-next').disabled=false;
 $('.spin-prev').setAttribute('aria-label',mode==='3d'?'Повернуть влево':'Предыдущее фото');
 $('.spin-next').setAttribute('aria-label',mode==='3d'?'Повернуть вправо':'Следующее фото');
 if(mode==='3d') {
  $('#spinSource').textContent='3D-реконструкция формы. Материалы и детали могут отличаться от изделия.';
  $('#spinHint').textContent='Вращайте и наклоняйте перетаскиванием · Колесо или два пальца — масштаб';
  $('.spin-thumbnails').innerHTML=[[0,'Спереди'],[90,'Справа'],[180,'Сзади'],[270,'Слева']].map(([deg,label])=>`<button type="button" class="spin-preset" data-preset="${deg}">${label}<span>${deg}°</span></button>`).join('');
  show3D();
 } else {
  $('#spinSource').textContent=model[0]==='velour'?'Фотографии реального изделия':'Каталожная визуализация модели';
  $('#spinHint').textContent='Рассмотрите материал и детали · Используйте + для увеличения';
  $('.spin-thumbnails').innerHTML=photos().map((item,i)=>`<button type="button" data-photo="${i}" aria-label="${item.label}" aria-pressed="false"><img src="${item.url}" alt="" loading="lazy"><span>${item.label}</span></button>`).join('');
  renderPhoto();
 }
}
function open(id) {
 const found=catalog.find(item=>item[0]===id); if(!found)return;
 returnFocus=document.activeElement; originatingDialog=returnFocus?.closest('dialog') || document.querySelector('dialog[open]'); model=found;
 $('#spinTitle').textContent=model[1];
 if(!dialog.open)dialog.showModal();
 document.body.classList.add('modal-open'); document.dispatchEvent(new CustomEvent('barsalini:viewer',{detail:{open:true}}));
 setMode('3d'); $('.spin-close').focus();
}
async function close() { if(document.fullscreenElement===dialog) await document.exitFullscreen().catch(()=>{}); dialog.close(); }
function zoom(delta) {if(mode==='3d')viewer?.zoomBy(delta);else{photoZoom=Math.max(1,Math.min(3,photoZoom+delta));renderPhoto();}}
async function fullscreen() {
 if(document.fullscreenElement===dialog) await document.exitFullscreen().catch(()=>{});
 else if(dialog.classList.contains('is-expanded'))dialog.classList.remove('is-expanded');
 else {try{if(!dialog.requestFullscreen)throw Error();await dialog.requestFullscreen();}catch{dialog.classList.add('is-expanded');}}
 $('.spin-fullscreen').setAttribute('aria-pressed',String(document.fullscreenElement===dialog || dialog.classList.contains('is-expanded'))); viewer?.resize();
}
$('.spin-close').addEventListener('click',close);
dialog.addEventListener('close',()=>{clearViewer(); dialog.classList.remove('is-expanded'); $('.spin-fullscreen').setAttribute('aria-pressed','false'); document.body.classList.toggle('modal-open',!!document.querySelector('dialog[open]')); document.dispatchEvent(new CustomEvent('barsalini:viewer',{detail:{open:false}})); if(returnFocus?.isConnected && (!originatingDialog || originatingDialog.open))returnFocus.focus();});
dialog.addEventListener('click',event=>{
 const b=event.target.closest('button'); if(!b)return;
 if(b.dataset.spinMode)setMode(b.dataset.spinMode);
 if(b.dataset.preset!==undefined)viewer?.setAngle(Number(b.dataset.preset));
 if(b.dataset.photo!==undefined){photoIndex=Number(b.dataset.photo);photoZoom=1;renderPhoto();}
 if(b.dataset.spinZoom)zoom(Number(b.dataset.spinZoom));
 if(b.matches('.spin-prev,.spin-next')){const direction=b.matches('.spin-prev')?-1:1;if(mode==='3d')viewer?.step(direction*Math.PI/4);else{photoIndex+=direction;photoZoom=1;renderPhoto();}}
 if(b.matches('.spin-reset')){if(mode==='3d')viewer?.reset();else{photoZoom=1;renderPhoto();}}
 if(b.matches('.spin-auto'))viewer?.setAuto(b.getAttribute('aria-pressed')!=='true');
 if(b.matches('.spin-retry')){clearViewer();show3D();}
 if(b.matches('.spin-fullscreen'))fullscreen();
});
viewport.addEventListener('keydown',event=>{if(mode!=='photos'||event.target!==viewport)return; if(['ArrowLeft','ArrowRight','+','-','Home'].includes(event.key)){event.preventDefault();if(event.key.startsWith('Arrow')){photoIndex+=event.key==='ArrowLeft'?-1:1;photoZoom=1;renderPhoto();}else if(event.key==='Home'){photoZoom=1;renderPhoto();}else zoom(event.key==='+'?.25:-.25);}});
photo.addEventListener('error',()=>{message.textContent='Фотография не загрузилась. Попробуйте другой вид или обновите страницу.';});
document.addEventListener('fullscreenchange',()=>{$('.spin-fullscreen').setAttribute('aria-pressed',String(document.fullscreenElement===dialog));viewer?.resize();});
document.addEventListener('click',event=>{const button=event.target.closest('[data-spin]');if(button){event.preventDefault();open(button.dataset.spin);}});
window.BarsaliniSpin=Object.freeze({open});
