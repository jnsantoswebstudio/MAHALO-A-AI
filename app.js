/* MAHALO — vitrine + pedidos por WhatsApp | JN Santos Web Studio
 * Conteúdo publicado: site-data.js. Prévia local: exportação do painel admin.html.
 * Não captura pagamento nem consulta estoque/sincroniza o Anota AI.
 */
(()=>{
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const clone=x=>JSON.parse(JSON.stringify(x));
let DATA=clone(window.MAHALO_SITE_DATA||{});
try{const preview=localStorage.getItem('mahalo-admin-preview-v3');if(preview){const parsed=JSON.parse(preview);if(parsed&&Array.isArray(parsed.products))DATA=parsed;}}catch(_e){}
const brand=DATA.brand||{},rules=DATA.rules||{freeToppings:2,maxToppings:10,maxPerTopping:10};
const fmt=v=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(v||0);
const clean=v=>String(v??'').replace(/[<>]/g,'').trim().slice(0,600);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset=v=>{const u=String(v||'');return (/^https:\/\//i.test(u)||/^assets\/[a-z0-9_./-]+$/i.test(u)||/^data:image\/(png|jpeg|webp|gif);base64,/i.test(u))?u:''};
const ext=v=>/^https:\/\//i.test(String(v||''))?v:'#contato';
const activeProducts=()=>DATA.products.filter(x=>x.active!==false);
const activeToppings=()=>DATA.toppings.filter(x=>x.active!==false);
let search='',category='all',cart=[],builderProduct='',builderTops=[],builderQty=1,modalProduct='',modalTops=[],modalQty=1,modalNote='',focusBefore=null,toastT;
const toast=msg=>{const e=$('#toast');e.textContent=msg;e.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>e.classList.remove('show'),2700)};
const whats=msg=>{const url='https://wa.me/'+String(brand.phone||'5521975951272').replace(/\D/g,'')+'?text='+encodeURIComponent(msg);const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';document.body.append(a);a.click();a.remove()};
const setHref=(selector,url)=>$$(selector).forEach(x=>{x.href=ext(url);x.target='_blank';x.rel='noopener noreferrer'});
const setText=(selector,value)=>{const e=$(selector);if(e&&value)e.textContent=value};
function initBrand(){
 const yellow=brand.colors?.yellow,purple=brand.colors?.purple,aqua=brand.colors?.aqua;
 if(/^#[0-9a-f]{6}$/i.test(yellow||''))document.documentElement.style.setProperty('--yellow',yellow);
 if(/^#[0-9a-f]{6}$/i.test(purple||''))document.documentElement.style.setProperty('--plum',purple);
 if(/^#[0-9a-f]{6}$/i.test(aqua||''))document.documentElement.style.setProperty('--aqua',aqua);
 setText('#heroSubtitle',brand.heroSubtitle);setText('#essenceText',brand.essenceText);
 const hero=asset(brand.heroImage),logo=asset(brand.logo),essence=asset(brand.essenceImage);
 if(hero){$('.hero-cup').src=hero;const previewCup=$('#builderCup');if(previewCup)previewCup.src=hero;const universeCup=$('.gallery-product img');if(universeCup)universeCup.src=hero;}
 if(brand.heroTitle&&brand.heroTitle!=='O lado bom do seu dia.')$('.hero h1').textContent=brand.heroTitle;
 if(brand.essenceTitle&&brand.essenceTitle!=='Natural de verdade. Com a energia da Mahalo.')$('.essence-copy .display-title').textContent=brand.essenceTitle;
 if(brand.universeTitle&&brand.universeTitle!=='O universo Mahalo, de perto.')$('.universe .display-title').textContent=brand.universeTitle;
 if(brand.universeText)setText('.universe .section-title-wrap>p',brand.universeText);
 if(logo)$$('.logo-lockup img,.footer-main img,.gallery-logo img').forEach(x=>x.src=logo);
 if(essence){const el=$('.essence-logo-field img');if(el)el.src=essence;}
 setHref('a[href*="pedido.anota.ai"],a[data-link="anota"]',brand.anota);
 setHref('a[href*="instagram.com"]',brand.instagram);
 setHref('a[href*="wa.me/"]',`https://wa.me/${String(brand.phone||'').replace(/\D/g,'')}`);
 setHref('.visit-actions a:first-child',brand.map);
 // Exibir coordenadas ou endereço editável no mapa (Google Maps embed autorizado).
 if(/^https:\/\/(maps\.google\.com\/maps\?|www\.google\.com\/maps\/embed\?)/i.test(String(brand.mapEmbed||''))){const frame=$('.map-frame iframe');if(frame)frame.src=brand.mapEmbed;}
 if(brand.address)setText('.visit-details strong',brand.address);
 if(brand.phone)setText('.visit-details div:nth-child(2) strong','WhatsApp: '+String(brand.phone).replace(/^55(\d\d)(\d{5})(\d{4})$/,'($1) $2-$3'));
 setText('#studioCredit',brand.footerCredit?.replace(/^Desenvolvido por\s+/,'')||'JN Santos Web Studio');
 $('#year').textContent=String(new Date().getFullYear());
}
function photoMarkup(src,label,kind='product'){
 const safe=asset(src);
 return safe?`<img src="${esc(safe)}" alt="${esc(label)}" loading="lazy" onerror="this.style.display='none';this.parentNode.classList.add('image-missing')">`:`<div class="photo-placeholder"><span aria-hidden="true">✳</span><small>FOTO ${kind==='product'?'DO PRODUTO':'OFICIAL'}<br>EM BREVE</small></div>`;
}
function renderCatalog(){
 const box=$('#productGrid');box.replaceChildren();
 const items=activeProducts().filter(p=>(category==='all'||p.category===category)&&`${p.name} ${p.description}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(search));
 if(!items.length){box.innerHTML='<p class="no-results">Não encontramos itens nessa busca. Tente outra palavra.</p>';return}
 items.forEach(p=>{
   const article=document.createElement('article');article.className='product-tile';
   article.innerHTML=`<div class="product-tile-image ${p.category==='sucos'?'product-blue':p.category==='melado'?'product-gold':''}">${photoMarkup(p.image,p.name)}<span class="product-sticker">${p.category==='tigelas'?'AÇAÍ ORGÂNICO':p.category==='sucos'?'BEBIDAS':'ARTESANAL'}</span></div><div class="product-tile-content"><small>${p.category==='tigelas'?'ACOMPANHAMENTOS À SUA ESCOLHA':p.category==='sucos'?'300ML · GARRAFA':'500ML · PURO'}</small><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p><div class="product-price-row"><strong>${fmt(p.price)}</strong><button type="button" class="tile-action">${p.toppings?'PERSONALIZAR ↗':'ADICIONAR ↗'}</button></div></div>`;
   article.querySelector('button').addEventListener('click',()=>openProduct(p.id));box.append(article);
 });
}
function totals(p,selected,qty){
 let free=Math.max(0,Number(rules.freeToppings)||0),extra=0,pending=0,count=0;
 selected.forEach(entry=>{const t=activeToppings().find(x=>x.id===entry.id);if(!t)return;let n=Math.min(10,Math.max(0,Number(entry.count)||0));count+=n;const included=Math.min(free,n);free-=included;const charged=n-included;if(charged>0){if(t.extraPrice===null||t.extraPrice===undefined||t.extraPrice==='')pending+=charged;else extra+=charged*(Number(t.extraPrice)||0);}});
 return {known:Math.round(((Number(p?.price)||0)+extra)*qty*100)/100,pending:pending*qty,count,extra:Math.round(extra*100)/100};
}
const currentProduct=(id)=>activeProducts().find(p=>p.id===id);
const chooseTop=(arr,id,delta)=>{
 const e=arr.find(x=>x.id===id),old=e?.count||0,total=arr.reduce((s,x)=>s+x.count,0);
 if(delta>0&&total >= (Number(rules.maxToppings)||10)){toast('Máximo de '+rules.maxToppings+' acompanhamentos por unidade.');return false}
 if(delta>0&&old >= (Number(rules.maxPerTopping)||10)){toast('Limite por acompanhamento atingido.');return false}
 if(!e&&delta>0)arr.push({id,count:1});else if(e){e.count+=delta;if(e.count<=0)arr.splice(arr.indexOf(e),1)}
 return true;
};
function toppingMarkup(entry,selected,mode){
 const n=selected.find(x=>x.id===entry.id)?.count||0;
 const desc=entry.extraPrice===null||entry.extraPrice===undefined?'Extra: valor a confirmar':`Após os ${rules.freeToppings} grátis: ${fmt(entry.extraPrice)}`;
 return `<div class="topping-new ${n?'is-selected':''}" data-top="${esc(entry.id)}"><div class="topping-thumb"><span class="thumb-fallback">${esc(entry.emoji||'✳')}</span>${mode==='builder'?'':(asset(entry.image)?`<img src="${esc(asset(entry.image))}" alt="" loading="lazy" onerror="this.style.display='none'">`:``)}</div><div class="topping-name"><strong>${esc(entry.name)}</strong><small>${desc}</small></div><div class="stepper" role="group" aria-label="${esc(entry.name)}"><button type="button" data-step="-1" aria-label="Remover ${esc(entry.name)}" ${n?'':'disabled'}>−</button><span>${n}</span><button type="button" data-step="1" aria-label="Adicionar ${esc(entry.name)}">+</button></div></div>`;
}
function attachToppings(box,arr,refresh,animate=false){
 box.querySelectorAll('.topping-new').forEach(row=>row.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{
  const delta=Number(b.dataset.step),entry=activeToppings().find(x=>x.id===row.dataset.top);
  if(chooseTop(arr,row.dataset.top,delta)){refresh();if(delta>0&&animate&&entry)animateCup(entry.emoji||'✳');}
 })));
}
function buildTopList(container,selected,refresh,animate=false){container.innerHTML=activeToppings().map(t=>toppingMarkup(t,selected,animate?'builder':'product')).join('');attachToppings(container,selected,refresh,animate)};
function priceLabel(p,selected,qty){const t=totals(p,selected,qty);return (t.pending?'A partir de ':'')+fmt(t.known)+(t.pending?' · '+t.pending+' extra(s) a confirmar':'')};
const saveCart=()=>{try{localStorage.setItem('mahalo-cart-v3',JSON.stringify(cart))}catch(_e){}};
function loadCart(){try{const x=JSON.parse(localStorage.getItem('mahalo-cart-v3')||'[]');if(Array.isArray(x))cart=x.filter(v=>v&&typeof v.id==='string'&&Array.isArray(v.toppings)&&Number.isInteger(v.quantity)&&v.quantity>0).slice(0,50)}catch(_e){}renderCart()}
function addCart(id,toppings,quantity,note=''){
 const p=currentProduct(id);if(!p)return toast('Produto indisponível no momento.');
 cart.push({id:p.id,name:p.name,price:p.price,toppings:clone(toppings),quantity:Math.min(25,Math.max(1,quantity)),note:clean(note)});saveCart();renderCart();toast('Adicionado ao carrinho!');openCart();
}
function renderCart(){
 const list=$('#cartItems');list.replaceChildren();$('#cartCounter').textContent=cart.reduce((s,x)=>s+x.quantity,0);
 let subtotal=0,pending=0;
 if(!cart.length){list.innerHTML='<div class="cart-empty"><span>🥤</span><strong>Seu carrinho está vazio.</strong><p>Escolha uma opção do cardápio para começar.</p></div>';$('#cartTotals').textContent='Carrinho vazio';return}
 cart.forEach((it,i)=>{
   const p=currentProduct(it.id)||{name:it.name,price:it.price};const t=totals(p,it.toppings,it.quantity);subtotal+=t.known;pending+=t.pending;
   const desc=it.toppings.map(x=>{const top=DATA.toppings.find(k=>k.id===x.id);return `${x.count}× ${top?.name||x.id}`}).join(' · ');
   const item=document.createElement('div');item.className='cart-line';
   item.innerHTML=`<span>🥣</span><div class="cart-line-body"><strong>${esc(it.name)}</strong><small>${esc(desc||'Sem complementos')}<br>${it.note?'Obs.: '+esc(it.note)+'<br>':''}Qtd.: ${it.quantity} · ${esc(priceLabel(p,it.toppings,it.quantity))}</small><div class="cart-line-footer"><strong>${fmt(t.known)}</strong><button type="button">Remover</button></div></div>`;
   item.querySelector('button').addEventListener('click',()=>{cart.splice(i,1);saveCart();renderCart()});list.append(item);
 });
 $('#cartTotals').textContent=(pending?'Total mínimo calculado: ':'Subtotal: ')+fmt(subtotal)+(pending?' · '+pending+' extra(s) sem valor informado':'');
}
const cartDrawer=$('#cartDrawer'),cartOverlay=$('#cartOverlay'),productDialog=$('#productDialog'),productOverlay=$('#productOverlay');
const openCart=()=>{if(productDialog.getAttribute('aria-hidden')==='false')closeProduct(false);focusBefore=document.activeElement;cartOverlay.hidden=false;cartDrawer.classList.add('open');cartDrawer.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');$('#cartClose').focus()};
const closeCart=()=>{cartDrawer.classList.remove('open');cartDrawer.setAttribute('aria-hidden','true');cartOverlay.hidden=true;document.body.classList.remove('modal-open');focusBefore?.focus()};
const openProduct=id=>{const p=currentProduct(id);if(!p)return;modalProduct=id;modalTops=[];modalQty=1;modalNote='';focusBefore=document.activeElement;setText('#productDialogTitle',p.name);renderProductModal();productOverlay.hidden=false;productDialog.classList.add('open');productDialog.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');$('#productDialogClose').focus()};
const closeProduct=(restore=true)=>{productOverlay.hidden=true;productDialog.classList.remove('open');productDialog.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');if(restore)focusBefore?.focus()};
function renderProductModal(){
 const p=currentProduct(modalProduct),body=$('#productDialogBody');if(!p)return;
 const t=p.toppings?`<h3>Complementos</h3><p class="dialog-hint">Até ${rules.freeToppings} acompanhamentos sem acréscimo. Selecione até ${rules.maxToppings} unidades no total. Adicionais são enviados separadamente.</p><div class="modal-toplist" id="modalTops"></div>`:'';
 body.innerHTML=`<div class="dialog-product-hero"><div class="dialog-product-photo">${photoMarkup(p.image,p.name)}</div><div><strong>${fmt(p.price)}</strong><p>${esc(p.description)}</p></div></div>${t}<label class="builder-label" for="modalNote">Observações</label><textarea class="builder-note" id="modalNote" rows="2" maxlength="280" placeholder="Detalhes do pedido...">${esc(modalNote)}</textarea><div class="modal-bottom"><div class="stepper"><button type="button" id="modalMinus">−</button><span>${modalQty}</span><button type="button" id="modalPlus">+</button></div><div class="modal-subtotal" id="modalPrice">${priceLabel(p,modalTops,modalQty)}</div></div><button class="button button-plum modal-add" type="button" id="modalAdd">ADICIONAR AO CARRINHO ↗</button>`;
 if(p.toppings){const refresh=()=>{modalNote=$('#modalNote')?.value||modalNote;renderProductModal()};buildTopList($('#modalTops'),modalTops,refresh)}
 $('#modalPlus').addEventListener('click',()=>{modalNote=$('#modalNote').value;modalQty=Math.min(25,modalQty+1);renderProductModal()});
 $('#modalMinus').addEventListener('click',()=>{modalNote=$('#modalNote').value;modalQty=Math.max(1,modalQty-1);renderProductModal()});
 $('#modalAdd').addEventListener('click',()=>addCart(modalProduct,modalTops,modalQty,$('#modalNote').value));
}
function initCatalog(){
 $('#searchProducts').addEventListener('input',e=>{search=e.target.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');renderCatalog()});
 $$('#categoryFilters button').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.filter;$$('#categoryFilters button').forEach(x=>x.classList.toggle('active',x===b));renderCatalog()}));renderCatalog();
}
function renderBuilder(){
 const p=currentProduct(builderProduct);if(!p)return;
 $('#builderPrice').textContent=fmt(p.price);$('#qtyCount').textContent=builderQty;
 const redraw=()=>renderBuilder();buildTopList($('#toppings'),builderTops,redraw,true);
 // Identidade visual V2 do montador: ilustrações antigas (emoji), sem chips de fotos.
 // Preserva as regras/preços da V3; os ingredientes permanecem dentro do copo.
 const layer=$('#ingredientLayer');layer.replaceChildren();
 let index=0;
 builderTops.forEach(choice=>{
   const entry=activeToppings().find(x=>x.id===choice.id);if(!entry)return;
   for(let i=0;i<choice.count&&index<(Number(rules.maxToppings)||10);i++,index++){
     const piece=document.createElement('span');piece.className='cup-piece cup-piece-classic';
     piece.title=entry.name;piece.setAttribute('aria-label',entry.name);
     piece.style.setProperty('--delay',index*.04+'s');
     piece.textContent=entry.emoji||'✳';layer.append(piece);
   }
 });
 const t=totals(p,builderTops,builderQty);
 $('#previewSummary').textContent=builderTops.length?`${t.count} acompanhamento(s) na sua tigela`:'Açaí Mahalo · escolha seus complementos';
 $('#previewPrice').textContent=priceLabel(p,builderTops,builderQty);
 $('#toppingRule').textContent=`Até ${rules.freeToppings} sem acréscimo · até ${rules.maxToppings} unidades no total`;
}
function animateCup(emoji){const layer=$('#ingredientLayer');const piece=document.createElement('span');piece.className='cup-fall';piece.textContent=emoji;piece.style.left=(15+Math.random()*65)+'%';layer.append(piece);setTimeout(()=>piece.remove(),900)}
function initBuilder(){
 const select=$('#builderProduct');select.replaceChildren();
 activeProducts().filter(p=>p.toppings).forEach(p=>{const opt=document.createElement('option');opt.value=p.id;opt.textContent=p.name+' — '+fmt(p.price);select.append(opt)});
 builderProduct=select.value||'';select.addEventListener('change',()=>{builderProduct=select.value;builderTops=[];renderBuilder()});
 $('#qtyDown').addEventListener('click',()=>{builderQty=Math.max(1,builderQty-1);renderBuilder()});$('#qtyUp').addEventListener('click',()=>{builderQty=Math.min(25,builderQty+1);renderBuilder()});
 $('#clearToppings').addEventListener('click',()=>{builderTops=[];renderBuilder();toast('Acompanhamentos removidos')});
 $('#addToCart').addEventListener('click',()=>addCart(builderProduct,builderTops,builderQty,$('#builderNote').value));renderBuilder();
}
function initGallery(){
 const gallery=$('#realGallery');(DATA.gallery||[]).forEach(g=>{const wrap=document.createElement('article');wrap.className='real-gallery-card';wrap.innerHTML=`<div class="real-gallery-photo">${photoMarkup(g.image,g.title,'gallery')}</div><strong>${esc(g.title)}</strong><p>${esc(g.caption)}</p><button type="button">${asset(g.image)?'AMPLIAR IMAGEM ↗':'VER INSTAGRAM ↗'}</button>`;
  wrap.querySelector('button').addEventListener('click',()=>{if(asset(g.image))showLightbox(g.image,g.title,g.caption);else window.open(ext(g.url||brand.instagram),'_blank','noopener')});gallery.append(wrap)});
 const old={logo:{src:asset(brand.logo)||'assets/mahalo-logo.png',title:'Identidade da Mahalo',caption:'Logo enviada para o projeto'},cup:{src:asset(brand.heroImage)||'assets/copo-conceitual.svg',title:'Copo de açaí',caption:'Ilustração conceitual, fotografia pendente'}};
 $$('.gallery-item[data-gallery]').forEach(e=>e.addEventListener('click',()=>{const x=old[e.dataset.gallery];if(x)showLightbox(x.src,x.title,x.caption)}));
 const lightbox=$('#lightbox');const close=()=>{lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');focusBefore?.focus()};
 $('#lightboxClose').addEventListener('click',close);lightbox.addEventListener('click',e=>{if(e.target===lightbox)close()});window.closeMahaloLightbox=close;
}
function showLightbox(src,title,caption){focusBefore=document.activeElement;$('#lightboxImage').src=asset(src);$('#lightboxImage').alt=title;$('#lightboxCaption').textContent=caption;$('#lightbox').classList.add('open');$('#lightbox').setAttribute('aria-hidden','false');document.body.classList.add('modal-open');$('#lightboxClose').focus()}
function initNav(){const menu=$('#menuToggle'),nav=$('#main-nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});$$('#main-nav a').forEach(x=>x.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
 $('#cartToggle').addEventListener('click',openCart);$('#cartClose').addEventListener('click',closeCart);cartOverlay.addEventListener('click',closeCart);
 $('#productDialogClose').addEventListener('click',()=>closeProduct());productOverlay.addEventListener('click',()=>closeProduct());
 document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(productDialog.classList.contains('open'))closeProduct();else if(cartDrawer.classList.contains('open'))closeCart();else if($('#lightbox').classList.contains('open'))window.closeMahaloLightbox();else{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}});
}
function initContact(){ $('#contactForm').addEventListener('submit',e=>{e.preventDefault();const name=clean($('#contactName').value),msg=clean($('#contactMessage').value),subject=clean($('#contactTopic').value);if(!name||!msg)return toast('Informe seu nome e mensagem');whats(`Olá, equipe Mahalo! 💜\nMeu nome é ${name}.\nAssunto: ${subject}\nMensagem: ${msg}`)}) }
function initCheckout(){
 $('#checkout').addEventListener('click',()=>{
 if(!cart.length)return toast('Escolha algum produto antes de continuar.');let subtotal=0,pending=0;
 let msg='Olá, equipe Mahalo! 💜💛\nGostaria de fazer este pedido:\n\n';
 cart.forEach((it,i)=>{const p=currentProduct(it.id)||{price:it.price};const c=totals(p,it.toppings,it.quantity);subtotal+=c.known;pending+=c.pending;
 msg+=`${i+1}. *${it.name}*\n   Qtd: ${it.quantity} · ${fmt(c.known)}${c.pending?' (mínimo)':''}\n`;
 if(it.toppings.length){msg+='   Acompanhamentos (separados): '+it.toppings.map(t=>`${t.count}× ${DATA.toppings.find(x=>x.id===t.id)?.name||t.id}`).join(', ')+'\n'}
 if(it.note)msg+='   Obs.: '+it.note+'\n';msg+='\n'});
 msg+=(pending?'*Subtotal mínimo calculado:* ':'*Subtotal calculado:* ')+fmt(subtotal)+'\n';
 if(pending)msg+=`${pending} adicional(is) sem preço extra informado — confirmar valor.\n`;
 msg+='*Por favor, confirmem a disponibilidade, o preço total, a entrega/retirada e a forma de pagamento antes de fechar.*\n\nCardápio completo: '+ext(brand.anota);whats(msg);
 });
}
initBrand();initNav();initCatalog();initBuilder();initGallery();loadCart();initContact();initCheckout();
})();
