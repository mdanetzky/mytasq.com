/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(["backbone"],function(e){var t,n,r,i;return i=e.sync,n=e.Model.prototype.constructor,r=e.View.prototype.constructor,t=e.Collection.prototype.constructor,e.sync=function(e,t,n){var r,s,o,u;s=t.socket||((u=t.collection)!==null?u.socket:void 0);if(!s)return i.apply(this,arguments);o=n.success,delete n.success,r=n.error,delete n.error;var a=typeof t.url=="function"?t.url():t.url;s.emit("backbone.sync",{url:a,method:e,model:t,options:n},function(e,t){e?r.call(this,e):o.call(this,t)})},e.Model=e.Model.extend({constructor:function(e,t){this.socket=e!==null?e.socket:void 0,delete e.socket,n.apply(this,arguments)}}),e.View=e.View.extend({constructor:function(e,t){this.socket=e!==null?e.socket:void 0,delete e.socket,r.apply(this,arguments)}}),e.Collection=e.Collection.extend({constructor:function(e,n){this.socket=e!==null?e.socket:void 0,delete e.socket,t.apply(this,arguments)}}),e});