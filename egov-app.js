(() => {
"use strict";
const C=window.EGOV_CATEGORIES,A=window.EGOV_API,P=window.EGOV_PARSER,R=window.EGOV_RENDERER,D=window.EGOV_SEARCH_DICTIONARY;
const state={view:"HOME",category:null,sub:null,search:{mode:"keyword",inputValue:"",submittedQuery:"",results:[]},law:{lawId:null,document:null,highlight:""},request:{controller:null,id:0},ui:{mobile:matchMedia("(max-width:899px)").matches}};
const el={categories:document.getElementById("egov-categories"),list:document.getElementById("egov-list-content"),law:document.getElementById("egov-law-content"),toc:document.getElementById("egov-toc"),status:document.getElementById("egov-status"),query:document.getElementById("egov-query"),suggestions:document.getElementById("egov-suggestions")};

function status(msg="",kind=""){el.status.textContent=msg;el.status.dataset.kind=kind}
function beginRequest(){state.request.controller?.abort();state.request.controller=new AbortController();state.request.id++;return {id:state.request.id,signal:state.request.controller.signal}}
function current(id){return id===state.request.id}
function show(view){
  state.view=view;
  if(!state.ui.mobile){document.querySelectorAll(".egov-pane").forEach(x=>x.classList.add("egov-active"));return}
  const map={HOME:"egov-category-pane",CATEGORY:"egov-list-pane",SEARCH_RESULTS:"egov-list-pane",LAW_VIEWER:"egov-viewer-pane"};
  document.querySelectorAll(".egov-pane").forEach(x=>x.classList.toggle("egov-active",x.id===map[view]));
}
function urlFor(extra={}){
  const u=new URL(location.href);u.search="";u.hash="";
  if(extra.law){u.searchParams.set("law",extra.law);if(extra.hash)u.hash=extra.hash}
  else if(extra.category){u.searchParams.set("category",extra.category);if(extra.sub)u.searchParams.set("sub",extra.sub)}
  else if(extra.q){u.searchParams.set("mode",extra.mode||"keyword");u.searchParams.set("q",extra.q)}
  return u.pathname+u.search+u.hash;
}
function navigate(url,replace=false){history[replace?"replaceState":"pushState"]({},"",url)}
function categoryById(id){return C.CATEGORIES.find(x=>x.id===id)}
function subById(c,id){return c?.subcategories.find(x=>x.id===id)}
function selectCategory(category,sub,push=true){
  const c=categoryById(category);if(!c){show("HOME");return}
  const s=subById(c,sub)||c.subcategories[0];state.category=c.id;state.sub=s?.id||null;
  const laws=(s?.lawKeys||[]).map(k=>C.LAW_MASTER[k]).filter(Boolean);
  R.renderLawList(el.list,laws,s?`${c.name} / ${s.name}`:c.name);show("CATEGORY");
  if(push)navigate(urlFor({category:c.id,sub:s?.id}));
}
function suggestions(q){const terms=[];for(const [key,vals] of Object.entries(D)){if(q.includes(key)||key.includes(q))terms.push(...vals)}R.renderSuggestions(el.suggestions,[...new Set(terms)].slice(0,8))}
async function submitSearch(mode,q,push=true){
  q=q.trim();if(!q){status("検索語を入力してください。","warn");return}if(q.length>100){status("検索語は100文字以内で入力してください。","warn");return}
  state.search={...state.search,mode,inputValue:q,submittedQuery:q};suggestions(q);const req=beginRequest();status("e-Govから検索結果を取得しています…");
  document.getElementById("egov-search-button").disabled=true;
  try{
    const data=mode==="law"?await A.laws(q,req.signal):await A.keyword(q,req.signal);if(!current(req.id))return;
    const results=mode==="law"?P.normalizeLawList(data):P.normalizeKeyword(data);state.search.results=results;
    if(mode==="law")R.renderLawList(el.list,results.map(x=>({...x,displayName:x.lawTitle})),`法令名検索：「${q}」`);
    else R.renderSearchGroups(el.list,results,q);
    show("SEARCH_RESULTS");status(results.length?`${results.length}件の法令グループを表示しています。`:"検索結果は0件です。");
    if(push)navigate(urlFor({mode,q}));
  }catch(e){if(e.code!=="CANCELLED")handleError(e,()=>submitSearch(mode,q,false))}
  finally{if(current(req.id))document.getElementById("egov-search-button").disabled=false}
}
function handleError(e,retry){
  const msg=e.code==="RATE_LIMIT_ERROR"?"短時間に複数回の取得に失敗しています。しばらく時間をおいてからお試しください。":
    e.code==="TIMEOUT_ERROR"?"取得がタイムアウトしました。":e.code==="PARSE_ERROR"?"取得したデータを解析できませんでした。":"法令データを取得できませんでした。通信状態を確認してください。";
  status(msg,"error");const box=document.createElement("div");box.className="egov-empty";const p=document.createElement("p");p.textContent=msg;box.append(p);
  if(e.retryable){const b=document.createElement("button");b.textContent="再試行";b.type="button";b.addEventListener("click",retry,{once:true});box.append(b)}
  const a=document.createElement("a");a.href="https://laws.e-gov.go.jp/";a.target="_blank";a.rel="noopener noreferrer";a.textContent="e-Gov法令検索で確認 ↗";box.append(document.createElement("br"),a);el.law.replaceChildren(box);
}
async function openLaw(lawId,{push=true,article="",highlight=""}={}){
  if(!lawId)return;state.law.lawId=lawId;state.law.highlight=highlight||"";show("LAW_VIEWER");
  if(push)navigate(urlFor({law:lawId,hash:article?`article-${article}`:""}));
  let doc=A.cacheGet(lawId);if(doc){state.law.document=doc;R.renderLaw(el.law,el.toc,doc,state.law.highlight);status("");jump(article);return}
  const req=beginRequest();status("e-Govから法令を取得しています…");el.law.innerHTML='<div class="egov-empty">e-Govから法令を取得しています…</div>';
  try{const xml=await A.lawData(lawId,req.signal);if(!current(req.id))return;doc=P.parseLawXml(xml,lawId);A.cachePut(lawId,doc);state.law.document=doc;R.renderLaw(el.law,el.toc,doc,state.law.highlight);status("");jump(article)}
  catch(e){if(e.code!=="CANCELLED")handleError(e,()=>openLaw(lawId,{push:false,article,highlight}))}
}
function jump(article){
  const hash=article?`article-${String(article).replace(/[^\p{L}\p{N}_.-]+/gu,"-")}`:location.hash.slice(1);if(!hash)return;
  requestAnimationFrame(()=>{const target=document.getElementById(hash);if(target)target.scrollIntoView({block:"start"});else status("指定された条文位置が見つかりませんでした。","warn")});
}
function lawSearch(q){
  q=q.trim();if(!state.law.document||!q)return;state.law.highlight=q;R.renderLaw(el.law,el.toc,state.law.document,q);
  const articles=[...el.law.querySelectorAll(".egov-article")],first=articles.find(a=>a.textContent.toLocaleLowerCase().includes(q.toLocaleLowerCase()));
  if(first)first.scrollIntoView({block:"start"});else status("この法令内では見つかりませんでした。","warn");
}
function parseLocation(push=false){
  const u=new URL(location.href),law=u.searchParams.get("law"),cat=u.searchParams.get("category"),sub=u.searchParams.get("sub"),mode=u.searchParams.get("mode"),q=u.searchParams.get("q");
  if(law){openLaw(law,{push:false,article:u.hash.replace(/^#article-/,"")});return}
  if(cat){selectCategory(cat,sub,false);return}
  if((mode==="keyword"||mode==="law")&&q){document.querySelector(`input[name=mode][value="${mode}"]`).checked=true;el.query.value=q;submitSearch(mode,q,false);return}
  show("HOME");
}
document.addEventListener("click",e=>{
  const t=e.target.closest("[data-action]");if(!t)return;const a=t.dataset.action;
  if(a==="category"){const c=categoryById(t.dataset.category);if(c)selectCategory(c.id,c.subcategories[0]?.id)}
  else if(a==="subcategory")selectCategory(t.dataset.category,t.dataset.sub);
  else if(a==="law")openLaw(t.dataset.lawId,{article:t.dataset.article||"",highlight:t.dataset.highlight||""});
  else if(a==="suggestion"){el.query.value=t.dataset.query;suggestions(t.dataset.query);el.query.focus()}
  else if(a==="toc"){if(state.ui.mobile){el.toc.classList.remove("egov-open");document.getElementById("egov-toc-button").setAttribute("aria-expanded","false")}}
  else if(a==="back")history.back();
});
document.getElementById("egov-search-form").addEventListener("submit",e=>{e.preventDefault();const mode=new FormData(e.currentTarget).get("mode");submitSearch(mode,el.query.value)});
el.query.addEventListener("input",()=>suggestions(el.query.value.trim()));
document.getElementById("egov-law-search-form").addEventListener("submit",e=>{e.preventDefault();lawSearch(document.getElementById("egov-law-query").value)});
document.getElementById("egov-toc-button").addEventListener("click",e=>{const open=el.toc.classList.toggle("egov-open");e.currentTarget.setAttribute("aria-expanded",String(open))});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&el.toc.classList.contains("egov-open")){el.toc.classList.remove("egov-open");const b=document.getElementById("egov-toc-button");b.setAttribute("aria-expanded","false");b.focus()}});
document.getElementById("egov-page-top").addEventListener("click",()=>scrollTo({top:0,behavior:"smooth"}));
addEventListener("popstate",()=>parseLocation(false));
const mq=matchMedia("(max-width:899px)");mq.addEventListener("change",e=>{state.ui.mobile=e.matches;el.toc.classList.remove("egov-open");document.getElementById("egov-toc-button").setAttribute("aria-expanded","false");show(state.view)});
C.validate();R.renderCategories(el.categories,C.CATEGORIES);parseLocation(false);
})();