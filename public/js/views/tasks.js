/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(['mt.backbone.sio', 'jquery', 'models/tasks'], function(Backbone, $, Tasks){
    
    var TasksView = Backbone.View.extend({
        el: "#tasks",
        initialize: function(){
            var sdfklasdf = $('[id|="task"]');
            $('[id|="task"]').each(function(index){
               console.log('index :' + index);
               
            });
            $('[id|="task"] [id!="tasks"]').each(function(index){
               console.log('index :' + index);
               
            });
        }
    });
    
    return TasksView;
});