let current = JSON.parse(localStorage.getItem("currentUser") || "null");

function canCreateRole(role,target){
  if(role==='owner') return true;
  if(role==='CEO') return target!=='owner';
  if(role==='mods') return ['partner','reseller'].includes(target);
  if(role==='partner') return target==='reseller';
  return false;
}