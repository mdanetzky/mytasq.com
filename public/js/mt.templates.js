/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(['underscore', 'text!templates/task.html', 'text!templates/tasks.html']
        , function(_, task, tasks) {

    var tmplCache = {};

    tmplCache['task'] = _.template(task);
    tmplCache['tasks'] = _.template(tasks);

    var templates = function(tmplName, context) {
        if (!tmplCache[tmplName]) {
            return "missing template: " + tmplName;
        } else {
            context = _.extend(_.clone(this), context);
            return tmplCache[tmplName](context);
        }
    };

    return templates;
});
