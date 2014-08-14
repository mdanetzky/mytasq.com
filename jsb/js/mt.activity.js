/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(["jquery","activity-indicator"],function(e){function n(){if(t!==null)throw new Error("Cannot instantiate more than one ActivitySingleton, use ActivitySingleton.getInstance()");this.initialize()}var t=null;return n.prototype={initialize:function(){e("body").append('<div id="activity-container" style="display:none; width:50px; height:50px; position:fixed; z-index:10000;"></div>'),this.activityDiv=e("#activity-container")},show:function(){this.activityDiv.show();var t=e(this.activityDiv).outerHeight(),n=e(this.activityDiv).outerWidth();this.activityDiv.css("top",Math.max(0,(e(window).height()-t)/2)+"px"),this.activityDiv.css("left",Math.max(0,(e(window).width()-n)/2)+"px"),this.activityDiv.activity()},hide:function(){this.activityDiv.activity(!1),this.activityDiv.hide()}},n.getInstance=function(){return t===null&&(t=new n),t},n.getInstance()});