/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(['mt.backbone.sio', 'underscore', 'mt.util', 'jquery', 'mt.spinner', 'mt.message.box'],
        function(Backbone, _, util, $, activity, msgBox) {
            var appView;
            var UserLogin = Backbone.View.extend({
                // User input indicator
                formChanged: false,
                el: "#userLoginForm",
                initialize: function() {
                    this.copyAndValidate();
                },
                events: {
                    "click #userLoginSend": "none"
                            , "submit": "validateAndSend"
                            , "input #userLoginEmail": "formInput"
                            , "input #userLoginPassword": "formInput"
                            , "input #userLoginRememberMe": "formInput"
                },
                none: function() {
                },
                validateAndSend: function() {
                    var self = this;
                    if (self.sending) {
                        return false;
                    }
                    self.sending = true;
                    activity.show();
                    this.model.save({}, {
                        success: function(model, response, options) {
                            self.copyAndValidate();
                            activity.hide();
                            // Submit dummy form to let browser save email/password
                            // reload page
                            util.loadAndSlide('content', '/content', function() {
                                self.options.app.trigger('global-rerender');
                            });
                        }, error: function(response) {
                            self.copyAndValidate();
                            activity.hide();
                            self.sending = false;
                            msgBox("Login failed!");
                        }});
                    return true;
                },
                formInput: function() {
                    this.formChanged = true;
                    this.copyAndValidate();
                },
                copyAndValidate: function() {
                    var validated = true;
                    this.model.set("email", $("#userLoginEmail").val());
                    this.model.set("password", $("#userLoginPassword").val());
                    this.model.set("rememberme", $("#userLoginRememberMe").attr('checked'));
                    if (util.validateEmail(this.model.get('email'))) {
                        $("#userLoginEmailCG").removeClass('error');
                        $("#userLoginEmailCG").addClass('success');
                    } else {
                        validated = false;
                        $("#userLoginEmailCG").removeClass('success');
                        $("#userLoginEmailCG").addClass('error');
                    }
                    if (this.model.get('password')) {
                        $("#userLoginPasswordCG").removeClass('error');
                        $("#userLoginPasswordCG").addClass('success');
                    } else {
                        validated = false;
                        $("#userLoginPasswordCG").removeClass('success');
                        $("#userLoginPasswordCG").addClass('error');
                    }
                    if (validated) {
                        $('#userLoginSend').removeAttr('disabled');
                    } else {
                        $('#userLoginSend').attr('disabled', 'disabled');
                        $('#userLoginSend').removeAttr('disabled');
                    }
                }
            });
            return UserLogin;
        });