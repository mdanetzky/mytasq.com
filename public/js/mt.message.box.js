/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Bootstrap based messageBox.
 */

define(['jquery', 'text!templates/message.box.html'], function($, msgBoxTmpl) {
    $('body').append(msgBoxTmpl);
    return function(message, callback) {
        $('#messageBoxContent').html(message);
        if (callback) {
            $('#messageBox').on('hidden', function() {
                $('#messageBox').off('hidden');
                callback();
            });
        }
        $('#messageBox').modal('show');
    };
});