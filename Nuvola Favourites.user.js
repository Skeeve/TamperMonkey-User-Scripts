// ==UserScript==
// @name         Nuvola Favourites
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to make nuvola website a bit more comfortable
// @author       https://github.com/Skeeve
// @match        https://smartradio.frontier-nuvola.net/portal/content/radios/*
// @match        https://smartradio.frontier-nuvola.net/portal/content/feeds/*
// @match        https://smartradio.frontier-nuvola.net/portal/favorites/*
// @match        https://smartradio.frontier-nuvola.net/portal/devices
// @grant        GM_addStyle
// ==/UserScript==

/* eslint-env jquery */

(function doit() {
    'use strict';

    const NUVOLA_RELOGIN = 'NuvolaRelogin';

    // Use window.name to transport some information
    let myDevice = window.name;
    // If the name is 'NuvolaRelogin', the window should be closed
    if (myDevice == NUVOLA_RELOGIN) {
        window.close();
        return;
    }

    // Get the device ID from the URL
    const mainpage = document.location.pathname.match('^/portal/favorites/([0-9a-fA-F]+)(?:/.*)$');
    if (mainpage !== null) {
        myDevice = mainpage[1];
        // store the device in window.name
        window.name = myDevice;
        console.log("Device is now", window.name);
        return;
    }
    // Fail if no device id found
    if (myDevice == "" ) {
        console.log("No device set.");
        return;
    }

    // Enhance all the "Heart-Buttons"
    const buttons = $('a.button.is-small.is-rounded.is-primary');
    console.log("Enhancing the buttons:", buttons);
    let btncount = 0;
    buttons.each(function(idx,elt) {
        ++btncount;
        // Set a click handler for the button
        $(elt).on("click",function(evt) {
            const lnk = this;
            let data = '';
            let bg = 'LightGrey';
            if ($(lnk).hasClass('is-outlined')) {
                data = "insert%5B" + myDevice + "%5D";
                bg = 'MistyRose';
            }
            const row = $(lnk).closest('tr');
            const bgcol= row.css('background-color');
            lnk.blur();
            row.css('background-color', bg);
            // POST the request
            jQuery.post(lnk.href, data)
            .done(function(data) {
                // If we were logged out, there should be no logout link in the result page
                if (data.match(/href="\/portal\/logout"/)) {
                    // But there is one, so we were still logged in
                    $(lnk).toggleClass('is-outlined');
                    $(lnk).children('i').removeClass('fa-exclamation-triangle').addClass('fa-heart');
                    $(lnk).attr('title', 'Success!');
                } else {
                    // Otherwise we were logged out
                    $(lnk).children('i').removeClass('fa-heart').addClass('fa-exclamation-triangle');
                    $(lnk).attr('title', 'Failed!\nMake sure you are logged in.');
                    // Open a window to log in again.
                    relogin();
                }
            })
            // reset all color changes
            .always(function() {
                row.css('background-color', bgcol);
            });
            return false;
        });
    });
    console.log("Buttons enhanced:", btncount);

    // Now enhance the folder view
    $('tr.directory i.fa-folder').each(function(idx, dir) {
        // get the folder's id
        const dir_id = dir.closest('tr').getAttribute('data-sorting').replaceAll(/^\["([^"]+)".*$/g, "$1");
        // Add a class to the table element indicating that the folder is closed.
        $(dir.closest('table')).addClass('closed-' + dir_id);
        // Add a click handler for opening or closing the folder
        $(dir).on('click', function(evt) {
            const dir = this;
            // toggle closed <-> open
            $(dir).toggleClass('fa-folder fa-folder-open');
            $(dir).closest('table').toggleClass('open-' + dir_id + ' closed-' + dir_id);
        });
        // Create a new style for all folder members, hiding them in closed status
        const newStyle = 'table.closed-' + dir_id + ' tr:not(.directory)[data-sorting*="' + dir_id+ '"] { display:none !important; }';
        GM_addStyle(newStyle);
    });

    // Add a style for signalling that an operation failed
    GM_addStyle('i.fa-exclamation-triangle {color:red;}');

    // Relogin function
    function relogin() {
        // Calculate the position of the login window
        // It should be centered
        const w = 500;
        const h = 770;
        const top = (screen.height - h) / 2;
        const left = (screen.width - w) / 2;
        // Open the window in such a way that it can close itself
        window.open(
            'https://smartradio.frontier-nuvola.net/portal/oauth',
            NUVOLA_RELOGIN,
            ['fullscreen=no',
             'height=' + h, 'width=' + w,
             'top=' + top, 'left=' + left,
             'location=no',
             'menubar=no',
             'resizable=yes',
             'scrollbars=no',
             'status=no',
             'titlebar=no',
             'toolbar=no',
            ].join()
        ).opener = null;
    }
})();