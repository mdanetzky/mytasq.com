/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * requirejs config and startup
 */

(function(){var e=require.config({baseUrl:"js",paths:{jquery:"lib/jquery-1.9.1.full",text:"lib/text",backbone:"lib/backbone",underscore:"lib/underscore",spin:"lib/spin",bootstrap:"lib/bootstrap.min","socket.io":"/socket.io/socket.io","uri.parser":"lib/uri.parser"},map:{"*":{css:"lib/require-css/css"}},shim:{"socket.io":{exports:"io"},"activity-indicator":{deps:["jquery"]},jquery:{exports:"$"},underscore:{exports:"_"},backbone:{deps:["underscore","jquery"],exports:"Backbone"},bootstrap:{deps:["jquery","css!../css/bootstrap.min.css"]}}});e(["mt.spinner"],function(t){t.show(),e(["mt.main","bootstrap"],function(e){e.init()})})})(),define("mt.boot",function(){});