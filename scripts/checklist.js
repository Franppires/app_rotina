function tg(row,ev){
  if(editMode){
    if(ev){ev.preventDefault();ev.stopPropagation();}
    return;
  }
  row.querySelector('.ck-box').classList.toggle('on');
  row.querySelector('.ck-lbl').classList.toggle('done');
  saveChecklistState();
  up();
}

function up(){
  const t=document.querySelectorAll('.ck-row').length;
  const d=document.querySelectorAll('.ck-box.on').length;
  const pct=Math.round(d/t*100);
  document.getElementById('pf').style.width=pct+'%';
  document.getElementById('pl').textContent=d+' de '+t+' concluídas';
  document.getElementById('ppct').textContent=pct+'%';
}

function saveChecklistState(){
  const st=[...document.querySelectorAll('.ck-row')].map(r=>r.querySelector('.ck-box').classList.contains('on'));
  appData.checklistHistory[getTodayKey()]=st;
  saveAppData();
}

function loadChecklistState(){
  const st=Array.isArray(appData.checklistHistory[getTodayKey()]) ? appData.checklistHistory[getTodayKey()] : [];
  if(!st.length){resetChecklistUI(false);up();return;}
  document.querySelectorAll('.ck-row').forEach((row,i)=>{
    const isOn=Boolean(st[i]);
    row.querySelector('.ck-box').classList.toggle('on',isOn);
    row.querySelector('.ck-lbl').classList.toggle('done',isOn);
  });
  up();
}

function resetChecklistUI(save){
  document.querySelectorAll('.ck-row').forEach(row=>{
    row.querySelector('.ck-box').classList.remove('on');
    row.querySelector('.ck-lbl').classList.remove('done');
  });
  if(save) saveChecklistState();
}

function resetChecklistToday(){
  resetChecklistUI(true);
  up();
}

function updateChecklistDateLabel(){
  const el=document.getElementById('ckDateLbl');
  if(!el) return;
  const now=new Date();
  const txt=now.toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'2-digit'});
  el.textContent='Checklist de hoje ('+txt+')';
}
