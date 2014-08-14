/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(["socket.io","uri.parser"],function(e,t){var n=t(document.location.href),r=n.protocol+"://"+n.authority,i=e.connect(r);return i});