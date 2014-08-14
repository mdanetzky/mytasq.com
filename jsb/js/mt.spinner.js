/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(["spin"],function(e){function t(e){var t=document.createDocumentFragment(),n=document.createElement("div");n.innerHTML=e;while(n.firstChild)t.appendChild(n.firstChild);return t}var n=t('<div id="activity-indicator-spinner" style="position:fixed; top:50%; left:50%; margin:-25px 0 0 -25px; width:50px; height:50px; display:none;"></div>');document.body.insertBefore(n,document.body.childNodes[0]);var r=document.getElementById("activity-indicator-spinner"),i=(new e).spin(r);return i.stop(),{show:function(){r.style.display="block",i.spin(r)},hide:function(){i.stop(),r.style.display="none"}}});