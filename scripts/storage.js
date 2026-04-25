const APP_SCHEMA_VERSION=2;
const STORAGE_KEYS={
  appData:'fo-app-data-v2',
  checklist:'fo-checklist-v1',
  checklistHistory:'fo-checklist-history-v1',
  editable:'fo-editable-v1',
  theme:'fo-theme-v1'
};

let appData=getDefaultAppData();

function getDefaultAppData(){
  return {
    version:APP_SCHEMA_VERSION,
    settings:{theme:'dark'},
    editable:{},
    checklistHistory:{}
  };
}

function normalizeAppData(data){
  const base=getDefaultAppData();
  if(!data || typeof data!=='object') return base;
  return {
    version:APP_SCHEMA_VERSION,
    settings:{
      theme:data.settings && data.settings.theme==='light' ? 'light' : 'dark'
    },
    editable:data.editable && typeof data.editable==='object' ? data.editable : {},
    checklistHistory:data.checklistHistory && typeof data.checklistHistory==='object' ? data.checklistHistory : {}
  };
}

function saveAppData(){
  localStorage.setItem(STORAGE_KEYS.appData,JSON.stringify(appData));
}

function getTodayKey(){
  const d=new Date();
  const y=d.getFullYear();
  const m=String(d.getMonth()+1).padStart(2,'0');
  const day=String(d.getDate()).padStart(2,'0');
  return y+'-'+m+'-'+day;
}

function getChecklistHistory(){
  return appData.checklistHistory;
}

function migrateLegacyDataIfNeeded(){
  const rawModern=localStorage.getItem(STORAGE_KEYS.appData);
  if(rawModern){
    try{
      appData=normalizeAppData(JSON.parse(rawModern));
      saveAppData();
      return;
    }catch(_){}
  }

  const migrated=getDefaultAppData();
  const legacyTheme=localStorage.getItem(STORAGE_KEYS.theme);
  if(legacyTheme==='light' || legacyTheme==='dark') migrated.settings.theme=legacyTheme;

  try{
    const legacyEditable=JSON.parse(localStorage.getItem(STORAGE_KEYS.editable) || '{}');
    if(legacyEditable && typeof legacyEditable==='object') migrated.editable=legacyEditable;
  }catch(_){}

  try{
    const legacyHistory=JSON.parse(localStorage.getItem(STORAGE_KEYS.checklistHistory) || '{}');
    if(legacyHistory && typeof legacyHistory==='object') migrated.checklistHistory=legacyHistory;
  }catch(_){}

  try{
    const legacyToday=JSON.parse(localStorage.getItem(STORAGE_KEYS.checklist) || '[]');
    if(Array.isArray(legacyToday) && legacyToday.length){
      migrated.checklistHistory[getTodayKey()]=legacyToday;
    }
  }catch(_){}

  appData=normalizeAppData(migrated);
  saveAppData();
}
