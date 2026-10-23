'use strict';
const products = [
 {id:'forma',number:'01',name:'Forma',color:'Шоколад',shade:'#493026',type:'day',caption:'Скульптурная форма',search:'кожа коричневая дневная шоколад классика форма',description:'Чёткий силуэт и мягкая линия клапана. Глубокий шоколадный оттенок встречается с тёплым сиянием металла — выразительный акцент для спокойного повседневного образа.',look:4,price:50000},
 {id:'sera',number:'02',name:'Sera',color:'Карамель',shade:'#ab784a',type:'day',caption:'Мягкий силуэт',search:'замша бежевая карамель коричневая мягкая дневная сера',description:'Плавный полумесяц, мягкие складки и бархатистая фактура. Sera продолжает естественную линию движения и привносит в образ тепло карамельного оттенка.',look:1,price:40000},
 {id:'linea',number:'03',name:'Linea',color:'Бордо',shade:'#4e2025',type:'evening',caption:'Вечерний акцент',search:'кожа бордо красная винная вечерняя линия линеа',description:'Вытянутые пропорции и лаконичная ручка. Глубокий винный цвет делает Linea особенным штрихом — к простому платью, жакету или вашему любимому вечернему образу.',look:3,price:35000},
 {id:'luna',number:'04',name:'Luna',color:'Эспрессо',shade:'#49382c',type:'day',caption:'Сумка-полумесяц',search:'коричневая полумесяц плечо',description:'Округлый силуэт и широкая ручка. Лаконичная спутница городского дня.',look:5,price:38000},
 {id:'piega',number:'05',name:'Piega',color:'Табак',shade:'#b47b43',type:'evening',caption:'Мягкий клатч',search:'клатч вечер карамель',description:'Мягкая складка вместо лишних деталей. Тёплый оттенок и выразительный объём для вечерних выходов.',price:30000},
 {id:'volume',number:'06',name:'Volume',color:'Тауп',shade:'#82786b',type:'day',caption:'Объёмный шопер',search:'шопер большая бежевая',description:'Свободный объём, спокойные пропорции и мягкие линии. Для дней, в которых много планов.',price:48000},
 {id:'riva',number:'07',name:'Riva',color:'Натуральный',shade:'#b4a287',type:'day',caption:'Плетёный тоут',search:'плетеная летняя светлая шопер',description:'Лёгкая фактура плетения и светлые акценты. Настроение долгого лета в городском гардеробе.',price:42000},
 {id:'amuleto',number:'08',name:'Amuleto',color:'Бургунди',shade:'#5c2830',type:'evening',caption:'Компактная кросс-боди',search:'бордо красная маленькая кросс боди',description:'Небольшой формат с выразительной застёжкой. Глубокий цвет становится самостоятельным акцентом.',price:32000},
 {id:'cilindro',number:'09',name:'Cilindro',color:'Терракота',shade:'#a75837',type:'day',caption:'Цилиндрический силуэт',search:'рыжая компактная цилиндр',description:'Неожиданная геометрия в тёплом оттенке. Компактный силуэт для самого необходимого.',price:45000},
 {id:'velour',number:'10',name:'Velour',color:'Шоколад',shade:'#4b4038',type:'day',caption:'Замшевая сумка на плечо',search:'замша шоколад коричневая прямоугольная плечо велюр велоур',description:'Бархатистая шоколадная фактура, вытянутый прямоугольный силуэт и длинные тёмные ручки. Верхняя молния, небольшая металлическая эмблема и подвесной брелок-футляр завершают сдержанный образ.',price:45000,photographed:true}
];
products.push(...[{"id":"camel-tote","number":"11","name":"Карамельный тоут","color":"Карамель","shade":"#a7774b","price":48000,"caption":"Тоут","type":"day","search":"Карамельный тоут Карамель","description":"Мягкий тоут с длинными ручками. Тёплый карамельный оттенок и выразительная фактура в повседневном образе.","photographed":true,"image":"real/camel-tote-product-front","gallery":[{"src":"real/camel-tote-product-front","label":"Спереди"},{"src":"real/camel-tote-detail-suede","label":"Детали"},{"src":"real/camel-tote-detail-zip","label":"Детали"},{"src":"real/camel-tote-detail-side","label":"Детали"},{"src":"real/camel-tote-model-shoulder","label":"На модели","editorial":true},{"src":"real/camel-tote-lookbook-full","label":"На модели","editorial":true},{"src":"real/camel-tote-model-crossbody","label":"На модели","editorial":true}],"modelImages":["real/camel-tote-model-shoulder","real/camel-tote-lookbook-full","real/camel-tote-model-crossbody"]},{"id":"chocolate-satchel","number":"12","name":"Шоколадная сумка","color":"Шоколад","shade":"#49362a","price":50000,"caption":"С короткими ручками","type":"day","search":"Шоколадная сумка Шоколад","description":"Чёткий силуэт, короткие ручки и съёмный ремень. В галерее — настоящие фотографии сумки и её деталей.","photographed":true,"image":"real/chocolate-satchel-product-front","gallery":[{"src":"real/chocolate-satchel-product-front","label":"Спереди"},{"src":"real/chocolate-satchel-detail-side-fastener","label":"Детали"},{"src":"real/chocolate-satchel-detail-interior","label":"Внутри"},{"src":"real/chocolate-satchel-detail-strap","label":"Детали"},{"src":"real/chocolate-satchel-lookbook-standing","label":"На модели","editorial":true},{"src":"real/chocolate-satchel-lookbook-seated","label":"На модели","editorial":true}],"modelImages":["real/chocolate-satchel-lookbook-standing","real/chocolate-satchel-lookbook-seated"]},{"id":"denim-tote","number":"13","name":"Синий тоут","color":"Синий","shade":"#40576b","price":42000,"caption":"Тоут","type":"day","search":"Синий тоут Синий","description":"Объёмный синий тоут с длинными ручками. Рассмотрите фактуру, боковые детали и посадку на плече.","photographed":true,"image":"real/denim-tote-product-front","gallery":[{"src":"real/denim-tote-product-front","label":"Спереди"},{"src":"real/denim-tote-detail-side","label":"Детали"},{"src":"real/denim-tote-detail-zip","label":"Детали"},{"src":"real/denim-tote-model-shoulder","label":"На модели","editorial":true},{"src":"real/denim-tote-lookbook-seated","label":"На модели","editorial":true},{"src":"real/denim-tote-lookbook-full","label":"На модели","editorial":true}],"modelImages":["real/denim-tote-model-shoulder","real/denim-tote-lookbook-seated","real/denim-tote-lookbook-full"]},{"id":"denim-shoulder","number":"14","name":"Синяя сумка на плечо","color":"Синий","shade":"#40576b","price":38000,"caption":"На плечо","type":"day","search":"Синяя сумка на плечо Синий","description":"Компактный вытянутый силуэт и спокойный синий оттенок. Сумка показана крупным планом и в образе.","photographed":true,"image":"real/denim-shoulder-product-front","gallery":[{"src":"real/denim-shoulder-product-front","label":"Спереди"},{"src":"real/denim-shoulder-detail-zip","label":"Детали"},{"src":"real/denim-shoulder-detail-side-fastener","label":"Детали"},{"src":"real/denim-shoulder-model-shoulder","label":"На модели","editorial":true},{"src":"real/denim-shoulder-lookbook-seated","label":"На модели","editorial":true},{"src":"real/denim-shoulder-lookbook-full","label":"На модели","editorial":true}],"modelImages":["real/denim-shoulder-model-shoulder","real/denim-shoulder-lookbook-seated","real/denim-shoulder-lookbook-full"]},{"id":"lilac-soft","number":"15","name":"Сиреневая сумка","color":"Сиреневый","shade":"#a89aa4","price":35000,"caption":"Мягкая форма","type":"day","search":"Сиреневая сумка Сиреневый","description":"Мягкий объём в приглушённом сиреневом оттенке. Короткие ручки и дополнительный ремень позволяют менять способ ношения.","photographed":true,"image":"real/lilac-soft-product-three-quarter-square","gallery":[{"src":"real/lilac-soft-product-three-quarter-square","label":"Общий вид"},{"src":"real/lilac-soft-product-front-square","label":"Спереди"},{"src":"real/lilac-soft-product-with-strap-square","label":"Общий вид"},{"src":"real/lilac-soft-detail-interior-square","label":"Внутри"},{"src":"real/lilac-soft-detail-handle-square","label":"Детали"},{"src":"real/lilac-soft-detail-side-square","label":"Детали"}],"modelImages":[]}]);
Object.assign(products.find(p=>p.id==='velour'),{"image":"real/chocolate-shoulder-product-front-square","gallery":[{"src":"real/chocolate-shoulder-product-front-square","label":"Спереди"},{"src":"real/chocolate-shoulder-product-three-quarter-square","label":"Общий вид"},{"src":"real/chocolate-shoulder-product-back-square","label":"Сзади"},{"src":"real/chocolate-shoulder-detail-knot-square","label":"Детали"},{"src":"real/chocolate-shoulder-detail-interior-square","label":"Внутри"},{"src":"real/chocolate-shoulder-detail-side-square","label":"Детали"}]});
const imageFor=p=>p.image||p.id;
const $ = id => document.getElementById(id);
const money=value=>new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB',maximumFractionDigits:0}).format(value);
const bagIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14l1 14H4L5 7Zm3 0V5a4 4 0 0 1 8 0v2"/></svg>';
let cart={};try{const stored=JSON.parse(localStorage.getItem('barsalini-cart-v1')||'{}');if(stored&&typeof stored==='object'&&!Array.isArray(stored))for(const p of products){const q=stored[p.id];if(Number.isInteger(q)&&q>0&&q<=10)cart[p.id]=q;}}catch{}
let filter='all',sort='default',lookIndex=0,toastTimer;
// Keep unfinished contact details in memory only, never in localStorage.
let checkoutDraft={};
let detailProductId=null,detailQuantity=1,detailGalleryIndex=0;
const cartList=()=>products.filter(p=>cart[p.id]).map(p=>({...p,quantity:cart[p.id]}));
const cartTotal=()=>cartList().reduce((sum,p)=>sum+p.price*p.quantity,0);
function persistCart(){try{localStorage.setItem('barsalini-cart-v1',JSON.stringify(cart));}catch{}document.querySelectorAll('.selection-count').forEach(el=>el.textContent=`(${Object.values(cart).reduce((a,b)=>a+b,0)})`);}
const looks=[
 {src:'hero',alt:'Модель с сумкой Forma в каменном дворе',title:'01 / Forma — в свете города'},
 {src:'editorial',alt:'Модель в светлом платье с карамельной сумкой Sera',title:'02 / Sera — в своём ритме'},
 {src:'material',alt:'Фактура шоколадной кожи и золотистый замок Forma',title:'03 / Forma — красота деталей'},
 {src:'linea-editorial',alt:'Модель в графитовом жакете с бордовой сумкой Linea',title:'04 / Linea — вечерний акцент'}, {src:'forma-editorial',alt:'Модель с сумкой Forma в галерее',title:'05 / Forma — тихое утро'}, {src:'luna-editorial',alt:'Модель с сумкой Luna на городских ступенях',title:'06 / Luna — в ритме города'}
];
function toast(message){const host=document.querySelector('dialog[open]')||document.body;host.append($('toast'));$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2500);}
function openDialog(id){document.querySelectorAll('dialog[open]').forEach(d=>d.close());const d=$(id);if(id==='cartDialog')renderCart();if(id==='searchDialog'){ $('searchInput').value='';renderSearch(''); }d.showModal();document.body.classList.add('modal-open');if(id==='searchDialog')$('searchInput').focus();}
function renderProducts(){
 const visible=products.filter(p=>filter==='all'||p.type===filter);
 if(sort!=='default')visible.sort((a,b)=>sort==='asc'?a.price-b.price:b.price-a.price);
 $('productCount').textContent=visible.length+' '+(visible.length===1?'модель':visible.length<5?'модели':'моделей');
 $('productGrid').innerHTML=visible.map(p=>`<article class="product-card"><div class="product-visual"><button type="button" class="product-image-button" data-product="${p.id}" aria-label="Открыть ${p.name}, ${p.color}"><img src="assets/${imageFor(p)}.webp" width="1254" height="1254" loading="lazy" alt="${p.name} — ${p.color}"></button><span class="product-number">N°${p.number}</span><button type="button" class="favorite" data-add="${p.id}" aria-label="Добавить ${p.name} в корзину">${bagIcon}</button></div><div class="product-info"><div><h3><button type="button" data-product="${p.id}">${p.name}</button></h3><p>${p.color} · ${p.caption}</p></div><span class="product-price">${money(p.price)}</span></div></article>`).join('');
}
function addToCart(id,button,quantity=1){
 if(!products.some(p=>p.id===id))return;
 const amount=Math.max(1,Math.min(10,Math.floor(Number(quantity)||1)));
 const available=10-(cart[id]||0);
 if(available===0){toast('В корзине уже 10 экземпляров этой модели');return;}
 if(amount>available){toast(`Можно добавить ещё ${available} шт. этой модели. Измените количество.`);return;}
 cart[id]=(cart[id]||0)+amount;
 persistCart();
 toast(amount>1?`Добавлено в корзину: ${amount} шт.`:'Добавлено в корзину');
 if(button?.classList.contains('solid-button')){
  button.textContent='Добавлено ✓';
  setTimeout(()=>{if(button.isConnected){if(button.hasAttribute('data-detail-add'))renderDetailQuantity();else button.innerHTML='Добавить в корзину <span>+</span>';}},1800);
 }
}
function productGallery(p){
 if(p.gallery)return p.gallery.map(v=>({...v,alt:`${p.name} — ${v.label}`}));
 const gallery=[
  {src:p.id,label:'Общий вид',alt:`Сумка ${p.name}, ${p.color} — визуальная концепция`},
  {src:p.id,label:'Крупный план',alt:`${p.name} — увеличенный фрагмент изображения`,cropped:true}
 ];
 if(p.look!==undefined)gallery.push({src:looks[p.look].src,label:'На модели',alt:looks[p.look].alt,editorial:true});
 if(p.id==='forma')gallery.push({src:'material',label:'Фактура',alt:'Концептуальное изображение фактуры и застёжки Forma'});
 return gallery;
}
function renderDetailGallery(index){
 const p=products.find(product=>product.id===detailProductId);
 if(!p)return;
 const gallery=productGallery(p);
 detailGalleryIndex=(index+gallery.length)%gallery.length;
 const view=gallery[detailGalleryIndex];
 $('detailPhoto').src=`assets/${view.src}.webp`;
 $('detailPhoto').alt=view.alt;
 $('detailStage').classList.toggle('is-cropped',Boolean(view.cropped));
 $('detailStage').classList.toggle('is-editorial',Boolean(view.editorial));
 $('detailGalleryLabel').textContent=view.label;
 $('detailGalleryCount').textContent=`${String(detailGalleryIndex+1).padStart(2,'0')} / ${String(gallery.length).padStart(2,'0')}`;
 document.querySelectorAll('[data-detail-image]').forEach(button=>{
  const active=Number(button.dataset.detailImage)===detailGalleryIndex;
  button.classList.toggle('active',active);
  button.setAttribute('aria-pressed',String(active));
 });
}
function renderDetailQuantity(){
 const p=products.find(product=>product.id===detailProductId);
 if(!p||!$('detailQuantity'))return;
 $('detailQuantity').value=String(detailQuantity);
 $('detailQuantity').textContent=String(detailQuantity);
 document.querySelectorAll('[data-detail-qty]').forEach(button=>{
  button.disabled=Number(button.dataset.detailQty)<0?detailQuantity<=1:detailQuantity>=10;
 });
 const addButton=document.querySelector('[data-detail-add]');
 if(addButton)addButton.innerHTML=`Добавить в корзину <span>${money(p.price*detailQuantity)}</span>`;
}
function showProduct(id){
 const p=products.find(product=>product.id===id);
 if(!p)return;
 detailProductId=id;detailQuantity=1;detailGalleryIndex=0;
 const gallery=productGallery(p);
 const appearance=p.id==='velour'
  ?'Прямоугольный корпус с мягкой замшевой фактурой. Две длинные тёмные ручки, верхняя молния, небольшая металлическая эмблема и подвесной брелок-футляр. В галерее можно рассмотреть сумку спереди, сзади, сбоку и внутри.'
  :p.photographed?p.description:`${p.description} Эта карточка показывает визуальное направление модели. Размеры, внутреннее устройство, состав и наличие уточняются после утверждения ассортимента.`;
 const care=p.id==='velour'
  ?'На фотографиях видна замшевая фактура; точный состав верха и подкладки уточняется. Берегите поверхность от влаги и трения. Способ очистки и защитное средство подбирайте после подтверждения материала, по рекомендации производителя.'
  :p.photographed?'Точный состав верха и подкладки уточняется. Храните сумку в тканевом чехле и избегайте длительного контакта с влагой. Средства для ухода выбирайте по рекомендации производителя после подтверждения материала.':'Фактура на изображении передаёт идею модели; точный состав пока не указан. Храните сумку в тканевом чехле, избегайте перегрузки и прямого солнца. Конкретные средства для ухода подбирайте только после подтверждения материала.';
 $('productDetail').innerHTML=`
  <div class="detail-layout">
   <div class="detail-gallery" aria-label="Галерея ${p.name}">
    <div class="detail-stage" id="detailStage"><img class="detail-photo" id="detailPhoto" src="assets/${gallery[0].src}.webp" alt="${gallery[0].alt}" width="1254" height="1254"></div>
    <div class="detail-gallery-caption"><span id="detailGalleryLabel" aria-live="polite">${gallery[0].label}</span><div class="detail-gallery-nav"><button type="button" data-detail-step="-1" aria-label="Предыдущее изображение">←</button><span id="detailGalleryCount">01 / ${String(gallery.length).padStart(2,'0')}</span><button type="button" data-detail-step="1" aria-label="Следующее изображение">→</button></div></div>
    <div class="detail-thumbnails" aria-label="Выбор изображения">${gallery.map((view,index)=>`<button type="button" class="detail-thumb${index===0?' active':''}${view.cropped?' is-cropped':''}" data-detail-image="${index}" aria-label="${view.label}: ${p.name}" aria-pressed="${index===0}"><img src="assets/${view.src}.webp" alt="" loading="lazy"><span>${view.label}</span></button>`).join('')}</div>
    
    <p class="detail-source">${p.photographed?'Галерея составлена из фотографий сумки.':'Визуальная концепция · изображения созданы с помощью ИИ.'}</p>
   </div>
   <div class="detail-copy">
    <p class="eyebrow">COLLECTION PREMIÈRE / N°${p.number}</p>
    <h2 id="detailTitle">${p.name}</h2>
    <p class="detail-category">${p.caption}</p>
    <p class="detail-price">${money(p.price)}</p>
    <div class="product-options"><div class="option-row"><span>Цвет</span><strong>${p.color}</strong></div><button type="button" class="color-choice" aria-label="${p.color}, выбран" aria-pressed="true" style="--swatch:${p.shade}"><span></span></button><div class="option-row"><span>Формат</span><span>Представлен на фото</span></div><button type="button" class="format-choice" aria-pressed="true">${p.caption}</button></div>
    <p class="description">${p.description}</p>
    <dl class="detail-facts"><div><dt>Силуэт</dt><dd>${p.caption}</dd></div><div><dt>В коллекции</dt><dd>${p.type==='evening'?'Вечерний акцент':'На каждый день'}</dd></div><div><dt>Размеры и состав</dt><dd>Уточняются</dd></div></dl>
    <div class="detail-purchase"><div class="detail-quantity"><span id="detailQuantityLabel">Количество</span><div class="quantity" role="group" aria-labelledby="detailQuantityLabel"><button type="button" data-detail-qty="-1" aria-label="Уменьшить количество" disabled>−</button><output id="detailQuantity" aria-live="polite" aria-atomic="true">1</output><button type="button" data-detail-qty="1" aria-label="Увеличить количество">+</button></div></div><button type="button" class="solid-button" data-add="${p.id}" data-detail-add>Добавить в корзину <span>${money(p.price)}</span></button></div>
    <button type="button" class="outline-button" data-open="cartDialog">Перейти в корзину <span>→</span></button>
    ${hasModel(p)?`<button type="button" class="model-product outline-button" data-model="${p.id}">Посмотреть на модели <span>↗</span></button>`:''}
    <div class="detail-accordions"><details open><summary>Силуэт и детали</summary><p>${appearance}</p></details><details><summary>Материалы и уход</summary><p>${care}</p></details><details><summary>Доставка и оформление</summary><p>Добавьте нужное количество в корзину и выберите доставку курьером или согласование с менеджером. Стоимость и сроки доставки, наличие и характеристики модели требуют подтверждения.</p><p>Оформление работает в демонстрационном режиме: данные не отправляются, оплата не списывается.</p></details></div>
    <p class="detail-note">Цена приведена для презентации. ${p.photographed?'Фотографии показывают внешний вид предоставленной сумки.':'Изображения показывают концепцию, а не утверждённый товар.'}</p>
   </div>
  </div>`;
 $('productDialog').setAttribute('aria-labelledby','detailTitle');
 openDialog('productDialog');
}
function renderCart(){const active=document.activeElement;const hadFocus=$('cartItems').contains(active);const focusKey=hadFocus?{qty:active.dataset.qty,delta:active.dataset.delta,remove:active.dataset.remove,product:active.dataset.product}:null;const list=cartList();$('cartItems').innerHTML=list.length?list.map(p=>`<div class="cart-row"><button data-product="${p.id}" aria-label="Открыть ${p.name}"><img src="assets/${imageFor(p)}.webp" alt="${p.name}"></button><div><h3>${p.name}</h3><p class="muted">${p.color}</p><p>${money(p.price)}</p><div class="quantity"><button data-qty="${p.id}" data-delta="-1" aria-label="Уменьшить количество ${p.name}">−</button><span aria-label="Количество">${p.quantity}</span><button data-qty="${p.id}" data-delta="1" aria-label="Увеличить количество ${p.name}" ${p.quantity>=10?'disabled':''}>+</button></div></div><button class="remove-item" data-remove="${p.id}" aria-label="Удалить ${p.name}">×</button></div>`).join(''):'<div class="empty-selection"><div class="empty-symbol">'+bagIcon+'</div><p>Ваша корзина пока пуста.<br>Найдите свою форму в коллекции Select.</p><a href="#collection" class="underlink" data-close-link>Открыть коллекцию</a></div>';$('cartFooter').innerHTML=list.length?`<div class="cart-total"><span>Итого</span><span>${money(cartTotal())}</span></div><p class="muted">Доставка будет согласована при подтверждении.</p><button class="solid-button" id="beginCheckout">Оформить заказ <span>→</span></button><p class="selection-note">Демонстрация оформления. Оплата не списывается.</p>`:'';if(hadFocus){const target=[...$('cartItems').querySelectorAll('button')].find(button=>!button.disabled&&(focusKey.qty?button.dataset.qty===focusKey.qty&&button.dataset.delta===focusKey.delta:focusKey.remove?button.dataset.remove===focusKey.remove:button.dataset.product===focusKey.product));(target||$('cartItems').querySelector('button, a')||$('beginCheckout')||$('cartDialog').querySelector('[data-close]')).focus();}}
function checkout(){if(!cartList().length)return;$('checkoutContent').innerHTML=`<h2 id="checkoutTitle">Оформление заказа</h2><p class="checkout-lead">Последние детали вашего выбора.</p><div class="checkout-layout"><form id="orderForm"><h3>01 / Контактные данные</h3><label>Имя и фамилия<input name="customerName" autocomplete="name" required maxlength="100" placeholder="Как к вам обращаться"></label><div class="form-pair"><label>Телефон<input name="phone" type="tel" autocomplete="tel" required placeholder="+7 999 123-45-67" maxlength="30"></label><label>Email <span class="muted">(необязательно)</span><input name="email" type="email" autocomplete="email" placeholder="mail@example.ru" maxlength="150"></label></div><h3>02 / Доставка</h3><label>Способ доставки<select name="delivery" id="deliveryMethod"><option value="courier">Курьером по адресу</option><option value="discuss">Согласовать с менеджером</option></select></label><label id="addressLabel">Город, улица, дом, квартира<textarea name="address" autocomplete="street-address" required maxlength="500" rows="2" placeholder="Адрес доставки"></textarea></label><label>Комментарий <span class="muted">(необязательно)</span><textarea name="comment" rows="2" maxlength="1000" placeholder="Ваши пожелания к заказу"></textarea></label><h3>03 / Оплата</h3><p class="payment-note">После подтверждения заказа<br><span class="muted">Способ оплаты согласуется отдельно.</span></p><p class="demo-note">Демонстрационный режим: данные никуда не отправляются, оплата не производится. Можно использовать вымышленные данные.</p><button class="solid-button" type="submit">Оформить демо-заказ <span>→</span></button></form><aside class="order-summary"><h3>Ваш заказ</h3>${cartList().map(p=>`<div class="summary-row"><img src="assets/${imageFor(p)}.webp" alt="${p.name}"><div>${p.name}<p class="muted">${p.color} · ${p.quantity} шт.</p><p>${money(p.price*p.quantity)}</p></div></div>`).join('')}<div class="cart-total"><span>Товары</span><span>${money(cartTotal())}</span></div><p class="muted">Доставка — по согласованию</p><div class="cart-total"><span>Итого за товары</span><span>${money(cartTotal())}</span></div><button type="button" class="underlink" data-open="cartDialog">Изменить корзину</button></aside></div>`;const form=$('orderForm');for(const [name,value] of Object.entries(checkoutDraft)){if(form.elements.namedItem(name))form.elements.namedItem(name).value=value;}const syncDelivery=()=>{const field=form.elements.address;field.required=form.elements.delivery.value==='courier';$('addressLabel').hidden=!field.required;};const saveDraft=()=>{checkoutDraft=Object.fromEntries(new FormData(form));};syncDelivery();openDialog('checkoutDialog');form.addEventListener('change',()=>{syncDelivery();saveDraft();});form.addEventListener('submit',submitOrder);form.addEventListener('input',e=>{saveDraft();if(e.target.setCustomValidity)e.target.setCustomValidity('');});}
function submitOrder(e){e.preventDefault();const form=e.target;const phone=form.elements.phone;const digits=phone.value.replace(/\D/g,'');if(digits.length<10||digits.length>15){phone.setCustomValidity('Введите телефон от 10 до 15 цифр');phone.reportValidity();return;}for(const field of [form.elements.customerName,form.elements.address]){if(field.required&&!field.value.trim()){field.setCustomValidity('Заполните это поле');field.reportValidity();return;}}const total=cartTotal();const count=cartList().reduce((n,p)=>n+p.quantity,0);cart={};checkoutDraft={};persistCart();$('checkoutContent').innerHTML=`<div class="order-success"><p class="eyebrow">BARSALINI LAND SELECT</p><span class="success-mark">✓</span><h2 id="checkoutTitle" tabindex="-1">Ваш выбор оформлен</h2><p>Демонстрационный заказ<br>${count} шт. · ${money(total)}</p><p class="muted">Так будет выглядеть завершение покупки.<br>Заявка никуда не отправлена.<br>Оплата не списывалась.</p><button class="solid-button" data-close>Продолжить знакомство <span>→</span></button></div>`;$('checkoutTitle').focus();}
function renderSearch(query){const normalize=s=>s.toLowerCase().replaceAll('ё','е').trim();const terms=normalize(query).split(/\s+/).filter(Boolean);const result=products.filter(p=>terms.every(t=>normalize(`№ ${p.number} ${Number(p.number)} ${p.name} ${p.color} ${p.caption} ${p.search}`).includes(t)));$('searchResults').innerHTML=result.length?result.map(p=>`<button class="result-row" data-product="${p.id}"><img src="assets/${imageFor(p)}.webp" alt=""><div><h3>${p.name}</h3><p>${p.color} · ${p.caption}</p><p>${money(p.price)}</p></div><span aria-hidden="true">↗</span></button>`).join(''):'<div class="empty-selection"><p>Пока ничего не найдено.<br>Попробуйте «Forma», «замша» или «бордо».</p></div>';}
function renderLook(){const look=looks[lookIndex];$('lookImage').src=`assets/${look.src}.webp`;$('lookImage').alt=look.alt;$('lookCaption').textContent=look.title;}
function showLook(index){lookIndex=Number(index)||0;renderLook();openDialog('lookDialog');}
function moveLook(direction){lookIndex=(lookIndex+direction+looks.length)%looks.length;renderLook();}
const info={care:'<p class="eyebrow">THE ART OF KEEPING</p><h2>Забота о любимых вещах.</h2><p>Несколько общих правил, которые помогают беречь сумку. Для конкретной модели всегда следуйте рекомендациям производителя.</p><ul><li>Храните сумку в тканевом чехле, вдали от прямого солнца и отопительных приборов.</li><li>Не перегружайте её. Мягкая бумага без красителя поможет сохранить форму при хранении.</li><li>Если сумка намокла, промокните её мягкой сухой тканью и оставьте сохнуть естественно.</li><li>Средство для ухода подбирайте по материалу. Сначала проверьте его на незаметном участке.</li><li>Для замши используйте специальную щётку; сложные загрязнения доверьте специалисту.</li></ul>',presentation:'<p class="eyebrow">BARSALINI LAND SELECT</p><h2>Первое знакомство.</h2><p>Перед вами самостоятельная визуальная концепция новой витрины Barsalini Land Select: коллекция Première, модельная съёмка и истории о деталях.</p><p>В коллекции представлены реальные фотографии сумок и съёмки с моделями, а также ранее подготовленные визуальные концепции для демонстрации художественного направления. Реальные фотографии предоставлены брендом; визуальные концепции отмечены в карточках. Характеристики ассортимента требуют подтверждения.</p><p>Карточки, поиск, лукбук, корзина и демонстрационное оформление доступны для знакомства с концепцией. Цены приведены для примера. Оплата и отправка заявок не подключены. Ассортимент, характеристики и контакты будут уточнены после согласования.</p>'};
document.addEventListener('click',event=>{const el=event.target.closest('button,a');if(!el)return;if(el.dataset.open)openDialog(el.dataset.open);if(el.hasAttribute('data-close'))el.closest('dialog').close();if(el.dataset.product)showProduct(el.dataset.product);if(el.dataset.model)showModel(el.dataset.model);if(el.dataset.modelPick)selectModel(el.dataset.modelPick);if(el.dataset.closeup)activateCloseup(el.dataset.closeup);if(el.id==='modelZoom')toggleModelZoom();if(el.id==='modelReset'){modelFrame=0;modelZoomed=false;renderModel();}if(el.dataset.modelStep){modelFrame+=Number(el.dataset.modelStep);modelZoomed=false;renderModel();}if(el.dataset.add)addToCart(el.dataset.add,el,el.hasAttribute('data-detail-add')?detailQuantity:1);if(el.dataset.detailQty){detailQuantity=Math.max(1,Math.min(10,detailQuantity+Number(el.dataset.detailQty)));renderDetailQuantity();}if(el.dataset.detailImage!==undefined)renderDetailGallery(Number(el.dataset.detailImage));if(el.dataset.detailStep)renderDetailGallery(detailGalleryIndex+Number(el.dataset.detailStep));if(el.dataset.remove){delete cart[el.dataset.remove];persistCart();renderCart();}if(el.dataset.qty){const id=el.dataset.qty;cart[id]=Math.max(0,Math.min(10,(cart[id]||0)+Number(el.dataset.delta)));if(!cart[id])delete cart[id];persistCart();renderCart();}if(el.id==='beginCheckout')checkout();if(el.dataset.look!==undefined)showLook(el.dataset.look);if(el.dataset.info){$('infoContent').innerHTML=info[el.dataset.info]||'';openDialog('infoDialog');}if(el.dataset.filter){filter=el.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===el);b.setAttribute('aria-pressed',String(b===el));});renderProducts();}if(el.closest('#menuDialog')&&el.tagName==='A'||el.hasAttribute('data-close-link'))el.closest('dialog').close();});
document.querySelectorAll('dialog').forEach(d=>{d.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');});d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});});
$('searchInput').addEventListener('input',e=>renderSearch(e.target.value));$('prevLook').addEventListener('click',()=>moveLook(-1));$('nextLook').addEventListener('click',()=>moveLook(1));$('lookDialog').addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();moveLook(-1);}if(e.key==='ArrowRight'){e.preventDefault();moveLook(1);}});
$('sortProducts').addEventListener('change',e=>{sort=e.target.value;renderProducts();});
const motion=$('motionToggle');if(matchMedia('(prefers-reduced-motion: reduce)').matches){document.querySelector('.hero').classList.add('motion-paused');motion.hidden=true;}
motion.addEventListener('click',()=>{const paused=document.querySelector('.hero').classList.toggle('motion-paused');motion.setAttribute('aria-pressed',String(paused));motion.setAttribute('aria-label',paused?'Продолжить движение кадра':'Приостановить движение кадра');motion.innerHTML=paused?'▷ <span>Продолжить</span>':'Ⅱ <span>Пауза</span>';});

