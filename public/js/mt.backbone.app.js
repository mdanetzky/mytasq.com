/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Backbone App.
 * Main mt application.
 */

define(['mt.backbone.sio', 'underscore', 'jquery', 'mt.socket'
            , 'models/user.register', 'views/user.register'
            , 'models/user.login', 'views/user.login'
            , 'views/user.logout'
            , 'views/middle.container'
            , 'views/nav.left'
            , 'views/nav.right'
            , 'views/nav.top'
], function(Backbone, _, $, socket
        , UserRegisterModel, UserRegisterView
        , UserLoginModel, UserLoginView
        , UserLogoutView
        , MiddleContainerView
        , NavLeftView
        , NavRightView
        , NavTopView
        ) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            "dummy": "empty",
            "empty.html": "empty",
            "search/:query": "search",
            "search/:query/p:page": "search"
        },
        empty: function(query, page) {
            console.log(query);
            console.log(page);
        },
        search: function(query, page) {

        }
    });
    var AppView = Backbone.View.extend({
        el: 'body',
        $window: $(window),
        $mainRow: $('#mt-main-row'),
        mainRowHeight: 0,
        initialize: function() {
            this.appRouter = new AppRouter();
            Backbone.history.start({pushState: true});
            this.initViews();
            this.on("global-remove", this.removeViews, this);
            this.on("global-render", this.initViews, this);
            this.$window.bind('resize', _.bind(this.resize, this));
        },
        events: {
            "click": "click"
        },
        removeViews: function() {
            this.navLeftView.remove();
            this.navRightView.remove();
            this.middleContainerView.remove();
        },
        initViews: function() {
            var self = this;
            $(function() {
                self.userRegisterModel = new UserRegisterModel();
                self.userRegisterView = new UserRegisterView({model: self.userRegisterModel});
                self.userLoginModel = new UserLoginModel();
                self.userLoginView = new UserLoginView({model: self.userLoginModel, app: self});
                self.userLogoutView = new UserLogoutView();
                self.middleContainerView = new MiddleContainerView({app: self});
                self.navLeftView = new NavLeftView();
                self.navRightView = new NavRightView();
                self.navTopView = new NavTopView({app: self});
                self.mainRowHeight = 0;
                self.$mainRow = $('#mt-main-row');
                self.$topNav = $('#mt-topnav');
                self.$footer = $('#mt-footer');
                self.resize();
            });
        },
        click: function(event) {
            // Send click on body to all interested recipients.
            this.trigger("globalClick", event);
        },
        resize: function() {
            var mainRowHeight = this.$mainRow.height();
            // Execute only if window height has changed.
            if (this.mainRowHeight !== mainRowHeight) {
                this.mainRowHeight = mainRowHeight;
                // Resize middle container.
                this.middleContainerView.resize(mainRowHeight);
                // Resize left nav container.
                this.navLeftView.resize(mainRowHeight);
                // Resize right nav container.
                this.navRightView.resize(mainRowHeight);
            }
        }
    });
    return AppView;
});