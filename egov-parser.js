window.EGOV_PARSER = (() => {
  const structural=new Set(["Part","Chapter","Section","Subsection","Division"]);
  const appendices=new Set(["AppdxTable","AppdxNote","AppdxStyle","Appdx","AppdxFig","AppdxFormat"]);
  const inline=new Set(["Ruby","Sup","Sub","Line","QuoteStruct","ArithFormula"]);

  function children(el){return [...el.children]}
  function text(el){return (el?.textContent||"").replace(/\s+/g," ").trim()}
  function direct(el,name){return children(el).find(x=>x.localName===name)||null}
  function fragments(el){
    const out=[];
    for(const n of el.childNodes){
      if(n.nodeType===Node.TEXT_NODE){if(n.nodeValue)out.push({type:"text",text:n.nodeValue})}
      else if(n.nodeType===Node.ELEMENT_NODE){
        const name=n.localName;
        if(name==="Ruby"){out.push({type:"ruby",text:text(n),rt:text(direct(n,"Rt"))})}
        else if(name==="Sup"||name==="Sub"){out.push({type:name.toLowerCase(),text:text(n)})}
        else out.push(...fragments(n));
      }
    }
    return out;
  }
  function parseTable(el){
    const rows=[];
    for(const row of el.querySelectorAll(":scope > TableRow")){
      const cells=[...row.children].filter(c=>c.localName==="TableColumn").map(c=>({
        text:text(c),rowspan:c.getAttribute("rowspan")||c.getAttribute("Rowspan")||"",colspan:c.getAttribute("colspan")||c.getAttribute("Colspan")||""
      }));
      rows.push(cells);
    }
    return {type:"Table",rows};
  }
  function parseNode(el,depth=0){
    const name=el.localName;
    if(name==="Article"){
      const title=direct(el,"ArticleTitle"), caption=direct(el,"ArticleCaption");
      const number=el.getAttribute("Num")||text(title)||crypto.randomUUID();
      const node={type:"Article",number,displayNumber:text(title),caption:text(caption),delete:el.getAttribute("Delete")==="true",hide:el.getAttribute("Hide")==="true",children:[]};
      node.children=children(el).filter(x=>!["ArticleTitle","ArticleCaption"].includes(x.localName)).map(x=>parseNode(x,depth+1)).filter(Boolean);
      node.plainText=text(el); return node;
    }
    if(structural.has(name)){
      const title=direct(el,`${name}Title`);
      return {type:name,number:el.getAttribute("Num")||"",title:text(title),children:children(el).filter(x=>x!==title).map(x=>parseNode(x,depth+1)).filter(Boolean)};
    }
    if(name==="Paragraph"){
      return {type:"Paragraph",number:el.getAttribute("Num")||"",displayNumber:text(direct(el,"ParagraphNum")),children:children(el).filter(x=>x.localName!=="ParagraphNum").map(x=>parseNode(x,depth+1)).filter(Boolean)};
    }
    if(name==="Item"||/^Subitem\d+$/.test(name)){
      const title=direct(el,name+"Title");
      return {type:name,displayNumber:text(title),children:children(el).filter(x=>x!==title).map(x=>parseNode(x,depth+1)).filter(Boolean)};
    }
    if(name==="Sentence"||name.endsWith("Sentence")||name==="Column"||name==="ColumnSentence"){
      return {type:"Text",fragments:fragments(el),plainText:text(el)};
    }
    if(name==="TableStruct"){const t=el.querySelector(":scope > Table");return t?parseTable(t):{type:"Text",fragments:fragments(el),plainText:text(el)}}
    if(name==="Table")return parseTable(el);
    if(["Remarks","Label","SupplProvisionLabel"].includes(name))return {type:"Label",text:text(el)};
    if(inline.has(name))return {type:"Text",fragments:fragments(el),plainText:text(el)};
    if(name.endsWith("Title")||name.endsWith("Caption")||name==="ParagraphNum")return null;
    const kids=children(el).map(x=>parseNode(x,depth+1)).filter(Boolean);
    if(kids.length)return {type:"Unknown",name,children:kids};
    const t=text(el); if(t)return {type:"Text",fragments:[{type:"text",text:t}],plainText:t};
    return null;
  }
  function makeAnchor(article,used){
    let base="article-"+String(article.number||article.displayNumber||"x").replace(/[^\p{L}\p{N}_.-]+/gu,"-");
    if(!base||base==="article-")base="article-x";let id=base,n=2;while(used.has(id))id=`${base}-${n++}`;used.add(id);return id;
  }
  function collectToc(nodes,out=[],used=new Set(),depth=1){
    for(const n of nodes||[]){
      if(structural.has(n.type)&&n.title)out.push({type:n.type,title:n.title,depth:Math.min(depth,3)});
      if(n.type==="Article"){n.anchorId=makeAnchor(n,used);out.push({type:"Article",title:[n.caption,n.displayNumber].filter(Boolean).join(" "),anchorId:n.anchorId,depth:3})}
      collectToc(n.children,out,used,depth+(structural.has(n.type)?1:0));
    } return out;
  }
  function parseLawXml(xml,lawId=""){
    const doc=new DOMParser().parseFromString(xml,"application/xml");
    if(doc.querySelector("parsererror"))throw new EGOV_API.EgError("PARSE_ERROR","法令XMLを解析できません");
    const law=doc.querySelector("Law"); if(!law)throw new EGOV_API.EgError("PARSE_ERROR","Law要素がありません");
    const body=direct(law,"LawBody"); if(!body)throw new EGOV_API.EgError("PARSE_ERROR","LawBody要素がありません");
    const main=direct(body,"MainProvision"); if(!main)throw new EGOV_API.EgError("PARSE_ERROR","MainProvision要素がありません");
    const model={
      metadata:{lawId,title:text(direct(body,"LawTitle")),lawNumber:text(direct(law,"LawNum")),lawType:law.getAttribute("LawType")||""},
      preamble:[],mainProvision:[],supplementaryProvisions:[],appendices:[],toc:[]
    };
    const pre=direct(body,"Preamble"); if(pre)model.preamble=children(pre).map(parseNode).filter(Boolean);
    model.mainProvision=children(main).map(parseNode).filter(Boolean);
    for(const el of children(body)){
      if(el.localName==="SupplProvision")model.supplementaryProvisions.push({type:"SupplProvision",label:text(direct(el,"SupplProvisionLabel"))||"附則",amendLawNum:el.getAttribute("AmendLawNum")||"",extract:el.getAttribute("Extract")||"",children:children(el).filter(x=>x.localName!=="SupplProvisionLabel").map(parseNode).filter(Boolean)});
      else if(appendices.has(el.localName))model.appendices.push({type:el.localName,title:text(el.querySelector(":scope > *[class$='Title']"))||el.localName,children:children(el).map(parseNode).filter(Boolean)});
    }
    model.toc=collectToc([...model.mainProvision,...model.supplementaryProvisions,...model.appendices]);
    return model;
  }
  function normalizeLawList(data){
    const arr=Array.isArray(data?.laws)?data.laws:Array.isArray(data)?data:[];
    return arr.map(x=>{
      const info=x.law_info||x;
      return {lawId:info.law_id||info.lawId||x.law_id||"",lawTitle:info.law_name||info.law_title||info.lawName||info.lawTitle||"",lawNumber:info.law_num||info.law_number||info.lawNum||"",lawType:info.law_type||info.lawType||""};
    }).filter(x=>x.lawId);
  }
  function normalizeKeyword(data){
    const raw=Array.isArray(data?.items)?data.items:Array.isArray(data?.results)?data.results:Array.isArray(data?.laws)?data.laws:Array.isArray(data)?data:[];
    const groups=new Map();
    for(const x of raw){
      const info=x.law_info||x.revision_info||x;
      const lawId=info.law_id||x.law_id||x.lawId||"";
      if(!lawId)continue;
      if(!groups.has(lawId))groups.set(lawId,{lawId,lawTitle:info.law_name||info.law_title||x.law_name||x.law_title||"",lawNumber:info.law_num||x.law_num||"",lawType:info.law_type||"",hitCount:0,matches:[]});
      const g=groups.get(lawId);
      const candidates=Array.isArray(x.sentences)?x.sentences:Array.isArray(x.matches)?x.matches:[x];
      for(const m of candidates){
        const snippet=m.text||m.sentence||m.snippet||m.keyword_context||"";
        const articleNumber=m.article||m.article_num||m.article_number||x.article||x.article_num||"";
        if(snippet||articleNumber){g.matches.push({articleNumber:String(articleNumber||""),snippet:String(snippet||"")});g.hitCount++}
      }
    }
    return [...groups.values()];
  }
  return {parseLawXml,normalizeLawList,normalizeKeyword};
})();