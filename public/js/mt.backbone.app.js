/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(
        ['mt.backbone.sio', 'underscore', 'jquery', 'mt.socket'
                    , 'models/user.register', 'views/user.register'
                    , 'models/user.login', 'views/user.login'
                    , 'views/user.logout'
                    , 'views/tasks.container'
                    , 'views/tasks'
                    , 'views/nav.left'
                    , 'views/nav.right'

        ], function(Backbone, _, $, socket
        , UserRegisterModel, UserRegisterView
        , UserLoginModel, UserLoginView
        , UserLogoutView
        , TasksContainerView
        , TasksView
        , NavLeftView
        , NavRightView
        ) {

    var appRouter, userRegisterModel, userRegisterView
            , userLoginModel, userLoginView
            , userLogoutView
            , tasksContainerView
            , tasksView
            , navLeftView
            , navRightView
            ;
    var AppRouter = Backbone.Router.extend({
        routes: {
            "empty.html": "empty", // #help
            "search/:query": "search", // #search/kiwis
            "search/:query/p:page": "search"   // #search/kiwis/p7
        },
        empty: function() {

        },
        search: function(query, page) {

        }

    });
    var AppView = Backbone.View.extend({
        self: this,
        el: 'body',
        $window: $(window),
        $topNav: $('#mt-topnav'),
        $footer: $('#mt-footer'),
        lastWindowHeight: 0,
        initialize: function() {
            Backbone.history.start({pushState: true});
            appRouter = new AppRouter();
            _.extend(this, Backbone.Events);
            this.initViews();
            this.on("global-rerender", this.initViews, this);
            $(window).bind('resize', _.bind(this.resize, this));
            this.resize();
        },
        initViews: function() {
            userRegisterModel = new UserRegisterModel();
            userRegisterView = new UserRegisterView({model: userRegisterModel});
            userLoginModel = new UserLoginModel();
            userLoginView = new UserLoginView({model: userLoginModel, app: this});
            userLogoutView = new UserLogoutView();
            tasksContainerView = new TasksContainerView();
            tasksView = new TasksView();
            navLeftView = new NavLeftView();
            navRightView = new NavRightView();
        },
        events: {
            "click #new_task": "createTask"
        },
        resize: function() {
            var windowHeight = this.$window.height();
            // Execute only if window height has changed.
            if (this.lastWindowHeight !== windowHeight) {
                this.lastWindowHeight = windowHeight;
                var footerHeight = (this.$footer.is(':visible') ? this.$footer.outerHeight(true) : 0);
                // Resize tasks container.
                var tasksTopOffset = tasksContainerView.$el.offset().top;
                var tasksContainerNewHeight = windowHeight - (tasksTopOffset + footerHeight);
                tasksContainerView.resize(tasksContainerNewHeight);
                // Resize left nav container.
                var navLeftTopOffset = navLeftView.$el.offset().top;
                var navLeftNewHeight = windowHeight - (navLeftTopOffset + footerHeight);
                navLeftView.resize(navLeftNewHeight);
                // Resize right nav container.
                var navRightTopOffset = navRightView.$el.offset().top;
                var navRightNewHeight = windowHeight - (navRightTopOffset + footerHeight);
                navRightView.resize(navRightNewHeight);
            }
        },
        createTask: function() {
            tasksView.createNewTask();
            return false;
        }
    });
    return AppView;
});