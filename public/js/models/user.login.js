/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Backbone model.
 * User login data.
 */

define(['mt.backbone.sio'], function(Backbone) {
    var UserLogin = Backbone.Model.extend({
        
        url: 'user/login',
        
        email : '',
        password : '',
        rememberme : false
    });
    
    
    return UserLogin;
});