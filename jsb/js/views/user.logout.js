/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(["mt.backbone.sio","underscore","mt.util","jquery","mt.spinner","mt.message.box"],function(e,t,n,r,i,s){var o=e.View.extend({el:"#userLogout",events:{"click #userLogoutSend":"logoutSend"},logoutSend:function(){i.show(),this.socket.emit("backbone.sync",{url:"user/logout"},function(e,t){i.hide(),e?s(e):s("Thank you",function(){document.location.href="/"})})}});return o});