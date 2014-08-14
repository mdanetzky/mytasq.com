/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Bootstrap based messageBox
 */

define(["jquery","text!templates/message.box.html"],function(e,t){return e("body").append(t),function(t,n){e("#messageBoxContent").html(t),n&&e("#messageBox").on("hidden",function(){e("#messageBox").off("hidden"),n()}),e("#messageBox").modal("show")}});