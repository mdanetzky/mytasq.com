/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(['mt.backbone.sio'], function(Backbone) {
    var UserRegister = Backbone.Model.extend({
        
        url : 'user/register',
        
        email : null,
        password : null,
        repassword : null,
        rememberme : null
    });
    
    return UserRegister;
});