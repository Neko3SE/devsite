window.EGOV_RENDERER = (() => {
  const $=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e};
  function inline(parent,frags,query=""){
    for(const f of frags||[]){
      let e;
      if(f.type==="ruby"){e=$("ruby");e.append(document.createTextNode(f.text));const rt=$("rt","",f.rt);e.append(rt)}
      else if(f.type==="sup")e=$("sup","",f.text);
      else if(f.type==="sub")e=$("sub","",f.text);
      else {appendHighlighted(parent,f.text,query);continue}
      parent.append(e);
    }
  }
  function appendHighlighted(parent,text,query){
    if(!query){parent.append(document.createTextNode(text||""));return}
    const source=String(text||""), q=String(query); const lower=source.toLocaleLowerCase(), needle=q.toLocaleLowerCase();
    let pos=0,i; while(needle&&(i=lower.indexOf(needle,pos))>=0){parent.append(document.createTextNode(source.slice(pos,i)));parent.append($("mark","",source.slice(i,i+q.length)));pos=i+q.length}
    parent.append(document.createTextNode(source.slice(pos)));
  }
  function node(n,query=""){
    if(!n)return document.createDocumentFragment();
    if(n.type==="Text"){const s=$("span");inline(s,n.fragments,query);return s}
    if(n.type==="Table"){const w=$("div","egov-table-wrap"),t=$("table");for(const row of n.rows){const tr=$("tr");for(const c of row){const td=$("td");if(c.rowspan)td.rowSpan=Number(c.rowspan)||1;if(c.colspan)td.colSpan=Number(c.colspan)||1;appendHighlighted(td,c.text,query);tr.append(td)}t.append(tr)}w.append(t);return w}
    if(n.type==="Label")return $("div","egov-struct-title",n.text);
    if(n.type==="Article"){
      const s=$("section","egov-article");s.id=n.anchorId||"";if(n.hide)s.hidden=true;
      if(n.caption)s.append($("div","egov-article-caption",n.caption));if(n.displayNumber)s.append($("div","egov-article-title",n.displayNumber));
      for(const c of n.children)s.append(node(c,query));return s;
    }
    if(["Part","Chapter","Section","Subsection","Division"].includes(n.type)){
      const s=$("section","egov-struct");if(n.title)s.append($("div","egov-struct-title",n.title));for(const c of n.children||[])s.append(node(c,query));return s;
    }
    if(n.type==="Paragraph"){const d=$("div","egov-paragraph");if(n.displayNumber)d.append($("span","egov-number",n.displayNumber+" "));for(const c of n.children||[])d.append(node(c,query));return d}
    if(n.type==="Item"||/^Subitem/.test(n.type)){const d=$("div",n.type==="Item"?"egov-item":"egov-subitem");if(n.displayNumber)d.append($("span","egov-number",n.displayNumber+" "));for(const c of n.children||[])d.append(node(c,query));return d}
    const d=$("div","egov-unknown");for(const c of n.children||[])d.append(node(c,query));return d;
  }
  function renderCategories(container,categories){
    container.replaceChildren();
    for(const c of categories){
      const wrap=$("section","egov-category"),b=$("button","",c.name);b.type="button";b.dataset.action="category";b.dataset.category=c.id;b.title=c.description||"";wrap.append(b);
      const subs=$("div","egov-subcategories");for(const s of c.subcategories){const x=$("button","",s.name);x.type="button";x.dataset.action="subcategory";x.dataset.category=c.id;x.dataset.sub=s.id;subs.append(x)}wrap.append(subs);container.append(wrap);
    }
  }
  function renderLawList(container,laws,title="法令一覧"){
    container.replaceChildren();document.getElementById("egov-list-heading").textContent=title;
    if(!laws.length){container.append($("div","egov-empty","この分類にはβ版の主要法令がまだ登録されていません。検索もご利用ください。"));return}
    for(const law of laws){const d=$("div","egov-list-item");d.append($("h3","",law.displayName||law.lawTitle||"法令"));if(law.lawNumber)d.append($("p","",law.lawNumber));const b=$("button","egov-open-law","法令を開く →");b.type="button";b.dataset.action="law";b.dataset.lawId=law.lawId;d.append(b);container.append(d)}
  }
  function renderSearchGroups(container,groups,query){
    container.replaceChildren();document.getElementById("egov-list-heading").textContent=`検索結果：「${query}」`;
    if(!groups.length){container.append($("div","egov-empty","該当する結果が見つかりませんでした。検索語を短くするか、関連語・ジャンル検索をお試しください。"));return}
    for(const g of groups.slice(0,20)){const d=$("section","egov-search-group");d.append($("h3","",g.lawTitle||g.lawId));d.append($("p","",[g.lawNumber,g.hitCount?`${g.hitCount}件`:``].filter(Boolean).join(" / ")));
      const open=$("button","egov-open-law","法令を開く →");open.type="button";open.dataset.action="law";open.dataset.lawId=g.lawId;open.dataset.highlight=query;d.append(open);
      for(const m of (g.matches||[]).slice(0,5)){const hit=$("div","egov-hit"),b=$("button");b.type="button";b.dataset.action="law";b.dataset.lawId=g.lawId;b.dataset.article=m.articleNumber||"";b.dataset.highlight=query;const label=[m.articleNumber?`第${m.articleNumber}条`:"",m.snippet].filter(Boolean).join(" ");appendHighlighted(b,label,query);hit.append(b);d.append(hit)}container.append(d)}
  }
  function renderLaw(container,toc,doc,query=""){
    container.replaceChildren();toc.replaceChildren();
    const root=$("div","egov-law-document"),title=$("h2","egov-law-title",doc.metadata.title||"法令");title.id="egov-law-heading";root.append(title);
    if(doc.metadata.lawNumber)root.append($("p","egov-law-number",doc.metadata.lawNumber));
    const src=$("p","egov-law-source");src.append("出典：");const a=$("a","","e-Gov法令検索 ↗");a.href=`https://laws.e-gov.go.jp/law/${encodeURIComponent(doc.metadata.lawId)}`;a.target="_blank";a.rel="noopener noreferrer";src.append(a);root.append(src);
    if(query)root.append($("div","egov-search-summary",`この法令内の「${query}」をハイライト表示しています。`));
    const frag=document.createDocumentFragment();for(const n of doc.preamble)frag.append(node(n,query));for(const n of doc.mainProvision)frag.append(node(n,query));
    for(const s of doc.supplementaryProvisions){const sec=$("section","egov-struct");sec.append($("div","egov-struct-title",s.label||"附則"));for(const n of s.children)sec.append(node(n,query));frag.append(sec)}
    for(const ap of doc.appendices){const sec=$("section","egov-struct");sec.append($("div","egov-struct-title",ap.title));for(const n of ap.children)sec.append(node(n,query));frag.append(sec)}
    root.append(frag);container.append(root);
    for(const item of doc.toc){if(!item.anchorId)continue;const a=$("a","",item.title||"条文");a.href="#"+item.anchorId;a.dataset.action="toc";a.dataset.depth=String(item.depth||1);toc.append(a)}
  }
  function renderSuggestions(container,terms){container.replaceChildren();for(const t of terms){const b=$("button","",t);b.type="button";b.dataset.action="suggestion";b.dataset.query=t;container.append(b)}}
  return {renderCategories,renderLawList,renderSearchGroups,renderLaw,renderSuggestions};
})();