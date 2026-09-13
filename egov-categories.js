window.EGOV_CATEGORIES = (() => {
  const LAW_MASTER = {
    consumer_contract:{lawId:"412AC0000000061",displayName:"消費者契約法"},
    land_house_lease:{lawId:"403AC0000000090",displayName:"借地借家法"},
    civil_code:{lawId:"129AC0000000089",displayName:"民法"},
    family_register:{lawId:"322AC0000000224",displayName:"戸籍法"},
    labor_standards:{lawId:"322AC0000000049",displayName:"労働基準法"},
    labor_contract:{lawId:"419AC0000000128",displayName:"労働契約法"},
    company_act:{lawId:"417AC0000000086",displayName:"会社法"},
    commercial_code:{lawId:"132AC0000000048",displayName:"商法"},
    income_tax:{lawId:"340AC0000000033",displayName:"所得税法"},
    local_tax:{lawId:"325AC0000000226",displayName:"地方税法"},
    personal_info:{lawId:"415AC0000000057",displayName:"個人情報の保護に関する法律"},
    electronic_signature:{lawId:"412AC0000000102",displayName:"電子署名及び認証業務に関する法律"},
    road_traffic:{lawId:"335AC0000000105",displayName:"道路交通法"},
    road_act:{lawId:"327AC1000000180",displayName:"道路法"},
    medical_act:{lawId:"323AC0000000205",displayName:"医療法"},
    public_assistance:{lawId:"325AC0000000144",displayName:"生活保護法"},
    school_education:{lawId:"322AC0000000026",displayName:"学校教育法"},
    copyright:{lawId:"345AC0000000048",displayName:"著作権法"},
    environment_basic:{lawId:"405AC0000000091",displayName:"環境基本法"},
    city_planning:{lawId:"343AC0000000100",displayName:"都市計画法"},
    criminal_code:{lawId:"140AC0000000045",displayName:"刑法"},
    civil_procedure:{lawId:"408AC0000000109",displayName:"民事訴訟法"},
    constitution:{lawId:"321CONSTITUTION",displayName:"日本国憲法"},
    local_autonomy:{lawId:"322AC0000000067",displayName:"地方自治法"},
    admin_procedure:{lawId:"405AC0000000088",displayName:"行政手続法"}
  };
  const CATEGORIES = [
    {id:"life",name:"暮らし・生活",description:"消費生活、住まい、戸籍、防災など",subcategories:[
      {id:"consumer",name:"消費生活",lawKeys:["consumer_contract"]},{id:"housing",name:"住まい",lawKeys:["land_house_lease"]},
      {id:"resident",name:"戸籍・住民",lawKeys:[]},{id:"safety",name:"防災・安全",lawKeys:[]}]},
    {id:"family",name:"家族・相続",description:"婚姻、親子、相続、成年後見",subcategories:[
      {id:"civil-family",name:"家族・相続",lawKeys:["civil_code"]},{id:"family-register",name:"戸籍",lawKeys:["family_register"]}]},
    {id:"work",name:"仕事・労働",description:"労働条件、休暇、雇用、安全など",subcategories:[
      {id:"conditions",name:"労働条件・労働時間",lawKeys:["labor_standards"]},{id:"employment",name:"雇用・労働契約",lawKeys:["labor_contract"]}]},
    {id:"business",name:"会社・ビジネス",description:"会社、商取引、契約など",subcategories:[
      {id:"corporate",name:"会社・法人",lawKeys:["company_act"]},{id:"commerce",name:"商取引",lawKeys:["commercial_code"]}]},
    {id:"tax-finance",name:"税金・金融",description:"所得税、地方税、金融",subcategories:[
      {id:"income-tax",name:"所得税",lawKeys:["income_tax"]},{id:"local-tax",name:"地方税",lawKeys:["local_tax"]}]},
    {id:"it-internet",name:"IT・インターネット",description:"個人情報、電子署名、インターネット",subcategories:[
      {id:"privacy",name:"個人情報",lawKeys:["personal_info"]},{id:"esign",name:"電子契約・電子署名",lawKeys:["electronic_signature"]}]},
    {id:"traffic",name:"交通・道路",description:"道路交通、道路",subcategories:[
      {id:"road-traffic",name:"道路交通",lawKeys:["road_traffic"]},{id:"road",name:"道路",lawKeys:["road_act"]}]},
    {id:"medical-welfare",name:"医療・福祉",description:"医療、福祉、社会保障",subcategories:[
      {id:"medical",name:"医療",lawKeys:["medical_act"]},{id:"welfare",name:"福祉・生活保護",lawKeys:["public_assistance"]}]},
    {id:"education-culture",name:"教育・文化",description:"学校教育、文化、著作権",subcategories:[
      {id:"school",name:"学校教育",lawKeys:["school_education"]},{id:"copyright",name:"著作権",lawKeys:["copyright"]}]},
    {id:"environment-land",name:"環境・土地",description:"環境、土地、都市計画",subcategories:[
      {id:"environment",name:"環境保全",lawKeys:["environment_basic"]},{id:"planning",name:"都市計画",lawKeys:["city_planning"]}]},
    {id:"justice",name:"民事・刑事・司法",description:"民事、刑事、裁判・手続",subcategories:[
      {id:"criminal",name:"刑事",lawKeys:["criminal_code"]},{id:"procedure",name:"民事裁判・手続",lawKeys:["civil_procedure"]}]},
    {id:"government",name:"国・行政・地方自治",description:"憲法、行政、地方自治",subcategories:[
      {id:"constitution",name:"憲法・国会",lawKeys:["constitution"]},{id:"administration",name:"行政",lawKeys:["admin_procedure"]},{id:"local",name:"地方自治",lawKeys:["local_autonomy"]}]}
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