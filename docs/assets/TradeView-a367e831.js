import{j as l,a as e,R as m,E as g,T as h,b as p,c as u,B as n,d as w}from"./index-50fd0032.js";import{R as s}from"./reactModal-6ec33bb1.js";import{a as b}from"./axios-c0bebe37.js";const x=l("div",{className:"text-center",style:{paddingTop:"4px",paddingBottom:"4px"},children:[e("div",{style:{margin:"4px"},className:"spinner-grow text-primary",role:"status",children:e("span",{className:"visually-hidden",children:"Loading..."})}),e("div",{style:{margin:"4px"},className:"spinner-grow text-secondary",role:"status",children:e("span",{className:"visually-hidden",children:"Loading..."})}),e("div",{style:{margin:"4px"},className:"spinner-grow text-success",role:"status",children:e("span",{className:"visually-hidden",children:"Loading..."})})]}),c=m({key:"getTradeStats",get:r=>()=>b.get(`http://35.243.104.152:2000/db/tradestats/${r}`).then(a=>a.data)}),S=s.memo(r=>e(g,{fallback:e("div",{className:"card bg-danger text-light mb-3",style:{width:"24rem"},children:l("div",{className:"card-header",children:[e(h,{state:"back",onClick:()=>r.changeViewState("compact")}),"Something went wrong loading trade data"]})}),children:e(s.Suspense,{fallback:x,children:e(y,{...r})})}));function f(r){return e(w,{color:"light",textColor:"info",border:!0,style:{padding:"2px",marginRight:"4px"},onClick:r.onClick,title:"Refresh today's trades",children:l("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-arrow-clockwise",viewBox:"0 0 16 16",children:[e("path",{fillRule:"evenodd",d:"M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"}),e("path",{d:"M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"})]})})}function y({symbol:r,changeViewState:a}){const t=p(c(r)),d=u(c(r));return l("div",{className:"card bg-light text-dark mb-3",style:{width:"24rem"},children:[l("div",{className:"card-header",children:[e(h,{state:"back",onClick:()=>a("compact")}),e(f,{onClick:d}),e("strong",{children:"Today's trades"})]}),e("div",{className:"card-body",children:e(v,{...t})}),l("div",{className:"card-footer",children:[e("strong",{children:"All time stats"}),e("table",{className:"table table-sm",children:l("tbody",{children:[l("tr",{children:[e("th",{scope:"row",children:e("small",{children:"# Sell trades"})}),e("td",{children:e("small",{children:t.numSold})})]}),l("tr",{children:[e("th",{scope:"row",children:e("small",{children:"# Profitable sell trades"})}),e("td",{children:e("small",{children:t.numProfitableTrades})})]})]})})]})]})}function v({trades:r}){return l("table",{className:"table table-striped table-sm",children:[e("thead",{children:l("tr",{children:[e("th",{children:e("small",{children:"Time"})}),e("th",{children:e("small",{children:"Action"})}),e("th",{children:e("small",{children:"Price"})}),e("th",{children:e("small",{children:"Value"})}),e("th",{children:e("small",{children:"Profit"})})]})}),e("tbody",{children:r.map(({timestamp:a,value:t,price:d,profit:o,action:i})=>l("tr",{children:[e("th",{scope:"row",children:e("small",{children:a.split("T")[1].split(".")[0]})}),e("td",{children:e("small",{children:i})}),e("td",{children:e("small",{children:new n(d).round(4).toString()})}),e("td",{children:e("small",{children:new n(t).round(2).toString()})}),e("td",{children:e("small",{children:i==="BUY"?"N/A":new n(o).round(3).toString()})})]},`${a}-${d}-${i}`))})]})}export{S as TradeView,y as TradeViewContainer,S as default,c as getTradeStats};