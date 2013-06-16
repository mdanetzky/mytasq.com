/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Backbone App.
 * Main mt application.
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

    var AppRouter = Backbone.Router.extend({
        routes: {
            "dummy": "empty", // #help
            "empty.html": "empty", // #help
            "search/:query": "search", // #search/kiwis
            "search/:query/p:page": "search"   // #search/kiwis/p7
        },
        empty: function(query, page) {
            console.log(query);
            console.log(page);
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
        removeViews: function() {
            this.navLeftView.remove();
            this.navRightView.remove();
            this.tasksView.remove();
        },
        initViews: function() {
            var self = this;
            $(function() {
                self.userRegisterModel = new UserRegisterModel();
                self.userRegisterView = new UserRegisterView({model: self.userRegisterModel});
                self.userLoginModel = new UserLoginModel();
                self.userLoginView = new UserLoginView({model: self.userLoginModel, app: self});
                self.userLogoutView = new UserLogoutView();
                self.tasksContainerView = new TasksContainerView();
                self.tasksView = new TasksView();
                self.navLeftView = new NavLeftView();
                self.navRightView = new NavRightView();
                self.mainRowHeight = 0;
                self.$mainRow = $('#mt-main-row');
                self.$topNav = $('#mt-topnav');
                self.$footer = $('#mt-footer');
                self.resize();
            });
        },
        events: {
            "click #new_task": "createTask"
        },
        resize: function() {
            var mainRowHeight = this.$mainRow.height();
            // Execute only if window height has changed.
            if (this.mainRowHeight !== mainRowHeight) {
                this.mainRowHeight = mainRowHeight;
                // Resize tasks container.
                this.tasksContainerView.resize(mainRowHeight);
                // Resize left nav container.
                this.navLeftView.resize(mainRowHeight);
                // Resize right nav container.
                this.navRightView.resize(mainRowHeight);
            }
        },
        createTask: function() {
            this.tasksView.createNewTask();
            return false;
        }
    });
    return AppView;
});