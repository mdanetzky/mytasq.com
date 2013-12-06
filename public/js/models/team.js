/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Backbone model.
 * Team.
 */

define(['mt.backbone.sio'], function(Backbone) {
    var Team = Backbone.Model.extend({
        url: 'team/save',
        id: null,
        name: null
    });
    return Team;
});

