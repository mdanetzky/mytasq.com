/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(["backbone","jquery","mt.socket","models/user.register","views/user.register","models/user.login","views/user.login","views/user.logout","mt.backbone.sio"],function(e,t,n,r,i,s,o,u){var a,f,l,c,h,p=e.Router.extend({routes:{"empty.html":"empty","search/:query":"search","search/:query/p:page":"search"},empty:function(){},search:function(e,t){}}),d=e.View.extend({el:t("body"),initialize:function(){e.history.start({pushState:!0}),a=new p,f=new r({socket:n}),l=new i({socket:n,model:f}),c=new s({socket:n}),h=new o({socket:n,model:c}),userLogoutView=new u({socket:n})}});return d});