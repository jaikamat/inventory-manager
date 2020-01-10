(this["webpackJsonpclubhouse-pos-importer"]=this["webpackJsonpclubhouse-pos-importer"]||[]).push([[0],{255:function(e,t,a){e.exports=a.p+"static/media/magic-ball.c3fcddd6.png"},267:function(e,t,a){e.exports=a(453)},272:function(e,t,a){},30:function(e,t){e.exports={GET_CARDS_BY_TITLE:"https://us-central1-clubhouse-collection.cloudfunctions.net/getCardsByTitle",GET_CARDS_FROM_INVENTORY:"https://us-central1-clubhouse-collection.cloudfunctions.net/getCardsFromInventory",FINISH_SALE:"https://us-central1-clubhouse-collection.cloudfunctions.net/finishSale",ADD_CARD_TO_INVENTORY:"https://us-central1-clubhouse-collection.cloudfunctions.net/addCardToInventory",GET_INVENTORY_QUERY:"https://us-central1-clubhouse-collection.cloudfunctions.net/inventorySearchQuery",GET_SALES_BY_TITLE:"https://us-central1-clubhouse-collection.cloudfunctions.net/getSales",LOGIN:"https://us-central1-clubhouse-collection.cloudfunctions.net/getJwt",SCRYFALL_AUTOCOMPLETE:"https://api.scryfall.com/cards/autocomplete",SCRYFALL_SEARCH:"https://api.scryfall.com/cards/search",SCRYFALL_ID_SEARCH:"https://api.scryfall.com/cards/"}},453:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),l=a(41),c=a.n(l),o=(a(272),a(22)),s=a.n(o),i=a(16),u=a(20),d=a(18),m=a(17),h=a(19),p=a(62),g=a(470),f=a(123),E=a.n(f),b=a(29),v=a.n(b);function y(){return{Authorization:"Bearer ".concat(localStorage.getItem("clubhouse_JWT"))}}var S=a(30),C=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,r=new Array(n),l=0;l<n;l++)r[l]=arguments[l];return(a=Object(d.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={isLoading:!1,term:"",autocomplete:[],results:[],defaultSearchValue:"Search for a card"},a.handleSearchChange=function(e,t){var n=t.value;if(a.setState({isLoading:!0,term:n}),a.state.term.length<1)return a.setState({isLoading:!1,term:"",results:[],autocomplete:[],defaultSearchValue:"Search for a card"});setTimeout((function(){var e,t,n;return s.a.async((function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,s.a.awrap(v.a.get("".concat(S.SCRYFALL_AUTOCOMPLETE,"?q=").concat(a.state.term),{headers:y()}));case 2:e=r.sent,t=e.data,n=t.data.map((function(e){return{title:e}})),a.setState({results:n,isLoading:!1});case 6:case"end":return r.stop()}}))}),300)},a.handleResultSelect=function(e,t){var n=t.result;a.props.handleSearchSelect(n.title)},a}return Object(h.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this.state,t=e.results,a=e.isLoading,n=e.defaultSearchValue;return r.a.createElement(g.a,{onSearchChange:E.a.debounce(this.handleSearchChange,300,{trailing:!0}),onResultSelect:this.handleResultSelect,loading:a,results:t,placeholder:n,selectFirstResult:!0})}}]),t}(r.a.Component),O=a(80),L=a(468),I=a(473),w=a(466),F=a(93),_=a(464),j=a(461),x=a(462),T=a(454);function N(e){var t=e.inventoryQty,a=0,n=0;t&&(a=(t.FOIL_NM||0)+(t.FOIL_LP||0)+(t.FOIL_MP||0)+(t.FOIL_HP||0),n=(t.NONFOIL_NM||0)+(t.NONFOIL_LP||0)+(t.NONFOIL_MP||0)+(t.NONFOIL_HP||0));var l={};a>0&&(l.color="blue");var c={};return n>0&&(c.color="blue"),r.a.createElement(r.a.Fragment,null,r.a.createElement(F.a,Object.assign({},l,{image:!0}),"Foil",r.a.createElement(F.a.Detail,null,a)),r.a.createElement(F.a,Object.assign({},c,{image:!0}),"Nonfoil",r.a.createElement(F.a.Detail,null,n)))}var k=a(81),A=function(e){var t=e.num,a=Number(t).toFixed(2);return r.a.createElement("span",null,"$",a)},R=a(257),D={boxShadow:"2px 2px 5px 0 rgba(0,0,0,.25)"},M=function(e){var t=e.image_uris,a=e.card_faces;try{return r.a.createElement(R.a,{src:t.normal,size:"tiny",style:D})}catch(n){return r.a.createElement(R.a,{src:a[0].image_uris.normal,size:"tiny",style:D})}},q=[{key:"NONFOIL",text:"Nonfoil",value:"NONFOIL"},{key:"FOIL",text:"Foil",value:"FOIL"}],Q=[{key:"NM",text:"Near Mint",value:"NM"},{key:"LP",text:"Light Play",value:"LP"},{key:"MP",text:"Moderate Play",value:"MP"},{key:"HP",text:"Heavy Play",value:"HP"}];function P(e,t){return!e&&t?{selectedFinish:"FOIL",finishDisabled:!0}:e&&!t?{selectedFinish:"NONFOIL",finishDisabled:!0}:e&&t?{selectedFinish:"NONFOIL",finishDisabled:!1}:void 0}var Y=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,l=new Array(n),c=0;c<n;c++)l[c]=arguments[c];return(a=Object(d.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(l)))).state={quantity:0,selectedFinish:P(a.props.nonfoil,a.props.foil).selectedFinish,selectedCondition:"NM",finishDisabled:P(a.props.nonfoil,a.props.foil).finishDisabled,submitDisable:!1,inventoryQty:a.props.inventoryQty,submitLoading:!1},a.handleFinishChange=function(e,t){var n=t.value;a.setState({selectedFinish:n},(function(){console.log(a.state)}))},a.handleConditionChange=function(e,t){var n=t.value;a.setState({selectedCondition:n},(function(){console.log(a.state)}))},a.handleQuantityChange=function(e,t){var n=t.value,r=parseInt(n),l=isNaN(r)?"":r;a.setState({quantity:l})},a.handleInventoryAdd=function(e,t){var n,l,c,o,i,u,d,m,h;return s.a.async((function(e){for(;;)switch(e.prev=e.next){case 0:return t.value,n=a.state,l=n.quantity,c=n.selectedFinish,o=n.selectedCondition,i=a.props.name,u="".concat(c,"_").concat(o),e.prev=4,a.setState({submitDisable:!0,submitLoading:!0}),e.next=8,s.a.awrap(v.a.post(S.ADD_CARD_TO_INVENTORY,{quantity:l,type:u,cardInfo:Object(O.a)({},a.props)},{headers:y()}));case 8:d=e.sent,m=d.data,h=r.a.createElement(L.a,{positive:!0,compact:!0},r.a.createElement(L.a.Header,null,l,"x ",i," ",l>0?"added":"removed","!")),k.a.notify((function(){return h}),{position:"bottom-right",duration:2e3}),a.setState({quantity:0,selectedFinish:P(a.props.nonfoil,a.props.foil).selectedFinish,selectedCondition:"NM",finishDisabled:P(a.props.nonfoil,a.props.foil).finishDisabled,submitDisable:!1,inventoryQty:m.qoh,submitLoading:!1}),e.next=18;break;case 15:e.prev=15,e.t0=e.catch(4),console.log(e.t0);case 18:case"end":return e.stop()}}),null,null,[[4,15]])},a}return Object(h.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this.state,t=e.selectedFinish,a=e.selectedCondition,n=e.finishDisabled,l=e.quantity,c=e.submitDisable,o=e.inventoryQty,s=e.submitLoading,i=this.props,u=i.image_uris,d=i.name,m=i.set_name,h=i.set,p=i.rarity,g=(i.id,i.card_faces),f=i.prices;return r.a.createElement(I.a,null,r.a.createElement(w.a.Group,{divided:!0},r.a.createElement(w.a,null,r.a.createElement(w.a.Image,{size:"tiny"},r.a.createElement(M,{image_uris:u,card_faces:g})),r.a.createElement(w.a.Content,null,r.a.createElement(w.a.Header,{as:"h3"},d," ",r.a.createElement("i",{className:"ss ss-fw ss-".concat(h," ss-").concat(p),style:{fontSize:"30px"}}),r.a.createElement(F.a,{color:"grey"},m," (",String(h).toUpperCase(),")"),r.a.createElement(N,{inventoryQty:o})," ",r.a.createElement(F.a,{tag:!0},"Est. ",f.usd?r.a.createElement(A,{num:f.usd}):"not found")),r.a.createElement(w.a.Description,null,r.a.createElement(_.a,null,r.a.createElement(_.a.Group,null,r.a.createElement(_.a.Field,{control:j.a,type:"number",label:"Quantity",value:l,onChange:this.handleQuantityChange}),r.a.createElement(_.a.Field,{label:"Finish",control:x.a,value:t,options:q,disabled:n,onChange:this.handleFinishChange}),r.a.createElement(_.a.Field,{label:"Condition",control:x.a,value:a,options:Q,onChange:this.handleConditionChange}),r.a.createElement(_.a.Button,{label:"Add to Inventory?",control:T.a,primary:!0,disabled:0===l||""===l||c,onClick:this.handleInventoryAdd,loading:s},"Submit"))))))))}}]),t}(n.Component);var H=function(e){return e.cards.map((function(t){return r.a.createElement(Y,Object.assign({showImage:e.showImages,key:t.id},t,{inventoryQty:e.quantities[t.id]}))}))},G=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,r=new Array(n),l=0;l<n;l++)r[l]=arguments[l];return(a=Object(d.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={searchResults:[],inventoryQuantities:[],showImages:!0},a.handleSearchSelect=function(e){var t,n,r,l;return s.a.async((function(c){for(;;)switch(c.prev=c.next){case 0:return t=encodeURI('"'.concat(e,'"')),c.prev=1,c.next=4,s.a.awrap(v.a.get("".concat(S.SCRYFALL_SEARCH,"?q=!").concat(t,"%20unique%3Aprints%20game%3Apaper"),{headers:y()}));case 4:return n=c.sent,r=n.data.data.map((function(e){return e.id})),c.next=8,s.a.awrap(v.a.post(S.GET_CARDS_FROM_INVENTORY,{scryfallIds:r},{headers:y()}));case 8:l=c.sent,a.setState({searchResults:n.data.data,inventoryQuantities:l.data}),c.next=15;break;case 12:c.prev=12,c.t0=c.catch(1),console.log(c.t0);case 15:case"end":return c.stop()}}),null,null,[[1,12]])},a.handleImageToggle=function(){a.setState({showImages:!a.state.showImages})},a}return Object(h.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){return r.a.createElement("div",null,r.a.createElement("div",null,r.a.createElement(C,{handleSearchSelect:this.handleSearchSelect})),r.a.createElement(H,{showImages:this.state.showImages,cards:this.state.searchResults,quantities:this.state.inventoryQuantities}))}}]),t}(r.a.Component),z=a(45),B=a(472),U=a(471),J=a(463),V=a(69),W=a(92),$=a(94),K=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,r=new Array(n),l=0;l<n;l++)r[l]=arguments[l];return(a=Object(d.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={price:null},a}return Object(h.a)(t,e),Object(u.a)(t,[{key:"componentDidMount",value:function(){var e,t,a;return s.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return e=this.props.id,n.next=3,s.a.awrap(v.a.get("".concat(S.SCRYFALL_ID_SEARCH).concat(e),{headers:y()}));case 3:t=n.sent,a=t.data,this.setState({price:Number(a.prices.usd)});case 6:case"end":return n.stop()}}),null,this)}},{key:"render",value:function(){var e=this.state.price;return r.a.createElement("span",null,"Est. ",e?r.a.createElement(A,{num:e}):"not found")}}]),t}(r.a.Component);function X(e,t){return Object.entries(e).map((function(e){var a,n=Object(W.a)(e,2),r=n[0],l=n[1];return{text:"".concat((a=r,a.split("_").join(" | "))," | Qty: ").concat(l),value:r,key:"".concat(t).concat(r)}}))}var Z=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,r=new Array(n),l=0;l<n;l++)r[l]=arguments[l];return(a=Object(d.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={selectedFinishCondition:"",selectedFinishConditionQty:0,quantityToSell:0,price:0,conditionOptions:X(a.props.qoh,a.props.id)},a.handleQuantityChange=function(e,t){var n=t.value,r=a.state.selectedFinishConditionQty;n>r&&(n=r),n<0&&(n=0),a.setState({quantityToSell:parseInt(n)})},a.handleSelectedFinishCondition=function(e,t){var n=t.value;a.setState({selectedFinishCondition:n,selectedFinishConditionQty:a.props.qoh[n]})},a.handlePriceChange=function(e,t){var n=t.value;a.setState({price:n})},a.handleAddToSale=function(){var e=a.props,t=(e.id,e.name,e.set,a.state),n=t.selectedFinishCondition,r=t.quantityToSell,l=t.price;a.props.addToSaleList(Object(O.a)({},a.props),n,r,l),a.setState({selectedFinishCondition:"",selectedFinishConditionQty:0,quantityToSell:0,price:0,conditionOptions:X(a.props.qoh,a.props.id)})},a}return Object(h.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this.props,t=e.name,a=e.image_uris,n=e.set,l=e.set_name,c=e.rarity,o=e.qoh,s=e.id,i=e.card_faces,u=this.state,d=u.selectedFinishCondition,m=u.selectedFinishConditionQty,h=u.conditionOptions,p=u.quantityToSell,g=u.price;return r.a.createElement(I.a,null,r.a.createElement(w.a.Group,{divided:!0},r.a.createElement(w.a,null,r.a.createElement(w.a.Image,{size:"tiny"},r.a.createElement(M,{image_uris:a,card_faces:i})),r.a.createElement(w.a.Content,null,r.a.createElement(w.a.Header,{as:"h3"},t," ",r.a.createElement("i",{className:"ss ss-fw ss-".concat(n," ss-").concat(c),style:{fontSize:"30px"}}),r.a.createElement(F.a,{color:"grey"},l," (",String(n).toUpperCase(),")"),r.a.createElement(N,{inventoryQty:o})," ",r.a.createElement(F.a,{tag:!0},r.a.createElement(K,{id:s}))),r.a.createElement(w.a.Description,null,r.a.createElement(_.a,null,r.a.createElement(_.a.Group,null,r.a.createElement(_.a.Field,{control:$.a,selection:!0,placeholder:"Select inventory",options:h,value:d,label:"Select finish/condition",onChange:this.handleSelectedFinishCondition}),r.a.createElement(_.a.Field,{control:j.a,type:"number",label:"Quantity to sell",value:p,onChange:this.handleQuantityChange,disabled:!m}),r.a.createElement(_.a.Field,{control:j.a,type:"number",label:"Price",value:g,onChange:this.handlePriceChange,disabled:!m}),r.a.createElement(_.a.Button,{label:"Add to sale?",control:T.a,primary:!0,onClick:this.handleAddToSale,disabled:!p},"Sell"))))))))}}]),t}(r.a.Component);function ee(e){return e.cards.map((function(t){return r.a.createElement(Z,Object.assign({key:t.id},t,{addToSaleList:e.addToSaleList}))}))}function te(e){var t=e.name,a=e.set,n=e.finishCondition,l=e.qtyToSell,c=e.price,o=e.rarity,s=e.deleteLineItem,i=e.id;return r.a.createElement(I.a,null,r.a.createElement(w.a.Group,null,r.a.createElement(w.a,null,r.a.createElement(w.a.Content,null,r.a.createElement(w.a.Header,{as:"h4"},t," ",r.a.createElement("i",{className:"ss ss-fw ss-".concat(a," ss-").concat(o),style:{fontSize:"30px"}}),r.a.createElement(F.a,{color:"grey"},a.toUpperCase())),r.a.createElement(w.a.Meta,null,r.a.createElement("span",null,l,"x @ ",r.a.createElement(A,{num:c})," | ",n),r.a.createElement(T.a,{floated:"right",icon:!0,onClick:function(){return s(i,n)}},r.a.createElement(V.a,{name:"cancel"})))))))}var ae=function(e){var t=e.saleList,a=t.length?t.reduce((function(e,t){return e+parseInt(t.qtyToSell)*Number(t.price)}),0):0;return r.a.createElement(A,{num:a})},ne=function(e){var t=e.color,a=e.header,n=e.message,l=e.position;return k.a.notify((function(){return r.a.createElement(L.a,{color:t,compact:!0},r.a.createElement(L.a.Header,null,a),n)}),{position:l})},re={searchResults:[],saleListCards:[],showModal:!1,submitLoading:!1},le=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,r=new Array(n),l=0;l<n;l++)r[l]=arguments[l];return(a=Object(d.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state=re,a.handleResultSelect=function(e){var t,n;return s.a.async((function(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,r.next=3,s.a.awrap(v.a.get(S.GET_CARDS_BY_TITLE,{params:{title:e},headers:y()}));case 3:t=r.sent,n=t.data,a.setState({searchResults:n}),r.next=11;break;case 8:r.prev=8,r.t0=r.catch(0),console.log(r.t0);case 11:case"end":return r.stop()}}),null,null,[[0,8]])},a.addToSaleList=function(e,t,n,r){var l=Object(O.a)({},e,{finishCondition:t,qtyToSell:n,price:r}),c=Object(z.a)(a.state.saleListCards),o=c.findIndex((function(e){return e.id===l.id&&e.finishCondition===t}));-1!==o?c.splice(o,1,l):c.push(l),a.setState({saleListCards:c})},a.removeFromSaleList=function(e,t){var n=E.a.reject(Object(z.a)(a.state.saleListCards),(function(a){return a.id===e&&a.finishCondition===t}));a.setState({saleListCards:n})},a.finalizeSale=function(){var e,t,n;return s.a.async((function(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,a.setState({submitLoading:!0}),r.next=4,s.a.awrap(v.a.post(S.FINISH_SALE,{cards:a.state.saleListCards},{headers:y()}));case 4:e=r.sent,t=e.data,n=t.sale_data.Sale.saleID,ne({color:"green",header:"Sale created in Lightspeed!",message:"The id number is #".concat(n),position:"bottom-right"}),a.setState(re),r.next=16;break;case 11:r.prev=11,r.t0=r.catch(0),ne({color:"red",header:"Error!",message:"Sale was not created",position:"bottom-right"}),a.setState(re),console.log(r.t0);case 16:case"end":return r.stop()}}),null,null,[[0,11]])},a.closeModal=function(){a.setState({showModal:!1})},a}return Object(h.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this,t=this.state,a=t.searchResults,n=t.saleListCards,l=t.showModal,c=t.submitLoading,o=n.map((function(t){return r.a.createElement(te,Object.assign({},t,{key:"".concat(t.id).concat(t.finishCondition).concat(t.qtyToSell),deleteLineItem:e.removeFromSaleList}))}));return r.a.createElement("div",null,r.a.createElement(C,{handleSearchSelect:this.handleResultSelect}),r.a.createElement(B.a,{stackable:!0},r.a.createElement(B.a.Row,null,r.a.createElement(B.a.Column,{width:"11"},r.a.createElement(U.a,{as:"h2"},"Inventory"),r.a.createElement(I.a,null,r.a.createElement(ee,{cards:a,addToSaleList:this.addToSaleList}))),r.a.createElement(B.a.Column,{width:"5"},r.a.createElement(U.a,{as:"h2"},"Sale Items"),r.a.createElement(I.a,null,o),n.length>0&&r.a.createElement(I.a,{clearing:!0},r.a.createElement(U.a,{floated:"left"},r.a.createElement(U.a,{sub:!0},"Subtotal"),r.a.createElement(ae,{saleList:n})),r.a.createElement(J.a,{basic:!0,open:l,trigger:r.a.createElement(T.a,{floated:"right",primary:!0,onClick:function(){e.setState({showModal:!0})}},"Finalize sale")},r.a.createElement(J.a.Content,null,r.a.createElement(U.a,{inverted:!0,as:"h2"},"Finalize this sale for Lightspeed?"),r.a.createElement("p",null,"Click 'Yes' to complete the sale in Lightspeed. Please ensure that you have all cards in hand and double-checked the pull list. Undoing this action will be quite painful!")),r.a.createElement(J.a.Actions,null,r.a.createElement(T.a,{basic:!0,color:"red",inverted:!0,onClick:this.closeModal},r.a.createElement(V.a,{name:"remove"})," No"),r.a.createElement(T.a,{color:"green",inverted:!0,onClick:this.finalizeSale,loading:c},r.a.createElement(V.a,{name:"checkmark"})," Yes"))))))))}}]),t}(r.a.Component),ce=a(467),oe=a(252),se=a.n(oe),ie=function(e){var t=e.saleData,a=e.cardList.reduce((function(e,t){return e+t.qtyToSell}),0);return r.a.createElement(ce.a.Row,null,r.a.createElement(ce.a.Cell,null,t.saleID),r.a.createElement(ce.a.Cell,null,se()(t.createTime).format("MM/DD/YYYY - h:mm A")),r.a.createElement(ce.a.Cell,null,a))},ue=function(e){var t=e.list;return r.a.createElement(ce.a,{celled:!0,unstackable:!0,compact:!0},r.a.createElement(ce.a.Header,null,r.a.createElement(ce.a.Row,null,r.a.createElement(ce.a.HeaderCell,null,"Sale ID"),r.a.createElement(ce.a.HeaderCell,null,"Date of Sale"),r.a.createElement(ce.a.HeaderCell,null,"Quantity Sold"))),r.a.createElement(ce.a.Body,null,t.map((function(e){var t=e.sale_data,a=e.card_list,n=e._id;return r.a.createElement(ie,{saleData:t,cardList:a,key:n})}))))},de=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,r=new Array(n),l=0;l<n;l++)r[l]=arguments[l];return(a=Object(d.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={salesList:[],cardName:""},a.handleSearchSelect=function(e){var t,n;return s.a.async((function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,s.a.awrap(v.a.get(S.GET_SALES_BY_TITLE,{params:{cardName:e},headers:y()}));case 2:t=r.sent,n=t.data,a.setState({salesList:n,cardName:e});case 5:case"end":return r.stop()}}))},a}return Object(h.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this.state,t=e.salesList,a=e.cardName;return r.a.createElement("div",null,r.a.createElement(C,{handleSearchSelect:this.handleSearchSelect}),r.a.createElement("br",null),r.a.createElement("span",null,r.a.createElement("em",null,""!==a&&r.a.createElement("h4",null,t.length," results for ",a))),r.a.createElement(ue,{list:t}))}}]),t}(n.Component),me=a(36),he=function(e){var t=e.color,a=e.header,n=e.message,l=e.position;return k.a.notify((function(){return r.a.createElement(L.a,{color:t,compact:!0},r.a.createElement(L.a.Header,null,a),n)}),{position:l})},pe={username:"",password:"",btnLoading:!1},ge=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,r=new Array(n),l=0;l<n;l++)r[l]=arguments[l];return(a=Object(d.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state=pe,a.handleInputChange=function(e,t){var n=t.value;a.setState(Object(me.a)({},e.target.name,n))},a.login=function(){var e,t,n,r,l;return s.a.async((function(c){for(;;)switch(c.prev=c.next){case 0:return e=a.state,t=e.username,n=e.password,a.setState({btnLoading:!0}),c.next=4,s.a.awrap(a.props.handleLogin(t,n));case 4:r=c.sent,l=r.authed,a.setState({btnLoading:!1}),l?(a.setState(pe),he({color:"green",header:"Success!",message:"You were logged in",position:"bottom-right"})):(a.setState(pe),he({color:"red",header:"Error",message:"Login failed",position:"bottom-right"}));case 8:case"end":return c.stop()}}))},a}return Object(h.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this.state,t=e.username,a=e.password,n=e.btnLoading;return this.props.loggedIn?r.a.createElement(p.a,{to:"/manage-inventory"}):r.a.createElement(_.a,null,r.a.createElement(_.a.Field,null,r.a.createElement(_.a.Input,{name:"username",placeholder:"Username",label:"Username",value:t,onChange:this.handleInputChange})),r.a.createElement(_.a.Field,null,r.a.createElement(_.a.Input,{name:"password",placeholder:"Password",type:"password",label:"Password",value:a,onChange:this.handleInputChange})),r.a.createElement(T.a,{type:"submit",onClick:this.login,disabled:!t||!a,loading:n},"Submit"))}}]),t}(r.a.Component),fe=function(e){return e.loggedIn?r.a.createElement(r.a.Fragment,null,r.a.createElement(U.a,{as:"h3",color:"grey"},r.a.createElement("i",null,"Until we meet again, friend...")),r.a.createElement(T.a,{onClick:function(){return e.handleLogin("","")}},"Logout")):r.a.createElement(p.a,{to:"/login"})};var Ee=function(e){var t=e.handleLogin,a=e.loggedIn;return r.a.createElement("div",{style:{paddingTop:"52.63px",marginLeft:"20px",marginRight:"20px"}},r.a.createElement("br",null),r.a.createElement(p.d,null,r.a.createElement(p.b,{exact:!0,path:"/manage-inventory",component:G}),r.a.createElement(p.b,{exact:!0,path:"/new-sale",component:le}),r.a.createElement(p.b,{exact:!0,path:"/browse-sales",component:de}),r.a.createElement(p.b,{exact:!0,path:"/login",render:function(){return r.a.createElement(ge,{handleLogin:t,loggedIn:a})}}),r.a.createElement(p.b,{exact:!0,path:"/logout",render:function(){return r.a.createElement(fe,{handleLogin:t,loggedIn:a})}})))},be=a(255),ve=a.n(be),ye=a(469),Se=a(43),Ce={background:"linear-gradient(#2185d0, #206ac6)",boxShadow:"0 3px 5px 0 rgba(0,0,0,.25)"},Oe=function(e){function t(){return Object(i.a)(this,t),Object(d.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(h.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this.props.loggedIn;return r.a.createElement(ye.a,{inverted:!0,fixed:"top",style:Ce},r.a.createElement(ye.a.Item,null,r.a.createElement("img",{src:ve.a,style:{marginRight:"7px"},alt:"logo"}),r.a.createElement("span",null,r.a.createElement("h3",null,"Clubhouse Collection"))),r.a.createElement(ye.a.Menu,{position:"right"},e&&r.a.createElement($.a,{item:!0,icon:"bars"},r.a.createElement($.a.Menu,null,r.a.createElement(r.a.Fragment,null,r.a.createElement($.a.Item,{as:Se.b,to:"/manage-inventory"},r.a.createElement(V.a,{name:"plus",color:"blue"}),"Manage Inventory"),r.a.createElement($.a.Item,{as:Se.b,to:"/new-sale"},r.a.createElement(V.a,{name:"dollar sign",color:"blue"}),"New Sale"),r.a.createElement($.a.Item,{as:Se.b,to:"/browse-sales"},r.a.createElement(V.a,{name:"eye",color:"blue"}),"Browse Sales"),r.a.createElement($.a.Item,{as:Se.b,to:"/logout"},r.a.createElement(V.a,{name:"log out",color:"blue"}),"Logout")))),!e&&r.a.createElement(ye.a.Item,{position:"right",as:Se.b,to:"/login"},"Log in")))}}]),t}(r.a.Component),Le=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,r=new Array(n),l=0;l<n;l++)r[l]=arguments[l];return(a=Object(d.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={loggedIn:!!localStorage.getItem("clubhouse_JWT")},a.handleLogin=function(e,t){var n,r;return s.a.async((function(l){for(;;)switch(l.prev=l.next){case 0:return l.prev=0,l.next=3,s.a.awrap(v.a.post(S.LOGIN,{username:e.toLowerCase(),password:t},{headers:y()}));case 3:if(n=l.sent,!(r=n.data).token){l.next=11;break}return localStorage.setItem("clubhouse_JWT",r.token),a.setState({loggedIn:!!localStorage.getItem("clubhouse_JWT")}),l.abrupt("return",{authed:!0});case 11:return localStorage.clear(),a.setState({loggedIn:!!localStorage.getItem("clubhouse_JWT")}),l.abrupt("return",{authed:!1});case 14:l.next=19;break;case 16:l.prev=16,l.t0=l.catch(0),console.log(l.t0);case 19:case"end":return l.stop()}}),null,null,[[0,16]])},a}return Object(h.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){return r.a.createElement("div",null,r.a.createElement(Oe,{loggedIn:this.state.loggedIn}),r.a.createElement(Ee,{handleLogin:this.handleLogin,loggedIn:this.state.loggedIn}))}}]),t}(r.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a(452);c.a.render(r.a.createElement(Se.a,null,r.a.createElement(Le,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[267,1,2]]]);
//# sourceMappingURL=main.246abafd.chunk.js.map