import {createBagViewer} from './bag-viewer.js?v=20261021-3d2';
function initStudio() {
 const section=document.getElementById('formStudio');if(!section)return;
 const $=selector=>section.querySelector(selector), viewport=$('.studio-viewport'), selector=$('#studioModel'), status=$('.studio-status'), retry=$('[data-studio-retry]');
 let model=products.find(item=>item.id==='velour'), viewer=null, visible=false, modal=false, pending=false, generation=0;
 const auto=$('[data-studio-auto]');
 selector.innerHTML=products.map(item=>`<option value="${item.id}">N° ${item.number} — ${item.name}</option>`).join('');selector.value=model.id;
 $('.studio-angles').innerHTML=[[0,'Спереди'],[90,'Справа'],[180,'Сзади'],[270,'Слева']].map(([deg,label])=>`<button type="button" data-angle="${deg}">${label} <span>${deg}°</span></button>`).join('');
 $('.studio-bottom').insertAdjacentHTML('beforeend','<div class="studio-zoom" role="group" aria-label="Масштаб модели"><button type="button" data-studio-zoom="-0.25" aria-label="Отдалить">−</button><output class="studio-scale" aria-label="Масштаб">100%</output><button type="button" data-studio-zoom="0.25" aria-label="Приблизить">+</button><button type="button" data-studio-reset aria-label="Исходный ракурс и масштаб">↺</button></div>');
 viewport.setAttribute('aria-label','Объёмная модель сумки. Стрелки: вращение и наклон. Плюс и минус: масштаб. Home: исходный вид.');
 function autoState(value){auto.textContent=value?'Пауза':'Автоповорот';auto.setAttribute('aria-pressed',String(value));}
 function failure(error){status.textContent=error?.message||error||'Не удалось открыть 3D. Каталожное фото доступно.';retry.hidden=false;pending=false;viewport.removeAttribute('aria-busy');}
 async function load(){
  if(viewer||pending)return;pending=true;const ticket=++generation;retry.hidden=true;status.textContent='Подготавливаем объём…';viewport.setAttribute('aria-busy','true');
  try{
   const instance=await createBagViewer(viewport,model.id,{onChange:state=>{if(ticket!==generation)return;$('.studio-angle').textContent=`${String(state.angle).padStart(3,'0')}° / 360°`;$('.studio-scale').textContent=`${Math.round(state.zoom*100)}%`;},onAutoChange:autoState,onError:failure});
   if(ticket!==generation){instance.dispose();return;} viewer=instance;viewer.setModel(model.id);viewer.setVisible(visible&&!modal);pending=false;viewport.removeAttribute('aria-busy');status.textContent='Вращайте и наклоняйте · Два пальца — масштаб';
  }catch(error){if(ticket===generation)failure(error);}
 }
 function choose(){
  model=products.find(item=>item.id===selector.value)||products[9];
  $('.studio-name').textContent=model.name;$('.studio-color').textContent=model.color;$('.studio-price').textContent=new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB',maximumFractionDigits:0}).format(model.price);
  $('[data-spin]').dataset.spin=model.id;$('[data-product]').dataset.product=model.id;
  $('.studio-image').src=`assets/${model.id}.webp`;$('.studio-image').alt=`${model.name} — каталожный вид`;
  $('.studio-photo-note').textContent=model.id==='velour'?'Реальные фотографии Velour — в карточке и в режиме «Фотографии».':'Каталожная визуализация — в карточке и в режиме «Фотографии».';
  viewer?.setModel(model.id);if(visible&&!viewer)load();
 }
 selector.addEventListener('change',choose);
 section.addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;
  if(b.dataset.angle!==undefined)viewer?.setAngle(Number(b.dataset.angle));
  if(b.dataset.studioStep)viewer?.step(Number(b.dataset.studioStep)*Math.PI/4);
  if(b.dataset.studioZoom)viewer?.zoomBy(Number(b.dataset.studioZoom));
  if(b.hasAttribute('data-studio-reset'))viewer?.reset();
  if(b.hasAttribute('data-studio-auto'))viewer?.setAuto(b.getAttribute('aria-pressed')!=='true');
  if(b.hasAttribute('data-studio-retry')){generation++;viewer?.dispose();viewer=null;pending=false;load();}
 });
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)load();viewer?.setVisible(visible&&!modal);},{rootMargin:'120px'});observer.observe(viewport);
 document.addEventListener('barsalini:viewer',event=>{modal=event.detail.open;viewer?.setVisible(visible&&!modal);});
 choose();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initStudio,{once:true});else initStudio();
