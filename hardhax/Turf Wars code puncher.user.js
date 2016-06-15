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

//historic done 0-100
var start = 100;
var end = 500;

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
    if (start >= codes_todo.length || start >= end) {
        onInviteComplete();
        return;
    }
    var code = codes_todo[start++];
    invite(code);
    
    var wait = 300; //default
    //var wait = 400;
    //var wait = 50;
    //var wait = 1000;
    //wait += Math.random() * 5000;
    
    
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
    }, wait);
}


function main() {
    $.get('http://forty7.guru/hax/test', function(data) {
        //alert(data);
        var splitted = data.split('\n');
        codes_todo = splitted;
        inviteLooper();
    }); 
}

(function() {
    'use strict';
    //$('.tabmenu :nth-child(2)').click()
    //main();
    kk_main();
    //kk_invite(event, "test");
    // Your code here...
})();

//kk new lower level javascript
var global_code = null;

function kk_main() {
    $.get('http://forty7.guru/hax/test', function(data) {
        //alert(data);
        var splitted = data.split('\n');
        codes_todo = splitted;
        kk_inviteLooper();
    }); 
}

function kk_inviteLooper() {
    if (start >= codes_todo.length || start >= end) {
        onInviteComplete();
        return;
    }
    var code = codes_todo[start++];
    global_code = code;
    kk_invite(code, kk_postInvite);
}

///
function kk_invite(code, post) {
	//event.preventDefault();
	var invite_input = _gel('invite_code');
	var inviteLabel = _gel('invite_label');
	var inviteButton = _gel('invite_btn');
	var iCodes = [];
	
	//inviteLabel.setAttribute('aria-live', 'assertive');
	//inviteLabel.firstChild.replaceData(0, 100, 'Inviting…');

	//kk_inviteRequest(invite_input.value, inviteButton, postInvite, invite_input, iCodes);
	kk_inviteRequest(code, inviteButton, kk_postInvite, invite_input, iCodes);
	iCodes = [];
}

function kk_inviteRequest(invite_param, sendingButton, onSuccess, input, tps) {
    if (invite_param !== 0 && !invite_param) {
        onSuccess(input, "You forgot to enter an invite code!", false);
        return false;
    }
    var url = DOMAIN_API + "/player/mob/" + (invite_param === 0 ? "accept_all" : "invite");
    var params = {
        enid: VIEWER.enid,
        invite_code: invite_param,
        tps: JSON.stringify(tps)
    };
    var r = new ajaxRequest(afterInvite);
    r.setVars({
        sbtn: sendingButton,
        onSuccess: onSuccess,
        input: input
    });
    r.open("POST", url, true, params);
    r.send();
    return false;
}

function kk_postInvite(target, response, chlg)  {
    console.log(response);
    var code = global_code;
    
    var status = response;
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
    kk_inviteLooper();
    
}

