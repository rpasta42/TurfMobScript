// ==UserScript==
// @name         Turf Wars code puncher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://app.turfwarsapp.com/invite/
// @require      http://code.jquery.com/jquery-latest.js
// @include      https://app.turfwarsapp.com/invite/location?ctrl=same
// @grant        unsafeWindow
// ==/UserScript==

unsafeWindow.on = true;

var codes_todo = [];


function invite(code) {
    $('#invite_code').val(code);
    $('#invite_btn').click();
}


//dictionary of done statuses
var codes = {};
//var codes_todo = ['test', 'bob', 'ross'];
var start = 0;


function onInviteComplete() {
    console.log('done');
    //alert(JSON.stringify(codes));
    var bad = "";
    
    var results1 = {};
    
    for (var code in codes) {
        var s = codes[code];
        if (results1[s] == null)
            results1[s] = 1;
        else results1[s]++;
       
        if (codes[code] != 'success' && codes[code] != 'already invited' && codes[code] != 'already_member')
            bad += "; " + code + ':' + codes[code];
    }
    console.log(bad);
    alert(JSON.stringify(results1));
}

function inviteLooper() {
    if (start >= codes_todo.length) {
        onInviteComplete();
        return;
    }
    var code = codes_todo[start++];
    invite(code);
    setTimeout(function() {
        var status = $('#invite_label').text();
        if (status.includes('already invited'))
            codes[code] = 'already invited';
        else if (status.includes('Success'))
            codes[code] = 'success';
        else if (status.includes('already in your'))
            codes[code] = 'already_member';
        else if (status.includes('doesn’t exis'))
            codes[code] = 'doesn\'t exist';
        else if (status.includes('Inviting'))
            codes[code] = 'unfinished';
        else
            codes[code] = 'unknown status: ' + status;
        inviteLooper();
    }, 300);
}


(function() {
    'use strict';
    //$('.tabmenu :nth-child(2)').click()
    $.get('http://forty7.guru/hax/test', function(data) {
        //alert(data);
        var splitted = data.split('\n');
        codes_todo = splitted;
        inviteLooper();
    });
    
    
    // Your code here...
})();