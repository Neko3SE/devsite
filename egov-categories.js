window.EGOV_CATEGORIES = (() => {
  const LAW_MASTER = {
    civil_code:{lawId:"129AC0000000089",displayName:"民法"},
    labor_standards:{lawId:"322AC0000000049",displayName:"労働基準法"},
    admin_procedure:{lawId:"405AC0000000088",displayName:"行政手続法"},
    company_act:{lawId:"417AC0000000086",displayName:"会社法"},
    constitution:{lawId:"321CONSTITUTION",displayName:"日本国憲法"},
    copyright:{lawId:"345AC0000000048",displayName:"著作権法"},
    personal_info:{lawId:"415AC0000000057",displayName:"個人情報の保護に関する法律"},
    road_traffic:{lawId:"335AC0000000105",displayName:"道路交通法"},
    criminal_code:{lawId:"140AC0000000045",displayName:"刑法"},
    local_autonomy:{lawId:"322AC0000000067",displayName:"地方自治法"}
  };
  const CATEGORIES = [
    {id:"life",name:"暮らし・生活",description:"消費生活、住まい、戸籍、防災など",subcategories:[
      {id:"consumer",name:"消費生活",lawKeys:["civil_code"]},{id:"housing",name:"住まい",lawKeys:["civil_code"]},
      {id:"resident",name:"戸籍・住民",lawKeys:["civil_code"]},{id:"safety",name:"防災・安全",lawKeys:[]}]},
    {id:"family",name:"家族・相続",description:"婚姻、親子、相続、成年後見",subcategories:[
      {id:"marriage",name:"婚姻・離婚",lawKeys:["civil_code"]},{id:"parent-child",name:"親子",lawKeys:["civil_code"]},
      {id:"inheritance",name:"相続・遺言",lawKeys:["civil_code"]},{id:"guardianship",name:"成年後見",lawKeys:["civil_code"]}]},
    {id:"work",name:"仕事・労働",description:"労働条件、休暇、雇用、安全など",subcategories:[
      {id:"conditions",name:"労働条件",lawKeys:["labor_standards"]},{id:"working-time",name:"労働時間・休暇",lawKeys:["labor_standards"]},
      {id:"employment",name:"雇用・退職",lawKeys:["labor_standards"]},{id:"safety",name:"労働安全",lawKeys:[]},{id:"insurance",name:"労働保険",lawKeys:[]}]},
    {id:"business",name:"会社・ビジネス",description:"会社、契約、労務、知的財産",subcategories:[
      {id:"corporate",name:"会社・法人",lawKeys:["company_act"]},{id:"contracts",name:"契約・取引",lawKeys:["civil_code"]},
      {id:"labor",name:"雇用・労務",lawKeys:["labor_standards"]},{id:"ip",name:"知的財産",lawKeys:["copyright"]},{id:"regulation",name:"事業規制",lawKeys:[]}]},
    {id:"tax-finance",name:"税金・金融",description:"所得税、消費税、法人税、金融",subcategories:[
      {id:"income-tax",name:"所得税",lawKeys:[]},{id:"consumption-tax",name:"消費税",lawKeys:[]},{id:"corporate-tax",name:"法人税",lawKeys:[]},{id:"local-tax",name:"地方税",lawKeys:[]},{id:"finance",name:"金融・保険",lawKeys:[]}]},
    {id:"it-internet",name:"IT・インターネット",description:"個人情報、通信、セキュリティ",subcategories:[
      {id:"privacy",name:"個人情報",lawKeys:["personal_info"]},{id:"communications",name:"通信",lawKeys:[]},{id:"cybersecurity",name:"サイバーセキュリティ",lawKeys:[]},{id:"esign",name:"電子契約・電子署名",lawKeys:[]},{id:"digital-government",name:"デジタル行政",lawKeys:["admin_procedure"]}]},
    {id:"traffic",name:"交通・道路",description:"道路交通、自動車、鉄道、航空・船舶",subcategories:[
      {id:"road-traffic",name:"道路交通",lawKeys:["road_traffic"]},{id:"automobile",name:"自動車",lawKeys:["road_traffic"]},{id:"road",name:"道路",lawKeys:[]},{id:"railway",name:"鉄道",lawKeys:[]},{id:"air-sea",name:"航空・船舶",lawKeys:[]}]},
    {id:"medical-welfare",name:"医療・福祉",description:"医療、介護、障害福祉、社会保障",subcategories:[
      {id:"medical",name:"医療",lawKeys:[]},{id:"health",name:"健康・衛生",lawKeys:[]},{id:"care",name:"介護",lawKeys:[]},{id:"disability",name:"障害福祉",lawKeys:[]},{id:"social-security",name:"社会保障",lawKeys:[]}]},
    {id:"education-culture",name:"教育・文化",description:"学校、大学、文化財、著作権",subcategories:[
      {id:"school",name:"学校教育",lawKeys:[]},{id:"university",name:"大学・研究",lawKeys:[]},{id:"cultural-property",name:"文化財",lawKeys:[]},{id:"copyright",name:"著作権",lawKeys:["copyright"]}]},
    {id:"environment-land",name:"環境・土地",description:"環境、廃棄物、土地、建築、都市計画",subcategories:[
      {id:"environment",name:"環境保全",lawKeys:[]},{id:"waste",name:"廃棄物",lawKeys:[]},{id:"land",name:"土地",lawKeys:["civil_code"]},{id:"building",name:"建築",lawKeys:[]},{id:"planning",name:"都市計画",lawKeys:[]}]},
    {id:"justice",name:"民事・刑事・司法",description:"民事、刑事、裁判、犯罪被害",subcategories:[
      {id:"civil",name:"民事",lawKeys:["civil_code"]},{id:"criminal",name:"刑事",lawKeys:["criminal_code"]},{id:"procedure",name:"裁判・手続",lawKeys:[]},{id:"victims",name:"犯罪・被害者",lawKeys:[]}]},
    {id:"government",name:"国・行政・地方自治",description:"憲法、行政、地方自治、公務員",subcategories:[
      {id:"constitution",name:"憲法・国会",lawKeys:["constitution"]},{id:"administration",name:"行政",lawKeys:["admin_procedure"]},{id:"local",name:"地方自治",lawKeys:["local_autonomy"]},{id:"public-servant",name:"公務員",lawKeys:[]},{id:"information",name:"情報公開",lawKeys:[]}]}
  ];

  function validate(){
    const warnings=[], ids=new Set(), lawIds=new Set();
    for(const [key,law] of Object.entries(LAW_MASTER)){
      if(!law.lawId||!law.displayName) warnings.push(`LAW_MASTER ${key}: 必須項目不足`);
      if(lawIds.has(law.lawId)) warnings.push(`lawId重複: ${law.lawId}`);
      lawIds.add(law.lawId);
    }
    for(const c of CATEGORIES){
      if(ids.has(c.id)) warnings.push(`category id重複: ${c.id}`); ids.add(c.id);
      const subs=new Set();
      for(const s of c.subcategories){
        if(subs.has(s.id)) warnings.push(`${c.id}: sub id重複 ${s.id}`); subs.add(s.id);
        const seen=new Set();
        for(const k of s.lawKeys){
          if(!LAW_MASTER[k]) warnings.push(`${c.id}/${s.id}: unknown lawKey ${k}`);
          if(seen.has(k)) warnings.push(`${c.id}/${s.id}: lawKey重複 ${k}`);
          seen.add(k);
        }
      }
    }
    warnings.forEach(x=>console.warn("[egov-categories]",x));
    return warnings;
  }
  return {LAW_MASTER,CATEGORIES,validate};
})();