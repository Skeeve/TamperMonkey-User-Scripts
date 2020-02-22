// ==UserScript==
// @name     Bettelseite aus - FAZ
// @version  1
// @grant    none
// @include  https://www.faz.net/*
// @run-at   document-start
// ==/UserScript==

// On start of the document, before it is displayed
// (document-start) run below script

// As soon as the ready state changes to interactive
document.onreadystatechange = function () {
  if (document.readyState === "interactive") {
    // tell the AdBlocker script that everything is fine
    unsafeWindow.sptoggleOff= true;
    // Relevant code on FAZ page is
    // var isDisabled = (typeof window.sptoggleOff !== "undefined" && window.sptoggleOff) || …
  }
}