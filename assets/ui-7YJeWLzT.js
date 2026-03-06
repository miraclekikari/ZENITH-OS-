function gn(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Oe={exports:{}},fe={};var bt;function yn(){if(bt)return fe;bt=1;var e=Symbol.for("react.transitional.element"),t=Symbol.for("react.fragment");function a(n,r,i){var o=null;if(i!==void 0&&(o=""+i),r.key!==void 0&&(o=""+r.key),"key"in r){i={};for(var l in r)l!=="key"&&(i[l]=r[l])}else i=r;return r=i.ref,{$$typeof:e,type:n,key:o,ref:r!==void 0?r:null,props:i}}return fe.Fragment=t,fe.jsx=a,fe.jsxs=a,fe}var xt;function bn(){return xt||(xt=1,Oe.exports=yn()),Oe.exports}var Ss=bn(),Fe={exports:{}},g={};var St;function xn(){if(St)return g;St=1;var e=Symbol.for("react.transitional.element"),t=Symbol.for("react.portal"),a=Symbol.for("react.fragment"),n=Symbol.for("react.strict_mode"),r=Symbol.for("react.profiler"),i=Symbol.for("react.consumer"),o=Symbol.for("react.context"),l=Symbol.for("react.forward_ref"),f=Symbol.for("react.suspense"),d=Symbol.for("react.memo"),m=Symbol.for("react.lazy"),v=Symbol.for("react.activity"),S=Symbol.iterator;function h(s){return s===null||typeof s!="object"?null:(s=S&&s[S]||s["@@iterator"],typeof s=="function"?s:null)}var E={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},A=Object.assign,L={};function C(s,u,x){this.props=s,this.context=u,this.refs=L,this.updater=x||E}C.prototype.isReactComponent={},C.prototype.setState=function(s,u){if(typeof s!="object"&&typeof s!="function"&&s!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,s,u,"setState")},C.prototype.forceUpdate=function(s){this.updater.enqueueForceUpdate(this,s,"forceUpdate")};function N(){}N.prototype=C.prototype;function z(s,u,x){this.props=s,this.context=u,this.refs=L,this.updater=x||E}var F=z.prototype=new N;F.constructor=z,A(F,C.prototype),F.isPureReactComponent=!0;var w=Array.isArray;function X(){}var I={H:null,A:null,T:null,S:null},ee=Object.prototype.hasOwnProperty;function le(s,u,x){var y=x.ref;return{$$typeof:e,type:s,key:u,ref:y!==void 0?y:null,props:x}}function un(s,u){return le(s.type,u,s.props)}function ze(s){return typeof s=="object"&&s!==null&&s.$$typeof===e}function dn(s){var u={"=":"=0",":":"=2"};return"$"+s.replace(/[=:]/g,function(x){return u[x]})}var gt=/\/+/g;function Te(s,u){return typeof s=="object"&&s!==null&&s.key!=null?dn(""+s.key):u.toString(36)}function mn(s){switch(s.status){case"fulfilled":return s.value;case"rejected":throw s.reason;default:switch(typeof s.status=="string"?s.then(X,X):(s.status="pending",s.then(function(u){s.status==="pending"&&(s.status="fulfilled",s.value=u)},function(u){s.status==="pending"&&(s.status="rejected",s.reason=u)})),s.status){case"fulfilled":return s.value;case"rejected":throw s.reason}}throw s}function te(s,u,x,y,k){var P=typeof s;(P==="undefined"||P==="boolean")&&(s=null);var _=!1;if(s===null)_=!0;else switch(P){case"bigint":case"string":case"number":_=!0;break;case"object":switch(s.$$typeof){case e:case t:_=!0;break;case m:return _=s._init,te(_(s._payload),u,x,y,k)}}if(_)return k=k(s),_=y===""?"."+Te(s,0):y,w(k)?(x="",_!=null&&(x=_.replace(gt,"$&/")+"/"),te(k,u,x,"",function(hn){return hn})):k!=null&&(ze(k)&&(k=un(k,x+(k.key==null||s&&s.key===k.key?"":(""+k.key).replace(gt,"$&/")+"/")+_)),u.push(k)),1;_=0;var D=y===""?".":y+":";if(w(s))for(var O=0;O<s.length;O++)y=s[O],P=D+Te(y,O),_+=te(y,u,x,P,k);else if(O=h(s),typeof O=="function")for(s=O.call(s),O=0;!(y=s.next()).done;)y=y.value,P=D+Te(y,O++),_+=te(y,u,x,P,k);else if(P==="object"){if(typeof s.then=="function")return te(mn(s),u,x,y,k);throw u=String(s),Error("Objects are not valid as a React child (found: "+(u==="[object Object]"?"object with keys {"+Object.keys(s).join(", ")+"}":u)+"). If you meant to render a collection of children, use an array instead.")}return _}function be(s,u,x){if(s==null)return s;var y=[],k=0;return te(s,y,"","",function(P){return u.call(x,P,k++)}),y}function vn(s){if(s._status===-1){var u=s._result;u=u(),u.then(function(x){(s._status===0||s._status===-1)&&(s._status=1,s._result=x)},function(x){(s._status===0||s._status===-1)&&(s._status=2,s._result=x)}),s._status===-1&&(s._status=0,s._result=u)}if(s._status===1)return s._result.default;throw s._result}var yt=typeof reportError=="function"?reportError:function(s){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var u=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof s=="object"&&s!==null&&typeof s.message=="string"?String(s.message):String(s),error:s});if(!window.dispatchEvent(u))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",s);return}console.error(s)},pn={map:be,forEach:function(s,u,x){be(s,function(){u.apply(this,arguments)},x)},count:function(s){var u=0;return be(s,function(){u++}),u},toArray:function(s){return be(s,function(u){return u})||[]},only:function(s){if(!ze(s))throw Error("React.Children.only expected to receive a single React element child.");return s}};return g.Activity=v,g.Children=pn,g.Component=C,g.Fragment=a,g.Profiler=r,g.PureComponent=z,g.StrictMode=n,g.Suspense=f,g.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=I,g.__COMPILER_RUNTIME={__proto__:null,c:function(s){return I.H.useMemoCache(s)}},g.cache=function(s){return function(){return s.apply(null,arguments)}},g.cacheSignal=function(){return null},g.cloneElement=function(s,u,x){if(s==null)throw Error("The argument must be a React element, but you passed "+s+".");var y=A({},s.props),k=s.key;if(u!=null)for(P in u.key!==void 0&&(k=""+u.key),u)!ee.call(u,P)||P==="key"||P==="__self"||P==="__source"||P==="ref"&&u.ref===void 0||(y[P]=u[P]);var P=arguments.length-2;if(P===1)y.children=x;else if(1<P){for(var _=Array(P),D=0;D<P;D++)_[D]=arguments[D+2];y.children=_}return le(s.type,k,y)},g.createContext=function(s){return s={$$typeof:o,_currentValue:s,_currentValue2:s,_threadCount:0,Provider:null,Consumer:null},s.Provider=s,s.Consumer={$$typeof:i,_context:s},s},g.createElement=function(s,u,x){var y,k={},P=null;if(u!=null)for(y in u.key!==void 0&&(P=""+u.key),u)ee.call(u,y)&&y!=="key"&&y!=="__self"&&y!=="__source"&&(k[y]=u[y]);var _=arguments.length-2;if(_===1)k.children=x;else if(1<_){for(var D=Array(_),O=0;O<_;O++)D[O]=arguments[O+2];k.children=D}if(s&&s.defaultProps)for(y in _=s.defaultProps,_)k[y]===void 0&&(k[y]=_[y]);return le(s,P,k)},g.createRef=function(){return{current:null}},g.forwardRef=function(s){return{$$typeof:l,render:s}},g.isValidElement=ze,g.lazy=function(s){return{$$typeof:m,_payload:{_status:-1,_result:s},_init:vn}},g.memo=function(s,u){return{$$typeof:d,type:s,compare:u===void 0?null:u}},g.startTransition=function(s){var u=I.T,x={};I.T=x;try{var y=s(),k=I.S;k!==null&&k(x,y),typeof y=="object"&&y!==null&&typeof y.then=="function"&&y.then(X,yt)}catch(P){yt(P)}finally{u!==null&&x.types!==null&&(u.types=x.types),I.T=u}},g.unstable_useCacheRefresh=function(){return I.H.useCacheRefresh()},g.use=function(s){return I.H.use(s)},g.useActionState=function(s,u,x){return I.H.useActionState(s,u,x)},g.useCallback=function(s,u){return I.H.useCallback(s,u)},g.useContext=function(s){return I.H.useContext(s)},g.useDebugValue=function(){},g.useDeferredValue=function(s,u){return I.H.useDeferredValue(s,u)},g.useEffect=function(s,u){return I.H.useEffect(s,u)},g.useEffectEvent=function(s){return I.H.useEffectEvent(s)},g.useId=function(){return I.H.useId()},g.useImperativeHandle=function(s,u,x){return I.H.useImperativeHandle(s,u,x)},g.useInsertionEffect=function(s,u){return I.H.useInsertionEffect(s,u)},g.useLayoutEffect=function(s,u){return I.H.useLayoutEffect(s,u)},g.useMemo=function(s,u){return I.H.useMemo(s,u)},g.useOptimistic=function(s,u){return I.H.useOptimistic(s,u)},g.useReducer=function(s,u,x){return I.H.useReducer(s,u,x)},g.useRef=function(s){return I.H.useRef(s)},g.useState=function(s){return I.H.useState(s)},g.useSyncExternalStore=function(s,u,x){return I.H.useSyncExternalStore(s,u,x)},g.useTransition=function(){return I.H.useTransition()},g.version="19.2.4",g}var wt;function Sn(){return wt||(wt=1,Fe.exports=xn()),Fe.exports}var aa=Sn();const na=gn(aa);function He(e,t){(t==null||t>e.length)&&(t=e.length);for(var a=0,n=Array(t);a<t;a++)n[a]=e[a];return n}function wn(e){if(Array.isArray(e))return e}function An(e){if(Array.isArray(e))return He(e)}function kn(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function En(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,ra(n.key),n)}}function Cn(e,t,a){return t&&En(e.prototype,t),Object.defineProperty(e,"prototype",{writable:!1}),e}function we(e,t){var a=typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(!a){if(Array.isArray(e)||(a=it(e))||t){a&&(e=a);var n=0,r=function(){};return{s:r,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(f){throw f},f:r}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var i,o=!0,l=!1;return{s:function(){a=a.call(e)},n:function(){var f=a.next();return o=f.done,f},e:function(f){l=!0,i=f},f:function(){try{o||a.return==null||a.return()}finally{if(l)throw i}}}}function b(e,t,a){return(t=ra(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function Pn(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function In(e,t){var a=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(a!=null){var n,r,i,o,l=[],f=!0,d=!1;try{if(i=(a=a.call(e)).next,t===0){if(Object(a)!==a)return;f=!1}else for(;!(f=(n=i.call(a)).done)&&(l.push(n.value),l.length!==t);f=!0);}catch(m){d=!0,r=m}finally{try{if(!f&&a.return!=null&&(o=a.return(),Object(o)!==o))return}finally{if(d)throw r}}return l}}function Ln(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function _n(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function At(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),a.push.apply(a,n)}return a}function c(e){for(var t=1;t<arguments.length;t++){var a=arguments[t]!=null?arguments[t]:{};t%2?At(Object(a),!0).forEach(function(n){b(e,n,a[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):At(Object(a)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(a,n))})}return e}function Ie(e,t){return wn(e)||In(e,t)||it(e,t)||Ln()}function $(e){return An(e)||Pn(e)||it(e)||_n()}function Mn(e,t){if(typeof e!="object"||!e)return e;var a=e[Symbol.toPrimitive];if(a!==void 0){var n=a.call(e,t);if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function ra(e){var t=Mn(e,"string");return typeof t=="symbol"?t:t+""}function Ee(e){"@babel/helpers - typeof";return Ee=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Ee(e)}function it(e,t){if(e){if(typeof e=="string")return He(e,t);var a={}.toString.call(e).slice(8,-1);return a==="Object"&&e.constructor&&(a=e.constructor.name),a==="Map"||a==="Set"?Array.from(e):a==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?He(e,t):void 0}}var kt=function(){},ot={},ia={},oa=null,sa={mark:kt,measure:kt};try{typeof window<"u"&&(ot=window),typeof document<"u"&&(ia=document),typeof MutationObserver<"u"&&(oa=MutationObserver),typeof performance<"u"&&(sa=performance)}catch{}var Nn=ot.navigator||{},Et=Nn.userAgent,Ct=Et===void 0?"":Et,q=ot,M=ia,Pt=oa,xe=sa;q.document;var B=!!M.documentElement&&!!M.head&&typeof M.addEventListener=="function"&&typeof M.createElement=="function",la=~Ct.indexOf("MSIE")||~Ct.indexOf("Trident/"),Re,zn=/fa(k|kd|s|r|l|t|d|dr|dl|dt|b|slr|slpr|wsb|tl|ns|nds|es|gt|jr|jfr|jdr|usb|ufsb|udsb|cr|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/,Tn=/Font ?Awesome ?([567 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit|Notdog Duo|Notdog|Chisel|Etch|Graphite|Thumbprint|Jelly Fill|Jelly Duo|Jelly|Utility|Utility Fill|Utility Duo|Slab Press|Slab|Whiteboard)?.*/i,fa={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fab:"brands","fa-brands":"brands"},duotone:{fa:"solid",fad:"solid","fa-solid":"solid","fa-duotone":"solid",fadr:"regular","fa-regular":"regular",fadl:"light","fa-light":"light",fadt:"thin","fa-thin":"thin"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid",fasdr:"regular","fa-regular":"regular",fasdl:"light","fa-light":"light",fasdt:"thin","fa-thin":"thin"},slab:{"fa-regular":"regular",faslr:"regular"},"slab-press":{"fa-regular":"regular",faslpr:"regular"},thumbprint:{"fa-light":"light",fatl:"light"},whiteboard:{"fa-semibold":"semibold",fawsb:"semibold"},notdog:{"fa-solid":"solid",fans:"solid"},"notdog-duo":{"fa-solid":"solid",fands:"solid"},etch:{"fa-solid":"solid",faes:"solid"},graphite:{"fa-thin":"thin",fagt:"thin"},jelly:{"fa-regular":"regular",fajr:"regular"},"jelly-fill":{"fa-regular":"regular",fajfr:"regular"},"jelly-duo":{"fa-regular":"regular",fajdr:"regular"},chisel:{"fa-regular":"regular",facr:"regular"},utility:{"fa-semibold":"semibold",fausb:"semibold"},"utility-duo":{"fa-semibold":"semibold",faudsb:"semibold"},"utility-fill":{"fa-semibold":"semibold",faufsb:"semibold"}},On={GROUP:"duotone-group",PRIMARY:"primary",SECONDARY:"secondary"},ca=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone","fa-thumbprint","fa-whiteboard","fa-notdog","fa-notdog-duo","fa-chisel","fa-etch","fa-graphite","fa-jelly","fa-jelly-fill","fa-jelly-duo","fa-slab","fa-slab-press","fa-utility","fa-utility-duo","fa-utility-fill"],T="classic",he="duotone",ua="sharp",da="sharp-duotone",ma="chisel",va="etch",pa="graphite",ha="jelly",ga="jelly-duo",ya="jelly-fill",ba="notdog",xa="notdog-duo",Sa="slab",wa="slab-press",Aa="thumbprint",ka="utility",Ea="utility-duo",Ca="utility-fill",Pa="whiteboard",Fn="Classic",Rn="Duotone",jn="Sharp",$n="Sharp Duotone",Dn="Chisel",Un="Etch",Wn="Graphite",Yn="Jelly",Hn="Jelly Duo",Gn="Jelly Fill",Bn="Notdog",Xn="Notdog Duo",qn="Slab",Jn="Slab Press",Vn="Thumbprint",Kn="Utility",Qn="Utility Duo",Zn="Utility Fill",er="Whiteboard",Ia=[T,he,ua,da,ma,va,pa,ha,ga,ya,ba,xa,Sa,wa,Aa,ka,Ea,Ca,Pa];Re={},b(b(b(b(b(b(b(b(b(b(Re,T,Fn),he,Rn),ua,jn),da,$n),ma,Dn),va,Un),pa,Wn),ha,Yn),ga,Hn),ya,Gn),b(b(b(b(b(b(b(b(b(Re,ba,Bn),xa,Xn),Sa,qn),wa,Jn),Aa,Vn),ka,Kn),Ea,Qn),Ca,Zn),Pa,er);var tr={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},duotone:{900:"fad",400:"fadr",300:"fadl",100:"fadt"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds",400:"fasdr",300:"fasdl",100:"fasdt"},slab:{400:"faslr"},"slab-press":{400:"faslpr"},whiteboard:{600:"fawsb"},thumbprint:{300:"fatl"},notdog:{900:"fans"},"notdog-duo":{900:"fands"},etch:{900:"faes"},graphite:{100:"fagt"},chisel:{400:"facr"},jelly:{400:"fajr"},"jelly-fill":{400:"fajfr"},"jelly-duo":{400:"fajdr"},utility:{600:"fausb"},"utility-duo":{600:"faudsb"},"utility-fill":{600:"faufsb"}},ar={"Font Awesome 7 Free":{900:"fas",400:"far"},"Font Awesome 7 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 7 Brands":{400:"fab",normal:"fab"},"Font Awesome 7 Duotone":{900:"fad",400:"fadr",normal:"fadr",300:"fadl",100:"fadt"},"Font Awesome 7 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 7 Sharp Duotone":{900:"fasds",400:"fasdr",normal:"fasdr",300:"fasdl",100:"fasdt"},"Font Awesome 7 Jelly":{400:"fajr",normal:"fajr"},"Font Awesome 7 Jelly Fill":{400:"fajfr",normal:"fajfr"},"Font Awesome 7 Jelly Duo":{400:"fajdr",normal:"fajdr"},"Font Awesome 7 Slab":{400:"faslr",normal:"faslr"},"Font Awesome 7 Slab Press":{400:"faslpr",normal:"faslpr"},"Font Awesome 7 Thumbprint":{300:"fatl",normal:"fatl"},"Font Awesome 7 Notdog":{900:"fans",normal:"fans"},"Font Awesome 7 Notdog Duo":{900:"fands",normal:"fands"},"Font Awesome 7 Etch":{900:"faes",normal:"faes"},"Font Awesome 7 Graphite":{100:"fagt",normal:"fagt"},"Font Awesome 7 Chisel":{400:"facr",normal:"facr"},"Font Awesome 7 Whiteboard":{600:"fawsb",normal:"fawsb"},"Font Awesome 7 Utility":{600:"fausb",normal:"fausb"},"Font Awesome 7 Utility Duo":{600:"faudsb",normal:"faudsb"},"Font Awesome 7 Utility Fill":{600:"faufsb",normal:"faufsb"}},nr=new Map([["classic",{defaultShortPrefixId:"fas",defaultStyleId:"solid",styleIds:["solid","regular","light","thin","brands"],futureStyleIds:[],defaultFontWeight:900}],["duotone",{defaultShortPrefixId:"fad",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp",{defaultShortPrefixId:"fass",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp-duotone",{defaultShortPrefixId:"fasds",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["chisel",{defaultShortPrefixId:"facr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["etch",{defaultShortPrefixId:"faes",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["graphite",{defaultShortPrefixId:"fagt",defaultStyleId:"thin",styleIds:["thin"],futureStyleIds:[],defaultFontWeight:100}],["jelly",{defaultShortPrefixId:"fajr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["jelly-duo",{defaultShortPrefixId:"fajdr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["jelly-fill",{defaultShortPrefixId:"fajfr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["notdog",{defaultShortPrefixId:"fans",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["notdog-duo",{defaultShortPrefixId:"fands",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["slab",{defaultShortPrefixId:"faslr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["slab-press",{defaultShortPrefixId:"faslpr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["thumbprint",{defaultShortPrefixId:"fatl",defaultStyleId:"light",styleIds:["light"],futureStyleIds:[],defaultFontWeight:300}],["utility",{defaultShortPrefixId:"fausb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["utility-duo",{defaultShortPrefixId:"faudsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["utility-fill",{defaultShortPrefixId:"faufsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["whiteboard",{defaultShortPrefixId:"fawsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}]]),rr={chisel:{regular:"facr"},classic:{brands:"fab",light:"fal",regular:"far",solid:"fas",thin:"fat"},duotone:{light:"fadl",regular:"fadr",solid:"fad",thin:"fadt"},etch:{solid:"faes"},graphite:{thin:"fagt"},jelly:{regular:"fajr"},"jelly-duo":{regular:"fajdr"},"jelly-fill":{regular:"fajfr"},notdog:{solid:"fans"},"notdog-duo":{solid:"fands"},sharp:{light:"fasl",regular:"fasr",solid:"fass",thin:"fast"},"sharp-duotone":{light:"fasdl",regular:"fasdr",solid:"fasds",thin:"fasdt"},slab:{regular:"faslr"},"slab-press":{regular:"faslpr"},thumbprint:{light:"fatl"},utility:{semibold:"fausb"},"utility-duo":{semibold:"faudsb"},"utility-fill":{semibold:"faufsb"},whiteboard:{semibold:"fawsb"}},La=["fak","fa-kit","fakd","fa-kit-duotone"],It={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},ir=["kit"],or="kit",sr="kit-duotone",lr="Kit",fr="Kit Duotone";b(b({},or,lr),sr,fr);var cr={kit:{"fa-kit":"fak"}},ur={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},dr={kit:{fak:"fa-kit"}},Lt={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},je,Se={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},mr=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone","fa-thumbprint","fa-whiteboard","fa-notdog","fa-notdog-duo","fa-chisel","fa-etch","fa-graphite","fa-jelly","fa-jelly-fill","fa-jelly-duo","fa-slab","fa-slab-press","fa-utility","fa-utility-duo","fa-utility-fill"],vr="classic",pr="duotone",hr="sharp",gr="sharp-duotone",yr="chisel",br="etch",xr="graphite",Sr="jelly",wr="jelly-duo",Ar="jelly-fill",kr="notdog",Er="notdog-duo",Cr="slab",Pr="slab-press",Ir="thumbprint",Lr="utility",_r="utility-duo",Mr="utility-fill",Nr="whiteboard",zr="Classic",Tr="Duotone",Or="Sharp",Fr="Sharp Duotone",Rr="Chisel",jr="Etch",$r="Graphite",Dr="Jelly",Ur="Jelly Duo",Wr="Jelly Fill",Yr="Notdog",Hr="Notdog Duo",Gr="Slab",Br="Slab Press",Xr="Thumbprint",qr="Utility",Jr="Utility Duo",Vr="Utility Fill",Kr="Whiteboard";je={},b(b(b(b(b(b(b(b(b(b(je,vr,zr),pr,Tr),hr,Or),gr,Fr),yr,Rr),br,jr),xr,$r),Sr,Dr),wr,Ur),Ar,Wr),b(b(b(b(b(b(b(b(b(je,kr,Yr),Er,Hr),Cr,Gr),Pr,Br),Ir,Xr),Lr,qr),_r,Jr),Mr,Vr),Nr,Kr);var Qr="kit",Zr="kit-duotone",ei="Kit",ti="Kit Duotone";b(b({},Qr,ei),Zr,ti);var ai={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},duotone:{"fa-regular":"fadr","fa-light":"fadl","fa-thin":"fadt"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds","fa-regular":"fasdr","fa-light":"fasdl","fa-thin":"fasdt"},slab:{"fa-regular":"faslr"},"slab-press":{"fa-regular":"faslpr"},whiteboard:{"fa-semibold":"fawsb"},thumbprint:{"fa-light":"fatl"},notdog:{"fa-solid":"fans"},"notdog-duo":{"fa-solid":"fands"},etch:{"fa-solid":"faes"},graphite:{"fa-thin":"fagt"},jelly:{"fa-regular":"fajr"},"jelly-fill":{"fa-regular":"fajfr"},"jelly-duo":{"fa-regular":"fajdr"},chisel:{"fa-regular":"facr"},utility:{"fa-semibold":"fausb"},"utility-duo":{"fa-semibold":"faudsb"},"utility-fill":{"fa-semibold":"faufsb"}},ni={classic:["fas","far","fal","fat","fad"],duotone:["fadr","fadl","fadt"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds","fasdr","fasdl","fasdt"],slab:["faslr"],"slab-press":["faslpr"],whiteboard:["fawsb"],thumbprint:["fatl"],notdog:["fans"],"notdog-duo":["fands"],etch:["faes"],graphite:["fagt"],jelly:["fajr"],"jelly-fill":["fajfr"],"jelly-duo":["fajdr"],chisel:["facr"],utility:["fausb"],"utility-duo":["faudsb"],"utility-fill":["faufsb"]},Ge={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},duotone:{fadr:"fa-regular",fadl:"fa-light",fadt:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid",fasdr:"fa-regular",fasdl:"fa-light",fasdt:"fa-thin"},slab:{faslr:"fa-regular"},"slab-press":{faslpr:"fa-regular"},whiteboard:{fawsb:"fa-semibold"},thumbprint:{fatl:"fa-light"},notdog:{fans:"fa-solid"},"notdog-duo":{fands:"fa-solid"},etch:{faes:"fa-solid"},graphite:{fagt:"fa-thin"},jelly:{fajr:"fa-regular"},"jelly-fill":{fajfr:"fa-regular"},"jelly-duo":{fajdr:"fa-regular"},chisel:{facr:"fa-regular"},utility:{fausb:"fa-semibold"},"utility-duo":{faudsb:"fa-semibold"},"utility-fill":{faufsb:"fa-semibold"}},ri=["fa-solid","fa-regular","fa-light","fa-thin","fa-duotone","fa-brands","fa-semibold"],_a=["fa","fas","far","fal","fat","fad","fadr","fadl","fadt","fab","fass","fasr","fasl","fast","fasds","fasdr","fasdl","fasdt","faslr","faslpr","fawsb","fatl","fans","fands","faes","fagt","fajr","fajfr","fajdr","facr","fausb","faudsb","faufsb"].concat(mr,ri),ii=["solid","regular","light","thin","duotone","brands","semibold"],Ma=[1,2,3,4,5,6,7,8,9,10],oi=Ma.concat([11,12,13,14,15,16,17,18,19,20]),si=["aw","fw","pull-left","pull-right"],li=[].concat($(Object.keys(ni)),ii,si,["2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","inverse","layers","layers-bottom-left","layers-bottom-right","layers-counter","layers-text","layers-top-left","layers-top-right","li","pull-end","pull-start","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul","width-auto","width-fixed",Se.GROUP,Se.SWAP_OPACITY,Se.PRIMARY,Se.SECONDARY]).concat(Ma.map(function(e){return"".concat(e,"x")})).concat(oi.map(function(e){return"w-".concat(e)})),fi={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}},H="___FONT_AWESOME___",Be=16,Na="fa",za="svg-inline--fa",Q="data-fa-i2svg",Xe="data-fa-pseudo-element",ci="data-fa-pseudo-element-pending",st="data-prefix",lt="data-icon",_t="fontawesome-i2svg",ui="async",di=["HTML","HEAD","STYLE","SCRIPT"],Ta=["::before","::after",":before",":after"],Oa=(function(){try{return!0}catch{return!1}})();function ge(e){return new Proxy(e,{get:function(a,n){return n in a?a[n]:a[T]}})}var Fa=c({},fa);Fa[T]=c(c(c(c({},{"fa-duotone":"duotone"}),fa[T]),It.kit),It["kit-duotone"]);var mi=ge(Fa),qe=c({},rr);qe[T]=c(c(c(c({},{duotone:"fad"}),qe[T]),Lt.kit),Lt["kit-duotone"]);var Mt=ge(qe),Je=c({},Ge);Je[T]=c(c({},Je[T]),dr.kit);var ft=ge(Je),Ve=c({},ai);Ve[T]=c(c({},Ve[T]),cr.kit);ge(Ve);var vi=zn,Ra="fa-layers-text",pi=Tn,hi=c({},tr);ge(hi);var gi=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],$e=On,yi=[].concat($(ir),$(li)),ue=q.FontAwesomeConfig||{};function bi(e){var t=M.querySelector("script["+e+"]");if(t)return t.getAttribute(e)}function xi(e){return e===""?!0:e==="false"?!1:e==="true"?!0:e}if(M&&typeof M.querySelector=="function"){var Si=[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-search-pseudo-elements","searchPseudoElements"],["data-search-pseudo-elements-warnings","searchPseudoElementsWarnings"],["data-search-pseudo-elements-full-scan","searchPseudoElementsFullScan"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]];Si.forEach(function(e){var t=Ie(e,2),a=t[0],n=t[1],r=xi(bi(a));r!=null&&(ue[n]=r)})}var ja={styleDefault:"solid",familyDefault:T,cssPrefix:Na,replacementClass:za,autoReplaceSvg:!0,autoAddCss:!0,searchPseudoElements:!1,searchPseudoElementsWarnings:!0,searchPseudoElementsFullScan:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};ue.familyPrefix&&(ue.cssPrefix=ue.familyPrefix);var oe=c(c({},ja),ue);oe.autoReplaceSvg||(oe.observeMutations=!1);var p={};Object.keys(ja).forEach(function(e){Object.defineProperty(p,e,{enumerable:!0,set:function(a){oe[e]=a,de.forEach(function(n){return n(p)})},get:function(){return oe[e]}})});Object.defineProperty(p,"familyPrefix",{enumerable:!0,set:function(t){oe.cssPrefix=t,de.forEach(function(a){return a(p)})},get:function(){return oe.cssPrefix}});q.FontAwesomeConfig=p;var de=[];function wi(e){return de.push(e),function(){de.splice(de.indexOf(e),1)}}var ae=Be,U={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function Ai(e){if(!(!e||!B)){var t=M.createElement("style");t.setAttribute("type","text/css"),t.innerHTML=e;for(var a=M.head.childNodes,n=null,r=a.length-1;r>-1;r--){var i=a[r],o=(i.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(o)>-1&&(n=i)}return M.head.insertBefore(t,n),e}}var ki="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function Nt(){for(var e=12,t="";e-- >0;)t+=ki[Math.random()*62|0];return t}function se(e){for(var t=[],a=(e||[]).length>>>0;a--;)t[a]=e[a];return t}function ct(e){return e.classList?se(e.classList):(e.getAttribute("class")||"").split(" ").filter(function(t){return t})}function $a(e){return"".concat(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Ei(e){return Object.keys(e||{}).reduce(function(t,a){return t+"".concat(a,'="').concat($a(e[a]),'" ')},"").trim()}function Le(e){return Object.keys(e||{}).reduce(function(t,a){return t+"".concat(a,": ").concat(e[a].trim(),";")},"")}function ut(e){return e.size!==U.size||e.x!==U.x||e.y!==U.y||e.rotate!==U.rotate||e.flipX||e.flipY}function Ci(e){var t=e.transform,a=e.containerWidth,n=e.iconWidth,r={transform:"translate(".concat(a/2," 256)")},i="translate(".concat(t.x*32,", ").concat(t.y*32,") "),o="scale(".concat(t.size/16*(t.flipX?-1:1),", ").concat(t.size/16*(t.flipY?-1:1),") "),l="rotate(".concat(t.rotate," 0 0)"),f={transform:"".concat(i," ").concat(o," ").concat(l)},d={transform:"translate(".concat(n/2*-1," -256)")};return{outer:r,inner:f,path:d}}function Pi(e){var t=e.transform,a=e.width,n=a===void 0?Be:a,r=e.height,i=r===void 0?Be:r,o="";return la?o+="translate(".concat(t.x/ae-n/2,"em, ").concat(t.y/ae-i/2,"em) "):o+="translate(calc(-50% + ".concat(t.x/ae,"em), calc(-50% + ").concat(t.y/ae,"em)) "),o+="scale(".concat(t.size/ae*(t.flipX?-1:1),", ").concat(t.size/ae*(t.flipY?-1:1),") "),o+="rotate(".concat(t.rotate,"deg) "),o}var Ii=`:root, :host {
  --fa-font-solid: normal 900 1em/1 'Font Awesome 7 Free';
  --fa-font-regular: normal 400 1em/1 'Font Awesome 7 Free';
  --fa-font-light: normal 300 1em/1 'Font Awesome 7 Pro';
  --fa-font-thin: normal 100 1em/1 'Font Awesome 7 Pro';
  --fa-font-duotone: normal 900 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-regular: normal 400 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-light: normal 300 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-thin: normal 100 1em/1 'Font Awesome 7 Duotone';
  --fa-font-brands: normal 400 1em/1 'Font Awesome 7 Brands';
  --fa-font-sharp-solid: normal 900 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-regular: normal 400 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-light: normal 300 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-thin: normal 100 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-duotone-solid: normal 900 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-regular: normal 400 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-light: normal 300 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-thin: normal 100 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-slab-regular: normal 400 1em/1 'Font Awesome 7 Slab';
  --fa-font-slab-press-regular: normal 400 1em/1 'Font Awesome 7 Slab Press';
  --fa-font-whiteboard-semibold: normal 600 1em/1 'Font Awesome 7 Whiteboard';
  --fa-font-thumbprint-light: normal 300 1em/1 'Font Awesome 7 Thumbprint';
  --fa-font-notdog-solid: normal 900 1em/1 'Font Awesome 7 Notdog';
  --fa-font-notdog-duo-solid: normal 900 1em/1 'Font Awesome 7 Notdog Duo';
  --fa-font-etch-solid: normal 900 1em/1 'Font Awesome 7 Etch';
  --fa-font-graphite-thin: normal 100 1em/1 'Font Awesome 7 Graphite';
  --fa-font-jelly-regular: normal 400 1em/1 'Font Awesome 7 Jelly';
  --fa-font-jelly-fill-regular: normal 400 1em/1 'Font Awesome 7 Jelly Fill';
  --fa-font-jelly-duo-regular: normal 400 1em/1 'Font Awesome 7 Jelly Duo';
  --fa-font-chisel-regular: normal 400 1em/1 'Font Awesome 7 Chisel';
  --fa-font-utility-semibold: normal 600 1em/1 'Font Awesome 7 Utility';
  --fa-font-utility-duo-semibold: normal 600 1em/1 'Font Awesome 7 Utility Duo';
  --fa-font-utility-fill-semibold: normal 600 1em/1 'Font Awesome 7 Utility Fill';
}

.svg-inline--fa {
  box-sizing: content-box;
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285714em;
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
.svg-inline--fa.fa-pull-left,
.svg-inline--fa .fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-pull-right,
.svg-inline--fa .fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  inset-block-start: 0.25em; /* syncing vertical alignment with Web Font rendering */
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
  width: var(--fa-width, 1.25em);
}
.fa-layers .svg-inline--fa {
  inset: 0;
  margin: auto;
  position: absolute;
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
  font-size: calc(10 / 16 * 1em); /* converts a 10px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 10 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 10 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xs {
  font-size: calc(12 / 16 * 1em); /* converts a 12px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 12 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 12 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-sm {
  font-size: calc(14 / 16 * 1em); /* converts a 14px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 14 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 14 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-lg {
  font-size: calc(20 / 16 * 1em); /* converts a 20px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 20 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 20 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xl {
  font-size: calc(24 / 16 * 1em); /* converts a 24px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 24 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 24 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-2xl {
  font-size: calc(32 / 16 * 1em); /* converts a 32px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 32 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 32 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-width-auto {
  --fa-width: auto;
}

.fa-fw,
.fa-width-fixed {
  --fa-width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-inline-start: var(--fa-li-margin, 2.5em);
  padding-inline-start: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

/* Heads Up: Bordered Icons will not be supported in the future!
  - This feature will be deprecated in the next major release of Font Awesome (v8)!
  - You may continue to use it in this version *v7), but it will not be supported in Font Awesome v8.
*/
/* Notes:
* --@{v.$css-prefix}-border-width = 1/16 by default (to render as ~1px based on a 16px default font-size)
* --@{v.$css-prefix}-border-padding =
  ** 3/16 for vertical padding (to give ~2px of vertical whitespace around an icon considering it's vertical alignment)
  ** 4/16 for horizontal padding (to give ~4px of horizontal whitespace around an icon)
*/
.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.0625em);
  box-sizing: var(--fa-border-box-sizing, content-box);
  padding: var(--fa-border-padding, 0.1875em 0.25em);
}

.fa-pull-left,
.fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right,
.fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
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
    animation: none !important;
    transition: none !important;
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
}

.svg-inline--fa.fa-inverse {
  fill: var(--fa-inverse, #fff);
}

.fa-stack {
  display: inline-block;
  height: 2em;
  line-height: 2em;
  position: relative;
  vertical-align: middle;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.svg-inline--fa.fa-stack-1x {
  --fa-width: 1.25em;
  height: 1em;
  width: var(--fa-width);
}
.svg-inline--fa.fa-stack-2x {
  --fa-width: 2.5em;
  height: 2em;
  width: var(--fa-width);
}

.fa-stack-1x,
.fa-stack-2x {
  inset: 0;
  margin: auto;
  position: absolute;
  z-index: var(--fa-stack-z-index, auto);
}`;function Da(){var e=Na,t=za,a=p.cssPrefix,n=p.replacementClass,r=Ii;if(a!==e||n!==t){var i=new RegExp("\\.".concat(e,"\\-"),"g"),o=new RegExp("\\--".concat(e,"\\-"),"g"),l=new RegExp("\\.".concat(t),"g");r=r.replace(i,".".concat(a,"-")).replace(o,"--".concat(a,"-")).replace(l,".".concat(n))}return r}var zt=!1;function De(){p.autoAddCss&&!zt&&(Ai(Da()),zt=!0)}var Li={mixout:function(){return{dom:{css:Da,insertCss:De}}},hooks:function(){return{beforeDOMElementCreation:function(){De()},beforeI2svg:function(){De()}}}},G=q||{};G[H]||(G[H]={});G[H].styles||(G[H].styles={});G[H].hooks||(G[H].hooks={});G[H].shims||(G[H].shims=[]);var j=G[H],Ua=[],Wa=function(){M.removeEventListener("DOMContentLoaded",Wa),Ce=1,Ua.map(function(t){return t()})},Ce=!1;B&&(Ce=(M.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(M.readyState),Ce||M.addEventListener("DOMContentLoaded",Wa));function _i(e){B&&(Ce?setTimeout(e,0):Ua.push(e))}function ye(e){var t=e.tag,a=e.attributes,n=a===void 0?{}:a,r=e.children,i=r===void 0?[]:r;return typeof e=="string"?$a(e):"<".concat(t," ").concat(Ei(n),">").concat(i.map(ye).join(""),"</").concat(t,">")}function Tt(e,t,a){if(e&&e[t]&&e[t][a])return{prefix:t,iconName:a,icon:e[t][a]}}var Ue=function(t,a,n,r){var i=Object.keys(t),o=i.length,l=a,f,d,m;for(n===void 0?(f=1,m=t[i[0]]):(f=0,m=n);f<o;f++)d=i[f],m=l(m,t[d],d,t);return m};function Ya(e){return $(e).length!==1?null:e.codePointAt(0).toString(16)}function Ot(e){return Object.keys(e).reduce(function(t,a){var n=e[a],r=!!n.icon;return r?t[n.iconName]=n.icon:t[a]=n,t},{})}function Ke(e,t){var a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},n=a.skipHooks,r=n===void 0?!1:n,i=Ot(t);typeof j.hooks.addPack=="function"&&!r?j.hooks.addPack(e,Ot(t)):j.styles[e]=c(c({},j.styles[e]||{}),i),e==="fas"&&Ke("fa",t)}var ve=j.styles,Mi=j.shims,Ha=Object.keys(ft),Ni=Ha.reduce(function(e,t){return e[t]=Object.keys(ft[t]),e},{}),dt=null,Ga={},Ba={},Xa={},qa={},Ja={};function zi(e){return~yi.indexOf(e)}function Ti(e,t){var a=t.split("-"),n=a[0],r=a.slice(1).join("-");return n===e&&r!==""&&!zi(r)?r:null}var Va=function(){var t=function(i){return Ue(ve,function(o,l,f){return o[f]=Ue(l,i,{}),o},{})};Ga=t(function(r,i,o){if(i[3]&&(r[i[3]]=o),i[2]){var l=i[2].filter(function(f){return typeof f=="number"});l.forEach(function(f){r[f.toString(16)]=o})}return r}),Ba=t(function(r,i,o){if(r[o]=o,i[2]){var l=i[2].filter(function(f){return typeof f=="string"});l.forEach(function(f){r[f]=o})}return r}),Ja=t(function(r,i,o){var l=i[2];return r[o]=o,l.forEach(function(f){r[f]=o}),r});var a="far"in ve||p.autoFetchSvg,n=Ue(Mi,function(r,i){var o=i[0],l=i[1],f=i[2];return l==="far"&&!a&&(l="fas"),typeof o=="string"&&(r.names[o]={prefix:l,iconName:f}),typeof o=="number"&&(r.unicodes[o.toString(16)]={prefix:l,iconName:f}),r},{names:{},unicodes:{}});Xa=n.names,qa=n.unicodes,dt=_e(p.styleDefault,{family:p.familyDefault})};wi(function(e){dt=_e(e.styleDefault,{family:p.familyDefault})});Va();function mt(e,t){return(Ga[e]||{})[t]}function Oi(e,t){return(Ba[e]||{})[t]}function K(e,t){return(Ja[e]||{})[t]}function Ka(e){return Xa[e]||{prefix:null,iconName:null}}function Fi(e){var t=qa[e],a=mt("fas",e);return t||(a?{prefix:"fas",iconName:a}:null)||{prefix:null,iconName:null}}function J(){return dt}var Qa=function(){return{prefix:null,iconName:null,rest:[]}};function Ri(e){var t=T,a=Ha.reduce(function(n,r){return n[r]="".concat(p.cssPrefix,"-").concat(r),n},{});return Ia.forEach(function(n){(e.includes(a[n])||e.some(function(r){return Ni[n].includes(r)}))&&(t=n)}),t}function _e(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=t.family,n=a===void 0?T:a,r=mi[n][e];if(n===he&&!e)return"fad";var i=Mt[n][e]||Mt[n][r],o=e in j.styles?e:null,l=i||o||null;return l}function ji(e){var t=[],a=null;return e.forEach(function(n){var r=Ti(p.cssPrefix,n);r?a=r:n&&t.push(n)}),{iconName:a,rest:t}}function Ft(e){return e.sort().filter(function(t,a,n){return n.indexOf(t)===a})}var Rt=_a.concat(La);function Me(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=t.skipLookups,n=a===void 0?!1:a,r=null,i=Ft(e.filter(function(h){return Rt.includes(h)})),o=Ft(e.filter(function(h){return!Rt.includes(h)})),l=i.filter(function(h){return r=h,!ca.includes(h)}),f=Ie(l,1),d=f[0],m=d===void 0?null:d,v=Ri(i),S=c(c({},ji(o)),{},{prefix:_e(m,{family:v})});return c(c(c({},S),Wi({values:e,family:v,styles:ve,config:p,canonical:S,givenPrefix:r})),$i(n,r,S))}function $i(e,t,a){var n=a.prefix,r=a.iconName;if(e||!n||!r)return{prefix:n,iconName:r};var i=t==="fa"?Ka(r):{},o=K(n,r);return r=i.iconName||o||r,n=i.prefix||n,n==="far"&&!ve.far&&ve.fas&&!p.autoFetchSvg&&(n="fas"),{prefix:n,iconName:r}}var Di=Ia.filter(function(e){return e!==T||e!==he}),Ui=Object.keys(Ge).filter(function(e){return e!==T}).map(function(e){return Object.keys(Ge[e])}).flat();function Wi(e){var t=e.values,a=e.family,n=e.canonical,r=e.givenPrefix,i=r===void 0?"":r,o=e.styles,l=o===void 0?{}:o,f=e.config,d=f===void 0?{}:f,m=a===he,v=t.includes("fa-duotone")||t.includes("fad"),S=d.familyDefault==="duotone",h=n.prefix==="fad"||n.prefix==="fa-duotone";if(!m&&(v||S||h)&&(n.prefix="fad"),(t.includes("fa-brands")||t.includes("fab"))&&(n.prefix="fab"),!n.prefix&&Di.includes(a)){var E=Object.keys(l).find(function(L){return Ui.includes(L)});if(E||d.autoFetchSvg){var A=nr.get(a).defaultShortPrefixId;n.prefix=A,n.iconName=K(n.prefix,n.iconName)||n.iconName}}return(n.prefix==="fa"||i==="fa")&&(n.prefix=J()||"fas"),n}var Yi=(function(){function e(){kn(this,e),this.definitions={}}return Cn(e,[{key:"add",value:function(){for(var a=this,n=arguments.length,r=new Array(n),i=0;i<n;i++)r[i]=arguments[i];var o=r.reduce(this._pullDefinitions,{});Object.keys(o).forEach(function(l){a.definitions[l]=c(c({},a.definitions[l]||{}),o[l]),Ke(l,o[l]);var f=ft[T][l];f&&Ke(f,o[l]),Va()})}},{key:"reset",value:function(){this.definitions={}}},{key:"_pullDefinitions",value:function(a,n){var r=n.prefix&&n.iconName&&n.icon?{0:n}:n;return Object.keys(r).map(function(i){var o=r[i],l=o.prefix,f=o.iconName,d=o.icon,m=d[2];a[l]||(a[l]={}),m.length>0&&m.forEach(function(v){typeof v=="string"&&(a[l][v]=d)}),a[l][f]=d}),a}}])})(),jt=[],re={},ie={},Hi=Object.keys(ie);function Gi(e,t){var a=t.mixoutsTo;return jt=e,re={},Object.keys(ie).forEach(function(n){Hi.indexOf(n)===-1&&delete ie[n]}),jt.forEach(function(n){var r=n.mixout?n.mixout():{};if(Object.keys(r).forEach(function(o){typeof r[o]=="function"&&(a[o]=r[o]),Ee(r[o])==="object"&&Object.keys(r[o]).forEach(function(l){a[o]||(a[o]={}),a[o][l]=r[o][l]})}),n.hooks){var i=n.hooks();Object.keys(i).forEach(function(o){re[o]||(re[o]=[]),re[o].push(i[o])})}n.provides&&n.provides(ie)}),a}function Qe(e,t){for(var a=arguments.length,n=new Array(a>2?a-2:0),r=2;r<a;r++)n[r-2]=arguments[r];var i=re[e]||[];return i.forEach(function(o){t=o.apply(null,[t].concat(n))}),t}function Z(e){for(var t=arguments.length,a=new Array(t>1?t-1:0),n=1;n<t;n++)a[n-1]=arguments[n];var r=re[e]||[];r.forEach(function(i){i.apply(null,a)})}function V(){var e=arguments[0],t=Array.prototype.slice.call(arguments,1);return ie[e]?ie[e].apply(null,t):void 0}function Ze(e){e.prefix==="fa"&&(e.prefix="fas");var t=e.iconName,a=e.prefix||J();if(t)return t=K(a,t)||t,Tt(Za.definitions,a,t)||Tt(j.styles,a,t)}var Za=new Yi,Bi=function(){p.autoReplaceSvg=!1,p.observeMutations=!1,Z("noAuto")},Xi={i2svg:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return B?(Z("beforeI2svg",t),V("pseudoElements2svg",t),V("i2svg",t)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},a=t.autoReplaceSvgRoot;p.autoReplaceSvg===!1&&(p.autoReplaceSvg=!0),p.observeMutations=!0,_i(function(){Ji({autoReplaceSvgRoot:a}),Z("watch",t)})}},qi={icon:function(t){if(t===null)return null;if(Ee(t)==="object"&&t.prefix&&t.iconName)return{prefix:t.prefix,iconName:K(t.prefix,t.iconName)||t.iconName};if(Array.isArray(t)&&t.length===2){var a=t[1].indexOf("fa-")===0?t[1].slice(3):t[1],n=_e(t[0]);return{prefix:n,iconName:K(n,a)||a}}if(typeof t=="string"&&(t.indexOf("".concat(p.cssPrefix,"-"))>-1||t.match(vi))){var r=Me(t.split(" "),{skipLookups:!0});return{prefix:r.prefix||J(),iconName:K(r.prefix,r.iconName)||r.iconName}}if(typeof t=="string"){var i=J();return{prefix:i,iconName:K(i,t)||t}}}},R={noAuto:Bi,config:p,dom:Xi,parse:qi,library:Za,findIconDefinition:Ze,toHtml:ye},Ji=function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},a=t.autoReplaceSvgRoot,n=a===void 0?M:a;(Object.keys(j.styles).length>0||p.autoFetchSvg)&&B&&p.autoReplaceSvg&&R.dom.i2svg({node:n})};function Ne(e,t){return Object.defineProperty(e,"abstract",{get:t}),Object.defineProperty(e,"html",{get:function(){return e.abstract.map(function(n){return ye(n)})}}),Object.defineProperty(e,"node",{get:function(){if(B){var n=M.createElement("div");return n.innerHTML=e.html,n.children}}}),e}function Vi(e){var t=e.children,a=e.main,n=e.mask,r=e.attributes,i=e.styles,o=e.transform;if(ut(o)&&a.found&&!n.found){var l=a.width,f=a.height,d={x:l/f/2,y:.5};r.style=Le(c(c({},i),{},{"transform-origin":"".concat(d.x+o.x/16,"em ").concat(d.y+o.y/16,"em")}))}return[{tag:"svg",attributes:r,children:t}]}function Ki(e){var t=e.prefix,a=e.iconName,n=e.children,r=e.attributes,i=e.symbol,o=i===!0?"".concat(t,"-").concat(p.cssPrefix,"-").concat(a):i;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:c(c({},r),{},{id:o}),children:n}]}]}function Qi(e){var t=["aria-label","aria-labelledby","title","role"];return t.some(function(a){return a in e})}function vt(e){var t=e.icons,a=t.main,n=t.mask,r=e.prefix,i=e.iconName,o=e.transform,l=e.symbol,f=e.maskId,d=e.extra,m=e.watchable,v=m===void 0?!1:m,S=n.found?n:a,h=S.width,E=S.height,A=[p.replacementClass,i?"".concat(p.cssPrefix,"-").concat(i):""].filter(function(w){return d.classes.indexOf(w)===-1}).filter(function(w){return w!==""||!!w}).concat(d.classes).join(" "),L={children:[],attributes:c(c({},d.attributes),{},{"data-prefix":r,"data-icon":i,class:A,role:d.attributes.role||"img",viewBox:"0 0 ".concat(h," ").concat(E)})};!Qi(d.attributes)&&!d.attributes["aria-hidden"]&&(L.attributes["aria-hidden"]="true"),v&&(L.attributes[Q]="");var C=c(c({},L),{},{prefix:r,iconName:i,main:a,mask:n,maskId:f,transform:o,symbol:l,styles:c({},d.styles)}),N=n.found&&a.found?V("generateAbstractMask",C)||{children:[],attributes:{}}:V("generateAbstractIcon",C)||{children:[],attributes:{}},z=N.children,F=N.attributes;return C.children=z,C.attributes=F,l?Ki(C):Vi(C)}function $t(e){var t=e.content,a=e.width,n=e.height,r=e.transform,i=e.extra,o=e.watchable,l=o===void 0?!1:o,f=c(c({},i.attributes),{},{class:i.classes.join(" ")});l&&(f[Q]="");var d=c({},i.styles);ut(r)&&(d.transform=Pi({transform:r,width:a,height:n}),d["-webkit-transform"]=d.transform);var m=Le(d);m.length>0&&(f.style=m);var v=[];return v.push({tag:"span",attributes:f,children:[t]}),v}function Zi(e){var t=e.content,a=e.extra,n=c(c({},a.attributes),{},{class:a.classes.join(" ")}),r=Le(a.styles);r.length>0&&(n.style=r);var i=[];return i.push({tag:"span",attributes:n,children:[t]}),i}var We=j.styles;function et(e){var t=e[0],a=e[1],n=e.slice(4),r=Ie(n,1),i=r[0],o=null;return Array.isArray(i)?o={tag:"g",attributes:{class:"".concat(p.cssPrefix,"-").concat($e.GROUP)},children:[{tag:"path",attributes:{class:"".concat(p.cssPrefix,"-").concat($e.SECONDARY),fill:"currentColor",d:i[0]}},{tag:"path",attributes:{class:"".concat(p.cssPrefix,"-").concat($e.PRIMARY),fill:"currentColor",d:i[1]}}]}:o={tag:"path",attributes:{fill:"currentColor",d:i}},{found:!0,width:t,height:a,icon:o}}var eo={found:!1,width:512,height:512};function to(e,t){!Oa&&!p.showMissingIcons&&e&&console.error('Icon with name "'.concat(e,'" and prefix "').concat(t,'" is missing.'))}function tt(e,t){var a=t;return t==="fa"&&p.styleDefault!==null&&(t=J()),new Promise(function(n,r){if(a==="fa"){var i=Ka(e)||{};e=i.iconName||e,t=i.prefix||t}if(e&&t&&We[t]&&We[t][e]){var o=We[t][e];return n(et(o))}to(e,t),n(c(c({},eo),{},{icon:p.showMissingIcons&&e?V("missingIconAbstract")||{}:{}}))})}var Dt=function(){},at=p.measurePerformance&&xe&&xe.mark&&xe.measure?xe:{mark:Dt,measure:Dt},ce='FA "7.2.0"',ao=function(t){return at.mark("".concat(ce," ").concat(t," begins")),function(){return en(t)}},en=function(t){at.mark("".concat(ce," ").concat(t," ends")),at.measure("".concat(ce," ").concat(t),"".concat(ce," ").concat(t," begins"),"".concat(ce," ").concat(t," ends"))},pt={begin:ao,end:en},Ae=function(){};function Ut(e){var t=e.getAttribute?e.getAttribute(Q):null;return typeof t=="string"}function no(e){var t=e.getAttribute?e.getAttribute(st):null,a=e.getAttribute?e.getAttribute(lt):null;return t&&a}function ro(e){return e&&e.classList&&e.classList.contains&&e.classList.contains(p.replacementClass)}function io(){if(p.autoReplaceSvg===!0)return ke.replace;var e=ke[p.autoReplaceSvg];return e||ke.replace}function oo(e){return M.createElementNS("http://www.w3.org/2000/svg",e)}function so(e){return M.createElement(e)}function tn(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=t.ceFn,n=a===void 0?e.tag==="svg"?oo:so:a;if(typeof e=="string")return M.createTextNode(e);var r=n(e.tag);Object.keys(e.attributes||[]).forEach(function(o){r.setAttribute(o,e.attributes[o])});var i=e.children||[];return i.forEach(function(o){r.appendChild(tn(o,{ceFn:n}))}),r}function lo(e){var t=" ".concat(e.outerHTML," ");return t="".concat(t,"Font Awesome fontawesome.com "),t}var ke={replace:function(t){var a=t[0];if(a.parentNode)if(t[1].forEach(function(r){a.parentNode.insertBefore(tn(r),a)}),a.getAttribute(Q)===null&&p.keepOriginalSource){var n=M.createComment(lo(a));a.parentNode.replaceChild(n,a)}else a.remove()},nest:function(t){var a=t[0],n=t[1];if(~ct(a).indexOf(p.replacementClass))return ke.replace(t);var r=new RegExp("".concat(p.cssPrefix,"-.*"));if(delete n[0].attributes.id,n[0].attributes.class){var i=n[0].attributes.class.split(" ").reduce(function(l,f){return f===p.replacementClass||f.match(r)?l.toSvg.push(f):l.toNode.push(f),l},{toNode:[],toSvg:[]});n[0].attributes.class=i.toSvg.join(" "),i.toNode.length===0?a.removeAttribute("class"):a.setAttribute("class",i.toNode.join(" "))}var o=n.map(function(l){return ye(l)}).join(`
`);a.setAttribute(Q,""),a.innerHTML=o}};function Wt(e){e()}function an(e,t){var a=typeof t=="function"?t:Ae;if(e.length===0)a();else{var n=Wt;p.mutateApproach===ui&&(n=q.requestAnimationFrame||Wt),n(function(){var r=io(),i=pt.begin("mutate");e.map(r),i(),a()})}}var ht=!1;function nn(){ht=!0}function nt(){ht=!1}var Pe=null;function Yt(e){if(Pt&&p.observeMutations){var t=e.treeCallback,a=t===void 0?Ae:t,n=e.nodeCallback,r=n===void 0?Ae:n,i=e.pseudoElementsCallback,o=i===void 0?Ae:i,l=e.observeMutationsRoot,f=l===void 0?M:l;Pe=new Pt(function(d){if(!ht){var m=J();se(d).forEach(function(v){if(v.type==="childList"&&v.addedNodes.length>0&&!Ut(v.addedNodes[0])&&(p.searchPseudoElements&&o(v.target),a(v.target)),v.type==="attributes"&&v.target.parentNode&&p.searchPseudoElements&&o([v.target],!0),v.type==="attributes"&&Ut(v.target)&&~gi.indexOf(v.attributeName))if(v.attributeName==="class"&&no(v.target)){var S=Me(ct(v.target)),h=S.prefix,E=S.iconName;v.target.setAttribute(st,h||m),E&&v.target.setAttribute(lt,E)}else ro(v.target)&&r(v.target)})}}),B&&Pe.observe(f,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}}function fo(){Pe&&Pe.disconnect()}function co(e){var t=e.getAttribute("style"),a=[];return t&&(a=t.split(";").reduce(function(n,r){var i=r.split(":"),o=i[0],l=i.slice(1);return o&&l.length>0&&(n[o]=l.join(":").trim()),n},{})),a}function uo(e){var t=e.getAttribute("data-prefix"),a=e.getAttribute("data-icon"),n=e.innerText!==void 0?e.innerText.trim():"",r=Me(ct(e));return r.prefix||(r.prefix=J()),t&&a&&(r.prefix=t,r.iconName=a),r.iconName&&r.prefix||(r.prefix&&n.length>0&&(r.iconName=Oi(r.prefix,e.innerText)||mt(r.prefix,Ya(e.innerText))),!r.iconName&&p.autoFetchSvg&&e.firstChild&&e.firstChild.nodeType===Node.TEXT_NODE&&(r.iconName=e.firstChild.data)),r}function mo(e){var t=se(e.attributes).reduce(function(a,n){return a.name!=="class"&&a.name!=="style"&&(a[n.name]=n.value),a},{});return t}function vo(){return{iconName:null,prefix:null,transform:U,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function Ht(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},a=uo(e),n=a.iconName,r=a.prefix,i=a.rest,o=mo(e),l=Qe("parseNodeAttributes",{},e),f=t.styleParser?co(e):[];return c({iconName:n,prefix:r,transform:U,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:i,styles:f,attributes:o}},l)}var po=j.styles;function rn(e){var t=p.autoReplaceSvg==="nest"?Ht(e,{styleParser:!1}):Ht(e);return~t.extra.classes.indexOf(Ra)?V("generateLayersText",e,t):V("generateSvgReplacementMutation",e,t)}function ho(){return[].concat($(La),$(_a))}function Gt(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!B)return Promise.resolve();var a=M.documentElement.classList,n=function(v){return a.add("".concat(_t,"-").concat(v))},r=function(v){return a.remove("".concat(_t,"-").concat(v))},i=p.autoFetchSvg?ho():ca.concat(Object.keys(po));i.includes("fa")||i.push("fa");var o=[".".concat(Ra,":not([").concat(Q,"])")].concat(i.map(function(m){return".".concat(m,":not([").concat(Q,"])")})).join(", ");if(o.length===0)return Promise.resolve();var l=[];try{l=se(e.querySelectorAll(o))}catch{}if(l.length>0)n("pending"),r("complete");else return Promise.resolve();var f=pt.begin("onTree"),d=l.reduce(function(m,v){try{var S=rn(v);S&&m.push(S)}catch(h){Oa||h.name==="MissingIcon"&&console.error(h)}return m},[]);return new Promise(function(m,v){Promise.all(d).then(function(S){an(S,function(){n("active"),n("complete"),r("pending"),typeof t=="function"&&t(),f(),m()})}).catch(function(S){f(),v(S)})})}function go(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;rn(e).then(function(a){a&&an([a],t)})}function yo(e){return function(t){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=(t||{}).icon?t:Ze(t||{}),r=a.mask;return r&&(r=(r||{}).icon?r:Ze(r||{})),e(n,c(c({},a),{},{mask:r}))}}var bo=function(t){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=a.transform,r=n===void 0?U:n,i=a.symbol,o=i===void 0?!1:i,l=a.mask,f=l===void 0?null:l,d=a.maskId,m=d===void 0?null:d,v=a.classes,S=v===void 0?[]:v,h=a.attributes,E=h===void 0?{}:h,A=a.styles,L=A===void 0?{}:A;if(t){var C=t.prefix,N=t.iconName,z=t.icon;return Ne(c({type:"icon"},t),function(){return Z("beforeDOMElementCreation",{iconDefinition:t,params:a}),vt({icons:{main:et(z),mask:f?et(f.icon):{found:!1,width:null,height:null,icon:{}}},prefix:C,iconName:N,transform:c(c({},U),r),symbol:o,maskId:m,extra:{attributes:E,styles:L,classes:S}})})}},xo={mixout:function(){return{icon:yo(bo)}},hooks:function(){return{mutationObserverCallbacks:function(a){return a.treeCallback=Gt,a.nodeCallback=go,a}}},provides:function(t){t.i2svg=function(a){var n=a.node,r=n===void 0?M:n,i=a.callback,o=i===void 0?function(){}:i;return Gt(r,o)},t.generateSvgReplacementMutation=function(a,n){var r=n.iconName,i=n.prefix,o=n.transform,l=n.symbol,f=n.mask,d=n.maskId,m=n.extra;return new Promise(function(v,S){Promise.all([tt(r,i),f.iconName?tt(f.iconName,f.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(function(h){var E=Ie(h,2),A=E[0],L=E[1];v([a,vt({icons:{main:A,mask:L},prefix:i,iconName:r,transform:o,symbol:l,maskId:d,extra:m,watchable:!0})])}).catch(S)})},t.generateAbstractIcon=function(a){var n=a.children,r=a.attributes,i=a.main,o=a.transform,l=a.styles,f=Le(l);f.length>0&&(r.style=f);var d;return ut(o)&&(d=V("generateAbstractTransformGrouping",{main:i,transform:o,containerWidth:i.width,iconWidth:i.width})),n.push(d||i.icon),{children:n,attributes:r}}}},So={mixout:function(){return{layer:function(a){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=n.classes,i=r===void 0?[]:r;return Ne({type:"layer"},function(){Z("beforeDOMElementCreation",{assembler:a,params:n});var o=[];return a(function(l){Array.isArray(l)?l.map(function(f){o=o.concat(f.abstract)}):o=o.concat(l.abstract)}),[{tag:"span",attributes:{class:["".concat(p.cssPrefix,"-layers")].concat($(i)).join(" ")},children:o}]})}}}},wo={mixout:function(){return{counter:function(a){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};n.title;var r=n.classes,i=r===void 0?[]:r,o=n.attributes,l=o===void 0?{}:o,f=n.styles,d=f===void 0?{}:f;return Ne({type:"counter",content:a},function(){return Z("beforeDOMElementCreation",{content:a,params:n}),Zi({content:a.toString(),extra:{attributes:l,styles:d,classes:["".concat(p.cssPrefix,"-layers-counter")].concat($(i))}})})}}}},Ao={mixout:function(){return{text:function(a){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=n.transform,i=r===void 0?U:r,o=n.classes,l=o===void 0?[]:o,f=n.attributes,d=f===void 0?{}:f,m=n.styles,v=m===void 0?{}:m;return Ne({type:"text",content:a},function(){return Z("beforeDOMElementCreation",{content:a,params:n}),$t({content:a,transform:c(c({},U),i),extra:{attributes:d,styles:v,classes:["".concat(p.cssPrefix,"-layers-text")].concat($(l))}})})}}},provides:function(t){t.generateLayersText=function(a,n){var r=n.transform,i=n.extra,o=null,l=null;if(la){var f=parseInt(getComputedStyle(a).fontSize,10),d=a.getBoundingClientRect();o=d.width/f,l=d.height/f}return Promise.resolve([a,$t({content:a.innerHTML,width:o,height:l,transform:r,extra:i,watchable:!0})])}}},on=new RegExp('"',"ug"),Bt=[1105920,1112319],Xt=c(c(c(c({},{FontAwesome:{normal:"fas",400:"fas"}}),ar),fi),ur),rt=Object.keys(Xt).reduce(function(e,t){return e[t.toLowerCase()]=Xt[t],e},{}),ko=Object.keys(rt).reduce(function(e,t){var a=rt[t];return e[t]=a[900]||$(Object.entries(a))[0][1],e},{});function Eo(e){var t=e.replace(on,"");return Ya($(t)[0]||"")}function Co(e){var t=e.getPropertyValue("font-feature-settings").includes("ss01"),a=e.getPropertyValue("content"),n=a.replace(on,""),r=n.codePointAt(0),i=r>=Bt[0]&&r<=Bt[1],o=n.length===2?n[0]===n[1]:!1;return i||o||t}function Po(e,t){var a=e.replace(/^['"]|['"]$/g,"").toLowerCase(),n=parseInt(t),r=isNaN(n)?"normal":n;return(rt[a]||{})[r]||ko[a]}function qt(e,t){var a="".concat(ci).concat(t.replace(":","-"));return new Promise(function(n,r){if(e.getAttribute(a)!==null)return n();var i=se(e.children),o=i.filter(function(X){return X.getAttribute(Xe)===t})[0],l=q.getComputedStyle(e,t),f=l.getPropertyValue("font-family"),d=f.match(pi),m=l.getPropertyValue("font-weight"),v=l.getPropertyValue("content");if(o&&!d)return e.removeChild(o),n();if(d&&v!=="none"&&v!==""){var S=l.getPropertyValue("content"),h=Po(f,m),E=Eo(S),A=d[0].startsWith("FontAwesome"),L=Co(l),C=mt(h,E),N=C;if(A){var z=Fi(E);z.iconName&&z.prefix&&(C=z.iconName,h=z.prefix)}if(C&&!L&&(!o||o.getAttribute(st)!==h||o.getAttribute(lt)!==N)){e.setAttribute(a,N),o&&e.removeChild(o);var F=vo(),w=F.extra;w.attributes[Xe]=t,tt(C,h).then(function(X){var I=vt(c(c({},F),{},{icons:{main:X,mask:Qa()},prefix:h,iconName:N,extra:w,watchable:!0})),ee=M.createElementNS("http://www.w3.org/2000/svg","svg");t==="::before"?e.insertBefore(ee,e.firstChild):e.appendChild(ee),ee.outerHTML=I.map(function(le){return ye(le)}).join(`
`),e.removeAttribute(a),n()}).catch(r)}else n()}else n()})}function Io(e){return Promise.all([qt(e,"::before"),qt(e,"::after")])}function Lo(e){return e.parentNode!==document.head&&!~di.indexOf(e.tagName.toUpperCase())&&!e.getAttribute(Xe)&&(!e.parentNode||e.parentNode.tagName!=="svg")}var _o=function(t){return!!t&&Ta.some(function(a){return t.includes(a)})},Mo=function(t){if(!t)return[];var a=new Set,n=t.split(/,(?![^()]*\))/).map(function(f){return f.trim()});n=n.flatMap(function(f){return f.includes("(")?f:f.split(",").map(function(d){return d.trim()})});var r=we(n),i;try{for(r.s();!(i=r.n()).done;){var o=i.value;if(_o(o)){var l=Ta.reduce(function(f,d){return f.replace(d,"")},o);l!==""&&l!=="*"&&a.add(l)}}}catch(f){r.e(f)}finally{r.f()}return a};function Jt(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;if(B){var a;if(t)a=e;else if(p.searchPseudoElementsFullScan)a=e.querySelectorAll("*");else{var n=new Set,r=we(document.styleSheets),i;try{for(r.s();!(i=r.n()).done;){var o=i.value;try{var l=we(o.cssRules),f;try{for(l.s();!(f=l.n()).done;){var d=f.value,m=Mo(d.selectorText),v=we(m),S;try{for(v.s();!(S=v.n()).done;){var h=S.value;n.add(h)}}catch(A){v.e(A)}finally{v.f()}}}catch(A){l.e(A)}finally{l.f()}}catch(A){p.searchPseudoElementsWarnings&&console.warn("Font Awesome: cannot parse stylesheet: ".concat(o.href," (").concat(A.message,`)
If it declares any Font Awesome CSS pseudo-elements, they will not be rendered as SVG icons. Add crossorigin="anonymous" to the <link>, enable searchPseudoElementsFullScan for slower but more thorough DOM parsing, or suppress this warning by setting searchPseudoElementsWarnings to false.`))}}}catch(A){r.e(A)}finally{r.f()}if(!n.size)return;var E=Array.from(n).join(", ");try{a=e.querySelectorAll(E)}catch{}}return new Promise(function(A,L){var C=se(a).filter(Lo).map(Io),N=pt.begin("searchPseudoElements");nn(),Promise.all(C).then(function(){N(),nt(),A()}).catch(function(){N(),nt(),L()})})}}var No={hooks:function(){return{mutationObserverCallbacks:function(a){return a.pseudoElementsCallback=Jt,a}}},provides:function(t){t.pseudoElements2svg=function(a){var n=a.node,r=n===void 0?M:n;p.searchPseudoElements&&Jt(r)}}},Vt=!1,zo={mixout:function(){return{dom:{unwatch:function(){nn(),Vt=!0}}}},hooks:function(){return{bootstrap:function(){Yt(Qe("mutationObserverCallbacks",{}))},noAuto:function(){fo()},watch:function(a){var n=a.observeMutationsRoot;Vt?nt():Yt(Qe("mutationObserverCallbacks",{observeMutationsRoot:n}))}}}},Kt=function(t){var a={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return t.toLowerCase().split(" ").reduce(function(n,r){var i=r.toLowerCase().split("-"),o=i[0],l=i.slice(1).join("-");if(o&&l==="h")return n.flipX=!0,n;if(o&&l==="v")return n.flipY=!0,n;if(l=parseFloat(l),isNaN(l))return n;switch(o){case"grow":n.size=n.size+l;break;case"shrink":n.size=n.size-l;break;case"left":n.x=n.x-l;break;case"right":n.x=n.x+l;break;case"up":n.y=n.y-l;break;case"down":n.y=n.y+l;break;case"rotate":n.rotate=n.rotate+l;break}return n},a)},To={mixout:function(){return{parse:{transform:function(a){return Kt(a)}}}},hooks:function(){return{parseNodeAttributes:function(a,n){var r=n.getAttribute("data-fa-transform");return r&&(a.transform=Kt(r)),a}}},provides:function(t){t.generateAbstractTransformGrouping=function(a){var n=a.main,r=a.transform,i=a.containerWidth,o=a.iconWidth,l={transform:"translate(".concat(i/2," 256)")},f="translate(".concat(r.x*32,", ").concat(r.y*32,") "),d="scale(".concat(r.size/16*(r.flipX?-1:1),", ").concat(r.size/16*(r.flipY?-1:1),") "),m="rotate(".concat(r.rotate," 0 0)"),v={transform:"".concat(f," ").concat(d," ").concat(m)},S={transform:"translate(".concat(o/2*-1," -256)")},h={outer:l,inner:v,path:S};return{tag:"g",attributes:c({},h.outer),children:[{tag:"g",attributes:c({},h.inner),children:[{tag:n.icon.tag,children:n.icon.children,attributes:c(c({},n.icon.attributes),h.path)}]}]}}}},Ye={x:0,y:0,width:"100%",height:"100%"};function Qt(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return e.attributes&&(e.attributes.fill||t)&&(e.attributes.fill="black"),e}function Oo(e){return e.tag==="g"?e.children:[e]}var Fo={hooks:function(){return{parseNodeAttributes:function(a,n){var r=n.getAttribute("data-fa-mask"),i=r?Me(r.split(" ").map(function(o){return o.trim()})):Qa();return i.prefix||(i.prefix=J()),a.mask=i,a.maskId=n.getAttribute("data-fa-mask-id"),a}}},provides:function(t){t.generateAbstractMask=function(a){var n=a.children,r=a.attributes,i=a.main,o=a.mask,l=a.maskId,f=a.transform,d=i.width,m=i.icon,v=o.width,S=o.icon,h=Ci({transform:f,containerWidth:v,iconWidth:d}),E={tag:"rect",attributes:c(c({},Ye),{},{fill:"white"})},A=m.children?{children:m.children.map(Qt)}:{},L={tag:"g",attributes:c({},h.inner),children:[Qt(c({tag:m.tag,attributes:c(c({},m.attributes),h.path)},A))]},C={tag:"g",attributes:c({},h.outer),children:[L]},N="mask-".concat(l||Nt()),z="clip-".concat(l||Nt()),F={tag:"mask",attributes:c(c({},Ye),{},{id:N,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[E,C]},w={tag:"defs",children:[{tag:"clipPath",attributes:{id:z},children:Oo(S)},F]};return n.push(w,{tag:"rect",attributes:c({fill:"currentColor","clip-path":"url(#".concat(z,")"),mask:"url(#".concat(N,")")},Ye)}),{children:n,attributes:r}}}},Ro={provides:function(t){var a=!1;q.matchMedia&&(a=q.matchMedia("(prefers-reduced-motion: reduce)").matches),t.missingIconAbstract=function(){var n=[],r={fill:"currentColor"},i={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};n.push({tag:"path",attributes:c(c({},r),{},{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});var o=c(c({},i),{},{attributeName:"opacity"}),l={tag:"circle",attributes:c(c({},r),{},{cx:"256",cy:"364",r:"28"}),children:[]};return a||l.children.push({tag:"animate",attributes:c(c({},i),{},{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:c(c({},o),{},{values:"1;0;1;1;0;1;"})}),n.push(l),n.push({tag:"path",attributes:c(c({},r),{},{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:a?[]:[{tag:"animate",attributes:c(c({},o),{},{values:"1;0;0;0;0;1;"})}]}),a||n.push({tag:"path",attributes:c(c({},r),{},{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:c(c({},o),{},{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:n}}}},jo={hooks:function(){return{parseNodeAttributes:function(a,n){var r=n.getAttribute("data-fa-symbol"),i=r===null?!1:r===""?!0:r;return a.symbol=i,a}}}},$o=[Li,xo,So,wo,Ao,No,zo,To,Fo,Ro,jo];Gi($o,{mixoutsTo:R});R.noAuto;var pe=R.config;R.library;R.dom;var sn=R.parse;R.findIconDefinition;R.toHtml;var Do=R.icon;R.layer;R.text;R.counter;function Uo(e){return e=e-0,e===e}function ln(e){return Uo(e)?e:(e=e.replace(/[_-]+(.)?/g,(t,a)=>a?a.toUpperCase():""),e.charAt(0).toLowerCase()+e.slice(1))}function Wo(e){return e.charAt(0).toUpperCase()+e.slice(1)}var ne=new Map,Yo=1e3;function Ho(e){if(ne.has(e))return ne.get(e);const t={};let a=0;const n=e.length;for(;a<n;){const r=e.indexOf(";",a),i=r===-1?n:r,o=e.slice(a,i).trim();if(o){const l=o.indexOf(":");if(l>0){const f=o.slice(0,l).trim(),d=o.slice(l+1).trim();if(f&&d){const m=ln(f);t[m.startsWith("webkit")?Wo(m):m]=d}}}a=i+1}if(ne.size===Yo){const r=ne.keys().next().value;r&&ne.delete(r)}return ne.set(e,t),t}function fn(e,t,a={}){if(typeof t=="string")return t;const n=(t.children||[]).map(m=>fn(e,m)),r=t.attributes||{},i={};for(const[m,v]of Object.entries(r))switch(!0){case m==="class":{i.className=v;break}case m==="style":{i.style=Ho(String(v));break}case m.startsWith("aria-"):case m.startsWith("data-"):{i[m.toLowerCase()]=v;break}default:i[ln(m)]=v}const{style:o,role:l,"aria-label":f,...d}=a;return o&&(i.style=i.style?{...i.style,...o}:o),l&&(i.role=l),f&&(i["aria-label"]=f,i["aria-hidden"]="false"),e(t.tag,{...i,...d},...n)}var Go=fn.bind(null,na.createElement),Zt=(e,t)=>{const a=aa.useId();return e||(t?a:void 0)},Bo=class{constructor(e="react-fontawesome"){this.enabled=!1;let t=!1;try{t=typeof process<"u"&&!1}catch{}this.scope=e,this.enabled=t}log(...e){this.enabled&&console.log(`[${this.scope}]`,...e)}warn(...e){this.enabled&&console.warn(`[${this.scope}]`,...e)}error(...e){this.enabled&&console.error(`[${this.scope}]`,...e)}},Xo="searchPseudoElementsFullScan"in pe?"7.0.0":"6.0.0",qo=Number.parseInt(Xo)>=7,me="fa",W={beat:"fa-beat",fade:"fa-fade",beatFade:"fa-beat-fade",bounce:"fa-bounce",shake:"fa-shake",spin:"fa-spin",spinPulse:"fa-spin-pulse",spinReverse:"fa-spin-reverse",pulse:"fa-pulse"},Jo={left:"fa-pull-left",right:"fa-pull-right"},Vo={90:"fa-rotate-90",180:"fa-rotate-180",270:"fa-rotate-270"},Ko={"2xs":"fa-2xs",xs:"fa-xs",sm:"fa-sm",lg:"fa-lg",xl:"fa-xl","2xl":"fa-2xl","1x":"fa-1x","2x":"fa-2x","3x":"fa-3x","4x":"fa-4x","5x":"fa-5x","6x":"fa-6x","7x":"fa-7x","8x":"fa-8x","9x":"fa-9x","10x":"fa-10x"},Y={border:"fa-border",fixedWidth:"fa-fw",flip:"fa-flip",flipHorizontal:"fa-flip-horizontal",flipVertical:"fa-flip-vertical",inverse:"fa-inverse",rotateBy:"fa-rotate-by",swapOpacity:"fa-swap-opacity",widthAuto:"fa-width-auto"};function Qo(e){const t=pe.cssPrefix||pe.familyPrefix||me;return t===me?e:e.replace(new RegExp(String.raw`(?<=^|\s)${me}-`,"g"),`${t}-`)}function Zo(e){const{beat:t,fade:a,beatFade:n,bounce:r,shake:i,spin:o,spinPulse:l,spinReverse:f,pulse:d,fixedWidth:m,inverse:v,border:S,flip:h,size:E,rotation:A,pull:L,swapOpacity:C,rotateBy:N,widthAuto:z,className:F}=e,w=[];return F&&w.push(...F.split(" ")),t&&w.push(W.beat),a&&w.push(W.fade),n&&w.push(W.beatFade),r&&w.push(W.bounce),i&&w.push(W.shake),o&&w.push(W.spin),f&&w.push(W.spinReverse),l&&w.push(W.spinPulse),d&&w.push(W.pulse),m&&w.push(Y.fixedWidth),v&&w.push(Y.inverse),S&&w.push(Y.border),h===!0&&w.push(Y.flip),(h==="horizontal"||h==="both")&&w.push(Y.flipHorizontal),(h==="vertical"||h==="both")&&w.push(Y.flipVertical),E!=null&&w.push(Ko[E]),A!=null&&A!==0&&w.push(Vo[A]),L!=null&&w.push(Jo[L]),C&&w.push(Y.swapOpacity),qo?(N&&w.push(Y.rotateBy),z&&w.push(Y.widthAuto),(pe.cssPrefix||pe.familyPrefix||me)===me?w:w.map(Qo)):w}var es=e=>typeof e=="object"&&"icon"in e&&!!e.icon;function ea(e){if(e)return es(e)?e:sn.icon(e)}function ts(e){return Object.keys(e)}var ta=new Bo("FontAwesomeIcon"),cn={border:!1,className:"",mask:void 0,maskId:void 0,fixedWidth:!1,inverse:!1,flip:!1,icon:void 0,listItem:!1,pull:void 0,pulse:!1,rotation:void 0,rotateBy:!1,size:void 0,spin:!1,spinPulse:!1,spinReverse:!1,beat:!1,fade:!1,beatFade:!1,bounce:!1,shake:!1,symbol:!1,title:"",titleId:void 0,transform:void 0,swapOpacity:!1,widthAuto:!1},as=new Set(Object.keys(cn)),ns=na.forwardRef((e,t)=>{const a={...cn,...e},{icon:n,mask:r,symbol:i,title:o,titleId:l,maskId:f,transform:d}=a,m=Zt(f,!!r),v=Zt(l,!!o),S=ea(n);if(!S)return ta.error("Icon lookup is undefined",n),null;const h=Zo(a),E=typeof d=="string"?sn.transform(d):d,A=ea(r),L=Do(S,{...h.length>0&&{classes:h},...E&&{transform:E},...A&&{mask:A},symbol:i,title:o,titleId:v,maskId:m});if(!L)return ta.error("Could not find icon",S),null;const{abstract:C}=L,N={ref:t};for(const z of ts(a))as.has(z)||(N[z]=a[z]);return Go(C[0],N)});ns.displayName="FontAwesomeIcon";var rs={prefix:"fas",iconName:"rotate",icon:[512,512,[128260,"sync-alt"],"f2f1","M480.1 192l7.9 0c13.3 0 24-10.7 24-24l0-144c0-9.7-5.8-18.5-14.8-22.2S477.9 .2 471 7L419.3 58.8C375 22.1 318 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1C79.2 135.5 159.3 64 256 64 300.4 64 341.2 79 373.7 104.3L327 151c-6.9 6.9-8.9 17.2-5.2 26.2S334.3 192 344 192l136.1 0zm29.4 100.5c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-44.4 0-85.2-15-117.7-40.3L185 361c6.9-6.9 8.9-17.2 5.2-26.2S177.7 320 168 320L24 320c-13.3 0-24 10.7-24 24L0 488c0 9.7 5.8 18.5 14.8 22.2S34.1 511.8 41 505l51.8-51.8C137 489.9 194 512 256 512 385 512 491.7 416.6 509.4 292.5z"]},ws=rs,is={prefix:"fas",iconName:"crop-simple",icon:[512,512,["crop-alt"],"f565","M128 32c0-17.7-14.3-32-32-32S64 14.3 64 32l0 32-32 0C14.3 64 0 78.3 0 96s14.3 32 32 32l32 0 0 256c0 35.3 28.7 64 64 64l208 0 0-64-208 0 0-352zM384 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-32 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0 0-256c0-35.3-28.7-64-64-64l-208 0 0 64 208 0 0 352z"]},As=is,os={prefix:"fas",iconName:"cloud-arrow-up",icon:[576,512,[62338,"cloud-upload","cloud-upload-alt"],"f0ee","M144 480c-79.5 0-144-64.5-144-144 0-63.4 41-117.2 97.9-136.5-1.3-7.7-1.9-15.5-1.9-23.5 0-79.5 64.5-144 144-144 55.4 0 103.5 31.3 127.6 77.1 14.2-8.3 30.8-13.1 48.4-13.1 53 0 96 43 96 96 0 15.7-3.8 30.6-10.5 43.7 44 20.3 74.5 64.7 74.5 116.3 0 70.7-57.3 128-128 128l-304 0zM305 191c-9.4-9.4-24.6-9.4-33.9 0l-72 72c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l31-31 0 102.1c0 13.3 10.7 24 24 24s24-10.7 24-24l0-102.1 31 31c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-72-72z"]},ks=os,Es={prefix:"fas",iconName:"power-off",icon:[512,512,[9211],"f011","M288 0c0-17.7-14.3-32-32-32S224-17.7 224 0l0 256c0 17.7 14.3 32 32 32s32-14.3 32-32L288 0zM146.3 98.4c14.5-10.1 18-30.1 7.9-44.6s-30.1-18-44.6-7.9C43.4 92.1 0 169 0 256 0 397.4 114.6 512 256 512S512 397.4 512 256c0-87-43.4-163.9-109.7-210.1-14.5-10.1-34.4-6.6-44.6 7.9s-6.6 34.4 7.9 44.6c49.8 34.8 82.3 92.4 82.3 157.6 0 106-86 192-192 192S64 362 64 256c0-65.2 32.5-122.9 82.3-157.6z"]},ss={prefix:"fas",iconName:"magnifying-glass",icon:[512,512,[128269,"search"],"f002","M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"]},Cs=ss,Ps={prefix:"fas",iconName:"ban",icon:[512,512,[128683,"cancel"],"f05e","M367.2 412.5L99.5 144.8c-22.4 31.4-35.5 69.8-35.5 111.2 0 106 86 192 192 192 41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3c22.4-31.4 35.5-69.8 35.5-111.2 0-106-86-192-192-192-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0z"]},Is={prefix:"fas",iconName:"camera",icon:[512,512,[62258,"camera-alt"],"f030","M149.1 64.8L138.7 96 64 96C28.7 96 0 124.7 0 160L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64l-74.7 0-10.4-31.2C356.4 45.2 338.1 32 317.4 32L194.6 32c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"]},Ls={prefix:"fas",iconName:"stethoscope",icon:[576,512,[129658],"f0f1","M32 48C32 21.5 53.5 0 80 0l48 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0 0 128c0 53 43 96 96 96s96-43 96-96l0-128-32 0c-17.7 0-32-14.3-32-32S238.3 0 256 0l48 0c26.5 0 48 21.5 48 48l0 144c0 77.4-55 142-128 156.8l0 19.2c0 61.9 50.1 112 112 112s112-50.1 112-112l0-85.5c-37.3-13.2-64-48.7-64-90.5 0-53 43-96 96-96s96 43 96 96c0 41.8-26.7 77.4-64 90.5l0 85.5c0 97.2-78.8 176-176 176S160 465.2 160 368l0-19.2C87 334 32 269.4 32 192L32 48zM480 224a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"]},_s={prefix:"fas",iconName:"clock",icon:[512,512,[128339,"clock-four"],"f017","M256 0a256 256 0 1 1 0 512 256 256 0 1 1 0-512zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"]},Ms={prefix:"fas",iconName:"satellite",icon:[512,512,[128752],"f7bf","M199 7c9.4-9.4 24.6-9.4 33.9 0l89.4 89.4 55-55c12.5-12.5 32.8-12.5 45.3 0l48 48c12.5 12.5 12.5 32.8 0 45.3l-55 55 89.4 89.4c9.4 9.4 9.4 24.6 0 33.9l-96 96c-9.4 9.4-24.6 9.4-33.9 0l-89.4-89.4-15.5 15.5c11.4 24.6 17.8 52 17.8 80.9 0 31.7-7.7 61.5-21.2 87.8-4.7 9-16.7 10.3-23.8 3.1l-96.3-96.3-60 60c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l60-60-96.3-96.3c-7.2-7.2-5.9-19.2 3.1-23.8 26.3-13.6 56.2-21.2 87.8-21.2 28.9 0 56.3 6.4 80.9 17.8L192.4 226.3 103 137c-9.4-9.4-9.4-24.6 0-33.9L199 7zm17 50.9l-62.1 62.1 72.4 72.4 62.1-62.1-72.4-72.4zM392 358.1l62.1-62.1-72.4-72.4-62.1 62.1 72.4 72.4z"]},Ns={prefix:"fas",iconName:"paper-plane",icon:[576,512,[61913],"f1d8","M536.4-26.3c9.8-3.5 20.6-1 28 6.3s9.8 18.2 6.3 28l-178 496.9c-5 13.9-18.1 23.1-32.8 23.1-14.2 0-27-8.6-32.3-21.7l-64.2-158c-4.5-11-2.5-23.6 5.2-32.6l94.5-112.4c5.1-6.1 4.7-15-.9-20.6s-14.6-6-20.6-.9L229.2 276.1c-9.1 7.6-21.6 9.6-32.6 5.2L38.1 216.8c-13.1-5.3-21.7-18.1-21.7-32.3 0-14.7 9.2-27.8 23.1-32.8l496.9-178z"]},zs={prefix:"fas",iconName:"table",icon:[448,512,[],"f0ce","M384 32c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64l-320 0-6.5-.3C25.2 476.4 0 449.1 0 416L0 96C0 60.7 28.7 32 64 32l320 0zM64 320l0 96 128 0 0-96-128 0zm192 0l0 96 128 0 0-96-128 0zM64 256l128 0 0-96-128 0 0 96zm192 0l128 0 0-96-128 0 0 96z"]},Ts={prefix:"fas",iconName:"heart",icon:[512,512,[128153,128154,128155,128156,128420,129293,129294,129505,9829,10084,61578],"f004","M241 87.1l15 20.7 15-20.7C296 52.5 336.2 32 378.9 32 452.4 32 512 91.6 512 165.1l0 2.6c0 112.2-139.9 242.5-212.9 298.2-12.4 9.4-27.6 14.1-43.1 14.1s-30.8-4.6-43.1-14.1C139.9 410.2 0 279.9 0 167.7l0-2.6C0 91.6 59.6 32 133.1 32 175.8 32 216 52.5 241 87.1z"]},Os={prefix:"fas",iconName:"flask",icon:[448,512,[],"f0c3","M288 0L128 0C110.3 0 96 14.3 96 32s14.3 32 32 32L128 215.5 7.5 426.3C2.6 435 0 444.7 0 454.7 0 486.4 25.6 512 57.3 512l333.4 0c31.6 0 57.3-25.6 57.3-57.3 0-10-2.6-19.8-7.5-28.4L320 215.5 320 64c17.7 0 32-14.3 32-32S337.7 0 320 0L288 0zM192 215.5l0-151.5 64 0 0 151.5c0 11.1 2.9 22.1 8.4 31.8l41.6 72.7-164 0 41.6-72.7c5.5-9.7 8.4-20.6 8.4-31.8z"]},Fs={prefix:"fas",iconName:"database",icon:[448,512,[],"f1c0","M448 205.8c-14.8 9.8-31.8 17.7-49.5 24-47 16.8-108.7 26.2-174.5 26.2S96.4 246.5 49.5 229.8c-17.6-6.3-34.7-14.2-49.5-24L0 288c0 44.2 100.3 80 224 80s224-35.8 224-80l0-82.2zm0-77.8l0-48C448 35.8 347.7 0 224 0S0 35.8 0 80l0 48c0 44.2 100.3 80 224 80s224-35.8 224-80zM398.5 389.8C351.6 406.5 289.9 416 224 416S96.4 406.5 49.5 389.8c-17.6-6.3-34.7-14.2-49.5-24L0 432c0 44.2 100.3 80 224 80s224-35.8 224-80l0-66.2c-14.8 9.8-31.8 17.7-49.5 24z"]},Rs={prefix:"fas",iconName:"share",icon:[512,512,["mail-forward"],"f064","M307.8 18.4c-12 5-19.8 16.6-19.8 29.6l0 80-112 0c-97.2 0-176 78.8-176 176 0 113.3 81.5 163.9 100.2 174.1 2.5 1.4 5.3 1.9 8.1 1.9 10.9 0 19.7-8.9 19.7-19.7 0-7.5-4.3-14.4-9.8-19.5-9.4-8.8-22.2-26.4-22.2-56.7 0-53 43-96 96-96l96 0 0 80c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-9.2-9.2-22.9-11.9-34.9-6.9z"]},js={prefix:"fas",iconName:"comment",icon:[512,512,[128489,61669],"f075","M512 240c0 132.5-114.6 240-256 240-37.1 0-72.3-7.4-104.1-20.7L33.5 510.1c-9.4 4-20.2 1.7-27.1-5.8S-2 485.8 2.8 476.8l48.8-92.2C19.2 344.3 0 294.3 0 240 0 107.5 114.6 0 256 0S512 107.5 512 240z"]},ls={prefix:"fas",iconName:"circle-xmark",icon:[512,512,[61532,"times-circle","xmark-circle"],"f057","M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM167 167c9.4-9.4 24.6-9.4 33.9 0l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9z"]},$s=ls,Ds={prefix:"fas",iconName:"sun",icon:[576,512,[9728],"f185","M288-32c8.4 0 16.3 4.4 20.6 11.7L364.1 72.3 468.9 46c8.2-2 16.9 .4 22.8 6.3S500 67 498 75.1l-26.3 104.7 92.7 55.5c7.2 4.3 11.7 12.2 11.7 20.6s-4.4 16.3-11.7 20.6L471.7 332.1 498 436.8c2 8.2-.4 16.9-6.3 22.8S477 468 468.9 466l-104.7-26.3-55.5 92.7c-4.3 7.2-12.2 11.7-20.6 11.7s-16.3-4.4-20.6-11.7L211.9 439.7 107.2 466c-8.2 2-16.8-.4-22.8-6.3S76 445 78 436.8l26.2-104.7-92.6-55.5C4.4 272.2 0 264.4 0 256s4.4-16.3 11.7-20.6L104.3 179.9 78 75.1c-2-8.2 .3-16.8 6.3-22.8S99 44 107.2 46l104.7 26.2 55.5-92.6 1.8-2.6c4.5-5.7 11.4-9.1 18.8-9.1zm0 144a144 144 0 1 0 0 288 144 144 0 1 0 0-288zm0 240a96 96 0 1 1 0-192 96 96 0 1 1 0 192z"]},fs={prefix:"fas",iconName:"earth-americas",icon:[512,512,[127758,"earth","earth-america","globe-americas"],"f57d","M55.7 199.7l30.9 30.9c6 6 14.1 9.4 22.6 9.4l21.5 0c8.5 0 16.6 3.4 22.6 9.4l29.3 29.3c6 6 9.4 14.1 9.4 22.6l0 37.5c0 8.5 3.4 16.6 9.4 22.6l13.3 13.3c6 6 9.4 14.1 9.4 22.6l0 18.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-2.7c0-8.5 3.4-16.6 9.4-22.6l45.3-45.3c6-6 9.4-14.1 9.4-22.6l0-34.7c0-17.7-14.3-32-32-32l-82.7 0c-8.5 0-16.6-3.4-22.6-9.4l-16-16c-4.2-4.2-6.6-10-6.6-16 0-12.5 10.1-22.6 22.6-22.6l34.7 0c12.5 0 22.6-10.1 22.6-22.6 0-6-2.4-11.8-6.6-16l-19.7-19.7C242 130 240 125.1 240 120s2-10 5.7-13.7l17.3-17.3c5.8-5.8 9.1-13.7 9.1-21.9 0-7.2-2.4-13.7-6.4-18.9-3.2-.1-6.4-.2-9.6-.2-95.4 0-175.7 64.2-200.3 151.7zM464 256c0-34.6-8.4-67.2-23.4-95.8-6.4 .9-12.7 3.9-17.9 9.1l-13.4 13.4c-6 6-9.4 14.1-9.4 22.6l0 34.7c0 17.7 14.3 32 32 32l24.1 0c2.5 0 5-.3 7.3-.8 .4-5 .5-10.1 .5-15.2zM0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0z"]},Us=fs,Ws={prefix:"fas",iconName:"link",icon:[576,512,[128279,"chain"],"f0c1","M419.5 96c-16.6 0-32.7 4.5-46.8 12.7-15.8-16-34.2-29.4-54.5-39.5 28.2-24 64.1-37.2 101.3-37.2 86.4 0 156.5 70 156.5 156.5 0 41.5-16.5 81.3-45.8 110.6l-71.1 71.1c-29.3 29.3-69.1 45.8-110.6 45.8-86.4 0-156.5-70-156.5-156.5 0-1.5 0-3 .1-4.5 .5-17.7 15.2-31.6 32.9-31.1s31.6 15.2 31.1 32.9c0 .9 0 1.8 0 2.6 0 51.1 41.4 92.5 92.5 92.5 24.5 0 48-9.7 65.4-27.1l71.1-71.1c17.3-17.3 27.1-40.9 27.1-65.4 0-51.1-41.4-92.5-92.5-92.5zM275.2 173.3c-1.9-.8-3.8-1.9-5.5-3.1-12.6-6.5-27-10.2-42.1-10.2-24.5 0-48 9.7-65.4 27.1L91.1 258.2c-17.3 17.3-27.1 40.9-27.1 65.4 0 51.1 41.4 92.5 92.5 92.5 16.5 0 32.6-4.4 46.7-12.6 15.8 16 34.2 29.4 54.6 39.5-28.2 23.9-64 37.2-101.3 37.2-86.4 0-156.5-70-156.5-156.5 0-41.5 16.5-81.3 45.8-110.6l71.1-71.1c29.3-29.3 69.1-45.8 110.6-45.8 86.6 0 156.5 70.6 156.5 156.9 0 1.3 0 2.6 0 3.9-.4 17.7-15.1 31.6-32.8 31.2s-31.6-15.1-31.2-32.8c0-.8 0-1.5 0-2.3 0-33.7-18-63.3-44.8-79.6z"]},cs={prefix:"fas",iconName:"gear",icon:[512,512,[9881,"cog"],"f013","M195.1 9.5C198.1-5.3 211.2-16 226.4-16l59.8 0c15.2 0 28.3 10.7 31.3 25.5L332 79.5c14.1 6 27.3 13.7 39.3 22.8l67.8-22.5c14.4-4.8 30.2 1.2 37.8 14.4l29.9 51.8c7.6 13.2 4.9 29.8-6.5 39.9L447 233.3c.9 7.4 1.3 15 1.3 22.7s-.5 15.3-1.3 22.7l53.4 47.5c11.4 10.1 14 26.8 6.5 39.9l-29.9 51.8c-7.6 13.1-23.4 19.2-37.8 14.4l-67.8-22.5c-12.1 9.1-25.3 16.7-39.3 22.8l-14.4 69.9c-3.1 14.9-16.2 25.5-31.3 25.5l-59.8 0c-15.2 0-28.3-10.7-31.3-25.5l-14.4-69.9c-14.1-6-27.2-13.7-39.3-22.8L73.5 432.3c-14.4 4.8-30.2-1.2-37.8-14.4L5.8 366.1c-7.6-13.2-4.9-29.8 6.5-39.9l53.4-47.5c-.9-7.4-1.3-15-1.3-22.7s.5-15.3 1.3-22.7L12.3 185.8c-11.4-10.1-14-26.8-6.5-39.9L35.7 94.1c7.6-13.2 23.4-19.2 37.8-14.4l67.8 22.5c12.1-9.1 25.3-16.7 39.3-22.8L195.1 9.5zM256.3 336a80 80 0 1 0 -.6-160 80 80 0 1 0 .6 160z"]},Ys=cs,Hs={prefix:"fas",iconName:"eraser",icon:[576,512,[],"f12d","M178.5 416l123 0 65.3-65.3-173.5-173.5-126.7 126.7 112 112zM224 480l-45.5 0c-17 0-33.3-6.7-45.3-18.7L17 345C6.1 334.1 0 319.4 0 304s6.1-30.1 17-41L263 17C273.9 6.1 288.6 0 304 0s30.1 6.1 41 17L527 199c10.9 10.9 17 25.6 17 41s-6.1 30.1-17 41l-135 135 120 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-288 0z"]},Gs={prefix:"fas",iconName:"check",icon:[448,512,[10003,10004],"f00c","M434.8 70.1c14.3 10.4 17.5 30.4 7.1 44.7l-256 352c-5.5 7.6-14 12.3-23.4 13.1s-18.5-2.7-25.1-9.3l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l101.5 101.5 234-321.7c10.4-14.3 30.4-17.5 44.7-7.1z"]},Bs={prefix:"fas",iconName:"user-lock",icon:[576,512,[],"f502","M224 8a120 120 0 1 1 0 240 120 120 0 1 1 0-240zM194.3 304l59.4 0c29.7 0 57.7 7.3 82.3 20.1l0 4.3c-19.6 17.6-32 43.1-32 71.5l0 96c0 5.5 .5 10.9 1.3 16.1L45.7 512C29.3 512 16 498.7 16 482.3 16 383.8 95.8 304 194.3 304zm301.7 .1c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 47.9 64 0 0-47.9zM352 400c0-20.9 13.4-38.7 32-45.3l0-50.6c0-44.2 35.8-80 80-80s80 35.8 80 80l0 50.6c18.6 6.6 32 24.4 32 45.3l0 96c0 26.5-21.5 48-48 48l-128 0c-26.5 0-48-21.5-48-48l0-96z"]},Xs={prefix:"fas",iconName:"spinner",icon:[512,512,[],"f110","M208 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm0 416a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM48 208a48 48 0 1 1 0 96 48 48 0 1 1 0-96zm368 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM75 369.1A48 48 0 1 1 142.9 437 48 48 0 1 1 75 369.1zM75 75A48 48 0 1 1 142.9 142.9 48 48 0 1 1 75 75zM437 369.1A48 48 0 1 1 369.1 437 48 48 0 1 1 437 369.1z"]},us={prefix:"fas",iconName:"sliders",icon:[512,512,["sliders-h"],"f1de","M32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 224zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384z"]},qs=us,ds={prefix:"fas",iconName:"wand-magic",icon:[512,512,["magic"],"f0d0","M398.5 12.2l-88.2 88.2 101.3 101.3 88.2-88.2C507.6 105.6 512 95 512 84s-4.4-21.6-12.2-29.5L457.5 12.2C449.6 4.4 439 0 428 0s-21.6 4.4-29.5 12.2zM276.4 134.3L12.2 398.5C4.4 406.4 0 417 0 428s4.4 21.6 12.2 29.5l42.3 42.3C62.4 507.6 73 512 84 512s21.6-4.4 29.5-12.2L377.7 235.6 276.4 134.3z"]},Js=ds,Vs={prefix:"fas",iconName:"user",icon:[448,512,[128100,62144,62470,"user-alt","user-large"],"f007","M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z"]},Ks={prefix:"fas",iconName:"bookmark",icon:[384,512,[128278,61591],"f02e","M64 0C28.7 0 0 28.7 0 64L0 480c0 11.5 6.2 22.2 16.2 27.8s22.3 5.5 32.2-.4L192 421.3 335.5 507.4c9.9 5.9 22.2 6.1 32.2 .4S384 491.5 384 480l0-416c0-35.3-28.7-64-64-64L64 0z"]},ms={prefix:"fas",iconName:"xmark",icon:[384,512,[128473,10005,10006,10060,215,"close","multiply","remove","times"],"f00d","M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"]},Qs=ms,Zs={prefix:"fas",iconName:"tags",icon:[576,512,[],"f02c","M401.2 39.1L549.4 189.4c27.7 28.1 27.7 73.1 0 101.2L393 448.9c-9.3 9.4-24.5 9.5-33.9 .2s-9.5-24.5-.2-33.9L515.3 256.8c9.2-9.3 9.2-24.4 0-33.7L367 72.9c-9.3-9.4-9.2-24.6 .2-33.9s24.6-9.2 33.9 .2zM32.1 229.5L32.1 96c0-35.3 28.7-64 64-64l133.5 0c17 0 33.3 6.7 45.3 18.7l144 144c25 25 25 65.5 0 90.5L285.4 418.7c-25 25-65.5 25-90.5 0l-144-144c-12-12-18.7-28.3-18.7-45.3zm144-85.5a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"]},vs={prefix:"fas",iconName:"circle-check",icon:[512,512,[61533,"check-circle"],"f058","M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72c5 5 11.8 7.5 18.8 7s13.4-4.1 17.5-9.8L379.3 179.2c7.8-10.7 5.4-25.7-5.3-33.5z"]},el=vs,tl={prefix:"fas",iconName:"images",icon:[576,512,[],"f302","M96 96c0-35.3 28.7-64 64-64l320 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64l-320 0c-35.3 0-64-28.7-64-64L96 96zM24 128c13.3 0 24 10.7 24 24l0 296c0 8.8 7.2 16 16 16l360 0c13.3 0 24 10.7 24 24s-10.7 24-24 24L64 512c-35.3 0-64-28.7-64-64L0 152c0-13.3 10.7-24 24-24zm168 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm196.5 11.5c-4.4-7.1-12.1-11.5-20.5-11.5s-16.1 4.4-20.5 11.5l-56.3 92.1-24.5-30.6c-4.6-5.7-11.4-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4S174.8 352 184 352l272 0c8.7 0 16.7-4.7 20.9-12.3s4.1-16.8-.5-24.3l-88-144z"]},al={prefix:"fas",iconName:"chevron-down",icon:[448,512,[],"f078","M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"]},nl={prefix:"fas",iconName:"wand-magic-sparkles",icon:[576,512,["magic-wand-sparkles"],"e2ca","M263.4-27L278.2 9.8 315 24.6c3 1.2 5 4.2 5 7.4s-2 6.2-5 7.4L278.2 54.2 263.4 91c-1.2 3-4.2 5-7.4 5s-6.2-2-7.4-5L233.8 54.2 197 39.4c-3-1.2-5-4.2-5-7.4s2-6.2 5-7.4L233.8 9.8 248.6-27c1.2-3 4.2-5 7.4-5s6.2 2 7.4 5zM110.7 41.7l21.5 50.1 50.1 21.5c5.9 2.5 9.7 8.3 9.7 14.7s-3.8 12.2-9.7 14.7l-50.1 21.5-21.5 50.1c-2.5 5.9-8.3 9.7-14.7 9.7s-12.2-3.8-14.7-9.7L59.8 164.2 9.7 142.7C3.8 140.2 0 134.4 0 128s3.8-12.2 9.7-14.7L59.8 91.8 81.3 41.7C83.8 35.8 89.6 32 96 32s12.2 3.8 14.7 9.7zM464 304c6.4 0 12.2 3.8 14.7 9.7l21.5 50.1 50.1 21.5c5.9 2.5 9.7 8.3 9.7 14.7s-3.8 12.2-9.7 14.7l-50.1 21.5-21.5 50.1c-2.5 5.9-8.3 9.7-14.7 9.7s-12.2-3.8-14.7-9.7l-21.5-50.1-50.1-21.5c-5.9-2.5-9.7-8.3-9.7-14.7s3.8-12.2 9.7-14.7l50.1-21.5 21.5-50.1c2.5-5.9 8.3-9.7 14.7-9.7zM460 0c11 0 21.6 4.4 29.5 12.2l42.3 42.3C539.6 62.4 544 73 544 84s-4.4 21.6-12.2 29.5l-88.2 88.2-101.3-101.3 88.2-88.2C438.4 4.4 449 0 460 0zM44.2 398.5L308.4 134.3 409.7 235.6 145.5 499.8C137.6 507.6 127 512 116 512s-21.6-4.4-29.5-12.2L44.2 457.5C36.4 449.6 32 439 32 428s4.4-21.6 12.2-29.5z"]},rl={prefix:"fas",iconName:"star",icon:[576,512,[11088,61446],"f005","M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"]},ps={prefix:"fas",iconName:"triangle-exclamation",icon:[512,512,[9888,"exclamation-triangle","warning"],"f071","M256 0c14.7 0 28.2 8.1 35.2 21l216 400c6.7 12.4 6.4 27.4-.8 39.5S486.1 480 472 480L40 480c-14.1 0-27.2-7.4-34.4-19.5s-7.5-27.1-.8-39.5l216-400c7-12.9 20.5-21 35.2-21zm0 352a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm0-192c-18.2 0-32.7 15.5-31.4 33.7l7.4 104c.9 12.5 11.4 22.3 23.9 22.3 12.6 0 23-9.7 23.9-22.3l7.4-104c1.3-18.2-13.1-33.7-31.4-33.7z"]},il=ps,ol={prefix:"fas",iconName:"graduation-cap",icon:[576,512,[127891,"mortar-board"],"f19d","M48 195.8l209.2 86.1c9.8 4 20.2 6.1 30.8 6.1s21-2.1 30.8-6.1l242.4-99.8c9-3.7 14.8-12.4 14.8-22.1s-5.8-18.4-14.8-22.1L318.8 38.1C309 34.1 298.6 32 288 32s-21 2.1-30.8 6.1L14.8 137.9C5.8 141.6 0 150.3 0 160L0 456c0 13.3 10.7 24 24 24s24-10.7 24-24l0-260.2zm48 71.7L96 384c0 53 86 96 192 96s192-43 192-96l0-116.6-142.9 58.9c-15.6 6.4-32.2 9.7-49.1 9.7s-33.5-3.3-49.1-9.7L96 267.4z"]},sl={prefix:"fas",iconName:"store",icon:[512,512,[],"f54e","M30.7 72.3C37.6 48.4 59.5 32 84.4 32l344 0c24.9 0 46.8 16.4 53.8 40.3l23.4 80.2c12.8 43.7-20.1 87.5-65.6 87.5-26.3 0-49.4-14.9-60.8-37.1-11.6 21.9-34.6 37.1-61.4 37.1-26.6 0-49.7-15-61.3-37-11.6 22-34.7 37-61.3 37-26.8 0-49.8-15.1-61.4-37.1-11.4 22.1-34.5 37.1-60.8 37.1-45.6 0-78.4-43.7-65.6-87.5L30.7 72.3zM96.4 352l320 0 0-66.4c7.6 1.6 15.5 2.4 23.5 2.4 14.3 0 28-2.6 40.5-7.2l0 151.2c0 26.5-21.5 48-48 48l-352 0c-26.5 0-48-21.5-48-48l0-151.2c12.5 4.6 26.1 7.2 40.5 7.2 8.1 0 15.9-.8 23.5-2.4l0 66.4z"]},ll={prefix:"fas",iconName:"font",icon:[512,512,[],"f031","M285.1 50.7C279.9 39.3 268.5 32 256 32s-23.9 7.3-29.1 18.7L59.5 416 48 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l88 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-6.1 0 22-48 208.3 0 22 48-6.1 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l88 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-11.5 0-167.4-365.3zM330.8 304L181.2 304 256 140.8 330.8 304z"]},hs={prefix:"fas",iconName:"shield-halved",icon:[512,512,["shield-alt"],"f3ed","M256 0c4.6 0 9.2 1 13.4 2.9L457.8 82.8c22 9.3 38.4 31 38.3 57.2-.5 99.2-41.3 280.7-213.6 363.2-16.7 8-36.1 8-52.8 0-172.4-82.5-213.1-264-213.6-363.2-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.9 1 251.4 0 256 0zm0 66.8l0 378.1c138-66.8 175.1-214.8 176-303.4l-176-74.6 0 0z"]},fl=hs,cl={prefix:"fas",iconName:"robot",icon:[640,512,[129302],"f544","M352 0c0-17.7-14.3-32-32-32S288-17.7 288 0l0 64-96 0c-53 0-96 43-96 96l0 224c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-224c0-53-43-96-96-96l-96 0 0-64zM160 368c0-13.3 10.7-24 24-24l32 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-32 0c-13.3 0-24-10.7-24-24zm120 0c0-13.3 10.7-24 24-24l32 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-32 0c-13.3 0-24-10.7-24-24zm120 0c0-13.3 10.7-24 24-24l32 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-32 0c-13.3 0-24-10.7-24-24zM224 176a48 48 0 1 1 0 96 48 48 0 1 1 0-96zm144 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM64 224c0-17.7-14.3-32-32-32S0 206.3 0 224l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96zm544-32c-17.7 0-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32z"]},ul={prefix:"fas",iconName:"plus",icon:[448,512,[10133,61543,"add"],"2b","M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"]},gs={prefix:"fas",iconName:"square-plus",icon:[448,512,[61846,"plus-square"],"f0fe","M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM200 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"]},dl=gs,ys={prefix:"fas",iconName:"link-slash",icon:[576,512,["chain-broken","chain-slash","unlink"],"f127","M41-24.9c-9.4-9.4-24.6-9.4-33.9 0S-2.3-.3 7 9.1l528 528c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-122-122c4.2-3.4 8.3-7.1 12.1-10.9l71.1-71.1c29.3-29.3 45.8-69.1 45.8-110.6 0-86.4-70-156.5-156.5-156.5-37.3 0-73.1 13.3-101.3 37.2 20.3 10.1 38.7 23.5 54.5 39.5 14.1-8.3 30.2-12.7 46.8-12.7 51.1 0 92.5 41.4 92.5 92.5 0 24.5-9.7 48-27.1 65.4l-71.1 71.1c-3.9 3.9-8.1 7.4-12.6 10.5l-47.5-47.5c16.5-.9 29.7-14.4 30.2-31.1 0-1.3 0-2.6 0-3.9 0-86.3-69.9-156.9-156.5-156.9-19.2 0-37.9 3.5-55.5 10.2L41-24.9zM225.9 160c.6 0 1.1 0 1.7 0 15.1 0 29.5 3.7 42.1 10.2 1.8 1.2 3.6 2.3 5.5 3.1 26.8 16.3 44.8 45.9 44.8 79.6 0 .4 0 .8 0 1.2L225.9 160zM346.2 416L192 261.8c1.2 84.6 69.6 152.9 154.1 154.1zM139.7 209.5l-45.3-45.3-48.6 48.6c-29.3 29.3-45.8 69.1-45.8 110.6 0 86.4 70 156.5 156.5 156.5 37.2 0 73.1-13.3 101.3-37.2-20.3-10.1-38.8-23.5-54.6-39.5-14 8.2-30.1 12.6-46.7 12.6-51.1 0-92.5-41.4-92.5-92.5 0-24.5 9.7-48 27.1-65.4l48.6-48.6z"]},ml=ys,bs={prefix:"fas",iconName:"arrow-rotate-right",icon:[512,512,[8635,"arrow-right-rotate","arrow-rotate-forward","redo"],"f01e","M436.7 74.7L448 85.4 448 32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 128c0 17.7-14.3 32-32 32l-128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l47.9 0-7.6-7.2c-.2-.2-.4-.4-.6-.6-75-75-196.5-75-271.5 0s-75 196.5 0 271.5 196.5 75 271.5 0c8.2-8.2 15.5-16.9 21.9-26.1 10.1-14.5 30.1-18 44.6-7.9s18 30.1 7.9 44.6c-8.5 12.2-18.2 23.8-29.1 34.7-100 100-262.1 100-362 0S-25 175 75 75c99.9-99.9 261.7-100 361.7-.3z"]},vl=bs,pl={prefix:"fas",iconName:"bolt",icon:[448,512,[9889,"zap"],"f0e7","M338.8-9.9c11.9 8.6 16.3 24.2 10.9 37.8L271.3 224 416 224c13.5 0 25.5 8.4 30.1 21.1s.7 26.9-9.6 35.5l-288 240c-11.3 9.4-27.4 9.9-39.3 1.3s-16.3-24.2-10.9-37.8L176.7 288 32 288c-13.5 0-25.5-8.4-30.1-21.1s-.7-26.9 9.6-35.5l288-240c11.3-9.4 27.4-9.9 39.3-1.3z"]},hl={prefix:"fas",iconName:"camera-retro",icon:[512,512,[128247],"f083","M0 416l0-208 136.2 0c13.5-20.2 32-36.8 53.7-48L0 160 0 125.7c0-35.3 28.7-64 64-64l.1 0C65.3 45.1 79.1 32 96 32l32 0c16.9 0 30.7 13.1 31.9 29.7l32.1 0 51.2-23.8c8.4-3.9 17.6-6 26.9-6L448 32c35.3 0 64 28.7 64 64l0 64-190 0c21.7 11.2 40.2 27.8 53.7 48l136.2 0 0 208c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64zM256 192a96.1 96.1 0 1 0 0 192.1 96.1 96.1 0 1 0 0-192.1z"]},xs={prefix:"fas",iconName:"face-smile",icon:[512,512,[128578,"smile"],"f118","M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM165.4 321.9c20.4 28 53.4 46.1 90.6 46.1s70.2-18.1 90.6-46.1c7.8-10.7 22.8-13.1 33.5-5.3s13.1 22.8 5.3 33.5C356.3 390 309.2 416 256 416s-100.3-26-129.4-65.9c-7.8-10.7-5.4-25.7 5.3-33.5s25.7-5.4 33.5 5.3zM144 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"]},gl=xs,yl={prefix:"fas",iconName:"microchip",icon:[512,512,[],"f2db","M176 24c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c-35.3 0-64 28.7-64 64l-40 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l40 0 0 56-40 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l40 0 0 56-40 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l40 0c0 35.3 28.7 64 64 64l0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40 56 0 0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40 56 0 0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40c35.3 0 64-28.7 64-64l40 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-40 0 0-56 40 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-40 0 0-56 40 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-40 0c0-35.3-28.7-64-64-64l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40-56 0 0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40-56 0 0-40zM160 128l192 0c17.7 0 32 14.3 32 32l0 192c0 17.7-14.3 32-32 32l-192 0c-17.7 0-32-14.3-32-32l0-192c0-17.7 14.3-32 32-32zm16 48l0 160 160 0 0-160-160 0z"]},bl={prefix:"fas",iconName:"retweet",icon:[576,512,[],"f079","M118.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-9.2 9.2-11.9 22.9-6.9 34.9S19.1 160 32 160l32 0 0 224c0 53 43 96 96 96l128 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-128 0c-17.7 0-32-14.3-32-32l0-224 32 0c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-64-64zM457.4 470.6c12.5 12.5 32.8 12.5 45.3 0l64-64c9.2-9.2 11.9-22.9 6.9-34.9S556.9 352 544 352l-32 0 0-224c0-53-43-96-96-96L288 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32 14.3 32 32l0 224-32 0c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l64 64z"]};export{Ps as $,Xs as A,vl as B,Ls as C,ws as D,$s as E,el as F,ml as G,zs as H,Fs as I,fl as J,qs as K,Us as L,ol as M,Os as N,dl as O,Ys as P,Vs as Q,na as R,Cs as S,ks as T,Ns as U,Ms as V,js as W,Ts as X,sl as Y,Gs as Z,_s as _,aa as a,Bs as a0,al as a1,Es as a2,ns as a3,rl as b,nl as c,As as d,Zs as e,cl as f,gn as g,Hs as h,Ds as i,Ss as j,ll as k,gl as l,Js as m,tl as n,pl as o,il as p,ul as q,Sn as r,Is as s,hl as t,Ks as u,bl as v,yl as w,Rs as x,Ws as y,Qs as z};
//# sourceMappingURL=ui-7YJeWLzT.js.map
