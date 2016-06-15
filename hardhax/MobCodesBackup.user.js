// ==UserScript==
// @name         MobCodesCloner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @require      http://code.jquery.com/jquery-latest.js
// @match        https://mob.codes/view_historic_codes.php
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==


function getCodes() {
    var codes = GM_getValue("codes", []);
    //return;
    ////use this to clear GM_setValue("codes", []);
    /*console.log(codes);
    return; use this once you have big enough list to print stuff*/
    
    //after there is no more modes left, uncomment this line and click ctrl+r:
    //$('body').html(codes);
    var tmp = $('.codes').html();
    if (tmp == null) {
        i = n;
        console.log(codes);
        return;
    }
    var tmp2 = tmp.split('<br>');
    GM_setValue("codes", codes + tmp2);
    

    $('#next').click();
    
}

(function() {
    'use strict';
    getCodes();
    
    // Your code here...
})();