/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(
        ['mt.backbone.sio', 'underscore', 'jquery', 'mt.socket'
                    , 'models/user.register', 'views/user.register'
                    , 'models/user.login', 'views/user.login'
                    , 'views/user.logout'
                    , 'views/tasks'

        ], function(Backbone, _, $, socket
        , UserRegisterModel, UserRegisterView
        , UserLoginModel, UserLoginView
        , UserLogoutView
        , TasksView
        ) {

    var appRouter, userRegisterModel, userRegisterView
            , userLoginModel, userLoginView
            , userLogoutView
            , tasksView
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
        el: $('body'),
        initialize: function() {
            Backbone.history.start({pushState: true});
            appRouter = new AppRouter();
            _.extend(this, Backbone.Events);
            this.initViews();
            this.on("global-rerender", this.initViews);
        },
        initViews: function() {
            userRegisterModel = new UserRegisterModel();
            userRegisterView = new UserRegisterView({model: userRegisterModel});
            userLoginModel = new UserLoginModel();
            userLoginView = new UserLoginView({model: userLoginModel, app: this});
            userLogoutView = new UserLogoutView();
            tasksView = new TasksView();
        },
        events: {
            "click #new_task": "createTask"
        },
        createTask: function(){
            tasksView.createNewTask();
            return false;
        }
    });
    return AppView;
});