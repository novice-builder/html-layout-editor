(function(){
'use strict';
const KEY='__componentInspector73';
if(window[KEY]){window[KEY].restore();return;}
const id='ci'+Date.now().toString(36);
const scope='[data-component-scope="'+id+'"]';
const host=document.createElement('div');
host.style.cssText='position:fixed;bottom:12px;left:10px;right:10px;margin:auto;max-width:420px;z-index:2147483647;pointer-events:none';
const sh=host.attachShadow({mode:'open'});
sh.innerHTML=`<style>
*{box-sizing:border-box}.panel{pointer-events:auto;background:#1c2029;color:white;border-radius:13px;padding:10px;font:13px system-ui;box-shadow:0 8px 26px #0009;max-height:74vh;overflow:auto}
.title{display:flex;align-items:center;gap:7px;touch-action:none;margin-bottom:8px;font-weight:600;user-select:none}.title span{flex:1}
button{border:0;border-radius:8px;background:#3c4658;color:white;padding:10px 5px;font:inherit}.row{display:flex;gap:6px;margin-top:7px}.row button{flex:1}.primary{background:#8ebaff;color:#0a192e;font-weight:700}
.status,.note{font-size:11px;color:#c8daf2;overflow-wrap:anywhere}.children{display:none;max-height:120px;overflow:auto;margin-top:6px}.children button{display:block;width:100%;text-align:left;margin:3px 0}
.preview{display:none;margin-top:7px}textarea{width:100%;height:25vh;min-height:130px;background:#0e141e;color:white;border:1px solid #687e98;border-radius:7px;padding:8px;font:11px/1.4 monospace}
.mini{display:none;pointer-events:auto;border-radius:24px;background:#1c2029;color:white;padding:12px}
</style><div class="panel" id="panel"><div class="title" id="handle"><span>Component Inspector V7.3</span><button id="min">−</button><button id="exit">×</button></div>
<div class="status" id="status">Tap an element to select it</div><div class="row"><button id="mode" class="primary">Inspect ON</button><button id="parent">↑ Parent</button><button id="children">Children</button><button id="back">Back</button></div>
<div class="children" id="childlist"></div><div class="row"><button id="html">HTML</button><button id="css">CSS</button><button id="both" class="primary">Both</button></div>
<div class="note" id="note" aria-live="polite"></div><div class="preview" id="preview"><textarea id="output" spellcheck="false"></textarea><button id="hide">Close code</button></div></div><button class="mini" id="mini">Inspector ▴</button>`;
document.documentElement.appendChild(host);
const h=document.createElement('div');h.style.cssText='position:fixed;pointer-events:none;z-index:2147483646;border:2px solid #308bff;background:#308bff22;box-sizing:border-box;display:none';document.documentElement.appendChild(h);
const $=k=>sh.getElementById(k);
let current=null,history=[],inspecting=true,minimised=false,drag=null;
function name(e){return e.tagName.toLowerCase()+(e.id?'#'+e.id:e.classList.length?'.'+e.classList[0]:'');}
function paint(){if(!current||!current.isConnected||!inspecting||minimised){h.style.display='none';return;}let r=current.getBoundingClientRect();h.style.display='block';for(let k of ['left','top','width','height'])h.style[k]=r[k]+'px';}
function select(e){if(!e||!e.tagName||[host,h,document.body,document.documentElement].includes(e))return;current=e;$('status').textContent=name(e)+' · '+e.querySelectorAll('*').length+' nested elements';$('childlist').style.display='none';paint();}
function click(e){if(!inspecting||minimised||e.composedPath().includes(host))return;e.preventDefault();e.stopImmediatePropagation();let target=e.target.closest('button,a,input,select,textarea,[role="button"],[role="tab"]')||e.target;if(current)history.push(current);select(target);}
document.addEventListener('click',click,true);window.addEventListener('scroll',paint,true);window.addEventListener('resize',paint);
function close(){document.removeEventListener('click',click,true);window.removeEventListener('scroll',paint,true);window.removeEventListener('resize',paint);h.remove();host.remove();delete window[KEY];}
window[KEY]={close,restore(){minimised=false;$('panel').style.display='block';$('mini').style.display='none';paint();}};
$('exit').onclick=close;$('min').onclick=()=>{minimised=true;$('panel').style.display='none';$('mini').style.display='block';paint();};$('mini').onclick=window[KEY].restore;
$('mode').onclick=()=>{inspecting=!inspecting;$('mode').textContent=inspecting?'Inspect ON':'Browse ON';$('mode').classList.toggle('primary',inspecting);paint();};
$('parent').onclick=()=>{if(current&&current.parentElement&&!([document.body,document.documentElement].includes(current.parentElement))){history.push(current);select(current.parentElement);}};
$('back').onclick=()=>{if(history.length)select(history.pop());};
$('children').onclick=()=>{let box=$('childlist');if(box.style.display==='block'){box.style.display='none';return;}box.replaceChildren();if(!current)return;for(let e of Array.from(current.children).filter(e=>e!==host&&e!==h).slice(0,70)){let b=document.createElement('button');b.textContent=name(e)+' '+(e.textContent||'').trim().slice(0,30);b.onclick=()=>{history.push(current);select(e);};box.appendChild(b);}if(!box.childNodes.length)box.textContent='No child elements';box.style.display='block';};
function split(s){let out=[],start=0,level=0,quote='';for(let i=0;i<s.length;i++){let c=s[i];if(quote){if(c===quote&&s[i-1]!=='\\')quote='';continue;}if(c==='"'||c==="'"){quote=c;continue;}if(c==='['||c==='(')level++;else if(c===']'||c===')')level--;else if(c===','&&!level){out.push(s.slice(start,i).trim());start=i+1;}}out.push(s.slice(start).trim());return out.filter(Boolean);}
const states=/:(?:hover|active|focus|focus-visible|focus-within|checked|disabled|enabled|visited|target|valid|invalid|required|optional|placeholder-shown)\b/g;
function base(s){return s.replace(/::[-\w]+(?:\([^)]*\))?/g,'').replace(states,'');}
function matches(root,s){try{let b=base(s);return root.matches(b)||!!root.querySelector(b);}catch(e){return false;}}
function portable(s,clone){if(matches(clone,s))return s;let candidate=s;for(let attempts=0;attempts<15;attempts++){let level=0,quote='',cut=-1;for(let i=0;i<candidate.length;i++){let c=candidate[i];if(quote){if(c===quote&&candidate[i-1]!=='\\')quote='';continue;}if(c==='"'||c==="'"){quote=c;continue;}if(c==='('||c==='[')level++;else if(c===')'||c===']')level--;else if(!level&&/[\s>+~]/.test(c)){cut=i;break;}}if(cut<0)return null;candidate=candidate.slice(cut+1).replace(/^[\s>+~]+/,'').trim();if(!candidate)return null;if(matches(clone,candidate))return candidate;}return null;}
function specificity(s){
 let a=0,b=0,c=0;let t=s.replace(/\\./g,'').replace(/\[[^\]]*\]/g,()=>{b++;return ' ';});
 t=t.replace(/#[\w-]+/g,()=>{a++;return ' ';}).replace(/\.[\w-]+/g,()=>{b++;return ' ';});
 t=t.replace(/::[\w-]+/g,()=>{c++;return ' ';}).replace(/:(?:[\w-]+)(?:\([^)]*\))?/g,()=>{b++;return ' ';});
 t=t.replace(/(^|[\s>+~])([a-z][\w-]*)\b/gi,(_,sep)=>{c++;return sep;});
 return [a,b,c];
}
function preservePriority(original,reduced){
 if(original===reduced)return reduced;
 let x=specificity(original),y=specificity(reduced);
 let addA=Math.max(0,x[0]-y[0]),addB=Math.max(0,x[1]-y[1]),addC=Math.max(0,x[2]-y[2]);
 let extra=':not(#__ci_unmatched__)'.repeat(Math.min(addA,8))+':not(.__ci_unmatched__)'.repeat(Math.min(addB,12))+':not(ci-unmatched)'.repeat(Math.min(addC,10));
 if(!extra)return reduced;
 let pseudo=reduced.search(/::[\w-]+/);
 return pseudo<0?reduced+extra:reduced.slice(0,pseudo)+extra+reduced.slice(pseudo);
}
function assetUrl(value,url){return value.replace(/url\(\s*(['"]?)([^'"\)]+)\1\s*\)/gi,(all,q,src)=>{if(/^(data:|blob:|#)/i.test(src))return all;try{return 'url("'+new URL(src,url).href+'")';}catch(e){return all;}});}
function extract(){
 if(!current||!current.isConnected)throw Error('Select a component first');
 let clone=current.cloneNode(true),orig=[current,...current.querySelectorAll('*')],dest=[clone,...clone.querySelectorAll('*')];
 let wrapper=document.createElement('div');wrapper.setAttribute('data-component-scope',id);wrapper.style.display='contents';wrapper.appendChild(clone);
 let rules=[],seen=new Set(),vars=new Set(),anims=new Set(),frames=[],fonts=[];let unreadable=0,scanned=0,meaningful=0;
 function scan(rs,parents,baseURL){for(let r of rs){if(++scanned>7500||rules.length>450)return;
  if(r.selectorText&&r.style){let applicable=split(r.selectorText).filter(s=>matches(current,s)).map(s=>{let p=portable(s,clone);return p?preservePriority(s,p):null;}).filter(Boolean);
   if(!applicable.length)continue;if(applicable.some(s=>/[.#\[]/.test(s)))meaningful++;
   let body=assetUrl(r.style.cssText,baseURL);for(let m of body.matchAll(/var\(\s*(--[\w-]+)/g))vars.add(m[1]);if(r.style.animationName)r.style.animationName.split(',').forEach(s=>anims.add(s.trim());
   let line=applicable.map(s=>':where('+scope+') '+s).join(', ')+' { '+body+' }';for(let j=parents.length-1;j>=0;j--)line=parents[j]+' {\n'+line+'\n}';if(!seen.has(line)){seen.add(line);rules.push(line);}
  }else if(r.styleSheet){try{scan(r.styleSheet.cssRules,parents,r.href||baseURL);}catch(e){unreadable++;}}
  else if(r.cssRules){let header=r.cssText.slice(0,r.cssText.indexOf('{')).trim();if(/@(?:-webkit-)?keyframes\b/i.test(header))frames.push(r);else if(/^@(?:media|supports|container|layer)\b/i.test(header))scan(r.cssRules,[...parents,header],baseURL);}
  else if(/^@font-face\b/i.test(r.cssText||''))fonts.push(assetUrl(r.cssText,baseURL));
 }}
 for(let sh of document.styleSheets){try{scan(sh.cssRules,[],sh.href||document.baseURI);}catch(e){unreadable++;}if(scanned>7500||rules.length>450)break;}
 for(let i=0;i<Math.min(orig.length,dest.length);i++){let from=orig[i],to=dest[i];if(!to||!to.tagName)continue;to.removeAttribute('fdprocessedid');for(let a of [...to.attributes])if(/^on/i.test(a.name)||(/^(src|href)$/i.test(a.name)&&/^javascript:/i.test(a.value)))to.removeAttribute(a.name);
 if(from instanceof HTMLInputElement){if(['checkbox','radio'].includes(from.type)){if(from.checked)to.setAttribute('checked','');else to.removeAttribute('checked');}else if(from.type!=='file')to.setAttribute('value',from.value);}
 if(from instanceof HTMLTextAreaElement)to.textContent=from.value;
 if(from instanceof HTMLOptionElement){if(from.selected)to.setAttribute('selected','');else to.removeAttribute('selected');}
 if(from instanceof HTMLImageElement&&from.getAttribute('src'))to.setAttribute('src',from.src);
 }
 clone.querySelectorAll('script,noscript').forEach(e=>e.remove());
 let computed=getComputedStyle(current),rootProps=['font-family','font-size','line-height','color','letter-spacing','box-sizing'];
 let rootCSS=scope+' { '+rootProps.map(p=>p+':'+computed.getPropertyValue(p)+';').join(' ')+' }';
 let variableCSS=[];for(let v of vars){let value=computed.getPropertyValue(v).trim();if(!value)for(let e of orig.slice(0,60)){value=getComputedStyle(e).getPropertyValue(v).trim();if(value)break;}if(value)variableCSS.push(v+':'+value+';');}
 let fallback=[];if(rules.length===0||(unreadable&&meaningful<2)){
  let properties=['display','position','font-size','font-weight','line-height','color','background-color','padding','margin','border','border-radius','box-shadow','text-align','opacity','gap','justify-content','align-items','flex-direction','grid-template-columns','transform','appearance','-webkit-appearance'];
  for(let i=0;i<Math.min(orig.length,100);i++){let n=orig[i],to=dest[i];if(!to||n.matches('script,noscript'))continue;let cs=getComputedStyle(n),parent=n.parentElement?getComputedStyle(n.parentElement):null,ds=[];
   for(let p of properties){let v=cs.getPropertyValue(p).trim();if(!v||({position:'static',opacity:'1',gap:'normal',transform:'none','box-shadow':'none',appearance:'none','-webkit-appearance':'none','grid-template-columns':'none','justify-content':'normal','align-items':'normal','flex-direction':'row'})[p]===v)continue;
    if(p==='background-color'&&(v==='transparent'||v==='rgba(0, 0, 0, 0)'))continue;
    if(['padding','margin','border','border-radius'].includes(p)&&(v==='0px'||v==='0px 0px 0px 0px'||v.startsWith('0px none ')))continue;
    if(parent&&['font-size','font-weight','line-height','color','text-align'].includes(p)&&v===parent.getPropertyValue(p).trim())continue;ds.push(p+':'+v+';');}
   if(ds.length){to.setAttribute('data-ci',i);fallback.push(scope+' [data-ci="'+i+'"] { '+ds.join(' ')+' }');}
  }
 }
 let keyframes=frames.filter(r=>anims.has(r.name)).map(r=>r.cssText);
 let fontsUsed=orig.slice(0,45).map(n=>getComputedStyle(n).fontFamily.toLowerCase()).join(' ');
 let fontCSS=fonts.filter(f=>{let m=f.match(/font-family\s*:\s*['"]?([^;'"}]+)/i);return m&&fontsUsed.includes(m[1].trim().toLowerCase());}).slice(0,8);
 let css=['/* Component CSS: matching original styles and preserved selector priority */',rootCSS,variableCSS.length?scope+' { '+variableCSS.join(' ')+' }':'',...rules,...fallback,...keyframes,...fontCSS].filter(Boolean).join('\n\n');
 return {html:wrapper.outerHTML,css,count:rules.length,unreadable};
}
function legacyCopy(s){let t=document.createElement('textarea');t.value=s;t.setAttribute('readonly','');t.style.cssText='position:fixed;left:0;top:0;width:1px;height:1px;opacity:0';document.body.appendChild(t);t.focus({preventScroll:true});t.select();let ok=false;try{ok=document.execCommand('copy');}catch(e){}t.remove();return ok;}
async function copyNow(mode){let payload,r;try{r=extract();payload=mode==='html'?r.html:mode==='css'?r.css:'<style>\n'+r.css+'\n</style>\n'+r.html;}catch(e){$('note').textContent='Extraction error: '+e.message;return;}
 let copied=false;try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(payload);copied=true;}}catch(e){}
 if(!copied)copied=legacyCopy(payload);
 if(copied){$('preview').style.display='none';$('note').textContent='Copied '+(mode==='both'?'HTML + CSS':mode.toUpperCase())+' ('+r.count+' CSS rules).';}
 else{$('output').value=payload;$('preview').style.display='block';$('note').textContent='Automatic copy blocked. Long-press the code and choose Copy.';$('output').focus();$('output').select();}
}
$('html').onclick=()=>copyNow('html');$('css').onclick=()=>copyNow('css');$('both').onclick=()=>copyNow('both');$('hide').onclick=()=>{$('preview').style.display='none';};
const bar=$('handle');bar.onpointerdown=e=>{if(e.target.closest('button'))return;let r=host.getBoundingClientRect();drag={x:e.clientX,y:e.clientY,l:r.left,t:r.top,w:r.width};host.style.left=r.left+'px';host.style.top=r.top+'px';host.style.right='auto';host.style.bottom='auto';host.style.margin='0';host.style.width=r.width+'px';bar.setPointerCapture(e.pointerId);};
bar.onpointermove=e=>{if(!drag)return;host.style.left=Math.max(0,Math.min(innerWidth-drag.w,drag.l+e.clientX-drag.x))+'px';host.style.top=Math.max(0,Math.min(innerHeight-55,drag.t+e.clientY-drag.y))+'px';};bar.onpointerup=bar.onpointercancel=()=>{drag=null;};
})();