function modelPhotos(p){return p.modelImages?.length?p.modelImages:p.look!==undefined?[looks[p.look].src]:[];}
function hasModel(p){return modelPhotos(p).length>0;}
let modelProductId='camel-tote',modelFrame=0,modelZoomed=false,modelRequest=0;
function showModel(id){if(!products.some(p=>p.id===id&&hasModel(p)))return;modelProductId=id;modelFrame=0;modelZoomed=false;renderModel();openDialog('modelDialog');}
function selectModel(id){if(!products.some(p=>p.id===id&&hasModel(p)))return;modelProductId=id;modelFrame=0;modelZoomed=false;renderModel();}
function updateModelZoom(){const photo=$('modelPhoto');photo.classList.toggle('is-zoomed',modelZoomed);$('modelZoom').textContent=modelZoomed?'Общий план':'Приблизить образ';$('modelZoom').setAttribute('aria-pressed',String(modelZoomed));if(!modelZoomed)photo.parentElement.scrollTo(0,0);}
function renderModel(){
 const p=products.find(p=>p.id===modelProductId);if(!p||!hasModel(p))return;
 const photos=modelPhotos(p);modelFrame=(modelFrame+photos.length)%photos.length;
 const nextSrc=`assets/${photos[modelFrame]}.webp`,request=++modelRequest,photo=$('modelPhoto'),viewport=photo.parentElement;
 viewport.setAttribute('aria-busy','true');photo.classList.add('is-loading');
 let status=viewport.querySelector('.model-image-status');if(!status){status=document.createElement('p');status.className='model-image-status';status.setAttribute('role','status');viewport.append(status);}status.textContent='Загружаем фотографию…';status.hidden=false;
 const pendingImage=new Image();pendingImage.src=nextSrc;
 pendingImage.decode().then(()=>{if(request!==modelRequest)return;photo.src=nextSrc;photo.alt=`${p.name} — сумка на модели`;photo.classList.remove('is-loading');viewport.setAttribute('aria-busy','false');status.hidden=true;}).catch(()=>{if(request!==modelRequest)return;viewport.setAttribute('aria-busy','false');status.textContent='Не удалось загрузить фотографию. Выберите другой образ или попробуйте ещё раз.';});
 updateModelZoom();
 $('modelName').textContent=p.name;$('modelNumber').textContent=`№ ${p.number} · ${modelFrame+1} / ${photos.length}`;
 $('modelSource').textContent=p.photographed?'Фотографии из съёмки коллекции':'Визуальная концепция образа';
 $('modelPrice').textContent=money(p.price);$('modelAdd').dataset.add=p.id;$('modelAdd').textContent='Добавить в корзину';
 if(!$('modelChoices').children.length)$('modelChoices').innerHTML=products.filter(hasModel).map(q=>`<button class="model-choice" type="button" data-model-pick="${q.id}" aria-pressed="false"><img src="assets/${imageFor(q)}.webp" loading="lazy" alt=""><span>№ ${q.number} · ${q.name}</span></button>`).join('');
 $('modelChoices').querySelectorAll('[data-model-pick]').forEach(button=>{const active=button.dataset.modelPick===p.id;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
 document.querySelectorAll('[data-model-step]').forEach(b=>b.disabled=photos.length<2);
}
function toggleModelZoom(){modelZoomed=!modelZoomed;updateModelZoom();}
$('modelDialog').addEventListener('keydown',e=>{if((e.key==='ArrowLeft'||e.key==='ArrowRight')&&!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)){e.preventDefault();modelFrame+=e.key==='ArrowRight'?1:-1;modelZoomed=false;renderModel();}});

function activateCloseup(id){document.querySelectorAll('.closeup-panel').forEach(p=>{const active=p.dataset.closeupId===id;p.classList.toggle('active',active);p.querySelector('[data-closeup]').setAttribute('aria-expanded',String(active));});}
function renderCloseups(){
 const featured=['velour','camel-tote','denim-shoulder','lilac-soft','chocolate-satchel','denim-tote'].map(id=>products.find(p=>p.id===id));
 $('closeupCollection').innerHTML=featured.map((p,i)=>`<article class="closeup-panel ${i===0?'active':''}" data-closeup-id="${p.id}"><button class="closeup-select" type="button" data-closeup="${p.id}" aria-expanded="${i===0}" aria-label="Рассмотреть ${p.name}"><img src="assets/${imageFor(p)}.webp" loading="lazy" alt="${p.name}"><span class="closeup-label">№ ${p.number} / ${p.caption}</span></button><div class="closeup-copy"><span>№ ${p.number}</span><h3>${p.name}</h3><p>${money(p.price)}</p><button type="button" class="underlink" data-product="${p.id}">Рассмотреть сумку ↗</button></div></article>`).join('');
 document.querySelectorAll('.closeup-panel').forEach(p=>p.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')activateCloseup(p.dataset.closeupId);}));
}
renderCloseups();
renderProducts();persistCart();
