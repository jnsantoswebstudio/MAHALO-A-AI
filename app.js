/**
 * MAHALO AÇAÍ BOWLS — CONCEITO VISUAL NÃO OFICIAL
 * JN Santos Web Studio
 * IMPORTANTE: os ingredientes/tamanhos abaixo são EXEMPLOS. Substituir SOMENTE
 * após receber cardápio oficial e autorização de uso de imagens da marca.
 * Não há sincronização nem checkout dentro da Anota AI neste protótipo.
 */
(()=>{
  'use strict';
  const WHATSAPP='5521975951272';
  const ANOTA_URL='https://pedido.anota.ai/loja/mahalo-aa-bowls';
  const $=(s)=>document.querySelector(s);
  const $$=(s)=>Array.from(document.querySelectorAll(s));
  const moneylessNotice='Exemplos ilustrativos. Tamanhos e complementos devem ser confirmados com a Mahalo.';
  const EXAMPLE_INGREDIENTS=[
    {id:'banana',name:'Banana',emoji:'🍌'},
    {id:'morango',name:'Morango',emoji:'🍓'},
    {id:'granola',name:'Granola',emoji:'🌾'},
    {id:'coco',name:'Coco',emoji:'🥥'},
    {id:'kiwi',name:'Kiwi',emoji:'🥝'},
    {id:'mel',name:'Mel',emoji:'🍯'}
  ];
  let selectedSize='Médio', selected=[],quantity=1,cart=[],returnFocus=null,toastTimeout;
  const safeText=(s)=>String(s??'').replace(/[<>]/g,'').trim().slice(0,600);
  const notify=(message)=>{const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('show'),2900)};
  const navigateWA=(message)=>{const url=`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';document.body.append(a);a.click();a.remove()};
  $('#year').textContent=String(new Date().getFullYear());
  // Mobile navigation
  const menu=$('#menuToggle'),nav=$('#main-nav');
  const closeMenu=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir navegação')};
  menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fechar navegação':'Abrir navegação')});
  $$('#main-nav a').forEach(a=>a.addEventListener('click',closeMenu));
  // Real, working catalog tabs
  const panels=['Custom','Ready','Official'];
  panels.forEach(name=>{$(`#catalogTab${name}`).addEventListener('click',()=>{
    panels.forEach(n=>{const active=n===name;const tab=$(`#catalogTab${n}`);tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));$(`#catalogPanel${n}`).hidden=!active});
  })});
  // Build interactive ingredient options from a single editable config.
  const toppingBox=$('#toppings');
  EXAMPLE_INGREDIENTS.forEach(ingredient=>{
    const button=document.createElement('button');button.type='button';button.className='topping';button.dataset.ingredient=ingredient.id;button.setAttribute('aria-pressed','false');
    const emoji=document.createElement('span');emoji.className='emoji';emoji.textContent=ingredient.emoji;
    const detail=document.createElement('span');const title=document.createElement('strong');title.textContent=ingredient.name;const small=document.createElement('small');small.textContent='Exemplo visual';detail.append(title,small);
    const plus=document.createElement('span');plus.className='plus';plus.textContent='+';button.append(emoji,detail,plus);
    button.addEventListener('click',()=>{const exists=selected.some(x=>x.id===ingredient.id);selected=exists?selected.filter(x=>x.id!==ingredient.id):[...selected,ingredient];button.classList.toggle('active',!exists);button.setAttribute('aria-pressed',String(!exists));plus.textContent=exists?'+':'✓';if(!exists)dropIngredient(ingredient.emoji);renderCup()});
    toppingBox.append(button);
  });
  const dropIngredient=(emoji)=>{
    const burst=$('#ingredientBurst');const el=document.createElement('span');el.className='drop';el.textContent=emoji;const dx=(Math.random()*160-80).toFixed(0)+'px';el.style.setProperty('--dx',dx);burst.append(el);setTimeout(()=>el.remove(),1050);
  };
  const renderCup=()=>{
    const layer=$('#ingredientLayer');layer.replaceChildren();selected.forEach(t=>{const piece=document.createElement('span');piece.className='piece';piece.textContent=t.emoji;piece.title=t.name;layer.append(piece)});
    $('#previewSummary').textContent=`Copo ${selectedSize.toLowerCase()} · ${selected.length?selected.length+' complemento'+(selected.length>1?'s':'')+' (exemplo)':'sem complementos'}`;
  };
  $$('.size-btn').forEach(b=>b.addEventListener('click',()=>{selectedSize=b.dataset.size;$$('.size-btn').forEach(x=>x.classList.toggle('active',x===b));renderCup()}));
  $('#qtyDown').addEventListener('click',()=>{quantity=Math.max(1,quantity-1);$('#qtyCount').textContent=quantity});
  $('#qtyUp').addEventListener('click',()=>{quantity=Math.min(25,quantity+1);$('#qtyCount').textContent=quantity});
  $('#clearToppings').addEventListener('click',()=>{selected=[];$$('.topping').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false');b.querySelector('.plus').textContent='+'});renderCup();notify('Complementos removidos do copo.')});
  $('#modeCustom').addEventListener('click',()=>{setBuilderMode(true)});
  $('#modeReady').addEventListener('click',()=>{setBuilderMode(false)});
  const setBuilderMode=(custom)=>{ $('#customMode').hidden=!custom;$('#readyMode').hidden=custom;$('#modeCustom').classList.toggle('active',custom);$('#modeReady').classList.toggle('active',!custom);$('#modeCustom').setAttribute('aria-pressed',String(custom));$('#modeReady').setAttribute('aria-pressed',String(!custom));$('#previewSummary').textContent=custom?`Copo ${selectedSize.toLowerCase()} · ${selected.length} complementos ilustrativos`:'Copos prontos: disponíveis no Anota AI';};
  renderCup();
  // Cart persists only as local example. No real order or payment is placed.
  try{const saved=JSON.parse(localStorage.getItem('mahalo-conceito-carrinho-v2')||'[]');if(Array.isArray(saved)){cart=saved.filter(p=>p&&typeof p.size==='string'&&Number.isInteger(p.quantity)&&p.quantity>0&&Array.isArray(p.ingredients)).slice(0,25)}}catch(_error){}
  const save=()=>{try{localStorage.setItem('mahalo-conceito-carrinho-v2',JSON.stringify(cart))}catch(_error){}};
  const drawer=$('#cartDrawer'),overlay=$('#cartOverlay');
  const openDrawer=()=>{returnFocus=document.activeElement;overlay.hidden=false;drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');$('#cartClose').focus()};
  const closeDrawer=()=>{drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');overlay.hidden=true;document.body.classList.remove('modal-open');(returnFocus||$('#cartToggle')).focus()};
  const renderCart=()=>{
    $('#cartCounter').textContent=cart.reduce((s,p)=>s+p.quantity,0);
    const list=$('#cartItems');list.replaceChildren();
    if(!cart.length){const empty=document.createElement('div');empty.className='cart-empty';empty.innerHTML='<span aria-hidden="true">🥤</span><strong>Seu carrinho está vazio.</strong><p>Monte um copo ilustrativo ou abra o cardápio oficial para comprar.</p>';list.append(empty);return}
    cart.forEach((item,index)=>{
      const article=document.createElement('article');article.className='cart-line';
      const icon=document.createElement('span');icon.textContent='🥤';
      const body=document.createElement('div');body.className='cart-line-body';
      const strong=document.createElement('strong');strong.textContent=`Açaí · ${item.size} (demonstração)`;
      const small=document.createElement('small');small.textContent=`Complementos de exemplo: ${item.ingredients.length?item.ingredients.map(t=>t.name).join(', '):'nenhum'}. Quantidade: ${item.quantity}. Preço a confirmar.`;
      const line=document.createElement('div');line.className='cart-line-footer';
      const qtyLabel=document.createElement('span');qtyLabel.textContent=`${item.quantity} unidade(s)`;
      const remove=document.createElement('button');remove.type='button';remove.textContent='Remover';remove.setAttribute('aria-label',`Remover item ${index+1}`);remove.addEventListener('click',()=>{cart.splice(index,1);save();renderCart()});
      line.append(qtyLabel,remove);body.append(strong,small,line);article.append(icon,body);list.append(article);
    });
  };
  $('#addToCart').addEventListener('click',()=>{cart.push({size:selectedSize,ingredients:selected.map(x=>({id:x.id,name:x.name})),quantity});save();renderCart();notify('Copo demonstrativo adicionado ao carrinho!');openDrawer()});
  $('#cartToggle').addEventListener('click',openDrawer);$('#cartClose').addEventListener('click',closeDrawer);overlay.addEventListener('click',closeDrawer);
  $('#checkout').addEventListener('click',()=>{
    if(!cart.length){notify('Adicione um copo de demonstração antes de continuar.');return}
    let message='Olá, equipe Mahalo! 💜💛\nGostaria de consultar um pedido.\n\n*Este pedido foi montado em um PROTÓTIPO NÃO OFICIAL, com tamanhos e adicionais ilustrativos. Nenhum item, preço ou disponibilidade foi validado.*\n\n';
    cart.forEach((p,i)=>{message+=`${i+1}. Açaí (EXEMPLO)\n• Tamanho ilustrativo: ${p.size}\n• Complementos de exemplo: ${p.ingredients.length?p.ingredients.map(x=>x.name).join(', '):'nenhum'}\n• Quantidade: ${p.quantity}\n\n`});
    message+='Poderiam confirmar os produtos e complementos REALMENTE disponíveis, o valor total, a forma de pagamento e entrega/retirada? Obrigado(a)!\n\nCardápio oficial: '+ANOTA_URL;
    navigateWA(message);
  });
  renderCart();
  // Expandable gallery with actual logo and original concept art (not misrepresented as photos).
  const galleries={logo:{src:'assets/mahalo-logo.png',alt:'Logo oficial fornecida da Mahalo Açaí Bowls',caption:'Identidade visual da Mahalo — logo fornecida para esta apresentação.'},cup:{src:'assets/copo-conceitual.svg',alt:'Copo de açaí artístico, não uma fotografia real',caption:'Arte conceitual do copo. Substituir por fotografia oficial autorizada da Mahalo.'}};
  const lightbox=$('#lightbox');let lightboxReturn=null;
  $$('.gallery-item[data-gallery]').forEach(btn=>btn.addEventListener('click',()=>{const photo=galleries[btn.dataset.gallery];if(!photo)return;lightboxReturn=document.activeElement;$('#lightboxImage').src=photo.src;$('#lightboxImage').alt=photo.alt;$('#lightboxCaption').textContent=photo.caption;lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');$('#lightboxClose').focus()}));
  const closeLightbox=()=>{lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');if(lightboxReturn)lightboxReturn.focus()};
  $('#lightboxClose').addEventListener('click',closeLightbox);lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(lightbox.classList.contains('open'))closeLightbox();else if(drawer.classList.contains('open'))closeDrawer();else closeMenu()}});
  // Contact form: no backend, no storage, user confirms WhatsApp message.
  $('#contactForm').addEventListener('submit',e=>{e.preventDefault();const name=safeText($('#contactName').value),topic=safeText($('#contactTopic').value),message=safeText($('#contactMessage').value);if(!name||!message){notify('Preencha seu nome e sua mensagem.');return}navigateWA(`Olá, equipe Mahalo! 💜\nMeu nome é ${name}.\nAssunto: ${topic}\nMensagem: ${message}\n\n(Contato preparado no protótipo conceitual não oficial.)`)});
})();
