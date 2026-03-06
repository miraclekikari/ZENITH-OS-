function Un(t,e){for(var n=0;n<e.length;n++){const a=e[n];if(typeof a!="string"&&!Array.isArray(a)){for(const r in a)if(r!=="default"&&!(r in t)){const s=Object.getOwnPropertyDescriptor(a,r);s&&Object.defineProperty(t,r,s.get?s:{enumerable:!0,get:()=>a[r]})}}}return Object.freeze(Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}))}function Yn(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var Ot={exports:{}},ot={},It={exports:{}},y={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ye;function $n(){if(ye)return y;ye=1;var t=Symbol.for("react.element"),e=Symbol.for("react.portal"),n=Symbol.for("react.fragment"),a=Symbol.for("react.strict_mode"),r=Symbol.for("react.profiler"),s=Symbol.for("react.provider"),i=Symbol.for("react.context"),c=Symbol.for("react.forward_ref"),m=Symbol.for("react.suspense"),d=Symbol.for("react.memo"),u=Symbol.for("react.lazy"),h=Symbol.iterator;function g(o){return o===null||typeof o!="object"?null:(o=h&&o[h]||o["@@iterator"],typeof o=="function"?o:null)}var x={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},z=Object.assign,N={};function S(o,f,v){this.props=o,this.context=f,this.refs=N,this.updater=v||x}S.prototype.isReactComponent={},S.prototype.setState=function(o,f){if(typeof o!="object"&&typeof o!="function"&&o!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,o,f,"setState")},S.prototype.forceUpdate=function(o){this.updater.enqueueForceUpdate(this,o,"forceUpdate")};function O(){}O.prototype=S.prototype;function k(o,f,v){this.props=o,this.context=f,this.refs=N,this.updater=v||x}var w=k.prototype=new O;w.constructor=k,z(w,S.prototype),w.isPureReactComponent=!0;var F=Array.isArray,b=Object.prototype.hasOwnProperty,Z={current:null},tt={key:!0,ref:!0,__self:!0,__source:!0};function gt(o,f,v){var C,L={},E=null,_=null;if(f!=null)for(C in f.ref!==void 0&&(_=f.ref),f.key!==void 0&&(E=""+f.key),f)b.call(f,C)&&!tt.hasOwnProperty(C)&&(L[C]=f[C]);var P=arguments.length-2;if(P===1)L.children=v;else if(1<P){for(var M=Array(P),D=0;D<P;D++)M[D]=arguments[D+2];L.children=M}if(o&&o.defaultProps)for(C in P=o.defaultProps,P)L[C]===void 0&&(L[C]=P[C]);return{$$typeof:t,type:o,key:E,ref:_,props:L,_owner:Z.current}}function Rn(o,f){return{$$typeof:t,type:o.type,key:f,ref:o.ref,props:o.props,_owner:o._owner}}function zt(o){return typeof o=="object"&&o!==null&&o.$$typeof===t}function Fn(o){var f={"=":"=0",":":"=2"};return"$"+o.replace(/[=:]/g,function(v){return f[v]})}var he=/\/+/g;function Nt(o,f){return typeof o=="object"&&o!==null&&o.key!=null?Fn(""+o.key):f.toString(36)}function yt(o,f,v,C,L){var E=typeof o;(E==="undefined"||E==="boolean")&&(o=null);var _=!1;if(o===null)_=!0;else switch(E){case"string":case"number":_=!0;break;case"object":switch(o.$$typeof){case t:case e:_=!0}}if(_)return _=o,L=L(_),o=C===""?"."+Nt(_,0):C,F(L)?(v="",o!=null&&(v=o.replace(he,"$&/")+"/"),yt(L,f,v,"",function(D){return D})):L!=null&&(zt(L)&&(L=Rn(L,v+(!L.key||_&&_.key===L.key?"":(""+L.key).replace(he,"$&/")+"/")+o)),f.push(L)),1;if(_=0,C=C===""?".":C+":",F(o))for(var P=0;P<o.length;P++){E=o[P];var M=C+Nt(E,P);_+=yt(E,f,v,M,L)}else if(M=g(o),typeof M=="function")for(o=M.call(o),P=0;!(E=o.next()).done;)E=E.value,M=C+Nt(E,P++),_+=yt(E,f,v,M,L);else if(E==="object")throw f=String(o),Error("Objects are not valid as a React child (found: "+(f==="[object Object]"?"object with keys {"+Object.keys(o).join(", ")+"}":f)+"). If you meant to render a collection of children, use an array instead.");return _}function bt(o,f,v){if(o==null)return o;var C=[],L=0;return yt(o,C,"","",function(E){return f.call(v,E,L++)}),C}function Dn(o){if(o._status===-1){var f=o._result;f=f(),f.then(function(v){(o._status===0||o._status===-1)&&(o._status=1,o._result=v)},function(v){(o._status===0||o._status===-1)&&(o._status=2,o._result=v)}),o._status===-1&&(o._status=0,o._result=f)}if(o._status===1)return o._result.default;throw o._result}var T={current:null},vt={transition:null},jn={ReactCurrentDispatcher:T,ReactCurrentBatchConfig:vt,ReactCurrentOwner:Z};function ge(){throw Error("act(...) is not supported in production builds of React.")}return y.Children={map:bt,forEach:function(o,f,v){bt(o,function(){f.apply(this,arguments)},v)},count:function(o){var f=0;return bt(o,function(){f++}),f},toArray:function(o){return bt(o,function(f){return f})||[]},only:function(o){if(!zt(o))throw Error("React.Children.only expected to receive a single React element child.");return o}},y.Component=S,y.Fragment=n,y.Profiler=r,y.PureComponent=k,y.StrictMode=a,y.Suspense=m,y.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=jn,y.act=ge,y.cloneElement=function(o,f,v){if(o==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+o+".");var C=z({},o.props),L=o.key,E=o.ref,_=o._owner;if(f!=null){if(f.ref!==void 0&&(E=f.ref,_=Z.current),f.key!==void 0&&(L=""+f.key),o.type&&o.type.defaultProps)var P=o.type.defaultProps;for(M in f)b.call(f,M)&&!tt.hasOwnProperty(M)&&(C[M]=f[M]===void 0&&P!==void 0?P[M]:f[M])}var M=arguments.length-2;if(M===1)C.children=v;else if(1<M){P=Array(M);for(var D=0;D<M;D++)P[D]=arguments[D+2];C.children=P}return{$$typeof:t,type:o.type,key:L,ref:E,props:C,_owner:_}},y.createContext=function(o){return o={$$typeof:i,_currentValue:o,_currentValue2:o,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},o.Provider={$$typeof:s,_context:o},o.Consumer=o},y.createElement=gt,y.createFactory=function(o){var f=gt.bind(null,o);return f.type=o,f},y.createRef=function(){return{current:null}},y.forwardRef=function(o){return{$$typeof:c,render:o}},y.isValidElement=zt,y.lazy=function(o){return{$$typeof:u,_payload:{_status:-1,_result:o},_init:Dn}},y.memo=function(o,f){return{$$typeof:d,type:o,compare:f===void 0?null:f}},y.startTransition=function(o){var f=vt.transition;vt.transition={};try{o()}finally{vt.transition=f}},y.unstable_act=ge,y.useCallback=function(o,f){return T.current.useCallback(o,f)},y.useContext=function(o){return T.current.useContext(o)},y.useDebugValue=function(){},y.useDeferredValue=function(o){return T.current.useDeferredValue(o)},y.useEffect=function(o,f){return T.current.useEffect(o,f)},y.useId=function(){return T.current.useId()},y.useImperativeHandle=function(o,f,v){return T.current.useImperativeHandle(o,f,v)},y.useInsertionEffect=function(o,f){return T.current.useInsertionEffect(o,f)},y.useLayoutEffect=function(o,f){return T.current.useLayoutEffect(o,f)},y.useMemo=function(o,f){return T.current.useMemo(o,f)},y.useReducer=function(o,f,v){return T.current.useReducer(o,f,v)},y.useRef=function(o){return T.current.useRef(o)},y.useState=function(o){return T.current.useState(o)},y.useSyncExternalStore=function(o,f,v){return T.current.useSyncExternalStore(o,f,v)},y.useTransition=function(){return T.current.useTransition()},y.version="18.3.1",y}var be;function Je(){return be||(be=1,It.exports=$n()),It.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ve;function Wn(){if(ve)return ot;ve=1;var t=Je(),e=Symbol.for("react.element"),n=Symbol.for("react.fragment"),a=Object.prototype.hasOwnProperty,r=t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,s={key:!0,ref:!0,__self:!0,__source:!0};function i(c,m,d){var u,h={},g=null,x=null;d!==void 0&&(g=""+d),m.key!==void 0&&(g=""+m.key),m.ref!==void 0&&(x=m.ref);for(u in m)a.call(m,u)&&!s.hasOwnProperty(u)&&(h[u]=m[u]);if(c&&c.defaultProps)for(u in m=c.defaultProps,m)h[u]===void 0&&(h[u]=m[u]);return{$$typeof:e,type:c,key:g,ref:x,props:h,_owner:r.current}}return ot.Fragment=n,ot.jsx=i,ot.jsxs=i,ot}var xe;function Hn(){return xe||(xe=1,Ot.exports=Wn()),Ot.exports}var ws=Hn(),ne=Je();const ae=Yn(ne),Ms=Un({__proto__:null,default:ae},[ne]);/*!
 * Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 * Copyright 2024 Fonticons, Inc.
 */function Vn(t,e,n){return(e=Bn(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function Le(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter(function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable})),n.push.apply(n,a)}return n}function l(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?Le(Object(n),!0).forEach(function(a){Vn(t,a,n[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):Le(Object(n)).forEach(function(a){Object.defineProperty(t,a,Object.getOwnPropertyDescriptor(n,a))})}return t}function Gn(t,e){if(typeof t!="object"||!t)return t;var n=t[Symbol.toPrimitive];if(n!==void 0){var a=n.call(t,e);if(typeof a!="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}function Bn(t){var e=Gn(t,"string");return typeof e=="symbol"?e:e+""}const Se=()=>{};let re={},Qe={},Ze=null,tn={mark:Se,measure:Se};try{typeof window<"u"&&(re=window),typeof document<"u"&&(Qe=document),typeof MutationObserver<"u"&&(Ze=MutationObserver),typeof performance<"u"&&(tn=performance)}catch{}const{userAgent:Ce=""}=re.navigator||{},B=re,A=Qe,Ae=Ze,xt=tn;B.document;const V=!!A.documentElement&&!!A.head&&typeof A.addEventListener=="function"&&typeof A.createElement=="function",en=~Ce.indexOf("MSIE")||~Ce.indexOf("Trident/");var qn=/fa(s|r|l|t|d|dr|dl|dt|b|k|kd|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/,Xn=/Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit)?.*/i,nn={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fab:"brands","fa-brands":"brands"},duotone:{fa:"solid",fad:"solid","fa-solid":"solid","fa-duotone":"solid",fadr:"regular","fa-regular":"regular",fadl:"light","fa-light":"light",fadt:"thin","fa-thin":"thin"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid",fasdr:"regular","fa-regular":"regular",fasdl:"light","fa-light":"light",fasdt:"thin","fa-thin":"thin"}},Kn={GROUP:"duotone-group",PRIMARY:"primary",SECONDARY:"secondary"},an=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone"],I="classic",wt="duotone",Jn="sharp",Qn="sharp-duotone",rn=[I,wt,Jn,Qn],Zn={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},duotone:{900:"fad",400:"fadr",300:"fadl",100:"fadt"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds",400:"fasdr",300:"fasdl",100:"fasdt"}},ta={"Font Awesome 6 Free":{900:"fas",400:"far"},"Font Awesome 6 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 6 Brands":{400:"fab",normal:"fab"},"Font Awesome 6 Duotone":{900:"fad",400:"fadr",normal:"fadr",300:"fadl",100:"fadt"},"Font Awesome 6 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 6 Sharp Duotone":{900:"fasds",400:"fasdr",normal:"fasdr",300:"fasdl",100:"fasdt"}},ea=new Map([["classic",{defaultShortPrefixId:"fas",defaultStyleId:"solid",styleIds:["solid","regular","light","thin","brands"],futureStyleIds:[],defaultFontWeight:900}],["sharp",{defaultShortPrefixId:"fass",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["duotone",{defaultShortPrefixId:"fad",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp-duotone",{defaultShortPrefixId:"fasds",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}]]),na={classic:{solid:"fas",regular:"far",light:"fal",thin:"fat",brands:"fab"},duotone:{solid:"fad",regular:"fadr",light:"fadl",thin:"fadt"},sharp:{solid:"fass",regular:"fasr",light:"fasl",thin:"fast"},"sharp-duotone":{solid:"fasds",regular:"fasdr",light:"fasdl",thin:"fasdt"}},aa=["fak","fa-kit","fakd","fa-kit-duotone"],ke={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},ra=["kit"],sa={kit:{"fa-kit":"fak"}},oa=["fak","fakd"],ia={kit:{fak:"fa-kit"}},we={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},Lt={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},ca=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone"],la=["fak","fa-kit","fakd","fa-kit-duotone"],fa={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},ua={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},duotone:{"fa-regular":"fadr","fa-light":"fadl","fa-thin":"fadt"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds","fa-regular":"fasdr","fa-light":"fasdl","fa-thin":"fasdt"}},ma={classic:["fas","far","fal","fat","fad"],duotone:["fadr","fadl","fadt"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds","fasdr","fasdl","fasdt"]},Ut={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},duotone:{fadr:"fa-regular",fadl:"fa-light",fadt:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid",fasdr:"fa-regular",fasdl:"fa-light",fasdt:"fa-thin"}},da=["fa-solid","fa-regular","fa-light","fa-thin","fa-duotone","fa-brands"],Yt=["fa","fas","far","fal","fat","fad","fadr","fadl","fadt","fab","fass","fasr","fasl","fast","fasds","fasdr","fasdl","fasdt",...ca,...da],pa=["solid","regular","light","thin","duotone","brands"],sn=[1,2,3,4,5,6,7,8,9,10],ha=sn.concat([11,12,13,14,15,16,17,18,19,20]),ga=[...Object.keys(ma),...pa,"2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","fw","inverse","layers-counter","layers-text","layers","li","pull-left","pull-right","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul",Lt.GROUP,Lt.SWAP_OPACITY,Lt.PRIMARY,Lt.SECONDARY].concat(sn.map(t=>"".concat(t,"x"))).concat(ha.map(t=>"w-".concat(t))),ya={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}};const W="___FONT_AWESOME___",$t=16,on="fa",cn="svg-inline--fa",J="data-fa-i2svg",Wt="data-fa-pseudo-element",ba="data-fa-pseudo-element-pending",se="data-prefix",oe="data-icon",Me="fontawesome-i2svg",va="async",xa=["HTML","HEAD","STYLE","SCRIPT"],ln=(()=>{try{return!0}catch{return!1}})();function pt(t){return new Proxy(t,{get(e,n){return n in e?e[n]:e[I]}})}const fn=l({},nn);fn[I]=l(l(l(l({},{"fa-duotone":"duotone"}),nn[I]),ke.kit),ke["kit-duotone"]);const La=pt(fn),Ht=l({},na);Ht[I]=l(l(l(l({},{duotone:"fad"}),Ht[I]),we.kit),we["kit-duotone"]);const Ee=pt(Ht),Vt=l({},Ut);Vt[I]=l(l({},Vt[I]),ia.kit);const ie=pt(Vt),Gt=l({},ua);Gt[I]=l(l({},Gt[I]),sa.kit);pt(Gt);const Sa=qn,un="fa-layers-text",Ca=Xn,Aa=l({},Zn);pt(Aa);const ka=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],Tt=Kn,wa=[...ra,...ga],ct=B.FontAwesomeConfig||{};function Ma(t){var e=A.querySelector("script["+t+"]");if(e)return e.getAttribute(t)}function Ea(t){return t===""?!0:t==="false"?!1:t==="true"?!0:t}A&&typeof A.querySelector=="function"&&[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-auto-a11y","autoA11y"],["data-search-pseudo-elements","searchPseudoElements"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]].forEach(e=>{let[n,a]=e;const r=Ea(Ma(n));r!=null&&(ct[a]=r)});const mn={styleDefault:"solid",familyDefault:I,cssPrefix:on,replacementClass:cn,autoReplaceSvg:!0,autoAddCss:!0,autoA11y:!0,searchPseudoElements:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};ct.familyPrefix&&(ct.cssPrefix=ct.familyPrefix);const rt=l(l({},mn),ct);rt.autoReplaceSvg||(rt.observeMutations=!1);const p={};Object.keys(mn).forEach(t=>{Object.defineProperty(p,t,{enumerable:!0,set:function(e){rt[t]=e,lt.forEach(n=>n(p))},get:function(){return rt[t]}})});Object.defineProperty(p,"familyPrefix",{enumerable:!0,set:function(t){rt.cssPrefix=t,lt.forEach(e=>e(p))},get:function(){return rt.cssPrefix}});B.FontAwesomeConfig=p;const lt=[];function Pa(t){return lt.push(t),()=>{lt.splice(lt.indexOf(t),1)}}const G=$t,j={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function _a(t){if(!t||!V)return;const e=A.createElement("style");e.setAttribute("type","text/css"),e.innerHTML=t;const n=A.head.childNodes;let a=null;for(let r=n.length-1;r>-1;r--){const s=n[r],i=(s.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(i)>-1&&(a=s)}return A.head.insertBefore(e,a),t}const za="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function ut(){let t=12,e="";for(;t-- >0;)e+=za[Math.random()*62|0];return e}function st(t){const e=[];for(let n=(t||[]).length>>>0;n--;)e[n]=t[n];return e}function ce(t){return t.classList?st(t.classList):(t.getAttribute("class")||"").split(" ").filter(e=>e)}function dn(t){return"".concat(t).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Na(t){return Object.keys(t||{}).reduce((e,n)=>e+"".concat(n,'="').concat(dn(t[n]),'" '),"").trim()}function Mt(t){return Object.keys(t||{}).reduce((e,n)=>e+"".concat(n,": ").concat(t[n].trim(),";"),"")}function le(t){return t.size!==j.size||t.x!==j.x||t.y!==j.y||t.rotate!==j.rotate||t.flipX||t.flipY}function Oa(t){let{transform:e,containerWidth:n,iconWidth:a}=t;const r={transform:"translate(".concat(n/2," 256)")},s="translate(".concat(e.x*32,", ").concat(e.y*32,") "),i="scale(".concat(e.size/16*(e.flipX?-1:1),", ").concat(e.size/16*(e.flipY?-1:1),") "),c="rotate(".concat(e.rotate," 0 0)"),m={transform:"".concat(s," ").concat(i," ").concat(c)},d={transform:"translate(".concat(a/2*-1," -256)")};return{outer:r,inner:m,path:d}}function Ia(t){let{transform:e,width:n=$t,height:a=$t,startCentered:r=!1}=t,s="";return r&&en?s+="translate(".concat(e.x/G-n/2,"em, ").concat(e.y/G-a/2,"em) "):r?s+="translate(calc(-50% + ".concat(e.x/G,"em), calc(-50% + ").concat(e.y/G,"em)) "):s+="translate(".concat(e.x/G,"em, ").concat(e.y/G,"em) "),s+="scale(".concat(e.size/G*(e.flipX?-1:1),", ").concat(e.size/G*(e.flipY?-1:1),") "),s+="rotate(".concat(e.rotate,"deg) "),s}var Ta=`:root, :host {
  --fa-font-solid: normal 900 1em/1 "Font Awesome 6 Free";
  --fa-font-regular: normal 400 1em/1 "Font Awesome 6 Free";
  --fa-font-light: normal 300 1em/1 "Font Awesome 6 Pro";
  --fa-font-thin: normal 100 1em/1 "Font Awesome 6 Pro";
  --fa-font-duotone: normal 900 1em/1 "Font Awesome 6 Duotone";
  --fa-font-duotone-regular: normal 400 1em/1 "Font Awesome 6 Duotone";
  --fa-font-duotone-light: normal 300 1em/1 "Font Awesome 6 Duotone";
  --fa-font-duotone-thin: normal 100 1em/1 "Font Awesome 6 Duotone";
  --fa-font-brands: normal 400 1em/1 "Font Awesome 6 Brands";
  --fa-font-sharp-solid: normal 900 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-regular: normal 400 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-light: normal 300 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-thin: normal 100 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-duotone-solid: normal 900 1em/1 "Font Awesome 6 Sharp Duotone";
  --fa-font-sharp-duotone-regular: normal 400 1em/1 "Font Awesome 6 Sharp Duotone";
  --fa-font-sharp-duotone-light: normal 300 1em/1 "Font Awesome 6 Sharp Duotone";
  --fa-font-sharp-duotone-thin: normal 100 1em/1 "Font Awesome 6 Sharp Duotone";
}

svg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {
  overflow: visible;
  box-sizing: content-box;
}

.svg-inline--fa {
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285705em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left {
  margin-right: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-pull-right {
  margin-left: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  top: 0.25em;
}
.svg-inline--fa.fa-fw {
  width: var(--fa-fw-width, 1.25em);
}

.fa-layers svg.svg-inline--fa {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: 1em;
}
.fa-layers svg.svg-inline--fa {
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: 0.625em;
  line-height: 0.1em;
  vertical-align: 0.225em;
}

.fa-xs {
  font-size: 0.75em;
  line-height: 0.0833333337em;
  vertical-align: 0.125em;
}

.fa-sm {
  font-size: 0.875em;
  line-height: 0.0714285718em;
  vertical-align: 0.0535714295em;
}

.fa-lg {
  font-size: 1.25em;
  line-height: 0.05em;
  vertical-align: -0.075em;
}

.fa-xl {
  font-size: 1.5em;
  line-height: 0.0416666682em;
  vertical-align: -0.125em;
}

.fa-2xl {
  font-size: 2em;
  line-height: 0.03125em;
  vertical-align: -0.1875em;
}

.fa-fw {
  text-align: center;
  width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-left: var(--fa-li-margin, 2.5em);
  padding-left: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  left: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.08em);
  padding: var(--fa-border-padding, 0.2em 0.25em 0.15em);
}

.fa-pull-left {
  float: left;
  margin-right: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right {
  float: right;
  margin-left: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
.fa-bounce,
.fa-fade,
.fa-beat-fade,
.fa-flip,
.fa-pulse,
.fa-shake,
.fa-spin,
.fa-spin-pulse {
    animation-delay: -1ms;
    animation-duration: 1ms;
    animation-iteration-count: 1;
    transition-delay: 0s;
    transition-duration: 0s;
  }
}
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.fa-stack {
  display: inline-block;
  vertical-align: middle;
  height: 2em;
  position: relative;
  width: 2.5em;
}

.fa-stack-1x,
.fa-stack-2x {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  z-index: var(--fa-stack-z-index, auto);
}

.svg-inline--fa.fa-stack-1x {
  height: 1em;
  width: 1.25em;
}
.svg-inline--fa.fa-stack-2x {
  height: 2em;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.sr-only,
.fa-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable:not(:focus),
.fa-sr-only-focusable:not(:focus) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}`;function pn(){const t=on,e=cn,n=p.cssPrefix,a=p.replacementClass;let r=Ta;if(n!==t||a!==e){const s=new RegExp("\\.".concat(t,"\\-"),"g"),i=new RegExp("\\--".concat(t,"\\-"),"g"),c=new RegExp("\\.".concat(e),"g");r=r.replace(s,".".concat(n,"-")).replace(i,"--".concat(n,"-")).replace(c,".".concat(a))}return r}let Pe=!1;function Rt(){p.autoAddCss&&!Pe&&(_a(pn()),Pe=!0)}var Ra={mixout(){return{dom:{css:pn,insertCss:Rt}}},hooks(){return{beforeDOMElementCreation(){Rt()},beforeI2svg(){Rt()}}}};const H=B||{};H[W]||(H[W]={});H[W].styles||(H[W].styles={});H[W].hooks||(H[W].hooks={});H[W].shims||(H[W].shims=[]);var U=H[W];const hn=[],gn=function(){A.removeEventListener("DOMContentLoaded",gn),At=1,hn.map(t=>t())};let At=!1;V&&(At=(A.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(A.readyState),At||A.addEventListener("DOMContentLoaded",gn));function Fa(t){V&&(At?setTimeout(t,0):hn.push(t))}function ht(t){const{tag:e,attributes:n={},children:a=[]}=t;return typeof t=="string"?dn(t):"<".concat(e," ").concat(Na(n),">").concat(a.map(ht).join(""),"</").concat(e,">")}function _e(t,e,n){if(t&&t[e]&&t[e][n])return{prefix:e,iconName:n,icon:t[e][n]}}var Ft=function(e,n,a,r){var s=Object.keys(e),i=s.length,c=n,m,d,u;for(a===void 0?(m=1,u=e[s[0]]):(m=0,u=a);m<i;m++)d=s[m],u=c(u,e[d],d,e);return u};function Da(t){const e=[];let n=0;const a=t.length;for(;n<a;){const r=t.charCodeAt(n++);if(r>=55296&&r<=56319&&n<a){const s=t.charCodeAt(n++);(s&64512)==56320?e.push(((r&1023)<<10)+(s&1023)+65536):(e.push(r),n--)}else e.push(r)}return e}function Bt(t){const e=Da(t);return e.length===1?e[0].toString(16):null}function ja(t,e){const n=t.length;let a=t.charCodeAt(e),r;return a>=55296&&a<=56319&&n>e+1&&(r=t.charCodeAt(e+1),r>=56320&&r<=57343)?(a-55296)*1024+r-56320+65536:a}function ze(t){return Object.keys(t).reduce((e,n)=>{const a=t[n];return!!a.icon?e[a.iconName]=a.icon:e[n]=a,e},{})}function qt(t,e){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};const{skipHooks:a=!1}=n,r=ze(e);typeof U.hooks.addPack=="function"&&!a?U.hooks.addPack(t,ze(e)):U.styles[t]=l(l({},U.styles[t]||{}),r),t==="fas"&&qt("fa",e)}const{styles:mt,shims:Ua}=U,yn=Object.keys(ie),Ya=yn.reduce((t,e)=>(t[e]=Object.keys(ie[e]),t),{});let fe=null,bn={},vn={},xn={},Ln={},Sn={};function $a(t){return~wa.indexOf(t)}function Wa(t,e){const n=e.split("-"),a=n[0],r=n.slice(1).join("-");return a===t&&r!==""&&!$a(r)?r:null}const Cn=()=>{const t=a=>Ft(mt,(r,s,i)=>(r[i]=Ft(s,a,{}),r),{});bn=t((a,r,s)=>(r[3]&&(a[r[3]]=s),r[2]&&r[2].filter(c=>typeof c=="number").forEach(c=>{a[c.toString(16)]=s}),a)),vn=t((a,r,s)=>(a[s]=s,r[2]&&r[2].filter(c=>typeof c=="string").forEach(c=>{a[c]=s}),a)),Sn=t((a,r,s)=>{const i=r[2];return a[s]=s,i.forEach(c=>{a[c]=s}),a});const e="far"in mt||p.autoFetchSvg,n=Ft(Ua,(a,r)=>{const s=r[0];let i=r[1];const c=r[2];return i==="far"&&!e&&(i="fas"),typeof s=="string"&&(a.names[s]={prefix:i,iconName:c}),typeof s=="number"&&(a.unicodes[s.toString(16)]={prefix:i,iconName:c}),a},{names:{},unicodes:{}});xn=n.names,Ln=n.unicodes,fe=Et(p.styleDefault,{family:p.familyDefault})};Pa(t=>{fe=Et(t.styleDefault,{family:p.familyDefault})});Cn();function ue(t,e){return(bn[t]||{})[e]}function Ha(t,e){return(vn[t]||{})[e]}function K(t,e){return(Sn[t]||{})[e]}function An(t){return xn[t]||{prefix:null,iconName:null}}function Va(t){const e=Ln[t],n=ue("fas",t);return e||(n?{prefix:"fas",iconName:n}:null)||{prefix:null,iconName:null}}function q(){return fe}const kn=()=>({prefix:null,iconName:null,rest:[]});function Ga(t){let e=I;const n=yn.reduce((a,r)=>(a[r]="".concat(p.cssPrefix,"-").concat(r),a),{});return rn.forEach(a=>{(t.includes(n[a])||t.some(r=>Ya[a].includes(r)))&&(e=a)}),e}function Et(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{family:n=I}=e,a=La[n][t];if(n===wt&&!t)return"fad";const r=Ee[n][t]||Ee[n][a],s=t in U.styles?t:null;return r||s||null}function Ba(t){let e=[],n=null;return t.forEach(a=>{const r=Wa(p.cssPrefix,a);r?n=r:a&&e.push(a)}),{iconName:n,rest:e}}function Ne(t){return t.sort().filter((e,n,a)=>a.indexOf(e)===n)}function Pt(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{skipLookups:n=!1}=e;let a=null;const r=Yt.concat(la),s=Ne(t.filter(h=>r.includes(h))),i=Ne(t.filter(h=>!Yt.includes(h))),c=s.filter(h=>(a=h,!an.includes(h))),[m=null]=c,d=Ga(s),u=l(l({},Ba(i)),{},{prefix:Et(m,{family:d})});return l(l(l({},u),Ja({values:t,family:d,styles:mt,config:p,canonical:u,givenPrefix:a})),qa(n,a,u))}function qa(t,e,n){let{prefix:a,iconName:r}=n;if(t||!a||!r)return{prefix:a,iconName:r};const s=e==="fa"?An(r):{},i=K(a,r);return r=s.iconName||i||r,a=s.prefix||a,a==="far"&&!mt.far&&mt.fas&&!p.autoFetchSvg&&(a="fas"),{prefix:a,iconName:r}}const Xa=rn.filter(t=>t!==I||t!==wt),Ka=Object.keys(Ut).filter(t=>t!==I).map(t=>Object.keys(Ut[t])).flat();function Ja(t){const{values:e,family:n,canonical:a,givenPrefix:r="",styles:s={},config:i={}}=t,c=n===wt,m=e.includes("fa-duotone")||e.includes("fad"),d=i.familyDefault==="duotone",u=a.prefix==="fad"||a.prefix==="fa-duotone";if(!c&&(m||d||u)&&(a.prefix="fad"),(e.includes("fa-brands")||e.includes("fab"))&&(a.prefix="fab"),!a.prefix&&Xa.includes(n)&&(Object.keys(s).find(g=>Ka.includes(g))||i.autoFetchSvg)){const g=ea.get(n).defaultShortPrefixId;a.prefix=g,a.iconName=K(a.prefix,a.iconName)||a.iconName}return(a.prefix==="fa"||r==="fa")&&(a.prefix=q()||"fas"),a}class Qa{constructor(){this.definitions={}}add(){for(var e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];const r=n.reduce(this._pullDefinitions,{});Object.keys(r).forEach(s=>{this.definitions[s]=l(l({},this.definitions[s]||{}),r[s]),qt(s,r[s]);const i=ie[I][s];i&&qt(i,r[s]),Cn()})}reset(){this.definitions={}}_pullDefinitions(e,n){const a=n.prefix&&n.iconName&&n.icon?{0:n}:n;return Object.keys(a).map(r=>{const{prefix:s,iconName:i,icon:c}=a[r],m=c[2];e[s]||(e[s]={}),m.length>0&&m.forEach(d=>{typeof d=="string"&&(e[s][d]=c)}),e[s][i]=c}),e}}let Oe=[],nt={};const at={},Za=Object.keys(at);function tr(t,e){let{mixoutsTo:n}=e;return Oe=t,nt={},Object.keys(at).forEach(a=>{Za.indexOf(a)===-1&&delete at[a]}),Oe.forEach(a=>{const r=a.mixout?a.mixout():{};if(Object.keys(r).forEach(s=>{typeof r[s]=="function"&&(n[s]=r[s]),typeof r[s]=="object"&&Object.keys(r[s]).forEach(i=>{n[s]||(n[s]={}),n[s][i]=r[s][i]})}),a.hooks){const s=a.hooks();Object.keys(s).forEach(i=>{nt[i]||(nt[i]=[]),nt[i].push(s[i])})}a.provides&&a.provides(at)}),n}function Xt(t,e){for(var n=arguments.length,a=new Array(n>2?n-2:0),r=2;r<n;r++)a[r-2]=arguments[r];return(nt[t]||[]).forEach(i=>{e=i.apply(null,[e,...a])}),e}function Q(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),a=1;a<e;a++)n[a-1]=arguments[a];(nt[t]||[]).forEach(s=>{s.apply(null,n)})}function X(){const t=arguments[0],e=Array.prototype.slice.call(arguments,1);return at[t]?at[t].apply(null,e):void 0}function Kt(t){t.prefix==="fa"&&(t.prefix="fas");let{iconName:e}=t;const n=t.prefix||q();if(e)return e=K(n,e)||e,_e(wn.definitions,n,e)||_e(U.styles,n,e)}const wn=new Qa,er=()=>{p.autoReplaceSvg=!1,p.observeMutations=!1,Q("noAuto")},nr={i2svg:function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return V?(Q("beforeI2svg",t),X("pseudoElements2svg",t),X("i2svg",t)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const{autoReplaceSvgRoot:e}=t;p.autoReplaceSvg===!1&&(p.autoReplaceSvg=!0),p.observeMutations=!0,Fa(()=>{rr({autoReplaceSvgRoot:e}),Q("watch",t)})}},ar={icon:t=>{if(t===null)return null;if(typeof t=="object"&&t.prefix&&t.iconName)return{prefix:t.prefix,iconName:K(t.prefix,t.iconName)||t.iconName};if(Array.isArray(t)&&t.length===2){const e=t[1].indexOf("fa-")===0?t[1].slice(3):t[1],n=Et(t[0]);return{prefix:n,iconName:K(n,e)||e}}if(typeof t=="string"&&(t.indexOf("".concat(p.cssPrefix,"-"))>-1||t.match(Sa))){const e=Pt(t.split(" "),{skipLookups:!0});return{prefix:e.prefix||q(),iconName:K(e.prefix,e.iconName)||e.iconName}}if(typeof t=="string"){const e=q();return{prefix:e,iconName:K(e,t)||t}}}},R={noAuto:er,config:p,dom:nr,parse:ar,library:wn,findIconDefinition:Kt,toHtml:ht},rr=function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const{autoReplaceSvgRoot:e=A}=t;(Object.keys(U.styles).length>0||p.autoFetchSvg)&&V&&p.autoReplaceSvg&&R.dom.i2svg({node:e})};function _t(t,e){return Object.defineProperty(t,"abstract",{get:e}),Object.defineProperty(t,"html",{get:function(){return t.abstract.map(n=>ht(n))}}),Object.defineProperty(t,"node",{get:function(){if(!V)return;const n=A.createElement("div");return n.innerHTML=t.html,n.children}}),t}function sr(t){let{children:e,main:n,mask:a,attributes:r,styles:s,transform:i}=t;if(le(i)&&n.found&&!a.found){const{width:c,height:m}=n,d={x:c/m/2,y:.5};r.style=Mt(l(l({},s),{},{"transform-origin":"".concat(d.x+i.x/16,"em ").concat(d.y+i.y/16,"em")}))}return[{tag:"svg",attributes:r,children:e}]}function or(t){let{prefix:e,iconName:n,children:a,attributes:r,symbol:s}=t;const i=s===!0?"".concat(e,"-").concat(p.cssPrefix,"-").concat(n):s;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:l(l({},r),{},{id:i}),children:a}]}]}function me(t){const{icons:{main:e,mask:n},prefix:a,iconName:r,transform:s,symbol:i,title:c,maskId:m,titleId:d,extra:u,watchable:h=!1}=t,{width:g,height:x}=n.found?n:e,z=oa.includes(a),N=[p.replacementClass,r?"".concat(p.cssPrefix,"-").concat(r):""].filter(b=>u.classes.indexOf(b)===-1).filter(b=>b!==""||!!b).concat(u.classes).join(" ");let S={children:[],attributes:l(l({},u.attributes),{},{"data-prefix":a,"data-icon":r,class:N,role:u.attributes.role||"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 ".concat(g," ").concat(x)})};const O=z&&!~u.classes.indexOf("fa-fw")?{width:"".concat(g/x*16*.0625,"em")}:{};h&&(S.attributes[J]=""),c&&(S.children.push({tag:"title",attributes:{id:S.attributes["aria-labelledby"]||"title-".concat(d||ut())},children:[c]}),delete S.attributes.title);const k=l(l({},S),{},{prefix:a,iconName:r,main:e,mask:n,maskId:m,transform:s,symbol:i,styles:l(l({},O),u.styles)}),{children:w,attributes:F}=n.found&&e.found?X("generateAbstractMask",k)||{children:[],attributes:{}}:X("generateAbstractIcon",k)||{children:[],attributes:{}};return k.children=w,k.attributes=F,i?or(k):sr(k)}function Ie(t){const{content:e,width:n,height:a,transform:r,title:s,extra:i,watchable:c=!1}=t,m=l(l(l({},i.attributes),s?{title:s}:{}),{},{class:i.classes.join(" ")});c&&(m[J]="");const d=l({},i.styles);le(r)&&(d.transform=Ia({transform:r,startCentered:!0,width:n,height:a}),d["-webkit-transform"]=d.transform);const u=Mt(d);u.length>0&&(m.style=u);const h=[];return h.push({tag:"span",attributes:m,children:[e]}),s&&h.push({tag:"span",attributes:{class:"sr-only"},children:[s]}),h}function ir(t){const{content:e,title:n,extra:a}=t,r=l(l(l({},a.attributes),n?{title:n}:{}),{},{class:a.classes.join(" ")}),s=Mt(a.styles);s.length>0&&(r.style=s);const i=[];return i.push({tag:"span",attributes:r,children:[e]}),n&&i.push({tag:"span",attributes:{class:"sr-only"},children:[n]}),i}const{styles:Dt}=U;function Jt(t){const e=t[0],n=t[1],[a]=t.slice(4);let r=null;return Array.isArray(a)?r={tag:"g",attributes:{class:"".concat(p.cssPrefix,"-").concat(Tt.GROUP)},children:[{tag:"path",attributes:{class:"".concat(p.cssPrefix,"-").concat(Tt.SECONDARY),fill:"currentColor",d:a[0]}},{tag:"path",attributes:{class:"".concat(p.cssPrefix,"-").concat(Tt.PRIMARY),fill:"currentColor",d:a[1]}}]}:r={tag:"path",attributes:{fill:"currentColor",d:a}},{found:!0,width:e,height:n,icon:r}}const cr={found:!1,width:512,height:512};function lr(t,e){!ln&&!p.showMissingIcons&&t&&console.error('Icon with name "'.concat(t,'" and prefix "').concat(e,'" is missing.'))}function Qt(t,e){let n=e;return e==="fa"&&p.styleDefault!==null&&(e=q()),new Promise((a,r)=>{if(n==="fa"){const s=An(t)||{};t=s.iconName||t,e=s.prefix||e}if(t&&e&&Dt[e]&&Dt[e][t]){const s=Dt[e][t];return a(Jt(s))}lr(t,e),a(l(l({},cr),{},{icon:p.showMissingIcons&&t?X("missingIconAbstract")||{}:{}}))})}const Te=()=>{},Zt=p.measurePerformance&&xt&&xt.mark&&xt.measure?xt:{mark:Te,measure:Te},it='FA "6.7.2"',fr=t=>(Zt.mark("".concat(it," ").concat(t," begins")),()=>Mn(t)),Mn=t=>{Zt.mark("".concat(it," ").concat(t," ends")),Zt.measure("".concat(it," ").concat(t),"".concat(it," ").concat(t," begins"),"".concat(it," ").concat(t," ends"))};var de={begin:fr,end:Mn};const St=()=>{};function Re(t){return typeof(t.getAttribute?t.getAttribute(J):null)=="string"}function ur(t){const e=t.getAttribute?t.getAttribute(se):null,n=t.getAttribute?t.getAttribute(oe):null;return e&&n}function mr(t){return t&&t.classList&&t.classList.contains&&t.classList.contains(p.replacementClass)}function dr(){return p.autoReplaceSvg===!0?Ct.replace:Ct[p.autoReplaceSvg]||Ct.replace}function pr(t){return A.createElementNS("http://www.w3.org/2000/svg",t)}function hr(t){return A.createElement(t)}function En(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{ceFn:n=t.tag==="svg"?pr:hr}=e;if(typeof t=="string")return A.createTextNode(t);const a=n(t.tag);return Object.keys(t.attributes||[]).forEach(function(s){a.setAttribute(s,t.attributes[s])}),(t.children||[]).forEach(function(s){a.appendChild(En(s,{ceFn:n}))}),a}function gr(t){let e=" ".concat(t.outerHTML," ");return e="".concat(e,"Font Awesome fontawesome.com "),e}const Ct={replace:function(t){const e=t[0];if(e.parentNode)if(t[1].forEach(n=>{e.parentNode.insertBefore(En(n),e)}),e.getAttribute(J)===null&&p.keepOriginalSource){let n=A.createComment(gr(e));e.parentNode.replaceChild(n,e)}else e.remove()},nest:function(t){const e=t[0],n=t[1];if(~ce(e).indexOf(p.replacementClass))return Ct.replace(t);const a=new RegExp("".concat(p.cssPrefix,"-.*"));if(delete n[0].attributes.id,n[0].attributes.class){const s=n[0].attributes.class.split(" ").reduce((i,c)=>(c===p.replacementClass||c.match(a)?i.toSvg.push(c):i.toNode.push(c),i),{toNode:[],toSvg:[]});n[0].attributes.class=s.toSvg.join(" "),s.toNode.length===0?e.removeAttribute("class"):e.setAttribute("class",s.toNode.join(" "))}const r=n.map(s=>ht(s)).join(`
`);e.setAttribute(J,""),e.innerHTML=r}};function Fe(t){t()}function Pn(t,e){const n=typeof e=="function"?e:St;if(t.length===0)n();else{let a=Fe;p.mutateApproach===va&&(a=B.requestAnimationFrame||Fe),a(()=>{const r=dr(),s=de.begin("mutate");t.map(r),s(),n()})}}let pe=!1;function _n(){pe=!0}function te(){pe=!1}let kt=null;function De(t){if(!Ae||!p.observeMutations)return;const{treeCallback:e=St,nodeCallback:n=St,pseudoElementsCallback:a=St,observeMutationsRoot:r=A}=t;kt=new Ae(s=>{if(pe)return;const i=q();st(s).forEach(c=>{if(c.type==="childList"&&c.addedNodes.length>0&&!Re(c.addedNodes[0])&&(p.searchPseudoElements&&a(c.target),e(c.target)),c.type==="attributes"&&c.target.parentNode&&p.searchPseudoElements&&a(c.target.parentNode),c.type==="attributes"&&Re(c.target)&&~ka.indexOf(c.attributeName))if(c.attributeName==="class"&&ur(c.target)){const{prefix:m,iconName:d}=Pt(ce(c.target));c.target.setAttribute(se,m||i),d&&c.target.setAttribute(oe,d)}else mr(c.target)&&n(c.target)})}),V&&kt.observe(r,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}function yr(){kt&&kt.disconnect()}function br(t){const e=t.getAttribute("style");let n=[];return e&&(n=e.split(";").reduce((a,r)=>{const s=r.split(":"),i=s[0],c=s.slice(1);return i&&c.length>0&&(a[i]=c.join(":").trim()),a},{})),n}function vr(t){const e=t.getAttribute("data-prefix"),n=t.getAttribute("data-icon"),a=t.innerText!==void 0?t.innerText.trim():"";let r=Pt(ce(t));return r.prefix||(r.prefix=q()),e&&n&&(r.prefix=e,r.iconName=n),r.iconName&&r.prefix||(r.prefix&&a.length>0&&(r.iconName=Ha(r.prefix,t.innerText)||ue(r.prefix,Bt(t.innerText))),!r.iconName&&p.autoFetchSvg&&t.firstChild&&t.firstChild.nodeType===Node.TEXT_NODE&&(r.iconName=t.firstChild.data)),r}function xr(t){const e=st(t.attributes).reduce((r,s)=>(r.name!=="class"&&r.name!=="style"&&(r[s.name]=s.value),r),{}),n=t.getAttribute("title"),a=t.getAttribute("data-fa-title-id");return p.autoA11y&&(n?e["aria-labelledby"]="".concat(p.replacementClass,"-title-").concat(a||ut()):(e["aria-hidden"]="true",e.focusable="false")),e}function Lr(){return{iconName:null,title:null,titleId:null,prefix:null,transform:j,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function je(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0};const{iconName:n,prefix:a,rest:r}=vr(t),s=xr(t),i=Xt("parseNodeAttributes",{},t);let c=e.styleParser?br(t):[];return l({iconName:n,title:t.getAttribute("title"),titleId:t.getAttribute("data-fa-title-id"),prefix:a,transform:j,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:r,styles:c,attributes:s}},i)}const{styles:Sr}=U;function zn(t){const e=p.autoReplaceSvg==="nest"?je(t,{styleParser:!1}):je(t);return~e.extra.classes.indexOf(un)?X("generateLayersText",t,e):X("generateSvgReplacementMutation",t,e)}function Cr(){return[...aa,...Yt]}function Ue(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!V)return Promise.resolve();const n=A.documentElement.classList,a=u=>n.add("".concat(Me,"-").concat(u)),r=u=>n.remove("".concat(Me,"-").concat(u)),s=p.autoFetchSvg?Cr():an.concat(Object.keys(Sr));s.includes("fa")||s.push("fa");const i=[".".concat(un,":not([").concat(J,"])")].concat(s.map(u=>".".concat(u,":not([").concat(J,"])"))).join(", ");if(i.length===0)return Promise.resolve();let c=[];try{c=st(t.querySelectorAll(i))}catch{}if(c.length>0)a("pending"),r("complete");else return Promise.resolve();const m=de.begin("onTree"),d=c.reduce((u,h)=>{try{const g=zn(h);g&&u.push(g)}catch(g){ln||g.name==="MissingIcon"&&console.error(g)}return u},[]);return new Promise((u,h)=>{Promise.all(d).then(g=>{Pn(g,()=>{a("active"),a("complete"),r("pending"),typeof e=="function"&&e(),m(),u()})}).catch(g=>{m(),h(g)})})}function Ar(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;zn(t).then(n=>{n&&Pn([n],e)})}function kr(t){return function(e){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const a=(e||{}).icon?e:Kt(e||{});let{mask:r}=n;return r&&(r=(r||{}).icon?r:Kt(r||{})),t(a,l(l({},n),{},{mask:r}))}}const wr=function(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{transform:n=j,symbol:a=!1,mask:r=null,maskId:s=null,title:i=null,titleId:c=null,classes:m=[],attributes:d={},styles:u={}}=e;if(!t)return;const{prefix:h,iconName:g,icon:x}=t;return _t(l({type:"icon"},t),()=>(Q("beforeDOMElementCreation",{iconDefinition:t,params:e}),p.autoA11y&&(i?d["aria-labelledby"]="".concat(p.replacementClass,"-title-").concat(c||ut()):(d["aria-hidden"]="true",d.focusable="false")),me({icons:{main:Jt(x),mask:r?Jt(r.icon):{found:!1,width:null,height:null,icon:{}}},prefix:h,iconName:g,transform:l(l({},j),n),symbol:a,title:i,maskId:s,titleId:c,extra:{attributes:d,styles:u,classes:m}})))};var Mr={mixout(){return{icon:kr(wr)}},hooks(){return{mutationObserverCallbacks(t){return t.treeCallback=Ue,t.nodeCallback=Ar,t}}},provides(t){t.i2svg=function(e){const{node:n=A,callback:a=()=>{}}=e;return Ue(n,a)},t.generateSvgReplacementMutation=function(e,n){const{iconName:a,title:r,titleId:s,prefix:i,transform:c,symbol:m,mask:d,maskId:u,extra:h}=n;return new Promise((g,x)=>{Promise.all([Qt(a,i),d.iconName?Qt(d.iconName,d.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(z=>{let[N,S]=z;g([e,me({icons:{main:N,mask:S},prefix:i,iconName:a,transform:c,symbol:m,maskId:u,title:r,titleId:s,extra:h,watchable:!0})])}).catch(x)})},t.generateAbstractIcon=function(e){let{children:n,attributes:a,main:r,transform:s,styles:i}=e;const c=Mt(i);c.length>0&&(a.style=c);let m;return le(s)&&(m=X("generateAbstractTransformGrouping",{main:r,transform:s,containerWidth:r.width,iconWidth:r.width})),n.push(m||r.icon),{children:n,attributes:a}}}},Er={mixout(){return{layer(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{classes:n=[]}=e;return _t({type:"layer"},()=>{Q("beforeDOMElementCreation",{assembler:t,params:e});let a=[];return t(r=>{Array.isArray(r)?r.map(s=>{a=a.concat(s.abstract)}):a=a.concat(r.abstract)}),[{tag:"span",attributes:{class:["".concat(p.cssPrefix,"-layers"),...n].join(" ")},children:a}]})}}}},Pr={mixout(){return{counter(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{title:n=null,classes:a=[],attributes:r={},styles:s={}}=e;return _t({type:"counter",content:t},()=>(Q("beforeDOMElementCreation",{content:t,params:e}),ir({content:t.toString(),title:n,extra:{attributes:r,styles:s,classes:["".concat(p.cssPrefix,"-layers-counter"),...a]}})))}}}},_r={mixout(){return{text(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{transform:n=j,title:a=null,classes:r=[],attributes:s={},styles:i={}}=e;return _t({type:"text",content:t},()=>(Q("beforeDOMElementCreation",{content:t,params:e}),Ie({content:t,transform:l(l({},j),n),title:a,extra:{attributes:s,styles:i,classes:["".concat(p.cssPrefix,"-layers-text"),...r]}})))}}},provides(t){t.generateLayersText=function(e,n){const{title:a,transform:r,extra:s}=n;let i=null,c=null;if(en){const m=parseInt(getComputedStyle(e).fontSize,10),d=e.getBoundingClientRect();i=d.width/m,c=d.height/m}return p.autoA11y&&!a&&(s.attributes["aria-hidden"]="true"),Promise.resolve([e,Ie({content:e.innerHTML,width:i,height:c,transform:r,title:a,extra:s,watchable:!0})])}}};const zr=new RegExp('"',"ug"),Ye=[1105920,1112319],$e=l(l(l(l({},{FontAwesome:{normal:"fas",400:"fas"}}),ta),ya),fa),ee=Object.keys($e).reduce((t,e)=>(t[e.toLowerCase()]=$e[e],t),{}),Nr=Object.keys(ee).reduce((t,e)=>{const n=ee[e];return t[e]=n[900]||[...Object.entries(n)][0][1],t},{});function Or(t){const e=t.replace(zr,""),n=ja(e,0),a=n>=Ye[0]&&n<=Ye[1],r=e.length===2?e[0]===e[1]:!1;return{value:Bt(r?e[0]:e),isSecondary:a||r}}function Ir(t,e){const n=t.replace(/^['"]|['"]$/g,"").toLowerCase(),a=parseInt(e),r=isNaN(a)?"normal":a;return(ee[n]||{})[r]||Nr[n]}function We(t,e){const n="".concat(ba).concat(e.replace(":","-"));return new Promise((a,r)=>{if(t.getAttribute(n)!==null)return a();const i=st(t.children).filter(g=>g.getAttribute(Wt)===e)[0],c=B.getComputedStyle(t,e),m=c.getPropertyValue("font-family"),d=m.match(Ca),u=c.getPropertyValue("font-weight"),h=c.getPropertyValue("content");if(i&&!d)return t.removeChild(i),a();if(d&&h!=="none"&&h!==""){const g=c.getPropertyValue("content");let x=Ir(m,u);const{value:z,isSecondary:N}=Or(g),S=d[0].startsWith("FontAwesome");let O=ue(x,z),k=O;if(S){const w=Va(z);w.iconName&&w.prefix&&(O=w.iconName,x=w.prefix)}if(O&&!N&&(!i||i.getAttribute(se)!==x||i.getAttribute(oe)!==k)){t.setAttribute(n,k),i&&t.removeChild(i);const w=Lr(),{extra:F}=w;F.attributes[Wt]=e,Qt(O,x).then(b=>{const Z=me(l(l({},w),{},{icons:{main:b,mask:kn()},prefix:x,iconName:k,extra:F,watchable:!0})),tt=A.createElementNS("http://www.w3.org/2000/svg","svg");e==="::before"?t.insertBefore(tt,t.firstChild):t.appendChild(tt),tt.outerHTML=Z.map(gt=>ht(gt)).join(`
`),t.removeAttribute(n),a()}).catch(r)}else a()}else a()})}function Tr(t){return Promise.all([We(t,"::before"),We(t,"::after")])}function Rr(t){return t.parentNode!==document.head&&!~xa.indexOf(t.tagName.toUpperCase())&&!t.getAttribute(Wt)&&(!t.parentNode||t.parentNode.tagName!=="svg")}function He(t){if(V)return new Promise((e,n)=>{const a=st(t.querySelectorAll("*")).filter(Rr).map(Tr),r=de.begin("searchPseudoElements");_n(),Promise.all(a).then(()=>{r(),te(),e()}).catch(()=>{r(),te(),n()})})}var Fr={hooks(){return{mutationObserverCallbacks(t){return t.pseudoElementsCallback=He,t}}},provides(t){t.pseudoElements2svg=function(e){const{node:n=A}=e;p.searchPseudoElements&&He(n)}}};let Ve=!1;var Dr={mixout(){return{dom:{unwatch(){_n(),Ve=!0}}}},hooks(){return{bootstrap(){De(Xt("mutationObserverCallbacks",{}))},noAuto(){yr()},watch(t){const{observeMutationsRoot:e}=t;Ve?te():De(Xt("mutationObserverCallbacks",{observeMutationsRoot:e}))}}}};const Ge=t=>{let e={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return t.toLowerCase().split(" ").reduce((n,a)=>{const r=a.toLowerCase().split("-"),s=r[0];let i=r.slice(1).join("-");if(s&&i==="h")return n.flipX=!0,n;if(s&&i==="v")return n.flipY=!0,n;if(i=parseFloat(i),isNaN(i))return n;switch(s){case"grow":n.size=n.size+i;break;case"shrink":n.size=n.size-i;break;case"left":n.x=n.x-i;break;case"right":n.x=n.x+i;break;case"up":n.y=n.y-i;break;case"down":n.y=n.y+i;break;case"rotate":n.rotate=n.rotate+i;break}return n},e)};var jr={mixout(){return{parse:{transform:t=>Ge(t)}}},hooks(){return{parseNodeAttributes(t,e){const n=e.getAttribute("data-fa-transform");return n&&(t.transform=Ge(n)),t}}},provides(t){t.generateAbstractTransformGrouping=function(e){let{main:n,transform:a,containerWidth:r,iconWidth:s}=e;const i={transform:"translate(".concat(r/2," 256)")},c="translate(".concat(a.x*32,", ").concat(a.y*32,") "),m="scale(".concat(a.size/16*(a.flipX?-1:1),", ").concat(a.size/16*(a.flipY?-1:1),") "),d="rotate(".concat(a.rotate," 0 0)"),u={transform:"".concat(c," ").concat(m," ").concat(d)},h={transform:"translate(".concat(s/2*-1," -256)")},g={outer:i,inner:u,path:h};return{tag:"g",attributes:l({},g.outer),children:[{tag:"g",attributes:l({},g.inner),children:[{tag:n.icon.tag,children:n.icon.children,attributes:l(l({},n.icon.attributes),g.path)}]}]}}}};const jt={x:0,y:0,width:"100%",height:"100%"};function Be(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return t.attributes&&(t.attributes.fill||e)&&(t.attributes.fill="black"),t}function Ur(t){return t.tag==="g"?t.children:[t]}var Yr={hooks(){return{parseNodeAttributes(t,e){const n=e.getAttribute("data-fa-mask"),a=n?Pt(n.split(" ").map(r=>r.trim())):kn();return a.prefix||(a.prefix=q()),t.mask=a,t.maskId=e.getAttribute("data-fa-mask-id"),t}}},provides(t){t.generateAbstractMask=function(e){let{children:n,attributes:a,main:r,mask:s,maskId:i,transform:c}=e;const{width:m,icon:d}=r,{width:u,icon:h}=s,g=Oa({transform:c,containerWidth:u,iconWidth:m}),x={tag:"rect",attributes:l(l({},jt),{},{fill:"white"})},z=d.children?{children:d.children.map(Be)}:{},N={tag:"g",attributes:l({},g.inner),children:[Be(l({tag:d.tag,attributes:l(l({},d.attributes),g.path)},z))]},S={tag:"g",attributes:l({},g.outer),children:[N]},O="mask-".concat(i||ut()),k="clip-".concat(i||ut()),w={tag:"mask",attributes:l(l({},jt),{},{id:O,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[x,S]},F={tag:"defs",children:[{tag:"clipPath",attributes:{id:k},children:Ur(h)},w]};return n.push(F,{tag:"rect",attributes:l({fill:"currentColor","clip-path":"url(#".concat(k,")"),mask:"url(#".concat(O,")")},jt)}),{children:n,attributes:a}}}},$r={provides(t){let e=!1;B.matchMedia&&(e=B.matchMedia("(prefers-reduced-motion: reduce)").matches),t.missingIconAbstract=function(){const n=[],a={fill:"currentColor"},r={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};n.push({tag:"path",attributes:l(l({},a),{},{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});const s=l(l({},r),{},{attributeName:"opacity"}),i={tag:"circle",attributes:l(l({},a),{},{cx:"256",cy:"364",r:"28"}),children:[]};return e||i.children.push({tag:"animate",attributes:l(l({},r),{},{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:l(l({},s),{},{values:"1;0;1;1;0;1;"})}),n.push(i),n.push({tag:"path",attributes:l(l({},a),{},{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:e?[]:[{tag:"animate",attributes:l(l({},s),{},{values:"1;0;0;0;0;1;"})}]}),e||n.push({tag:"path",attributes:l(l({},a),{},{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:l(l({},s),{},{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:n}}}},Wr={hooks(){return{parseNodeAttributes(t,e){const n=e.getAttribute("data-fa-symbol"),a=n===null?!1:n===""?!0:n;return t.symbol=a,t}}}},Hr=[Ra,Mr,Er,Pr,_r,Fr,Dr,jr,Yr,$r,Wr];tr(Hr,{mixoutsTo:R});R.noAuto;const dt=R.config,Es=R.library;R.dom;const Nn=R.parse;R.findIconDefinition;R.toHtml;const Vr=R.icon;R.layer;R.text;R.counter;/*!
 * Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 * Copyright 2024 Fonticons, Inc.
 */const Ps={prefix:"fas",iconName:"stethoscope",icon:[576,512,[129658],"f0f1","M142.4 21.9c5.6 16.8-3.5 34.9-20.2 40.5L96 71.1 96 192c0 53 43 96 96 96s96-43 96-96l0-120.9-26.1-8.7c-16.8-5.6-25.8-23.7-20.2-40.5s23.7-25.8 40.5-20.2l26.1 8.7C334.4 19.1 352 43.5 352 71.1L352 192c0 77.2-54.6 141.6-127.3 156.7C231 404.6 278.4 448 336 448c61.9 0 112-50.1 112-112l0-70.7c-28.3-12.3-48-40.5-48-73.3c0-44.2 35.8-80 80-80s80 35.8 80 80c0 32.8-19.7 61-48 73.3l0 70.7c0 97.2-78.8 176-176 176c-92.9 0-168.9-71.9-175.5-163.1C87.2 334.2 32 269.6 32 192L32 71.1c0-27.5 17.6-52 43.8-60.7l26.1-8.7c16.8-5.6 34.9 3.5 40.5 20.2zM480 224a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"]},_s={prefix:"fas",iconName:"table",icon:[512,512,[],"f0ce","M64 256l0-96 160 0 0 96L64 256zm0 64l160 0 0 96L64 416l0-96zm224 96l0-96 160 0 0 96-160 0zM448 256l-160 0 0-96 160 0 0 96zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32z"]},zs={prefix:"fas",iconName:"bookmark",icon:[384,512,[128278,61591],"f02e","M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"]},Ns={prefix:"fas",iconName:"wand-magic-sparkles",icon:[576,512,["magic-wand-sparkles"],"e2ca","M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"]},Os={prefix:"fas",iconName:"user",icon:[448,512,[128100,62144],"f007","M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"]},Is={prefix:"fas",iconName:"ban",icon:[512,512,[128683,"cancel"],"f05e","M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"]},Ts={prefix:"fas",iconName:"star",icon:[576,512,[11088,61446],"f005","M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"]},Rs={prefix:"fas",iconName:"microchip",icon:[512,512,[],"f2db","M176 24c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c-35.3 0-64 28.7-64 64l-40 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l40 0 0 56-40 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l40 0 0 56-40 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l40 0c0 35.3 28.7 64 64 64l0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40 56 0 0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40 56 0 0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40c35.3 0 64-28.7 64-64l40 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-40 0 0-56 40 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-40 0 0-56 40 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-40 0c0-35.3-28.7-64-64-64l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40-56 0 0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40-56 0 0-40zM160 128l192 0c17.7 0 32 14.3 32 32l0 192c0 17.7-14.3 32-32 32l-192 0c-17.7 0-32-14.3-32-32l0-192c0-17.7 14.3-32 32-32zm192 32l-192 0 0 192 192 0 0-192z"]},Gr={prefix:"fas",iconName:"square-plus",icon:[448,512,[61846,"plus-square"],"f0fe","M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM200 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"]},Fs=Gr,Br={prefix:"fas",iconName:"circle-check",icon:[512,512,[61533,"check-circle"],"f058","M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"]},Ds=Br,js={prefix:"fas",iconName:"camera-retro",icon:[512,512,[128247],"f083","M220.6 121.2L271.1 96 448 96l0 96-114.8 0c-21.9-15.1-48.5-24-77.2-24s-55.2 8.9-77.2 24L64 192l0-64 128 0c9.9 0 19.7-2.3 28.6-6.8zM0 128L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L271.1 32c-9.9 0-19.7 2.3-28.6 6.8L192 64l-32 0 0-16c0-8.8-7.2-16-16-16L80 32c-8.8 0-16 7.2-16 16l0 16C28.7 64 0 92.7 0 128zM168 304a88 88 0 1 1 176 0 88 88 0 1 1 -176 0z"]},qr={prefix:"fas",iconName:"cloud-arrow-up",icon:[640,512,[62338,"cloud-upload","cloud-upload-alt"],"f0ee","M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128l-368 0zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39L296 392c0 13.3 10.7 24 24 24s24-10.7 24-24l0-134.1 39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"]},Us=qr,Xr={prefix:"fas",iconName:"shield-halved",icon:[512,512,["shield-alt"],"f3ed","M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8l0 378.1C394 378 431.1 230.1 432 141.4L256 66.8s0 0 0 0z"]},Ys=Xr,$s={prefix:"fas",iconName:"heart",icon:[512,512,[128153,128154,128155,128156,128420,129293,129294,129505,9829,10084,61578],"f004","M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"]},Ws={prefix:"fas",iconName:"tags",icon:[512,512,[],"f02c","M345 39.1L472.8 168.4c52.4 53 52.4 138.2 0 191.2L360.8 472.9c-9.3 9.4-24.5 9.5-33.9 .2s-9.5-24.5-.2-33.9L438.6 325.9c33.9-34.3 33.9-89.4 0-123.7L310.9 72.9c-9.3-9.4-9.2-24.6 .2-33.9s24.6-9.2 33.9 .2zM0 229.5L0 80C0 53.5 21.5 32 48 32l149.5 0c17 0 33.3 6.7 45.3 18.7l168 168c25 25 25 65.5 0 90.5L277.3 442.7c-25 25-65.5 25-90.5 0l-168-168C6.7 262.7 0 246.5 0 229.5zM144 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"]},Kr={prefix:"fas",iconName:"arrow-rotate-right",icon:[512,512,[8635,"arrow-right-rotate","arrow-rotate-forward","redo"],"f01e","M386.3 160L336 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z"]},Hs=Kr,Vs={prefix:"fas",iconName:"satellite",icon:[512,512,[128752],"f7bf","M233 7c-9.4-9.4-24.6-9.4-33.9 0l-96 96c-9.4 9.4-9.4 24.6 0 33.9l89.4 89.4-15.5 15.5C152.3 230.4 124.9 224 96 224c-31.7 0-61.5 7.7-87.8 21.2c-9 4.7-10.3 16.7-3.1 23.8L112.7 376.7 96.3 393.1c-2.6-.7-5.4-1.1-8.3-1.1c-17.7 0-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32c0-2.9-.4-5.6-1.1-8.3l16.4-16.4L242.9 506.9c7.2 7.2 19.2 5.9 23.8-3.1C280.3 477.5 288 447.7 288 416c0-28.9-6.4-56.3-17.8-80.9l15.5-15.5L375 409c9.4 9.4 24.6 9.4 33.9 0l96-96c9.4-9.4 9.4-24.6 0-33.9l-89.4-89.4 55-55c12.5-12.5 12.5-32.8 0-45.3l-48-48c-12.5-12.5-32.8-12.5-45.3 0l-55 55L233 7zm159 351l-72.4-72.4 62.1-62.1L454.1 296 392 358.1zM226.3 192.4L153.9 120 216 57.9l72.4 72.4-62.1 62.1z"]},Gs={prefix:"fas",iconName:"comment",icon:[512,512,[128489,61669],"f075","M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c0 0 0 0 0 0s0 0 0 0s0 0 0 0c0 0 0 0 0 0l.3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"]},Bs={prefix:"fas",iconName:"camera",icon:[512,512,[62258,"camera-alt"],"f030","M149.1 64.8L138.7 96 64 96C28.7 96 0 124.7 0 160L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64l-74.7 0L362.9 64.8C356.4 45.2 338.1 32 317.4 32L194.6 32c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"]},Jr={prefix:"fas",iconName:"crop-simple",icon:[512,512,["crop-alt"],"f565","M128 32c0-17.7-14.3-32-32-32S64 14.3 64 32l0 32L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l32 0 0 256c0 35.3 28.7 64 64 64l224 0 0-64-224 0 0-352zM384 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-32 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0 0-256c0-35.3-28.7-64-64-64L160 64l0 64 224 0 0 352z"]},qs=Jr,Qr={prefix:"fas",iconName:"gear",icon:[512,512,[9881,"cog"],"f013","M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"]},Xs=Qr,Ks={prefix:"fas",iconName:"clock",icon:[512,512,[128339,"clock-four"],"f017","M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"]},Zr={prefix:"fas",iconName:"sliders",icon:[512,512,["sliders-h"],"f1de","M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"]},Js=Zr,Qs={prefix:"fas",iconName:"flask",icon:[448,512,[],"f0c3","M288 0L160 0 128 0C110.3 0 96 14.3 96 32s14.3 32 32 32l0 132.8c0 11.8-3.3 23.5-9.5 33.5L10.3 406.2C3.6 417.2 0 429.7 0 442.6C0 480.9 31.1 512 69.4 512l309.2 0c38.3 0 69.4-31.1 69.4-69.4c0-12.8-3.6-25.4-10.3-36.4L329.5 230.4c-6.2-10.1-9.5-21.7-9.5-33.5L320 64c17.7 0 32-14.3 32-32s-14.3-32-32-32L288 0zM192 196.8L192 64l64 0 0 132.8c0 23.7 6.6 46.9 19 67.1L309.5 320l-171 0L173 263.9c12.4-20.2 19-43.4 19-67.1z"]},Zs={prefix:"fas",iconName:"power-off",icon:[512,512,[9211],"f011","M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 224c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z"]},to={prefix:"fas",iconName:"images",icon:[576,512,[],"f302","M160 32c-35.3 0-64 28.7-64 64l0 224c0 35.3 28.7 64 64 64l352 0c35.3 0 64-28.7 64-64l0-224c0-35.3-28.7-64-64-64L160 32zM396 138.7l96 144c4.9 7.4 5.4 16.8 1.2 24.6S480.9 320 472 320l-144 0-48 0-80 0c-9.2 0-17.6-5.3-21.6-13.6s-2.9-18.2 2.9-25.4l64-80c4.6-5.7 11.4-9 18.7-9s14.2 3.3 18.7 9l17.3 21.6 56-84C360.5 132 368 128 376 128s15.5 4 20 10.7zM192 128a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM48 120c0-13.3-10.7-24-24-24S0 106.7 0 120L0 344c0 75.1 60.9 136 136 136l320 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-320 0c-48.6 0-88-39.4-88-88l0-224z"]},eo={prefix:"fas",iconName:"bolt",icon:[448,512,[9889,"zap"],"f0e7","M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288l111.5 0L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7l-111.5 0L349.4 44.6z"]},no={prefix:"fas",iconName:"sun",icon:[512,512,[9728],"f185","M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"]},ao={prefix:"fas",iconName:"user-lock",icon:[640,512,[],"f502","M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l362.8 0c-5.4-9.4-8.6-20.3-8.6-32l0-128c0-2.1 .1-4.2 .3-6.3c-31-26-71-41.7-114.6-41.7l-91.4 0zM528 240c17.7 0 32 14.3 32 32l0 48-64 0 0-48c0-17.7 14.3-32 32-32zm-80 32l0 48c-17.7 0-32 14.3-32 32l0 128c0 17.7 14.3 32 32 32l160 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32l0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80z"]},ro={prefix:"fas",iconName:"eraser",icon:[576,512,[],"f12d","M290.7 57.4L57.4 290.7c-25 25-25 65.5 0 90.5l80 80c12 12 28.3 18.7 45.3 18.7L288 480l9.4 0L512 480c17.7 0 32-14.3 32-32s-14.3-32-32-32l-124.1 0L518.6 285.3c25-25 25-65.5 0-90.5L381.3 57.4c-25-25-65.5-25-90.5 0zM297.4 416l-9.4 0-105.4 0-80-80L227.3 211.3 364.7 348.7 297.4 416z"]},ts={prefix:"fas",iconName:"earth-americas",icon:[512,512,[127758,"earth","earth-america","globe-americas"],"f57d","M57.7 193l9.4 16.4c8.3 14.5 21.9 25.2 38 29.8L163 255.7c17.2 4.9 29 20.6 29 38.5l0 39.9c0 11 6.2 21 16 25.9s16 14.9 16 25.9l0 39c0 15.6 14.9 26.9 29.9 22.6c16.1-4.6 28.6-17.5 32.7-33.8l2.8-11.2c4.2-16.9 15.2-31.4 30.3-40l8.1-4.6c15-8.5 24.2-24.5 24.2-41.7l0-8.3c0-12.7-5.1-24.9-14.1-33.9l-3.9-3.9c-9-9-21.2-14.1-33.9-14.1L257 256c-11.1 0-22.1-2.9-31.8-8.4l-34.5-19.7c-4.3-2.5-7.6-6.5-9.2-11.2c-3.2-9.6 1.1-20 10.2-24.5l5.9-3c6.6-3.3 14.3-3.9 21.3-1.5l23.2 7.7c8.2 2.7 17.2-.4 21.9-7.5c4.7-7 4.2-16.3-1.2-22.8l-13.6-16.3c-10-12-9.9-29.5 .3-41.3l15.7-18.3c8.8-10.3 10.2-25 3.5-36.7l-2.4-4.2c-3.5-.2-6.9-.3-10.4-.3C163.1 48 84.4 108.9 57.7 193zM464 256c0-36.8-9.6-71.4-26.4-101.5L412 164.8c-15.7 6.3-23.8 23.8-18.5 39.8l16.9 50.7c3.5 10.4 12 18.3 22.6 20.9l29.1 7.3c1.2-9 1.8-18.2 1.8-27.5zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"]},so=ts,oo={prefix:"fas",iconName:"link",icon:[640,512,[128279,"chain"],"f0c1","M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"]},io={prefix:"fas",iconName:"font",icon:[448,512,[],"f031","M254 52.8C249.3 40.3 237.3 32 224 32s-25.3 8.3-30 20.8L57.8 416 32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-1.8 0 18-48 159.6 0 18 48-1.8 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-25.8 0L254 52.8zM279.8 304l-111.6 0L224 155.1 279.8 304z"]},es={prefix:"fas",iconName:"magnifying-glass",icon:[512,512,[128269,"search"],"f002","M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"]},co=es,lo={prefix:"fas",iconName:"chevron-down",icon:[512,512,[],"f078","M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"]},fo={prefix:"fas",iconName:"plus",icon:[448,512,[10133,61543,"add"],"2b","M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"]},ns={prefix:"fas",iconName:"xmark",icon:[384,512,[128473,10005,10006,10060,215,"close","multiply","remove","times"],"f00d","M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"]},uo=ns,mo={prefix:"fas",iconName:"store",icon:[576,512,[],"f54e","M547.6 103.8L490.3 13.1C485.2 5 476.1 0 466.4 0L109.6 0C99.9 0 90.8 5 85.7 13.1L28.3 103.8c-29.6 46.8-3.4 111.9 51.9 119.4c4 .5 8.1 .8 12.1 .8c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.2 0 49.3-11.4 65.2-29c16 17.6 39.1 29 65.2 29c4.1 0 8.1-.3 12.1-.8c55.5-7.4 81.8-72.5 52.1-119.4zM499.7 254.9c0 0 0 0-.1 0c-5.3 .7-10.7 1.1-16.2 1.1c-12.4 0-24.3-1.9-35.4-5.3L448 384l-320 0 0-133.4c-11.2 3.5-23.2 5.4-35.6 5.4c-5.5 0-11-.4-16.3-1.1l-.1 0c-4.1-.6-8.1-1.3-12-2.3L64 384l0 64c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-64 0-131.4c-4 1-8 1.8-12.3 2.3z"]},po={prefix:"fas",iconName:"retweet",icon:[576,512,[],"f079","M272 416c17.7 0 32-14.3 32-32s-14.3-32-32-32l-112 0c-17.7 0-32-14.3-32-32l0-128 32 0c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-64-64c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8l32 0 0 128c0 53 43 96 96 96l112 0zM304 96c-17.7 0-32 14.3-32 32s14.3 32 32 32l112 0c17.7 0 32 14.3 32 32l0 128-32 0c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8l-32 0 0-128c0-53-43-96-96-96L304 96z"]},as={prefix:"fas",iconName:"face-smile",icon:[512,512,[128578,"smile"],"f118","M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM164.1 325.5C182 346.2 212.6 368 256 368s74-21.8 91.9-42.5c5.8-6.7 15.9-7.4 22.6-1.6s7.4 15.9 1.6 22.6C349.8 372.1 311.1 400 256 400s-93.8-27.9-116.1-53.5c-5.8-6.7-5.1-16.8 1.6-22.6s16.8-5.1 22.6 1.6zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"]},ho=as,rs={prefix:"fas",iconName:"rotate",icon:[512,512,[128260,"sync-alt"],"f2f1","M142.9 142.9c-17.5 17.5-30.1 38-37.8 59.8c-5.9 16.7-24.2 25.4-40.8 19.5s-25.4-24.2-19.5-40.8C55.6 150.7 73.2 122 97.6 97.6c87.2-87.2 228.3-87.5 315.8-1L455 55c6.9-6.9 17.2-8.9 26.2-5.2s14.8 12.5 14.8 22.2l0 128c0 13.3-10.7 24-24 24l-8.4 0c0 0 0 0 0 0L344 224c-9.7 0-18.5-5.8-22.2-14.8s-1.7-19.3 5.2-26.2l41.1-41.1c-62.6-61.5-163.1-61.2-225.3 1zM16 312c0-13.3 10.7-24 24-24l7.6 0 .7 0L168 288c9.7 0 18.5 5.8 22.2 14.8s1.7 19.3-5.2 26.2l-41.1 41.1c62.6 61.5 163.1 61.2 225.3-1c17.5-17.5 30.1-38 37.8-59.8c5.9-16.7 24.2-25.4 40.8-19.5s25.4 24.2 19.5 40.8c-10.8 30.6-28.4 59.3-52.9 83.8c-87.2 87.2-228.3 87.5-315.8 1L57 457c-6.9 6.9-17.2 8.9-26.2 5.2S16 449.7 16 440l0-119.6 0-.7 0-7.6z"]},go=rs,yo={prefix:"fas",iconName:"spinner",icon:[512,512,[],"f110","M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"]},bo={prefix:"fas",iconName:"robot",icon:[640,512,[129302],"f544","M320 0c17.7 0 32 14.3 32 32l0 64 120 0c39.8 0 72 32.2 72 72l0 272c0 39.8-32.2 72-72 72l-304 0c-39.8 0-72-32.2-72-72l0-272c0-39.8 32.2-72 72-72l120 0 0-64c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224l16 0 0 192-16 0c-26.5 0-48-21.5-48-48l0-96c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-16 0 0-192 16 0z"]},ss={prefix:"fas",iconName:"wand-magic",icon:[512,512,["magic"],"f0d0","M14.1 463.3c-18.7-18.7-18.7-49.1 0-67.9L395.4 14.1c18.7-18.7 49.1-18.7 67.9 0l34.6 34.6c18.7 18.7 18.7 49.1 0 67.9L116.5 497.9c-18.7 18.7-49.1 18.7-67.9 0L14.1 463.3zM347.6 187.6l105-105L429.4 59.3l-105 105 23.3 23.3z"]},vo=ss,os={prefix:"fas",iconName:"link-slash",icon:[640,512,["chain-broken","chain-slash","unlink"],"f127","M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L489.3 358.2l90.5-90.5c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114l-96 96-31.9-25C430.9 239.6 420.1 175.1 377 132c-52.2-52.3-134.5-56.2-191.3-11.7L38.8 5.1zM239 162c30.1-14.9 67.7-9.9 92.8 15.3c20 20 27.5 48.3 21.7 74.5L239 162zM406.6 416.4L220.9 270c-2.1 39.8 12.2 80.1 42.2 110c38.9 38.9 94.4 51 143.6 36.3zm-290-228.5L60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5l61.8-61.8-50.6-39.9z"]},xo=os,Lo={prefix:"fas",iconName:"check",icon:[448,512,[10003,10004],"f00c","M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"]},is={prefix:"fas",iconName:"triangle-exclamation",icon:[512,512,[9888,"exclamation-triangle","warning"],"f071","M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"]},So=is,Co={prefix:"fas",iconName:"database",icon:[448,512,[],"f1c0","M448 80l0 48c0 44.2-100.3 80-224 80S0 172.2 0 128L0 80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6L448 288c0 44.2-100.3 80-224 80S0 332.2 0 288L0 186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6l0 85.9c0 44.2-100.3 80-224 80S0 476.2 0 432l0-85.9z"]},Ao={prefix:"fas",iconName:"share",icon:[512,512,["mail-forward"],"f064","M307 34.8c-11.5 5.1-19 16.6-19 29.2l0 64-112 0C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96l96 0 0 64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z"]},ko={prefix:"fas",iconName:"paper-plane",icon:[512,512,[61913],"f1d8","M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480l0-83.6c0-4 1.5-7.8 4.2-10.8L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"]},cs={prefix:"fas",iconName:"circle-xmark",icon:[512,512,[61532,"times-circle","xmark-circle"],"f057","M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"]},wo=cs,Mo={prefix:"fas",iconName:"graduation-cap",icon:[640,512,[127891,"mortar-board"],"f19d","M320 32c-8.1 0-16.1 1.4-23.7 4.1L15.8 137.4C6.3 140.9 0 149.9 0 160s6.3 19.1 15.8 22.6l57.9 20.9C57.3 229.3 48 259.8 48 291.9l0 28.1c0 28.4-10.8 57.7-22.3 80.8c-6.5 13-13.9 25.8-22.5 37.6C0 442.7-.9 448.3 .9 453.4s6 8.9 11.2 10.2l64 16c4.2 1.1 8.7 .3 12.4-2s6.3-6.1 7.1-10.4c8.6-42.8 4.3-81.2-2.1-108.7C90.3 344.3 86 329.8 80 316.5l0-24.6c0-30.2 10.2-58.7 27.9-81.5c12.9-15.5 29.6-28 49.2-35.7l157-61.7c8.2-3.2 17.5 .8 20.7 9s-.8 17.5-9 20.7l-157 61.7c-12.4 4.9-23.3 12.4-32.2 21.6l159.6 57.6c7.6 2.7 15.6 4.1 23.7 4.1s16.1-1.4 23.7-4.1L624.2 182.6c9.5-3.4 15.8-12.5 15.8-22.6s-6.3-19.1-15.8-22.6L343.7 36.1C336.1 33.4 328.1 32 320 32zM128 408c0 35.3 86 72 192 72s192-36.7 192-72L496.7 262.6 354.5 314c-11.1 4-22.8 6-34.5 6s-23.5-2-34.5-6L143.3 262.6 128 408z"]};function ls(t){return t=t-0,t===t}function On(t){return ls(t)?t:(t=t.replace(/[_-]+(.)?/g,(e,n)=>n?n.toUpperCase():""),t.charAt(0).toLowerCase()+t.slice(1))}function fs(t){return t.charAt(0).toUpperCase()+t.slice(1)}var et=new Map,us=1e3;function ms(t){if(et.has(t))return et.get(t);const e={};let n=0;const a=t.length;for(;n<a;){const r=t.indexOf(";",n),s=r===-1?a:r,i=t.slice(n,s).trim();if(i){const c=i.indexOf(":");if(c>0){const m=i.slice(0,c).trim(),d=i.slice(c+1).trim();if(m&&d){const u=On(m);e[u.startsWith("webkit")?fs(u):u]=d}}}n=s+1}if(et.size===us){const r=et.keys().next().value;r&&et.delete(r)}return et.set(t,e),e}function In(t,e,n={}){if(typeof e=="string")return e;const a=(e.children||[]).map(u=>In(t,u)),r=e.attributes||{},s={};for(const[u,h]of Object.entries(r))switch(!0){case u==="class":{s.className=h;break}case u==="style":{s.style=ms(String(h));break}case u.startsWith("aria-"):case u.startsWith("data-"):{s[u.toLowerCase()]=h;break}default:s[On(u)]=h}const{style:i,role:c,"aria-label":m,...d}=n;return i&&(s.style=s.style?{...s.style,...i}:i),c&&(s.role=c),m&&(s["aria-label"]=m,s["aria-hidden"]="false"),t(e.tag,{...s,...d},...a)}var ds=In.bind(null,ae.createElement),qe=(t,e)=>{const n=ne.useId();return t||(e?n:void 0)},ps=class{constructor(t="react-fontawesome"){this.enabled=!1;let e=!1;try{e=typeof process<"u"&&!1}catch{}this.scope=t,this.enabled=e}log(...t){this.enabled&&console.log(`[${this.scope}]`,...t)}warn(...t){this.enabled&&console.warn(`[${this.scope}]`,...t)}error(...t){this.enabled&&console.error(`[${this.scope}]`,...t)}},hs="searchPseudoElementsFullScan"in dt?"7.0.0":"6.0.0",gs=Number.parseInt(hs)>=7,ft="fa",Y={beat:"fa-beat",fade:"fa-fade",beatFade:"fa-beat-fade",bounce:"fa-bounce",shake:"fa-shake",spin:"fa-spin",spinPulse:"fa-spin-pulse",spinReverse:"fa-spin-reverse",pulse:"fa-pulse"},ys={left:"fa-pull-left",right:"fa-pull-right"},bs={90:"fa-rotate-90",180:"fa-rotate-180",270:"fa-rotate-270"},vs={"2xs":"fa-2xs",xs:"fa-xs",sm:"fa-sm",lg:"fa-lg",xl:"fa-xl","2xl":"fa-2xl","1x":"fa-1x","2x":"fa-2x","3x":"fa-3x","4x":"fa-4x","5x":"fa-5x","6x":"fa-6x","7x":"fa-7x","8x":"fa-8x","9x":"fa-9x","10x":"fa-10x"},$={border:"fa-border",fixedWidth:"fa-fw",flip:"fa-flip",flipHorizontal:"fa-flip-horizontal",flipVertical:"fa-flip-vertical",inverse:"fa-inverse",rotateBy:"fa-rotate-by",swapOpacity:"fa-swap-opacity",widthAuto:"fa-width-auto"};function xs(t){const e=dt.cssPrefix||dt.familyPrefix||ft;return e===ft?t:t.replace(new RegExp(String.raw`(?<=^|\s)${ft}-`,"g"),`${e}-`)}function Ls(t){const{beat:e,fade:n,beatFade:a,bounce:r,shake:s,spin:i,spinPulse:c,spinReverse:m,pulse:d,fixedWidth:u,inverse:h,border:g,flip:x,size:z,rotation:N,pull:S,swapOpacity:O,rotateBy:k,widthAuto:w,className:F}=t,b=[];return F&&b.push(...F.split(" ")),e&&b.push(Y.beat),n&&b.push(Y.fade),a&&b.push(Y.beatFade),r&&b.push(Y.bounce),s&&b.push(Y.shake),i&&b.push(Y.spin),m&&b.push(Y.spinReverse),c&&b.push(Y.spinPulse),d&&b.push(Y.pulse),u&&b.push($.fixedWidth),h&&b.push($.inverse),g&&b.push($.border),x===!0&&b.push($.flip),(x==="horizontal"||x==="both")&&b.push($.flipHorizontal),(x==="vertical"||x==="both")&&b.push($.flipVertical),z!=null&&b.push(vs[z]),N!=null&&N!==0&&b.push(bs[N]),S!=null&&b.push(ys[S]),O&&b.push($.swapOpacity),gs?(k&&b.push($.rotateBy),w&&b.push($.widthAuto),(dt.cssPrefix||dt.familyPrefix||ft)===ft?b:b.map(xs)):b}var Ss=t=>typeof t=="object"&&"icon"in t&&!!t.icon;function Xe(t){if(t)return Ss(t)?t:Nn.icon(t)}function Cs(t){return Object.keys(t)}var Ke=new ps("FontAwesomeIcon"),Tn={border:!1,className:"",mask:void 0,maskId:void 0,fixedWidth:!1,inverse:!1,flip:!1,icon:void 0,listItem:!1,pull:void 0,pulse:!1,rotation:void 0,rotateBy:!1,size:void 0,spin:!1,spinPulse:!1,spinReverse:!1,beat:!1,fade:!1,beatFade:!1,bounce:!1,shake:!1,symbol:!1,title:"",titleId:void 0,transform:void 0,swapOpacity:!1,widthAuto:!1},As=new Set(Object.keys(Tn)),ks=ae.forwardRef((t,e)=>{const n={...Tn,...t},{icon:a,mask:r,symbol:s,title:i,titleId:c,maskId:m,transform:d}=n,u=qe(m,!!r),h=qe(c,!!i),g=Xe(a);if(!g)return Ke.error("Icon lookup is undefined",a),null;const x=Ls(n),z=typeof d=="string"?Nn.transform(d):d,N=Xe(r),S=Vr(g,{...x.length>0&&{classes:x},...z&&{transform:z},...N&&{mask:N},symbol:s,title:i,titleId:h,maskId:u});if(!S)return Ke.error("Could not find icon",g),null;const{abstract:O}=S,k={ref:e};for(const w of Cs(n))As.has(w)||(k[w]=n[w]);return ds(O[0],k)});ks.displayName="FontAwesomeIcon";export{mo as $,Co as A,_s as B,xo as C,Ds as D,wo as E,bo as F,Ts as G,Ns as H,qs as I,Ws as J,ro as K,no as L,io as M,ho as N,vo as O,to as P,eo as Q,Ms as R,So as S,fo as T,Bs as U,js as V,zs as W,po as X,Rs as Y,Us as Z,ko as _,ne as a,Ks as a0,Is as a1,ao as a2,lo as a3,Zs as a4,ks as a5,ae as b,Gs as c,Ao as d,Hs as e,$s as f,Yn as g,yo as h,Lo as i,ws as j,uo as k,Es as l,oo as m,co as n,Os as o,Xs as p,Fs as q,Je as r,Qs as s,Mo as t,so as u,Js as v,Ys as w,Vs as x,Ps as y,go as z};
//# sourceMappingURL=ui-Dkus-M-V.js.map
