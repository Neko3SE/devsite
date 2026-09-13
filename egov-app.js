(() => {
"use strict";
const C=window.EGOV_CATEGORIES,A=window.EGOV_API,P=window.EGOV_PARSER,R=window.EGOV_RENDERER,D=window.EGOV_SEARCH_DICTIONARY;
const state={view:"HOME",category:null,sub:null,search:{mode:"keyword",inputValue:"",submittedQuery:"",results:[]},law:{lawId:null,document:null,highlight:""},request:{controller:null,id:0},ui:{mobile:matchMedia("(max-width:899px)").matches}};
const el={categories:document.getElementById("egov-categories"),list:document.getElementById("egov-list-content"),law:document.getElementById("egov-law-content"),toc:document.getElementById("egov-toc-items"),tocPanel:document.getElementById("egov-toc"),status:document.getElementById("egov-status"),query:document.getElementById("egov-query"),suggestions:document.getElementById("egov-suggestions")};

function status(msg="",kind=""){el.status.textContent=msg;el.status.dataset.kind=kind}
function normalizeSearchInput(value){
  return String(value??"").trim().replace(/[\s\u3000]+/gu," ");
}
function searchTerms(value){
  return [...new Set(normalizeSearchInput(value).split(" ").filter(Boolean))];
}
function validLawId(value){
  return typeof value==="string" && /^[A-Za-z0-9_-]{1,128}$/.test(value);
}
function userErrorMessage(e){
  switch(e?.code){
    case "NETWORK_ERROR": return "e-Govに接続できませんでした。通信状態を確認してください。";
    case "TIMEOUT_ERROR": return "e-Govからの応答に時間がかかっています。しばらくしてから再度お試しください。";
    case "HTTP_ERROR": return "e-Govから法令データを取得できませんでした。";
    case "RATE_LIMIT_ERROR": return "e-Govへのアクセスが集中しています。しばらく待ってから再度お試しください。";
    case "API_ERROR": return "e-Govから正常な法令データを取得できませんでした。";
    case "PARSE_ERROR": return "取得した法令データを本Viewerで正しく読み取れませんでした。";
    case "RENDER_ERROR": return "法令データを画面に表示できませんでした。";
    case "NOT_FOUND": return "指定された法令が見つかりませんでした。";
    default: return "法令データを取得できませんでした。";
  }
}
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
  q=normalizeSearchInput(q);el.query.value=q;
  if(!q){status("検索語を入力してください。","warn");return}
  if(q.length>100){status("検索語は100文字以内で入力してください。","warn");return}
  state.search={...state.search,mode,inputValue:q,submittedQuery:q};suggestions(q);const req=beginRequest();status("e-Govから検索結果を取得しています…");
  document.getElementById("egov-search-button").disabled=true;
  try{
    const data=mode==="law"?await A.laws(q,req.signal):await A.keyword(q,req.signal);if(!current(req.id))return;
    let results;
    try{results=mode==="law"?P.normalizeLawList(data):P.normalizeKeyword(data)}
    catch(cause){throw new A.EgError("PARSE_ERROR","検索結果を解析できません",{operation:mode==="law"?"laws":"keyword",cause,retryable:false})}
    state.search.results=results;
    try{
      if(mode==="law")R.renderLawList(el.list,results.map(x=>({...x,displayName:x.lawTitle})),`法令名検索：「${q}」`);
      else R.renderSearchGroups(el.list,results,q);
    }catch(cause){throw new A.EgError("RENDER_ERROR","検索結果を描画できません",{operation:mode==="law"?"laws":"keyword",cause,retryable:false})}
    show("SEARCH_RESULTS");status(results.length?`${results.length}件の法令グループを表示しています。`:"検索結果は0件です。");
    if(push)navigate(urlFor({mode,q}));
  }catch(e){if(e.code!=="CANCELLED")handleError(e,()=>submitSearch(mode,q,false))}
  finally{if(current(req.id))document.getElementById("egov-search-button").disabled=false}
}
function handleError(e,retry){
  if(e?.code==="CANCELLED")return;
  let msg=userErrorMessage(e);
  const wait=Math.ceil((e?.retryAfter||0)/1000);
  if(wait>0)msg+=` 約${wait}秒後に再度お試しください。`;
  status(msg,"error");
  console.warn("[egov-viewer]",e?.code||"UNKNOWN","operation="+(e?.operation||"unknown"),e?.httpStatus?`http=${e.httpStatus}`:"");
  const box=document.createElement("div");box.className="egov-empty";
  const p=document.createElement("p");p.textContent=msg;box.append(p);
  if(e?.retryable&&wait===0&&typeof retry==="function"){
    const b=document.createElement("button");b.textContent="再試行";b.type="button";b.addEventListener("click",retry,{once:true});box.append(b);
  }
  const clear=document.createElement("button");clear.textContent="すべてクリア";clear.type="button";clear.dataset.action="clear-all";box.append(clear);
  const a=document.createElement("a");a.href="https://laws.e-gov.go.jp/";a.target="_blank";a.rel="noopener noreferrer";a.textContent="e-Gov法令検索で確認 ↗";
  box.append(document.createElement("br"),a);el.law.replaceChildren(box);
}
async function openLaw(lawId,{push=true,article="",highlight=""}={}){
  if(!validLawId(lawId)){
    handleError(new A.EgError("NOT_FOUND","不正な法令ID",{operation:"lawData",retryable:false}));
    show("LAW_VIEWER");return;
  }
  state.law.lawId=lawId;state.law.highlight=highlight||"";show("LAW_VIEWER");
  if(push)navigate(urlFor({law:lawId,hash:article?`article-${article}`:""}));
  let doc=A.cacheGet(lawId);
  if(doc){
    state.law.document=doc;
    try{R.renderLaw(el.law,el.toc,doc,state.law.highlight)}
    catch(cause){handleError(new A.EgError("RENDER_ERROR","描画できません",{operation:"lawData",cause,retryable:false}));return}
    status("");jump(article);return;
  }
  const req=beginRequest();status("e-Govから法令を取得しています…");
  const loading=document.createElement("div");loading.className="egov-empty";loading.textContent="e-Govから法令を取得しています…";el.law.replaceChildren(loading);
  try{
    const xml=await A.lawData(lawId,req.signal);if(!current(req.id))return;
    try{doc=P.parseLawXml(xml,lawId)}catch(cause){throw new A.EgError("PARSE_ERROR","法令XMLを解析できません",{operation:"lawData",cause,retryable:false})}
    A.cachePut(lawId,doc);state.law.document=doc;
    try{R.renderLaw(el.law,el.toc,doc,state.law.highlight)}
    catch(cause){throw new A.EgError("RENDER_ERROR","法令を描画できません",{operation:"lawData",cause,retryable:false})}
    status("");jump(article);
  }catch(e){if(e.code!=="CANCELLED")handleError(e,()=>openLaw(lawId,{push:false,article,highlight}))}
}
function jump(article){
  const hash=article?`article-${String(article).replace(/[^\p{L}\p{N}_.-]+/gu,"-")}`:location.hash.slice(1);if(!hash)return;
  requestAnimationFrame(()=>{const target=document.getElementById(hash);if(target)target.scrollIntoView({block:"start"});else status("指定された条文位置が見つかりませんでした。","warn")});
}
function lawSearch(q){
  q=normalizeSearchInput(q);
  const input=document.getElementById("egov-law-query");input.value=q;
  if(!state.law.document||!q)return;
  const terms=searchTerms(q);
  state.law.highlight=q;
  R.renderLaw(el.law,el.toc,state.law.document,q);

  const structuralSelectors=[
    ".egov-struct",
    ".egov-article"
  ].join(",");
  const candidates=[...el.law.querySelectorAll(structuralSelectors)];
  const first=candidates.find(x=>{
    const haystack=x.textContent.toLocaleLowerCase();
    return terms.every(term=>haystack.includes(term.toLocaleLowerCase()));
  });
  if(first){
    first.scrollIntoView({block:"start"});
    status(terms.length>1?`${terms.length}個のキーワードをすべて含む箇所を表示しています。`:"");
  }else{
    status(terms.length>1?"すべてのキーワードを含む箇所は、この法令内では見つかりませんでした。":"この法令内では見つかりませんでした。","warn");
  }
}
function clearAll(){
  state.request.controller?.abort();
  state.request.id++;
  state.category=null;state.sub=null;
  state.search={mode:"keyword",inputValue:"",submittedQuery:"",results:[]};
  state.law={lawId:null,document:null,highlight:""};
  el.query.value="";
  document.getElementById("egov-law-query").value="";
  document.querySelector('input[name="mode"][value="keyword"]').checked=true;
  R.renderSuggestions(el.suggestions,[]);
  el.list.replaceChildren();
  const emptyList=document.createElement("div");emptyList.className="egov-empty";emptyList.textContent="ジャンルを選ぶか、上の検索から法令を探してください。";el.list.append(emptyList);
  document.getElementById("egov-list-heading").textContent="法令一覧";
  el.law.replaceChildren();
  const emptyLaw=document.createElement("div");emptyLaw.className="egov-empty";
  const h=document.createElement("h2");h.id="egov-law-heading";h.textContent="法令を選択してください";
  const p=document.createElement("p");p.textContent="左のジャンルまたは検索結果から法令を開けます。";
  emptyLaw.append(h,p);el.law.append(emptyLaw);
  el.toc.replaceChildren();el.tocPanel.classList.remove("egov-open");
  document.getElementById("egov-toc-button").setAttribute("aria-expanded","false");
  status("");
  navigate(urlFor({}),true);show("HOME");
}
function genreHome(){
  el.tocPanel.classList.remove("egov-open");
  document.getElementById("egov-toc-button").setAttribute("aria-expanded","false");
  navigate(urlFor({}),false);show("HOME");
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
  else if(a==="toc"){if(state.ui.mobile){el.tocPanel.classList.remove("egov-open");document.getElementById("egov-toc-button").setAttribute("aria-expanded","false")}}
  else if(a==="close-toc"){el.tocPanel.classList.remove("egov-open");const b=document.getElementById("egov-toc-button");b.setAttribute("aria-expanded","false");b.focus()}
  else if(a==="genre-home")genreHome();
  else if(a==="clear-all")clearAll();
  else if(a==="back")history.back();
});
document.getElementById("egov-search-form").addEventListener("submit",e=>{e.preventDefault()});
document.getElementById("egov-search-button").addEventListener("click",()=>{
  const form=document.getElementById("egov-search-form");
  const mode=new FormData(form).get("mode");
  submitSearch(mode,el.query.value);
});
el.query.addEventListener("keydown",e=>{if(e.key==="Enter")e.preventDefault()});
el.query.addEventListener("input",()=>suggestions(el.query.value.trim()));
document.getElementById("egov-law-search-button").addEventListener("click",()=>lawSearch(document.getElementById("egov-law-query").value));
document.getElementById("egov-law-query").addEventListener("keydown",e=>{if(e.key==="Enter")e.preventDefault()});
document.getElementById("egov-toc-button").addEventListener("click",e=>{const open=el.tocPanel.classList.toggle("egov-open");e.currentTarget.setAttribute("aria-expanded",String(open))});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&el.tocPanel.classList.contains("egov-open")){el.tocPanel.classList.remove("egov-open");const b=document.getElementById("egov-toc-button");b.setAttribute("aria-expanded","false");b.focus()}});
document.getElementById("egov-page-top").addEventListener("click",()=>scrollTo({top:0,behavior:"smooth"}));
addEventListener("popstate",()=>parseLocation(false));
const mq=matchMedia("(max-width:899px)");mq.addEventListener("change",e=>{state.ui.mobile=e.matches;el.tocPanel.classList.remove("egov-open");document.getElementById("egov-toc-button").setAttribute("aria-expanded","false");show(state.view)});
C.validate();R.renderCategories(el.categories,C.CATEGORIES);parseLocation(false);
})();