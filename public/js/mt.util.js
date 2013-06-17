/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Diverse utility functions.
 * 
 * validateEmail: Checks if given string is a proper email address.
 * loadAndSlide: Loads content and slides it from right.
 */

define(['jquery', 'mt.spinner', 'transit'], function($, activity) {
    // Define jquery fixed selector.
    $.expr[':'].fixed = $.expr[':'].fixed || function(obj) {
        return $(obj).css('position') === 'fixed';
    };
    return {
        validateEmail: function(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        reloadContent: function(elementToReplaceId, url, callback) {
            var showActivity = !activity.isActive();
            if (showActivity) {
                activity.show();
            }
            var elementToReplace = $('#' + elementToReplaceId);
            elementToReplace.empty();
            elementToReplace.load(url, function() {
                if (showActivity) {
                    activity.hide();
                }
                callback();
            });
        },
        loadAndSlide: function(elementToReplaceId, url, callback) {
            var showActivity = !activity.isActive();
            if (showActivity) {
                activity.show();
            }
            var elementToAppendId = elementToReplaceId + "-new";
            var elementToReplace = $('#' + elementToReplaceId);
            var elementToAppend = elementToReplace.clone().attr('id', elementToAppendId);
            elementToReplace.parent().append(elementToAppend);
            var elemetWidth = elementToReplace.width();
            elementToAppend.load(url, function() {
                elementToAppend.css('left', elemetWidth);
                elementToAppend.css('right', -elemetWidth);
                elementToAppend.find('div:fixed:visible').css('left', elemetWidth);
                elementToAppend.find('div:fixed:visible').css('right', -elemetWidth);

                elementToAppend.css('display', 'block');
                elementToAppend.animate({left: 0, right: 0}, function() {
                    elementToReplace.remove();
                    elementToAppend.attr('id', elementToReplaceId);
                    if (showActivity) {
                        activity.hide();
                    }
                    callback();
                });
                elementToAppend.find('div:fixed:visible').animate({left: 0, right: 0});
                elementToReplace.animate({
                    left: -elemetWidth,
                    right: elemetWidth
                });
                elementToReplace.find('div:fixed:visible').animate({
                    left: -elemetWidth,
                    right: elemetWidth

                });
            });
        }
    };
});