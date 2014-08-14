/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Client main entry point
 */

define(["jquery","mt.socket","mt.backbone.app","mt.spinner"],function(e,t,n,r){var i;return{init:function(){e(document).ready(function(){i=new n({socket:t}),r.hide(),e("#content").fadeIn("fast")})}}});