window.EGOV_API = (() => {
  const BASE="https://laws.e-gov.go.jp/api/2", TIMEOUT=15000, MAX_USER_RETRIES=3, LOCAL_COOLDOWN=60000, CACHE_MAX=20;
  const inflight=new Map(), failures=new Map(), cache=new Map();

  class EgError extends Error{
    constructor(code,message,extra={}){super(message);this.name="EgError";this.code=code;Object.assign(this,extra)}
  }
  function operationState(op){if(!failures.has(op))failures.set(op,{count:0,until:0});return failures.get(op)}
  function parseRetryAfter(value){
    if(!value)return 0; const sec=Number(value); if(Number.isFinite(sec))return Math.max(0,sec*1000);
    const date=Date.parse(value); return Number.isFinite(date)?Math.max(0,date-Date.now()):0;
  }
  function noteFailure(op, retryAfter=0){
    const s=operationState(op); s.count++;
    if(retryAfter>0)s.until=Date.now()+retryAfter;
    else if(s.count>MAX_USER_RETRIES)s.until=Date.now()+LOCAL_COOLDOWN;
    return Math.max(0,s.until-Date.now());
  }
  function noteSuccess(op){failures.set(op,{count:0,until:0})}
  function checkCooldown(op){
    const s=operationState(op);
    if(s.until>Date.now())throw new EgError("RATE_LIMIT_ERROR","再試行待機中",{retryable:true,retryAfter:s.until-Date.now()});
    if(s.until && s.until<=Date.now())failures.set(op,{count:0,until:0});
  }
  async function request(url,{op,key,format="json",signal}={}){
    checkCooldown(op);
    if(inflight.has(key))return inflight.get(key);
    const controller=new AbortController();
    const relay=()=>controller.abort("navigation");
    if(signal)signal.addEventListener("abort",relay,{once:true});
    const timer=setTimeout(()=>controller.abort("timeout"),TIMEOUT);
    const promise=(async()=>{
      try{
        const res=await fetch(url,{mode:"cors",cache:"no-store",credentials:"omit",signal:controller.signal});
        if(res.status===429){
          const wait=parseRetryAfter(res.headers.get("Retry-After"))||LOCAL_COOLDOWN; noteFailure(op,wait);
          throw new EgError("RATE_LIMIT_ERROR","APIが再試行待機を要求しました",{operation:op,httpStatus:429,retryable:true,retryAfter:wait});
        }
        if(!res.ok){
          const wait=noteFailure(op);
          if(op==="lawData"&&(res.status===400||res.status===404)){
            throw new EgError("NOT_FOUND","指定された法令が見つかりません",{operation:op,httpStatus:res.status,retryable:false});
          }
          throw new EgError("HTTP_ERROR",`HTTP ${res.status}`,{operation:op,httpStatus:res.status,retryable:res.status>=500,retryAfter:wait});
        }
        const text=await res.text(); noteSuccess(op);
        if(format==="text")return text;
        try{return JSON.parse(text)}catch(e){throw new EgError("PARSE_ERROR","JSONを解析できません",{cause:e,retryable:false})}
      }catch(e){
        if(e instanceof EgError)throw e;
        if(e?.name==="AbortError"){
          if(controller.signal.reason==="timeout"){const wait=noteFailure(op);throw new EgError("TIMEOUT_ERROR","取得がタイムアウトしました",{operation:op,retryable:true,retryAfter:wait})}
          throw new EgError("CANCELLED","通信を中止しました",{operation:op,retryable:false});
        }
        const wait=noteFailure(op); throw new EgError("NETWORK_ERROR","通信できませんでした",{operation:op,cause:e,retryable:true,retryAfter:wait});
      }finally{
        clearTimeout(timer); if(signal)signal.removeEventListener("abort",relay); inflight.delete(key);
      }
    })();
    inflight.set(key,promise); return promise;
  }
  function build(path,params={}){
    const u=new URL(BASE+path); Object.entries(params).forEach(([k,v])=>{if(v!==undefined&&v!==null&&v!=="")u.searchParams.set(k,String(v))}); return u;
  }
  function cacheGet(id){if(!cache.has(id))return null;const v=cache.get(id);cache.delete(id);cache.set(id,v);return v}
  function cachePut(id,doc){if(cache.has(id))cache.delete(id);cache.set(id,doc);while(cache.size>CACHE_MAX)cache.delete(cache.keys().next().value)}
  return {
    EgError, cacheGet, cachePut,
    laws:(q,signal)=>request(build("/laws",{law_title:q,limit:50,response_format:"json"}),{op:"laws",key:`laws:${q}`,signal}),
    keyword:(q,signal)=>request(build("/keyword",{keyword:q,limit:100,response_format:"json"}),{op:"keyword",key:`keyword:${q}`,signal}),
    lawData:(id,signal)=>request(build(`/law_data/${encodeURIComponent(id)}`,{response_format:"xml",law_full_text_format:"xml"}),{op:"lawData",key:`law:${id}`,format:"text",signal}),
    getCooldown:(op)=>Math.max(0,operationState(op).until-Date.now())
  };
})();