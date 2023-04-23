const re=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const f of o.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&i(f)}).observe(document,{childList:!0,subtree:!0});function a(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerpolicy&&(o.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?o.credentials="include":n.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=a(n);fetch(n.href,o)}};re();var le={preferredElementNodeName:"PRE",render:fe};const V=[];let N,T;function fe(e,t){const a=e.settings.element;for((e.rows!=T||e.cols!=N)&&(N=e.cols,T=e.rows,V.length=0);a.childElementCount<T;){const i=document.createElement("span");i.style.display="block",a.appendChild(i)}for(;a.childElementCount>T;)a.removeChild(a.lastChild);for(let i=0;i<T;i++){const n=i*N;let o=!1;for(let r=0;r<N;r++){const c=r+n,h=t[c],b=V[c];se(h,b)||(o=!0,V[c]={...h})}if(o==!1)continue;let f="",s={},d=!1;for(let r=0;r<N;r++){const c=t[r+n];if(c.beginHTML&&(d&&(f+="</span>",s={},d=!1),f+=c.beginHTML),!ce(c,s)){d&&(f+="</span>");const h=c.color===e.settings.color?null:c.color,b=c.backgroundColor===e.settings.backgroundColor?null:c.backgroundColor,C=c.fontWeight===e.settings.fontWeight?null:c.fontWeight;let l="";h&&(l+="color:"+h+";"),b&&(l+="background:"+b+";"),C&&(l+="font-weight:"+C+";"),l&&(l=' style="'+l+'"'),f+="<span"+l+">",d=!0}f+=c.char,s=c,c.endHTML&&(d&&(f+="</span>",s={},d=!1),f+=c.endHTML)}d&&(f+="</span>"),a.childNodes[i].innerHTML=f}}function se(e,t){return!(typeof e!="object"||typeof t!="object"||e.char!==t.char||e.fontWeight!==t.fontWeight||e.color!==t.color||e.backgroundColor!==t.backgroundColor)}function ce(e,t){return!(e.fontWeight!==t.fontWeight||e.color!==t.color||e.backgroundColor!==t.backgroundColor)}var me={preferredElementNodeName:"CANVAS",render:de};function de(e,t){const a=e.settings.element,i=devicePixelRatio,n=e.cols,o=e.rows,f=e.metrics,s=f.cellWidth,d=Math.round(f.lineHeight),r=e.settings;r.canvasSize?(a.width=r.canvasSize.width*i,a.height=r.canvasSize.height*i,a.style.width=r.canvasSize.width+"px",a.style.height=r.canvasSize.height+"px"):(a.width=e.width*i,a.height=e.height*i);const c=" "+f.fontSize+"px "+f.fontFamily,h=r&&r.backgroundColor?r.backgroundColor:"white",b=r&&r.color?r.color:"black",C=r&&r.fontWeight?r.color:"400",l=a.getContext("2d");if(l.fillStyle=h,l.fillRect(0,0,a.width,a.height),l.save(),l.scale(i,i),l.fillStyle=b,l.textBaseline="top",r.canvasOffset){const u=r.canvasOffset,y=Math.round(u.x=="auto"?(a.width/i-n*s)/2:u.x),p=Math.round(u.y=="auto"?(a.height/i-o*d)/2:u.y);l.translate(y,p)}if(r.textAlign=="center")for(let u=0;u<o;u++){const y=u*n,p=[];let M=0;for(let w=0;w<n;w++){const S=t[y+w];l.font=(S.fontWeight||C)+c;const x=l.measureText(S.char).width;M+=x,p[w]=x}let E=(a.width/i-M)*.5;const _=u*d;for(let w=0;w<n;w++){const S=t[y+w],x=E;S.backgroundColor&&S.backgroundColor!=h&&(l.fillStyle=S.backgroundColor||h,l.fillRect(Math.round(x),_,Math.ceil(p[w]),d)),l.font=(S.fontWeight||C)+c,l.fillStyle=S.color||b,l.fillText(S.char,E,_),E+=p[w]}}else for(let u=0;u<o;u++)for(let y=0;y<n;y++){const p=t[u*n+y],M=y*s,E=u*d;p.backgroundColor&&p.backgroundColor!=h&&(l.fillStyle=p.backgroundColor||h,l.fillRect(Math.round(M),E,Math.ceil(s),d)),l.font=(p.fontWeight||C)+c,l.fillStyle=p.color||b,l.fillText(p.char,M,E)}l.restore()}class ue{constructor(){this.frames=0,this.ptime=0,this.fps=0}update(t){return this.frames++,t>=this.ptime+1e3&&(this.fps=this.frames*1e3/(t-this.ptime),this.ptime=t,this.frames=0),this.fps}}var K={store:function(e,t){try{return localStorage.setItem(e,JSON.stringify(t)),!0}catch{return!1}},restore:function(e,t={}){const a=JSON.parse(localStorage.getItem(e));return Object.assign(t,a),t},clear:function(e){localStorage.removeItem(e)}};const P={canvas:me,text:le},xe={element:null,cols:0,rows:0,once:!1,fps:30,renderer:"text",allowSelect:!1,restoreState:!1},he=["backgroundColor","color","fontFamily","fontSize","fontWeight","letterSpacing","lineHeight","textAlign"];function ge(e,t,a={}){return new Promise(function(i){const n={...xe,...t,...e.settings},o={time:0,frame:0,cycle:0},f="currentState";n.restoreState&&(K.restore(f,o),o.cycle++);let s;n.element?n.renderer=="canvas"?n.element.nodeName=="CANVAS"?s=P[n.renderer]:console.warn("This renderer expects a canvas target element."):n.element.nodeName!="CANVAS"?s=P[n.renderer]:console.warn("This renderer expects a text target element."):(s=P[n.renderer]||P.text,n.element=document.createElement(s.preferredElementNodeName),document.body.appendChild(n.element));for(const x of he)n[x]&&(n.element.style[x]=n[x]);const d=[],r={x:0,y:0,pressed:!1,px:0,py:0,ppressed:!1};n.element.addEventListener("pointermove",x=>{const L=n.element.getBoundingClientRect();r.x=x.clientX-L.left,r.y=x.clientY-L.top,d.push("pointerMove")}),n.element.addEventListener("pointerdown",x=>{r.pressed=!0,d.push("pointerDown")}),n.element.addEventListener("pointerup",x=>{r.pressed=!1,d.push("pointerUp")});const c=x=>{const L=n.element.getBoundingClientRect();r.x=x.touches[0].clientX-L.left,r.y=x.touches[0].clientY-L.top,d.push("pointerMove")};n.element.addEventListener("touchmove",c),n.element.addEventListener("touchstart",c),n.element.addEventListener("touchend",c),n.element.style.fontStrech="normal",n.allowSelect||pe(n.element),document.fonts.ready.then(x=>{let L=3;(function g(){--L>0?requestAnimationFrame(g):y()})()});const h=new ue,b=" ",C=Object.freeze({color:n.color,backgroundColor:n.backgroundColor,fontWeight:n.fontWeight}),l=[];let u;function y(){u=D(n.element);const x=B(o,n,u,h);typeof e.boot=="function"&&e.boot(x,l,a),requestAnimationFrame(S)}let p=0;const M=1e3/n.fps,E=o.time;let _,w;function S(x){const L=x-p;if(L<M){n.once||requestAnimationFrame(S);return}const g=B(o,n,u,h);h.update(x),p=x-L%M,o.time=x+E,o.frame++,K.store(f,o);const j={x:Math.min(g.cols-1,r.x/u.cellWidth),y:Math.min(g.rows-1,r.y/u.lineHeight),pressed:r.pressed,p:{x:r.px/u.cellWidth,y:r.py/u.lineHeight,pressed:r.ppressed}};if(r.px=r.x,r.py=r.y,r.ppressed=r.pressed,_!=g.cols||w!=g.rows){_=g.cols,w=g.rows,l.length=g.cols*g.rows;for(let v=0;v<l.length;v++)l[v]={...C,char:b}}if(typeof e.pre=="function"&&e.pre(g,j,l,a),typeof e.main=="function")for(let v=0;v<g.rows;v++){const oe=v*g.cols;for(let A=0;A<g.cols;A++){const W=A+oe,H=e.main({x:A,y:v,index:W},g,j,l,a);typeof H=="object"&&H!==null?l[W]={...l[W],...H}:l[W]={...l[W],char:H},!Boolean(l[W].char)&&l[W].char!==0&&(l[W].char=b)}}for(typeof e.post=="function"&&e.post(g,j,l,a),s.render(g,l,n);d.length>0;){const v=d.shift();v&&typeof e[v]=="function"&&e[v](g,j,l)}n.once||requestAnimationFrame(S),i(g)}})}function B(e,t,a,i){const n=t.element.getBoundingClientRect(),o=t.cols||Math.floor(n.width/a.cellWidth),f=t.rows||Math.floor(n.height/a.lineHeight);return Object.freeze({frame:e.frame,time:e.time,cols:o,rows:f,metrics:a,width:n.width,height:n.height,settings:t,runtime:Object.freeze({cycle:e.cycle,fps:i.fps})})}function pe(e){e.style.userSelect="none",e.style.webkitUserSelect="none",e.style.mozUserSelect="none",e.dataset.selectionEnabled="false"}function D(e){const t=getComputedStyle(e),a=t.getPropertyValue("font-family"),i=parseFloat(t.getPropertyValue("font-size")),n=parseFloat(t.getPropertyValue("line-height"));let o;if(e.nodeName=="CANVAS"){const s=e.getContext("2d");s.font=i+"px "+a,o=s.measureText("".padEnd(50,"X")).width/50}else{const s=document.createElement("span");e.appendChild(s),s.innerHTML="".padEnd(50,"X"),o=s.getBoundingClientRect().width/50,e.removeChild(s)}return{aspect:o/n,cellWidth:o,lineHeight:n,fontFamily:a,fontSize:i,_update:function(){const s=D(e);for(var d in s)(typeof s[d]=="number"||typeof s[d]=="string")&&(m[d]=s[d])}}}function be(e,t,a,i,n){return i+(n-i)*((e-t)/(a-t))}function G(e,t,a){return e<t?t:e>a?a:e}function I(e,t,a){return e*(1-a)+t*a}function Q(e,t,a){const i=G((a-e)/(t-e),0,1);return i*i*(3-2*i)}function ye(e){return e.a===void 0||e.a===1?`rgb(${e.r},${e.g},${e.b})`:`rgba(${e.r},${e.g},${e.b},${e.a})`}function we(e){let t=Math.round(e.r).toString(16).padStart(2,"0"),a=Math.round(e.g).toString(16).padStart(2,"0"),i=Math.round(e.b).toString(16).padStart(2,"0");if(e.a===void 0)return"#"+t+a+i;let n=Math.round(e.a*255).toString(16).padStart(2,"0");return"#"+t+a+i+n}function Se(e){return Math.round(e.r*.2126+e.g*.7152+e.b*.0722)/255}function ve(e){return{a:1,r:e>>16&255,g:e>>8&255,b:e&255}}const ke=[{int:0,name:"black"},{int:16777215,name:"white"},{int:8912896,name:"red"},{int:11206638,name:"cyan"},{int:13386956,name:"violet"},{int:52309,name:"green"},{int:170,name:"blue"},{int:15658615,name:"yellow"},{int:14518357,name:"orange"},{int:6702080,name:"brown"},{int:16742263,name:"lightred"},{int:3355443,name:"darkgrey"},{int:7829367,name:"grey"},{int:11206502,name:"lightgreen"},{int:35071,name:"lightblue"},{int:12303291,name:"lightgrey"}],Ce=[{int:0,name:"black"},{int:170,name:"blue"},{int:43520,name:"green"},{int:43690,name:"cyan"},{int:11141120,name:"red"},{int:11141290,name:"magenta"},{int:11162880,name:"brown"},{int:11184810,name:"lightgray"},{int:5592405,name:"darkgray"},{int:5592575,name:"lightblue"},{int:5635925,name:"lightgreen"},{int:5636095,name:"lightcyan"},{int:16733525,name:"lightred"},{int:16733695,name:"lightmagenta"},{int:16777045,name:"yellow"},{int:16777215,name:"white"}],ee=[{int:0,name:"black"},{int:12632256,name:"silver"},{int:8421504,name:"gray"},{int:16777215,name:"white"},{int:8388608,name:"maroon"},{int:16711680,name:"red"},{int:8388736,name:"purple"},{int:16711935,name:"fuchsia"},{int:32768,name:"green"},{int:65280,name:"lime"},{int:8421376,name:"olive"},{int:16776960,name:"yellow"},{int:128,name:"navy"},{int:255,name:"blue"},{int:32896,name:"teal"},{int:65535,name:"aqua"}],ne=[...ee,{int:16753920,name:"orange"}],te=[...ne,{int:15792383,name:"aliceblue"},{int:16444375,name:"antiquewhite"},{int:8388564,name:"aquamarine"},{int:15794175,name:"azure"},{int:16119260,name:"beige"},{int:16770244,name:"bisque"},{int:16772045,name:"blanchedalmond"},{int:9055202,name:"blueviolet"},{int:10824234,name:"brown"},{int:14596231,name:"burlywood"},{int:6266528,name:"cadetblue"},{int:8388352,name:"chartreuse"},{int:13789470,name:"chocolate"},{int:16744272,name:"coral"},{int:6591981,name:"cornflowerblue"},{int:16775388,name:"cornsilk"},{int:14423100,name:"crimson"},{int:65535,name:"aqua"},{int:139,name:"darkblue"},{int:35723,name:"darkcyan"},{int:12092939,name:"darkgoldenrod"},{int:11119017,name:"darkgray"},{int:25600,name:"darkgreen"},{int:11119017,name:"darkgrey"},{int:12433259,name:"darkkhaki"},{int:9109643,name:"darkmagenta"},{int:5597999,name:"darkolivegreen"},{int:16747520,name:"darkorange"},{int:10040012,name:"darkorchid"},{int:9109504,name:"darkred"},{int:15308410,name:"darksalmon"},{int:9419919,name:"darkseagreen"},{int:4734347,name:"darkslateblue"},{int:3100495,name:"darkslategray"},{int:3100495,name:"darkslategrey"},{int:52945,name:"darkturquoise"},{int:9699539,name:"darkviolet"},{int:16716947,name:"deeppink"},{int:49151,name:"deepskyblue"},{int:6908265,name:"dimgray"},{int:6908265,name:"dimgrey"},{int:2003199,name:"dodgerblue"},{int:11674146,name:"firebrick"},{int:16775920,name:"floralwhite"},{int:2263842,name:"forestgreen"},{int:14474460,name:"gainsboro"},{int:16316671,name:"ghostwhite"},{int:16766720,name:"gold"},{int:14329120,name:"goldenrod"},{int:11403055,name:"greenyellow"},{int:8421504,name:"grey"},{int:15794160,name:"honeydew"},{int:16738740,name:"hotpink"},{int:13458524,name:"indianred"},{int:4915330,name:"indigo"},{int:16777200,name:"ivory"},{int:15787660,name:"khaki"},{int:15132410,name:"lavender"},{int:16773365,name:"lavenderblush"},{int:8190976,name:"lawngreen"},{int:16775885,name:"lemonchiffon"},{int:11393254,name:"lightblue"},{int:15761536,name:"lightcoral"},{int:14745599,name:"lightcyan"},{int:16448210,name:"lightgoldenrodyellow"},{int:13882323,name:"lightgray"},{int:9498256,name:"lightgreen"},{int:13882323,name:"lightgrey"},{int:16758465,name:"lightpink"},{int:16752762,name:"lightsalmon"},{int:2142890,name:"lightseagreen"},{int:8900346,name:"lightskyblue"},{int:7833753,name:"lightslategray"},{int:7833753,name:"lightslategrey"},{int:11584734,name:"lightsteelblue"},{int:16777184,name:"lightyellow"},{int:3329330,name:"limegreen"},{int:16445670,name:"linen"},{int:16711935,name:"fuchsia"},{int:6737322,name:"mediumaquamarine"},{int:205,name:"mediumblue"},{int:12211667,name:"mediumorchid"},{int:9662683,name:"mediumpurple"},{int:3978097,name:"mediumseagreen"},{int:8087790,name:"mediumslateblue"},{int:64154,name:"mediumspringgreen"},{int:4772300,name:"mediumturquoise"},{int:13047173,name:"mediumvioletred"},{int:1644912,name:"midnightblue"},{int:16121850,name:"mintcream"},{int:16770273,name:"mistyrose"},{int:16770229,name:"moccasin"},{int:16768685,name:"navajowhite"},{int:16643558,name:"oldlace"},{int:7048739,name:"olivedrab"},{int:16729344,name:"orangered"},{int:14315734,name:"orchid"},{int:15657130,name:"palegoldenrod"},{int:10025880,name:"palegreen"},{int:11529966,name:"paleturquoise"},{int:14381203,name:"palevioletred"},{int:16773077,name:"papayawhip"},{int:16767673,name:"peachpuff"},{int:13468991,name:"peru"},{int:16761035,name:"pink"},{int:14524637,name:"plum"},{int:11591910,name:"powderblue"},{int:12357519,name:"rosybrown"},{int:4286945,name:"royalblue"},{int:9127187,name:"saddlebrown"},{int:16416882,name:"salmon"},{int:16032864,name:"sandybrown"},{int:3050327,name:"seagreen"},{int:16774638,name:"seashell"},{int:10506797,name:"sienna"},{int:8900331,name:"skyblue"},{int:6970061,name:"slateblue"},{int:7372944,name:"slategray"},{int:7372944,name:"slategrey"},{int:16775930,name:"snow"},{int:65407,name:"springgreen"},{int:4620980,name:"steelblue"},{int:13808780,name:"tan"},{int:14204888,name:"thistle"},{int:16737095,name:"tomato"},{int:4251856,name:"turquoise"},{int:15631086,name:"violet"},{int:16113331,name:"wheat"},{int:16119285,name:"whitesmoke"},{int:10145074,name:"yellowgreen"}],Me=[...te,{int:6697881,name:"rebeccapurple"}];function q(e){return e.map(t=>{const a=ve(t.int),i=we(a),n=ye(a),o=Se(a);return{...t,...a,v:o,hex:i,css:n}})}function $(e){const t={};return e.forEach(a=>{t[a.name]=a}),t}$(q(Me));$(q(te));$(q(ne));$(q(ee));q(ke);q(Ce);const Ee={fps:30},{min:Z,max:Le,sin:je,floor:F}=Math;let X="...::/\\+=*abcdef01XYZ#",k,O,J=10,Y=document.querySelector("#sliderValue01"),ze=document.querySelector("#inputValue01"),ae=document.querySelector("#valuePrinted");ae.textContent=J;Y.addEventListener("input",function(){J=Y.value,ae.textContent=Y.value},!1);ze.addEventListener("change",function(e){X=e.target.value});const We=Ne(),z=[];function _e(e,t,a){if((k!=e.cols||O!=e.rows)&&(k=e.cols,O=e.rows,z.length=k*O,z.fill(0)),t.pressed){const i=F(t.x),n=F(t.y);z[i+n*k]=U(5,50)}else{const i=e.time*.0015,n=k*(O-1);for(let o=0;o<k;o++){const f=F(be(We(o*.05,i),0,1,5,J));z[n+o]=Z(f,z[n+o]+2)}}for(let i=0;i<z.length;i++){const n=F(i/k),o=i%k,f=n*k+G(o+U(-1,1),0,k-1),s=Z(O-1,n+1)*k+o;z[f]=Le(0,z[s]-U(0,2))}}function qe(e,t,a,i){const n=z[e.index];if(n!==0)return{char:X[G(n,0,X.length-1)],fontWeight:n>20?700:100}}function U(e,t=0){return e>t&&([e,t]=[t,e]),Math.floor(e+Math.random()*(t-e+1))}function Ne(){const t=new Array(256),a=new Array(256*2);for(let i=0;i<256;i++)t[i]=Math.random(),a[i]=i;for(let i=0;i<256;i++){const n=Math.floor(Math.random()*256);[a[i],a[n]]=[a[n],a[i]],a[i+256]=a[i]}return function(i,n){const o=Math.floor(i),f=Math.floor(n),s=i-o,d=n-f,r=o%256,c=(r+1)%256,h=f%256,b=(h+1)%256,C=t[a[a[r]+h]],l=t[a[a[c]+h]],u=t[a[a[r]+b]],y=t[a[a[c]+b]],p=Q(0,1,s),M=Q(0,1,d),E=I(C,l,p),_=I(u,y,p);return I(E,_,M)}}function Te(e,t,a){}var ie=Object.freeze(Object.defineProperty({__proto__:null,settings:Ee,pre:_e,main:qe,post:Te},Symbol.toStringTag,{value:"Module"}));let R=document.querySelector(".controlsHolder");document.querySelector("#inputValue01");R.addEventListener("mouseover",()=>{R.style.opacity="1"});R.addEventListener("mouseout",()=>{R.style.opacity=".25"});const Oe={element:document.querySelector("#ASCII-Holder"),backgroundColor:"transparent",color:"#ff4800"};ge(ie,Oe).catch(function(e){console.warn(e.message),console.log(e.error)});console.log(ie);
