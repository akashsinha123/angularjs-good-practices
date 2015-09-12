"use strict";angular.module("AngularAuth",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","btford.socket-io","angular-md5","luegg.directives","http-auth-interceptor"]).constant("moment",moment).config(["$routeProvider","$locationProvider","$httpProvider",function(a,b,c){c.defaults.headers.post["Content-Type"]="application/x-www-form-urlencoded; charset=UTF-8";a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/home",{templateUrl:"views/home.html",controller:"HomeCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("AngularAuth").controller("MainCtrl",["$scope","$location","$cookieStore","UserService","md5",function(a,b,c,d,e){a.login=function(){a.md5password=e.createHash(a.user.password||""),a.md5username=e.createHash(a.user.username||"");var f={username:a.user.username,password:a.md5password};d.login(f).then(function(a){c.put("sessionId",a.response.body.sessionId),b.path("/home")})["catch"](function(a){})}}]),angular.module("AngularAuth").controller("AboutCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("AngularAuth").service("UserService",["$http","$q",function(a,b){this.login=function(c){var d=b.defer();return a.post("/api/login",$.param(c)).success(function(a){d.resolve(a)}).error(function(a){d.reject(a)}),d.promise},this.profile=function(c){var d=b.defer();return a.post("/api/check",$.param(c)).success(function(a){d.resolve(a)}).error(function(a){d.reject(a)}),d.promise}}]),angular.module("AngularAuth").controller("HomeCtrl",["$scope","$location","$cookieStore","CustomerService","UserService",function(a,b,c,d,e){}]),angular.module("AngularAuth").service("CustomerService",["$http","$q",function(a,b){this.fetch=function(c){var d=b.defer();return a.post("/api/home",$.param(c)).success(function(a){d.resolve(a)}).error(function(a){d.reject(a)}),d.promise},this.profile=function(a){}}]),angular.module("AngularAuth").service("ChatService",["$http","$q",function(a,b){this.fetch=function(c){var d=b.defer();return a.post("/api/messages",$.param(c)).success(function(a){d.resolve(a)}).error(function(a){d.reject(a)}),d.promise}}]),angular.module("AngularAuth").service("SocketService",["socketFactory","$cookieStore",function(a,b){this.socket=function(){var a,c=b.get("sessionId"),d="ws://106.187.100.19:8080/chatpay/websocket/chat?sessionId="+c;if("WebSocket"in window)a=new WebSocket(d);else{if(!("MozWebSocket"in window))return void alert("WebSocket is not supported by this browser.");a=new MozWebSocket(d)}return a}}]),angular.module("AngularAuth").service("ComposeService",["$http","$q",function(a,b){this.create=function(c){var d=b.defer();return a.post("/api/compose",$.param(c)).success(function(a){d.resolve(a)}).error(function(a){d.reject(a)}),d.promise}}]),angular.module("AngularAuth").service("UserOrderService",["$http","$q",function(a,b){this.fetch=function(c){var d=b.defer();return a.post("/api/inventory",$.param(c)).success(function(a){d.resolve(a)}).error(function(a){d.reject(a)}),d.promise},this.create=function(c){var d=b.defer();return a.post("/api/order",$.param(c)).success(function(a){d.resolve(a)}).error(function(a){d.reject(a)}),d.promise}}]),angular.module("AngularAuth").directive("userSearch",["$cookieStore","ChatService","CustomerService","SocketService","moment","UserService","$location",function(a,b,c,d,e,f,g){return{restrict:"E",scope:{customer:"=customer",messages:"=messages",categories:"=categories",merchants:"=merchants",timePast:"=timePast",presentTime:"=presentTime"},templateUrl:"views/directives/user-search.html",link:function(d,f,h){var i={sessionId:a.get("sessionId")};c.fetch(i).then(function(a){a&&(d.customers=a.response.body.customers,d.categories=a.response.body.categories,d.merchants=a.response.body.merchants)})["catch"](function(a){g.path("/")}),setInterval(function(){c.fetch(i)["catch"](function(a){g.path("/")})},6e4),d.customerSelected=function(c){d.customer=c;var e={sessionId:a.get("sessionId"),customerKey:c.userKey};b.fetch(e).then(function(a){d.messages=a.response.body.messages})["catch"](function(a){})},d.moment=e(),d.moment.lang("en"),d.duration=d.moment.fromNow(d.presentTime)}}}]),angular.module("AngularAuth").directive("userChat",["$cookieStore","ChatService","CustomerService","SocketService","ComposeService","moment",function(a,b,c,d,e,f){return{restrict:"E",scope:{customer:"=customer",messages:"=messages",merchants:"=merchants",merchant:"=merchant",timePast:"=timePast",presentTime:"=presentTime",fireSubmitMessage:"=fireSubmitMessage",composedMessagefromTemplate:"=composedMessagefromTemplate"},templateUrl:"views/directives/user-chat.html",link:function(b,c,f){var g=d.socket();g.onopen=function(){console.log("Info: WebSocket connection opened.")},b.$watch("composedMessagefromTemplate",function(a){b.composedMessage=a,b.fireSubmitMessage&&(b.composeMessage(),b.fireSubmitMessage=!1)}),b.composeMessage=function(){var c={sessionId:a.get("sessionId"),customerKey:b.customer.userKey,merchantKey:b.merchant.merchantKey,message:b.composedMessage};return e.create(c).then(function(a){console.log(a),b.messages.push({messageType:2,message:a.message}),b.composedMessage=""})["catch"](function(a){}),b.glued=!0,!1},g.onmessage=function(a){var c=JSON.parse(a.data);console.log(c),b.presentTime=(new Date).getTime(),c.messageType=1,console.log(c),b.messages.push(c),b.glued=!0,b.$digest()}}}}]),angular.module("AngularAuth").directive("userOrder",["UserOrderService","$cookieStore","ChatService","CustomerService","ComposeService","moment",function(a,b,c,d,e,f){return{restrict:"E",scope:{customer:"=customer",messages:"=messages",categories:"=categories",merchants:"=merchants",merchant:"=merchant",search:"=search"},templateUrl:"views/directives/user-order.html",link:function(c,d,e){c.items=[],c.itemNames=[],c.itemUnitPrice=[],c.total=0,c.quantityIncrement=function(a,b){c.items[b].quantity+=1,c.items[b].itemTotal=c.items[b].itemUnitPrice*c.items[b].quantity},c.quantityDecrement=function(a,b){c.items[b].quantity>1&&(c.items[b].quantity-=1),c.items[b].itemTotal=c.items[b].itemUnitPrice*c.items[b].quantity},c.addItem=function(a,b){c.items.push(a),c.itemNames.push(a.itemName),c.itemUnitPrice.push(a.itemUnitPrice);for(var d=0;d<c.items.length;d++)c.items[d].quantity||(c.items[d].quantity=1),c.items[d].itemTotal||(c.items[d].itemTotal=c.items[d].itemUnitPrice);c.inventory.splice(b,1)},c.removeItem=function(a,b){c.items.splice(a,1),c.itemNames.splice(a,1),c.itemUnitPrice.splice(a,1),c.inventory.push(b)},c.inventory=function(){var d={sessionId:b.get("sessionId"),merchantKey:c.merchant.merchantKey};c.merchantKey=c.merchant.merchantKey,a.fetch(d).then(function(a){c.inventory=a.response.body.inventory,console.log(c.inventory)})["catch"](function(a){})},c.countTotal=function(){c.sumTotal()},c.sumTotal=function(){for(var a=0,b=0;b<c.items.length;b++)a+=c.items[b].itemTotal;return a},c.finalTotal=function(){var a=c.sumTotal(),b=a+49,d=b+10;c.grandTotal=d-100,a=0,b=0,d=0},c.placeOrder=function(){var d={status:1,merchantKey:c.merchantKey,appKey:"2b11d3ccacf3b2f7675532bfd0c0bfdf",sessionId:b.get("sessionId"),customerKey:c.customer.userKey,userKey:"e8441ce0964c2581ff86f3c41b7981e4",data:JSON.stringify({items:[{acocuntId:1,created:f().toString(),id:1,itemDescription:"Fuji Apple - 500 gm",itemName:c.itemNames,itemQuantity:1,itemSku:"Fuji Apple - 500 gm",itemUnitPrice:c.itemUnitPrice,merchantId:1,orderId:4,status:1,totalItemPrice:c.grandTotal,userId:1}]})};a.create(d).then(function(a){console.log(a)})["catch"](function(a){console.log(a)})}}}}]),angular.module("AngularAuth").directive("userInfo",function(){return{restrict:"E",scope:{customer:"=customer"},templateUrl:"views/directives/user-info.html",link:function(a,b,c){}}}),angular.module("AngularAuth").directive("userHistory",function(){return{restrict:"E",scope:{search:"=search"},templateUrl:"views/directives/user-history.html",link:function(a,b,c){}}}),angular.module("AngularAuth").directive("userMessage",function(){return{restrict:"E",scope:{fireSubmitMessage:"=fireSubmitMessage",composedMessagefromTemplate:"=composedMessagefromTemplate"},templateUrl:"views/directives/user-message.html",link:function(a,b,c){a.messages=[{message:"May i help you order today?"},{message:"We have a special offer from spencer's today. Order products worth Rs 500 and get Rs 100 off."},{message:"Sorry sir for inconvenience caused. We have checked with merchant and they are delivering your order within 15 minutes."},{message:"May i help you order today?"},{message:"We have a special offer from spencer's today. Order products worth Rs 500 and get Rs 100 off."},{message:"Sorry sir for inconvenience caused. We have checked with merchant and they are delivering your order within 15 minutes."}],a.fillMessageField=function(b){a.composedMessagefromTemplate=b},a.sendMessage=function(b){a.fireSubmitMessage=!0,a.composedMessagefromTemplate=b}}}});