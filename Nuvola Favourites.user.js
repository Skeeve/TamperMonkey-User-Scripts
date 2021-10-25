// ==UserScript==
// @name         Nuvola Favourites
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       https://github.com/Skeeve
// @match        https://smartradio.frontier-nuvola.net/portal/content/radios/*
// @match        https://smartradio.frontier-nuvola.net/portal/content/feeds/*
// @match        https://smartradio.frontier-nuvola.net/portal/favorites/*
// @match        https://smartradio.frontier-nuvola.net/portal/devices
// @grant        GM_addStyle
// ==/UserScript==

(function doit() {
    'use strict';

    const mainpage = document.location.pathname.match('^/portal/favorites/([0-9a-fA-F]+)(?:/.*)$');
    let myDevice = window.name;
    if (myDevice == 'NuvolaRelogin') {
        window.close();
        return;
    }
    if (mainpage !== null) {
        myDevice = mainpage[1];
        window.name = myDevice;
        console.log("Device is now", window.name);
        return;
    }
    if (myDevice == "" ) {
        console.log("No device set.");
        return;
    }

    const buttons = $('a.button.is-small.is-rounded.is-primary');
    console.log("fixing the buttons:", buttons);
    let btncount = 0;
    buttons.each(function(idx,elt) {
        ++btncount;
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
            jQuery.post(lnk.href, data)
            .done(function(data) {
                if (data.match(/href="\/portal\/logout"/)) {
                    $(lnk).toggleClass('is-outlined');
                    $(lnk).children('i').removeClass('fa-exclamation-triangle').addClass('fa-heart');
                    $(lnk).attr('title', 'Success!');
                } else {
                    $(lnk).children('i').removeClass('fa-heart').addClass('fa-exclamation-triangle');
                    $(lnk).attr('title', 'Failed!\nMake sure you are logged in.');
                    relogin();
                }
            })
            .always(function()  {
                row.css('background-color', bgcol);
            })
            ;
            return false;
        });
    });
    console.log("Buttons fixed:", btncount);
    $('tr.directory i.fa-folder').each(function(idx, dir) {
        console.log(">>>> Found folder", dir);
        const dir_id = dir.closest('tr').getAttribute('data-sorting').replaceAll(/^\["([^"]+)".*$/g, "$1");
        console.log(">>>> folder id", dir_id);
        $(dir.closest('table')).addClass('closed-' + dir_id);
        // $(dir).closest('tr').nextAll('tr[data-sorting*=' + dir_id +']').addClass('folder-' + idx);
        $(dir).on('click', function(evt) {
            const dir = this;
            $(dir).toggleClass('fa-folder fa-folder-open');
            $(dir).closest('table').toggleClass('open-' + dir_id + ' closed-' + dir_id);
        });
        const newStyle = 'table.closed-' + dir_id + ' tr:not(.directory)[data-sorting*="' + dir_id+ '"] { display:none !important; }';
        console.log(newStyle);
        GM_addStyle(newStyle);
    });
    GM_addStyle('i.fa-exclamation-triangle {color:red;}');

    function relogin() {
        window.open(
            'https://smartradio.frontier-nuvola.net/portal/oauth',
            'NuvolaRelogin',
            'fullscreen=no,height=750,location=no,menubar=no,resizable=yes,scrollbars=no,status=no,titlebar=no,toolbar=no,width=500'
        ).opener = null;
    }
})();