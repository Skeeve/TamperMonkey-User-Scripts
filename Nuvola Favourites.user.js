// ==UserScript==
// @name         Nuvola Favourites
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to make nuvola website a bit more comfortable
// @author       https://github.com/Skeeve
// @icon         https://www.google.com/s2/favicons?sz=64&domain=frontier-nuvola.net
// @match        https://smartradio.frontier-nuvola.net/portal/content/radios/*
// @match        https://smartradio.frontier-nuvola.net/portal/content/feeds/*
// @match        https://smartradio.frontier-nuvola.net/portal/favorites/*
// @match        https://smartradio.frontier-nuvola.net/portal/devices
// @grant        GM_addStyle
// @grant        GM_notification
// ==/UserScript==

/* eslint-env jquery */

(function doit() {
    'use strict';

    const NUVOLA_RELOGIN = 'NuvolaRelogin';
    var loggedIn = true;

    // Use window.name to transport some information
    let myDevice = window.name;
    // If the name is 'NuvolaRelogin', the window should be closed.
    // This is used in the login popup window.
    if (myDevice == NUVOLA_RELOGIN) {
        window.close();
        return;
    }

    // Try to get another device ID from the URL
    const mainpage = document.location.pathname.match('^/portal/favorites/([0-9a-fA-F]+)(?:/.*)?$');
    if (mainpage !== null) {
        myDevice = mainpage[1];
        // store the device in window.name
        window.name = myDevice;
        console.log("Device is now", window.name);
    }
    // Fail if no device id found.
    // Neither in the window's name nor in the URL.
    if (myDevice == "" ) {
        console.log("No device set.");
        return;
    }

    // Enhance all the "Heart-Buttons"
    const buttons = $('a.button.is-small.is-rounded.is-primary');
    console.log("Enhancing buttons:", buttons.length);
    buttons.each(function(idx,elt) {
        // Set a click handler for the button
        $(elt).on("click",function(evt) {
            const lnk = this;
            let data = '';
            // Check whether to insert a favorite or remove
            let bg = 'LightGrey';
            if ($(lnk).hasClass('is-outlined')) {
                // insert
                data = "insert%5B" + myDevice + "%5D";
                bg = 'MistyRose';
            }
            // Make row LightGrey for remove and MistyRosefor insert.
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
                    // Switch back the button
                    $(lnk).toggleClass('is-outlined');
                    // Make it a heart again, if it were an error before
                    $(lnk).children('i').removeClass('fa-exclamation-triangle').addClass('fa-heart');
                    // And set a title to signal success
                    $(lnk).attr('title', 'Success!');
                } else {
                    // Otherwise we were logged out
                    // Signal this by changing the heart to an error indicator.
                    $(lnk).children('i').removeClass('fa-heart').addClass('fa-exclamation-triangle');
                    // And set a title
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
    console.log("Buttons enhanced:", buttons.length);

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

    // styles for
    // - signalling that an operation failed: i.fa-exclamation.triange
    // - an overlay when logged out: #loggedout
    // - the message window when logged out: #logoutpopup
    // - the logo in the message window: loggedoutlogo
    GM_addStyle(`
        i.fa-exclamation-triangle {color:red;}
        #loggedout {
              position: fixed; /* Sit on top of the page content */
              display: none; /* Hidden by default */
              width: 100%; /* Full width (cover the whole page) */
              height: 100%; /* Full height (cover the whole page) */
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: rgba(0,0,0,0.5); /* Black background with opacity */
              z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
              cursor: pointer; /* Add a pointer on hover */
              z-index: 998;
        }
        #logoutpopup {
            text-align: center;
            margin: auto;
            width: 20em;
            border: 0.25em solid red;
            background-color: white;
            padding: 0.25em;
            margin-top: 5em;
        }
        #logoutpopup::after {
           content: "";
           clear: both;
           display: table;
        }
        #logoutpopup p {
            padding: 0.25em;
        }
        #loggedoutlogo {
            background: url(https://smartradio.frontier-nuvola.net/static/frontier-nuvola.png);
            width: 100px;
            height: 100px;
            float: left;
        }
    `);

    // add the HTML for the overlay and the logged-out-message.
    $(document.body).append(`
    <div id="loggedout">
        <div id="logoutpopup">
            <div id="loggedoutlogo"></div>
            <div id="logoutmsg">
                <p>You were logged out.</p>
                <button id="LoginButton" class="button is-small">
                    <span class="icon"><i class="fa fa-user"></i></span>
                    <span>Login</span>
                </button>
            </div>
        </div>
    </div>
    `);
    // Button for logging in again
    $('#LoginButton').click(function() {
        relogin();
        checkLoginStatus();
    });

    // Handler to check every 10 seconds whether or not we
    // are still logged in.
    const checkLoginStatus = function() {
        // We were logged in
        if (loggedIn) {
            // Call the devices page to check for the logout button
            jQuery.get(window.location.origin + '/portal/devices')
                .done(function(data) {
                // If it's there we are still logged in
                loggedIn = data.match(/href="\/portal\/logout"/);
                if (loggedIn) {
                    // So we come back in 10 seconds
                    window.setTimeout(checkLoginStatus, 10000);
                } else {
                    // We were logged out
                    // Show the overlay and wait until the user loggs in again.
                    $('#loggedout').show();
                }
            });
        } else {
            // We come here when the user was logged out
            // and tried to log in again
            // Call the devices page to check for the logout button
            jQuery.get(window.location.origin + '/portal/devices')
                .done(function(data) {
                // If it's there we are logged in afain
                loggedIn = data.match(/href="\/portal\/logout"/);
                if (loggedIn) {
                    // We are logged in
                    $('#loggedout').hide();
                }
                // Come back in a second to check again
                window.setTimeout(checkLoginStatus, 1000);
            });
        }
    }
    checkLoginStatus();

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