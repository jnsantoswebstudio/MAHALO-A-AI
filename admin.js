(()=>{
'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],clone=x=>JSON.parse(JSON.stringify(x));
const DEFAULT=clone(window.MAHALO_SITE_DATA);let model=clone(DEFAULT),changed=false;
try{const p=JSON.parse(localStorage.getItem('mahalo-admin-preview-v3')||'null');if(p&&Array.isArray(p.products)&&Array.isArray(p.toppings)){model=p}}catch(_e){}
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=prefix=>prefix+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,6);
let toastTimer;
const toast=msg=>{const t=$('#adminToast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),3200)};
const mark=()=>{changed=true;$('#draftState').textContent='Alterações não publicadas';$('#draftState').style.color='#b04158'};
const field=(name,val,type='text',extra='')=>`<label class="edit-field ${type==='textarea'?'full':''}"><span>${esc(name)}</span>${type==='textarea'?`<textarea ${extra}>${esc(val)}</textarea>`:type==='select'?`<select ${extra}>${val}</select>`:`<input type="${type}" value="${esc(val)}" ${extra}>`}</label>`;
const imageFields=(value,bind,help='')=>`<div class="full"><label class="edit-field"><span>Imagem: URL, caminho em assets/ ou arquivo enviado</span><input type="text" value="${esc(value)}" ${bind} placeholder="assets/foto-mahalo.webp ou https://..."><small class="img-note">${esc(help||'Envie uma foto abaixo ou informe o endereço de uma imagem autorizada.')}</small></label><div class="image-tools"><label>Selecionar fotografia <input type="file" accept="image/*" data-file="1" ${bind}></label></div></div>`;
const brandGroups=[
 ['Identidade e chamadas',[['name','Nome da empresa'],['heroTitle','Título da Home'],['heroSubtitle','Descrição principal','textarea'],['essenceTitle','Título Nossa essência'],['essenceText','Texto Nossa essência','textarea'],['universeTitle','Título Universo Mahalo'],['universeText','Descrição Universo Mahalo','textarea'],['footerCredit','Crédito do rodapé']]],
 ['Contato e links',[['phone','WhatsApp internacional (55...)'],['instagram','URL Instagram'],['anota','URL Anota AI'],['map','URL do Google Maps (botão de rota)'],['mapEmbed','URL de incorporação do Google Maps'],['address','Localização / endereço']]],
 ['Imagens principais',[['logo','Logotipo','image'],['heroImage','Copo principal','image'],['essenceImage','Imagem Nossa essência','image']]],
 ['Cores do site',[['colors.yellow','Amarelo','color'],['colors.purple','Roxo','color'],['colors.aqua','Azul','color']]]
];
function resolve(obj,key){return key.split('.').reduce((o,k)=>o?.[k],obj)}
function set(obj,key,val){const parts=key.split('.');let current=obj;parts.slice(0,-1).forEach(k=>{if(!current[k])current[k]={};current=current[k]});current[parts.at(-1)]=val;mark()}
function renderBrand(){const container=$('#brandFields');container.innerHTML=brandGroups.map(([title,arr])=>`<article class="admin-group"><h3>${title}</h3>${arr.map(([key,label,type])=>type==='image'?`<div>${imageFields(resolve(model.brand,key),`data-brand="${key}"`)}</div>`:field(label,resolve(model.brand,key),type||'text',`data-brand="${key}"`)).join('')}</article>`).join('')}
const categories='<option value="tigelas">Tigelas de açaí</option><option value="sucos">Sucos</option><option value="melado">Melado de cana</option><option value="outros">Outros</option>';
function renderEditors(type){
 const items=model[type],holder=$('#'+({products:'productEditors',toppings:'toppingEditors',gallery:'galleryEditors'}[type]));
 holder.replaceChildren();items.forEach((item,index)=>{
 const card=document.createElement('article');card.className='editor-card';card.dataset.index=index;card.dataset.type=type;
 const label=item.name||item.title||'Sem título';
 let fields='';
 if(type==='products'){
 fields=field('Nome do produto',item.name,'text','data-key="name" required')+field('Preço (R$)',item.price,'number','data-key="price" step="0.01" min="0"')+
  field('Categoria',categories,'select',`data-key="category" data-value="${esc(item.category)}"`)+
  field('Descrição',item.description,'textarea','data-key="description"')+
  imageFields(item.image,'data-key="image"','Fotos oficiais dos bowls ainda pendentes; imagens de sucos já têm URLs fornecidas.')+
  `<label class="checkbox-field full"><input type="checkbox" data-key="toppings" ${item.toppings?'checked':''}>Permitir complementos neste produto</label><label class="checkbox-field full"><input type="checkbox" data-key="active" ${item.active!==false?'checked':''}>Exibir produto no site</label>`;
 }else if(type==='toppings'){
 fields=field('Nome do complemento',item.name,'text','data-key="name"')+field('Preço EXTRA após opções grátis (R$) — vazio = a confirmar',item.extraPrice??'','number','data-key="extraPrice" min="0" step="0.01"')+
 field('Emoji da animação no copo',item.emoji,'text','data-key="emoji" maxlength="10"')+imageFields(item.image,'data-key="image"')+
 `<label class="checkbox-field full"><input type="checkbox" data-key="active" ${item.active!==false?'checked':''}>Disponível no site</label>`;
 }else{
 fields=field('Nome da imagem',item.title,'text','data-key="title"')+field('Legenda',item.caption,'text','data-key="caption"')+imageFields(item.image,'data-key="image"')+field('Link ao clicar se não houver imagem',item.url,'text','data-key="url"');
 }
 card.innerHTML=`<div class="editor-summary"><img src="${esc(item.image||'assets/copo-conceitual.svg')}" alt="" onerror="this.src='assets/copo-conceitual.svg'"><div><h3>${esc(label)}</h3><p>${type==='products'?'Item '+(index+1)+' · '+(item.category||''):type==='toppings'?'Acompanhamento '+(index+1):'Galeria '+(index+1)}</p></div><div class="editor-actions"><button type="button" data-action="up" title="Mover para cima">↑</button><button type="button" data-action="down" title="Mover para baixo">↓</button><button type="button" data-action="duplicate">Duplicar</button><button class="delete" type="button" data-action="delete">Excluir</button></div></div><div class="editor-fields">${fields}</div>`;
 const select=card.querySelector('select[data-key=category]');if(select)select.value=item.category;
 holder.append(card);
 });
}
function renderRules(){const rules=[['freeToppings','Acompanhamentos grátis'],['maxToppings','Máximo de acompanhamentos por produto'],['maxPerTopping','Máximo de unidades do mesmo acompanhamento']];$('#rulesFields').innerHTML=`<div class="admin-group"><h3>Regras de personalização</h3>${rules.map(([key,name])=>field(name,model.rules[key],'number',`min="0" max="30" data-rule="${key}"`)).join('')}</div>`}
function renderOverview(){$('#stats').innerHTML=[['Produtos',model.products.length],['Tigelas de açaí',model.products.filter(x=>x.toppings).length],['Complementos',model.toppings.length],['Imagens na galeria',model.gallery.filter(x=>!!x.image).length]].map(([text,value])=>`<div class="stat"><b>${value}</b><small>${text}</small></div>`).join('')}
function renderAll(){renderOverview();renderBrand();renderEditors('products');renderEditors('toppings');renderEditors('gallery');renderRules()}
function goto(tab){$$('#adminTabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));$$('.panel').forEach(p=>p.classList.toggle('active',p.id==='panel-'+tab));$('#panelTitle').textContent=({overview:'Visão geral',brand:'Identidade e textos',products:'Produtos',toppings:'Complementos',gallery:'Galeria e imagens',rules:'Pedidos e regras',publish:'Exportar e publicar'})[tab]||'Admin';window.scrollTo({top:0,behavior:'smooth'})}
$$('#adminTabs [data-tab]').forEach(b=>b.addEventListener('click',()=>goto(b.dataset.tab)));$$('[data-goto]').forEach(b=>b.addEventListener('click',()=>goto(b.dataset.goto)));
function edit(e){const input=e.target;if(input.type==='file')return;
 if(input.dataset.brand){set(model.brand,input.dataset.brand,input.value);return}
 if(input.dataset.rule){set(model.rules,input.dataset.rule,Math.max(0,parseInt(input.value||'0',10)));return}
 const card=input.closest('.editor-card');if(!card||!input.dataset.key)return;
 const item=model[card.dataset.type][Number(card.dataset.index)],key=input.dataset.key;
 let value=input.type==='checkbox'?input.checked:input.value;
 if(input.type==='number')value=value===''?null:Number(value);
 set(item,key,value);
 if(key==='name'||key==='title'){card.querySelector('.editor-summary h3').textContent=value||'Sem título'}
 if(key==='image'&&value){const img=card.querySelector('.editor-summary img');img.src=value}
}
// Update only on change (not every keystroke); typing and blur supported.
document.addEventListener('change',edit);
document.addEventListener('input',e=>{const el=e.target;if(el.matches('textarea,input[type=text],input[type=number],input[type=color]')&&!el.matches('input[type=file]'))edit(e)});
function actions(e){const btn=e.target.closest('button[data-action]');if(!btn)return;const card=btn.closest('.editor-card');const type=card.dataset.type,i=Number(card.dataset.index),list=model[type],action=btn.dataset.action;
 if(action==='delete'){if(!confirm('Excluir este item da configuração?'))return;list.splice(i,1)}
 if(action==='duplicate'){const copy=clone(list[i]);copy.id=uid(type);list.splice(i+1,0,copy)}
 if(action==='up'&&i>0)[list[i-1],list[i]]=[list[i],list[i-1]];
 if(action==='down'&&i<list.length-1)[list[i+1],list[i]]=[list[i],list[i+1]];
 mark();renderEditors(type);renderOverview();
}
['productEditors','toppingEditors','galleryEditors'].forEach(id=>$('#'+id).addEventListener('click',actions));
$('#newProduct').addEventListener('click',()=>{model.products.push({id:uid('produto'),name:'Novo produto',price:0,description:'',category:'tigelas',image:'',active:false,toppings:true});renderEditors('products');mark();toast('Novo produto criado, inicialmente oculto.')});
$('#newTopping').addEventListener('click',()=>{model.toppings.push({id:uid('extra'),name:'Novo complemento',extraPrice:null,emoji:'✳',image:'',active:false});renderEditors('toppings');mark()});
$('#newGallery').addEventListener('click',()=>{model.gallery.push({title:'Nova imagem',caption:'',image:'',url:model.brand.instagram});renderEditors('gallery');mark()});
function savePreview(){try{localStorage.setItem('mahalo-admin-preview-v3',JSON.stringify(model));changed=false;$('#draftState').textContent='Prévia salva neste navegador';$('#draftState').style.color='#267f6b';toast('Prévia salva. Abra o site no mesmo navegador.')}catch(_e){toast('Memória local insuficiente. Baixe o JSON/JS e reduza as imagens.')}}
$('#savePreview').addEventListener('click',savePreview);
$('#savePreview2').addEventListener('click',()=>{savePreview();window.open('index.html','_blank','noopener')});
function download(name,content,mime='application/javascript'){
 const blob=new Blob([content],{type:mime+';charset=utf-8'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),4000)
}
$('#downloadJs').addEventListener('click',()=>{download('site-data.js','window.MAHALO_SITE_DATA = '+JSON.stringify(model,null,2)+';\n');toast('Arquivo gerado. Substitua site-data.js no GitHub.')});
$('#downloadJson').addEventListener('click',()=>download('mahalo-backup.json',JSON.stringify(model,null,2),'application/json'));
$('#restoreDefault').addEventListener('click',()=>{if(!confirm('Restaurar o conteúdo do site-data.js atualmente publicado?'))return;model=clone(DEFAULT);localStorage.removeItem('mahalo-admin-preview-v3');renderAll();mark();toast('Dados padrão restaurados no editor.')});
$('#importData').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{const x=JSON.parse(await file.text());if(!Array.isArray(x.products)||!Array.isArray(x.toppings)||!x.brand||!Array.isArray(x.gallery)||!x.rules)throw Error('Estrutura incompleta');model=x;renderAll();mark();toast('Backup importado. Salve ou exporte.')}catch(error){toast('Arquivo JSON inválido: '+error.message)}});
// Resize uploaded photos locally to avoid uploading huge originals to GitHub.
function resizeImage(file){return new Promise((resolve,reject)=>{if(!file.type.startsWith('image/'))return reject(Error('Escolha uma imagem'));const reader=new FileReader();reader.onerror=()=>reject(Error('Falha ao ler foto'));reader.onload=()=>{const img=new Image();img.onerror=()=>reject(Error('Foto inválida'));img.onload=()=>{const w=img.naturalWidth,h=img.naturalHeight,f=Math.min(1,1200/Math.max(w,h));const can=document.createElement('canvas');can.width=Math.max(1,Math.round(w*f));can.height=Math.max(1,Math.round(h*f));const ctx=can.getContext('2d');ctx.drawImage(img,0,0,can.width,can.height);resolve(can.toDataURL('image/jpeg',.78))};img.src=reader.result};reader.readAsDataURL(file)})}
document.addEventListener('change',async e=>{if(!e.target.matches('input[data-file]'))return;const file=e.target.files?.[0];if(!file)return;
 try{const url=await resizeImage(file);const input=e.target.closest('.full,.admin-group')?.querySelector('input[type="text"][data-key],input[type="text"][data-brand]');if(!input)throw Error('Campo de destino indisponível');input.value=url;input.dispatchEvent(new Event('change',{bubbles:true}));toast('Fotografia preparada. Exporte site-data.js para publicar.');}
 catch(err){toast(err.message)};
});
renderAll();
})();
