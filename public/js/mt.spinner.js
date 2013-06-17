/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Activity indicator (spinner)
 */

define(['spin'], function(Spin) {
    var create = function (htmlStr) {
        var frag = document.createDocumentFragment(),
                temp = document.createElement('div');
        temp.innerHTML = htmlStr;
        while (temp.firstChild) {
            frag.appendChild(temp.firstChild);
        }
        return frag;
    };
    var fragment = create('<div id="activity-indicator-spinner" style="position:fixed; top:50%; left:50%; margin:-25px 0 0 -25px; width:50px; height:50px; display:none;"></div>');
    document.body.insertBefore(fragment, document.body.childNodes[0]);
    var target = document.getElementById('activity-indicator-spinner');
    var spinner = new Spin().spin(target);
    spinner.stop();
    return {
        show: function() {
            target.style.display = 'block';
            spinner.spin(target);
        },
        hide: function() {
            spinner.stop();
            target.style.display = 'none';
        },
        isActive: function() {
            return (target.style.display === 'block');
        }
    };
});