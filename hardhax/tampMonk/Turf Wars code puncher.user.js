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
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==

function kk_getWait() {
    var wait = 0;
    //var wait = 300; //default
    //var wait = 400;
    //var wait = 50;
    //var wait = 1000;
    //wait += Math.random() * 5000;
    //var wait = Math.random() * 3000 + 3000;
    //var wait = Math.random() * 1000 + 500;
    //var wait = Math.random() * 4000 + 2000;
    wait = Math.random() * 3000 + 3000; //decent-ish
    wait = Math.random() * 4000 + 3000;
    return wait;
}
unsafeWindow.on = true;

var donec = GM_getValue("done", {});
var codes_todo = [];

function invite(code) {
    $('#invite_code').val(code);
    $('#invite_btn').click();
}

//dictionary of done statuses
var codes = {};
//var codes_todo = ['test', 'bob', 'ross'];

//historic done 0-100, 100-500, 500-1000, 1000-5000, 5000-6000, 6000-7000
//7000-10000, 10,000-11,000, 12,000-13,000, 13,000-15,0000, 15,000-17,000
//17,000-20,000, 20,000-23,000, 23,000-24,000, 24,000-26,000, 26,000-30,000
//30,000-35,000
//35,0000-38,000 funky
//38,000-40,000, 40,000-41,000, 41,000-42,000, 42,000-45,000
//45,000-57,000
//
var start = 56999;
var end = 100;

var exit = false;

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
    //return;
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
    donec = GM_getValue("done", {});
    
    var code = codes_todo[start++];

    while (donec[code] != null) {
        codes[code] = 'already in donec';
        console.log('skipping code ' + code + '; donec: ' + donec[code]);
        code = codes_todo[start++];
    }
    
    global_code = code;
    console.log('code: ' + code + '; n: ' + start);
    kk_invite(code, kk_postInvite);
}

///
function kk_invite(code, post) {
	//event.preventDefault();
	var invite_input = _gel('invite_code');
	var inviteLabel = _gel('invite_label');
	var inviteButton = _gel('invite_btn');
	var iCodes = [];

    if (post == null)
        post = kk_postInvite;

	//kk_inviteRequest(invite_input.value, inviteButton, postInvite, invite_input, iCodes);
	kk_inviteRequest(code, inviteButton, post, invite_input, iCodes);
	iCodes = [];
}

function kk_postInvite(target, response, chlg)  {
    var wait = kk_getWait();
    setTimeout(function() {
        kk_postInvite_real(target, response, chlg);
    }, wait);
}

function kk_postInvite_real(target, response, chlg)  {
    console.log('kk response: ' + response);
    var code = global_code;
    
    var status = response;
    if (status.includes('already invited'))
        codes[code] = donec[code] = 'already invited';
    else if (status.includes('Success'))
        codes[code] = donec[code] = 'success';
    else if (status.includes('already in your'))
        codes[code] = donec[code] = 'already_member';
    else if (status.includes('doesn’t exis'))
        codes[code] = donec[code] = 'doesn\'t exist';
    else if (status.includes('Inviting'))
        codes[code] = 'unfinished';
    else {
        codes[code] = 'unknown status: ' + status;
        onBad(status);
    }
    donec = GM_setValue("done", donec);
    
    if (!exit) kk_inviteLooper();
}

//Type <strong>turfwarz 672</strong> instead of an invite code
function onBad(res) {
    exit = true;
    
    function post_captcha(target, res, chlg) {
        if (res.includes('Thank you')) {
            start -= 2;
            exit = false;
            console.log('Successfully killed captcha');
            kk_inviteLooper();
        } else {
            exit = true;
            console.log('Couldn\'t kill captcha: ' + res);
            onInviteComplete();
        }
    }
    
    if (res.includes('Type')) {
        var lst = res.split('strong>');
        if (lst.length == 3) {
            var captcha_code = lst[1].replace('</', '').replace(' ', '');
            
            console.log('captcha code: ' + captcha_code);
            kk_invite(captcha_code, post_captcha);
        }
    } else if (res.includes('Solve this difficult')) {
        console.log('captcha code: ' + '4');
        kk_invite('4', post_captcha);
    }
    else {
        console.log('unknown captcha: ' + res);
    }
}

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

//old version

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