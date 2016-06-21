// ==UserScript==
// @name         Healer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://tampermonkey.net/
// @require      http://code.jquery.com/jquery-latest.js
// @include      https://app.turfwarsapp.com/
// @include      https://app.turfwarsapp.com/player/*
// @include      https://app.turfwarsapp.com/map/*
// @grant        unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==

var game_url = 'https://app.turfwarsapp.com/';
var curr_url = window.location.href;
console.log(curr_url);

var profile = GM_getValue("profile_url", null);

function start_healer() {
    if (game_url == curr_url) {
        $('button').each(function () {
            if ($(this).html().trim() == 'Your Turf') {
                var loc = $(this).attr('data-url').split('|')[0];
                loc = loc.substring(1, loc.length);
                loc = game_url + loc;
                GM_setValue("profile_url", loc);
                window.location.href = game_url + loc;
            }

        });
    }
    else if (curr_url.includes("player")) {
        console.log('assuming we\'re on turf overview');
    } else if (curr_url.includes("map")) {
        console.log('assuming we\re on turf profile page');
    } else {
        console.log("can't figure out where we at. TERMINATING");
    }
}

(function() {
    'use strict';

    var should_run = false;
    if (curr_url.includes("map"))
        should_run = true;
    else
        should_run = confirm('Run health bot?');

    if (should_run) {
        start_healer();
    }
    // Your code here...
})();

//used to save data between pages
function setCheckingTurf(val) {
    GM_setValue("in_turf_check", val);
}
function isCheckingTurf(val) {
    return GM_getValue("in_turf_check", false);
}