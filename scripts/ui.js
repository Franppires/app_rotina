const dc={
  c1:'#E8F4FF',c1t:'#185FA5',c2:'#FFF3E0',c2t:'#8B4E00',
  c3:'#E8F5E9',c3t:'#1B5E20',c4:'#FCE4EC',c4t:'#880E4F',
  c5:'#EDE7F6',c5t:'#311B92',c6:'#E0F7FA',c6t:'#006064',c7:'#FFF8E1',c7t:'#F57F17'
};
const dcd={
  c1:'#0A1A2C',c1t:'#85B7EB',c2:'#221608',c2t:'#FAC775',
  c3:'#0A2419',c3t:'#5DCAA5',c4:'#2A0A14',c4t:'#F48FB1',
  c5:'#18163A',c5t:'#AFA9EC',c6:'#002A2C',c6t:'#80DEEA',c7:'#221A00',c7t:'#FFE082'
};
const dm={0:6,1:0,2:1,3:2,4:3,5:4,6:5};

function tT(){
  const h=document.documentElement;
  const dk=h.getAttribute('data-theme')==='dark';
  h.setAttribute('data-theme',dk?'light':'dark');
  document.getElementById('tbtn').textContent=dk?'● escuro':'☀ claro';
  appData.settings.theme=dk?'light':'dark';
  saveAppData();
}

function goPage(id,el){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('visible'));
  document.querySelectorAll('.bn-item').forEach(b=>b.classList.remove('active'));
  document.getElementById(id).classList.add('visible');
  el.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}

const subMap={
  rot:['rot-dia','rot-ck','rot-brincar'],
  oli:['oli-ali','oli-sono','oli-dr'],
  alim:['alim-card','alim-coz'],
  tr:['tr-plano','tr-aca','tr-casa'],
  sau:['sau-meds','sau-dicas'],
  bq:['bq-semana','bq-livros','bq-inv']
};

function subNav(group,show,el){
  subMap[group].forEach(id=>{
    const e=document.getElementById(id);
    if(e) e.style.display='none';
  });
  const t=document.getElementById(show);
  if(t) t.style.display='block';
  el.closest('.pill-nav').querySelectorAll('.pill').forEach(p=>p.classList.remove('on'));
  el.classList.add('on');
}

function tD(id){document.getElementById(id).classList.toggle('open')}

function applySavedTheme(){
  const sv=appData.settings.theme;
  if(!sv) return;
  const isDark=sv==='dark';
  document.documentElement.setAttribute('data-theme',isDark?'dark':'light');
  document.getElementById('tbtn').textContent=isDark?'☀ claro':'● escuro';
}

function saveEditableFields(){
  const payload={};
  document.querySelectorAll('.inline-editable[data-edit-key]').forEach(el=>{
    payload[el.dataset.editKey]=el.textContent.trim();
  });
  appData.editable=payload;
  saveAppData();
}

function loadEditableFields(){
  const payload=appData.editable || {};
  document.querySelectorAll('.inline-editable[data-edit-key]').forEach(el=>{
    const key=el.dataset.editKey;
    if(typeof payload[key]==='string' && payload[key].length){
      el.textContent=payload[key];
    }
  });
}

function bindEditableFields(){
  const editableSelector=[
    '.topbar h1',
    '.topbar-sub',
    '.main .period-tag',
    '.main .ttime',
    '.main .ttitle',
    '.main .tdet li',
    '.main .card-title',
    '.main .card-sub',
    '.main .cr-l',
    '.main .cr-r',
    '.main .info-box',
    '.main .tip-title',
    '.main .tip-body',
    '.main .meal-title',
    '.main .meal-kcal',
    '.main .meal-name',
    '.main .meal-qty',
    '.main .macro-val',
    '.main .macro-lbl',
    '.main .wd-name',
    '.main .wd-type',
    '.main .ex-name',
    '.main .ex-det',
    '.main .med-name',
    '.main .med-time',
    '.main .med-body li',
    '.main .acc-title',
    '.main .acc-sub',
    '.main .acc-section',
    '.main .toy-name',
    '.main .toy-why',
    '.main .chip',
    '.main .ck-grp',
    '.main .ck-time',
    '.main .ck-lbl',
    '.footer'
  ].join(',');

  const editableEls=[...document.querySelectorAll(editableSelector)];
  editableEls.forEach((el,index)=>{
    el.classList.add('inline-editable');
    if(!el.dataset.editKey){
      el.dataset.editKey='auto-'+index;
    }
    el.setAttribute('contenteditable','false');
    el.addEventListener('click',e=>{
      e.stopPropagation();
      if(el.getAttribute('contenteditable')!=='true'){
        el.setAttribute('contenteditable','true');
        el.classList.add('editing');
        el.focus();
      }
    });
    el.addEventListener('blur',()=>{
      if(el.getAttribute('contenteditable')==='true'){
        el.setAttribute('contenteditable','false');
        el.classList.remove('editing');
        saveEditableFields();
      }
    });
    el.addEventListener('keydown',e=>{
      const allowBreak=el.matches('.tip-body, .info-box, .toy-why, .ex-det');
      if(e.key==='Enter' && !e.shiftKey && !allowBreak){
        e.preventDefault();
        el.blur();
      }
    });
  });
}

function exportAppData(){
  const payload={
    version:APP_SCHEMA_VERSION,
    exportedAt:new Date().toISOString(),
    settings:appData.settings,
    editable:appData.editable,
    checklistHistory:appData.checklistHistory
  };
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download='backup-rotina-'+getTodayKey()+'.json';
  a.click();
  URL.revokeObjectURL(url);
}

function openImportPicker(){
  const input=document.getElementById('importFileInput');
  if(input) input.click();
}

function importAppDataFromFile(ev){
  const file=ev.target.files && ev.target.files[0];
  if(!file) return;
  const reader=new FileReader();
  reader.onload=e=>{
    try{
      const parsed=JSON.parse(String(e.target.result || '{}'));
      const data=normalizeAppData(parsed);
      if(!data || typeof data!=='object') throw new Error('invalid');
      appData=data;
      saveAppData();
      applySavedTheme();
      loadEditableFields();
      loadChecklistState();
      alert('Backup restaurado com sucesso.');
    }catch(_){
      alert('Arquivo de backup invalido.');
    }finally{
      ev.target.value='';
    }
  };
  reader.readAsText(file);
}

function markToday(){
  const i=dm[new Date().getDay()];
  const b=document.getElementById('today-'+i);
  if(b) b.style.display='inline';
  const c=document.getElementById('day-'+i);
  if(c) c.classList.add('open');
}
