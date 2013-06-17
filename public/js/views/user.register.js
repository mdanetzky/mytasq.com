/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Backbone View.
 * User registration form.
 */

define(['mt.backbone.sio', 'underscore', 'mt.util', 'jquery', 'mt.spinner'], function(Backbone, _, util, $, activity) {
    var UserRegister = Backbone.View.extend({
        el: "#userRegisterForm",
        events: {
            "click #userRegisterSend": "validateAndSend"
                    , "input #userRegisterEmail": "copyAndValidate"
                    , "input #userRegisterPassword": "copyAndValidate"
                    , "input #userRegisterRePassword": "copyAndValidate"
                    , "input #userRegisterRememberMe": "copyAndValidate"
        },
        validateAndSend: function() {
            self = this;
            activity.show();
            $('#userRegisterSend').attr('disabled', 'disabled');
            this.model.save({}, {success: function(model, response, options) {
                    activity.hide();
                    alert('SUCCESS' + model + response + options);
                }, error: function(model, xhr, options) {
                    activity.hide();
                    self.copyAndValidate();
                    alert('ERROR');
                }});
            // prevent form submit
            return false;
        },
        copyAndValidate: function() {
            var validated = true;
            this.model.set("email", $("#userRegisterEmail").val());
            this.model.set("password", $("#userRegisterPassword").val());
            this.model.set("repassword", $("#userRegisterRePassword").val());
            this.model.set("rememberme", $("#userRegisterRememberMe").attr('checked'));
            if (util.validateEmail(this.model.get('email'))) {
                $("#userRegisterEmailCG").removeClass('error');
                $("#userRegisterEmailCG").addClass('success');
            } else {
                validated = false;
                $("#userRegisterEmailCG").removeClass('success');
                $("#userRegisterEmailCG").addClass('error');
            }
            if (this.model.get('password')) {
                $("#userRegisterPasswordCG").removeClass('error');
                $("#userRegisterPasswordCG").addClass('success');
            } else {
                validated = false;
                $("#userRegisterPasswordCG").removeClass('success');
                $("#userRegisterPasswordCG").addClass('error');
            }
            if (this.model.get('repassword') && this.model.get('password') === this.model.get('repassword')) {
                $("#userRegisterRePasswordCG").removeClass('error');
                $("#userRegisterRePasswordCG").addClass('success');
            } else {
                validated = false;
                $("#userRegisterRePasswordCG").removeClass('success');
                $("#userRegisterRePasswordCG").addClass('error');
            }
            if (validated) {
                $('#userRegisterSend').removeAttr('disabled');
            } else {
                $('#userRegisterSend').attr('disabled', 'disabled');
                $('#userRegisterSend').removeAttr('disabled');
            }
        }
    });
    return UserRegister;
});