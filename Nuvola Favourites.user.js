// ==UserScript==
// @name         Nuvola Favourites
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       https://github.com/Skeeve
// @match        https://smartradio.frontier-nuvola.net/portal/content/radios/*
// @match        https://smartradio.frontier-nuvola.net/portal/content/feeds/*
// @match        https://smartradio.frontier-nuvola.net/portal/favorites/*
// @grant        GM_addStyle
// ==/UserScript==

(function doit() {
    'use strict';

    const mainpage = document.location.pathname.match('^/portal/favorites/([0-9a-fA-F]+)$');
    let myDevice = window.name;
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
            .done(function() {
                $(lnk).toggleClass('is-outlined');
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
        const dir_id = dir.closest('tr').getAttribute('data-sorting').replaceAll(/^\["([^"]+)".*$/g, "$1");
        $(dir.closest('table')).addClass('closed-' + idx);
        $(dir).closest('tr').nextAll('tr[data-sorting*=' + dir_id +']').addClass('folder-' + idx);
        $(dir).on('click', function(evt) {
            const dir = this;
            $(dir).toggleClass('fa-folder fa-folder-open');
            $(dir).closest('table').toggleClass('open-' + idx + ' closed-' + idx);
        });
        const newStyle = 'table.closed-' + idx + ' tr.folder-' + idx + ' { display:none; }';
        console.log(newStyle);
        GM_addStyle(newStyle);
    });
})();