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

/* TODO:
   move newHealLog() to bottom of page
   check out which delays are not being used
   */

//to check, copy paste then save it to array a
//then in console:
//alert(JSON.stringify(a.filter((e)=> e.times_healed != 0)))

//resetAll();
//resetLogs();
//getLog()
//getHealLog()
//var logg = getHealLog();
//for (var line in logg) console.log(line);
//alert(JSON.stringify(getHealLog()));

var game_url = 'https://app.turfwarsapp.com/';
var curr_url = window.location.href;
console.log(curr_url);

var profile = GM_getValue("profile_url", null);

//0.76 = enabled healing,
//0.79 disabled
//0.7647 = still disabled
//0.7558 = still disabled //65/86
var min_health = 0.766; //health at which to try to heal turf

var healClicksDelay = 500; //500 by default
var waitActionShort = 200;
var waitAction = 700;
var waitMainLoop = 1000; //delay when getting new list (2,000 ok)
var updateCheckDamage = 5000; //if list is empty this is how long we wait before getting it again (5,000-13,000, default = 5,000)
var waitNextBase = 1000; //go from turf list to next base on heal list delay

var goToPageTime = null;
var sameWait = null;

/*overwrites*/
updateCheckDamage = 2000;
waitNextBase = 300;

//sameWait = 50000;
//sameWait = 500;
//if under attack, set sameWait to 200;

//goToPageTime default = 2000, 10,000 for long time afk, 5,000 = ok'ish
//goToPageTime = 500; //overwrites delay in gotoPage

/* end overwrites */


if (sameWait != null)
    healClicksDelay = waitActionShort = waitNextBase = updateCheckDamage = waitAction = waitMainLoop = sameWait;

/////////////////////////////
//main thing, calls start_healer or turfs_overview_run()
(function() {
    'use strict';

    var should_run = false;
    if (curr_url.includes("map")) {
        if (isCheckingTurf())
            should_run = true;
        //setCurrTurf(null);
    } else if (curr_url.includes("player")) {}
    else
        should_run = confirm('Run health bot?');

    if (should_run) {
        setRunOnBaseList(true);
        start_healer();
    } else {
        if (game_url == curr_url)
            setRunOnBaseList(false);
    }
    
    if (curr_url.includes("player") && shouldRunOnBaseList()) {
        console.log('assuming we\'re on turf overview');
        turfs_overview_run();
    }
    // Your code here...
})();

//if we're on main page, go to turf list
//if we're on profile of a turf, run onBaseHealthCheck()
function start_healer() {
    if (game_url == curr_url) {
        $('button').each(function () {
            if ($(this).html().trim() == 'Your Turf') {
                var loc = getJsonObjDataUrl($(this));
                GM_setValue("profile_url", loc);
                gotoPage(loc, waitAction);
            }
        });
    }
    else if (curr_url.includes("map")) {
        console.log('assuming we\re on turf profile page');
        onBaseHealthCheck();
    } else {
        console.log("can't figure out where we at. TERMINATING");
    }
}


//runs on Turf List
//if no heal bases, run getDamagedBases(),
//otherwise go to hurt base (which triggers onBaseHealthCheck)
function turfs_overview_run() {
    var baseToHeal = getNextHealBase();
    if (baseToHeal == null) {
        addLog("run out of dying bases. refreshing");
        setTimeout(function () { getDamagedBases(); }, waitMainLoop);
        return;
    }
    
    var bJQ = getBaseByName(baseToHeal.name);
    
    if (bJQ != null) { //go to profile
        var healBaseUrl = getJsonObjDataUrl(bJQ);
        setCurrTurf(baseToHeal);
        addLog("checking base:" + baseToHeal);
        gotoPage(healBaseUrl, waitNextBase);
        return;
        
    }
    gotoPage(profile, waitAction);
}

///called my turf_overview_run() in case we're out of bases to check
function getDamagedBases() {
    //var bases_html = $('#bas_list tbody').html();

    var bases = [];

    $('#base_list tbody tr').each(function () {
        var name = $(this).find('.base_name button').text();
        var loc = $(this).find('.base_loc').text();

        var dmg_div = $(this).find('.dmg_');
        if (dmg_div.length == 0) dmg_div = $(this).find('.dmg_med');

        var dmg = dmg_div.text();

        var dmg_splitted = dmg.split('/');
        var curr_health = parseInt(dmg_splitted[0]);
        var max_health = parseInt(dmg_splitted[1]);

        bases.push({'name':name, 'loc':loc, 'dmg':dmg, 'curr_health':curr_health, 'max_health':max_health});
    });

    var needHeal = [];

    for (var i in bases) {
        var base = bases[i];
        if ((base.curr_health / base.max_health) < min_health) {
            needHeal.push(base); //TODO: change this to base instead of base.name
        }
    }
    setHealBaseList(needHeal);
    addLog('bases: ' + JSON.stringify(bases));
    addLog('need heal: ' + JSON.stringify(needHeal));
    //alert(JSON.stringify(bases));
    //alert(bases);

    if (needHeal.length == 0)
        gotoPage(profile, updateCheckDamage);
    else
        gotoPage(profile, waitActionShort);
}

/* heal log obj:
var o = {
   'time': time_str,
   'base': base_name,
   'loc': location
   'times_healed': times_healed,
   'heal_cost': [str, str, str],
   'health'   : [num, num, num],
   'heal_fail': true/false, //false only if healed at least once
   'msg_extra': str,
   'max_health' : num, //maximum health
   'start_health' : num, //health before we start
}*/
function newHealLog(baseName) {
    return {
        'base': baseName,
        'loc': null,
        'times_healed': 0,
        'heal_cost': [],
        'health' : [],
        'heal_fail': true, //false only if healed at least once
        'msg_extra': null,
        'max_health' : null,
        'start_health' : null,
    };
}

//we're on base profile, click heal buttons
function onBaseHealthCheck(turf_arg, n_left_arg, o_arg) {
    var maxHeal = 5;

    var turf = null;
    var o = null;
    var n_left = null;

    //(typeof turf_arg !== "undefined")
    if (!(o_arg == undefined)) {
        turf = turf_arg;
        n_left = n_left_arg;
        o = o_arg;
    }
    else {
        turf = getCurrTurf();
        setCurrTurf(null);

        n_left = maxHeal;

        o = newHealLog(turf.name);
        o.loc = turf.loc;
        o.max_health = turf.max_health;
        o.start_health = turf.curr_health;
    }

    if (n_left < 1) {
        o.heal_fail = false;
        o.times_healed = maxHeal-n_left;
        addHealLog(o);
        gotoPage(profile, waitAction);
        return;
    }

    var repairBtn = $('#heal_button');
    if (repairBtn == null)
        o.msg_extra = "Can't find repair button";
    else if ($('#heal_cost').length == 0)
        o.msg_extra = "Can't find repair button";

    if (repairBtn == null || ($('#heal_cost').length == 0)) {
        if (n_left == maxHeal)
            o.heal_fail = true;
        o.times_healed = maxHeal-n_left;
        addHealLog(o);
        gotoPage(profile, waitAction);
        return;
    }

    o.heal_cost.push($('#heal_cost').text());

    $('#heal_button').click();


    function wrapper() {
        onBaseHealthCheck(turf, n_left-1, o);
    }
    setTimeout(wrapper, healClicksDelay);
}

function oldOnBaseHealthCheck() {
    //addHealLog(o);


    var repairBtn = $('#heal_button');
    if (repairBtn == null) {
        addLog("no repair button");
        gotoPage(profile, waitAction);
        return;
    }
    for (var i = 1; i < 5; i++) {
        function f() {
            var healin_log = 'empty healing log';
            var bad = false;
            if ($('#heal_cost').length == 0) {
                bad = true;
                healin_log = 'no healing button so no healing';
            }
            else
                healin_log = 'healing base for: ' + $('#heal_cost').text(); //$('#heal_button #heal_cost').text();
            if (bad) return;
            addHealLog(healin_log);
            $('#heal_button').click();
        }
        setTimeout(f, waitActionShort*i);
    }
    addHealLog('done healing, returning');
    gotoPage(profile, waitAction);
}


/* HELPER FUNCTIONS */
function getJsonObjDataUrl(obj) {
    var loc = $(obj).attr('data-url').split('|')[0];
    loc = loc.substring(1, loc.length);
    loc = game_url + loc;
    addLog('created url: ' + loc);
    return loc;
}

//gotoPage(profile, waitAction);
function gotoPage(url, delay) {
    console.log('heal success: ' + JSON.stringify(getHealLog().filter((e)=> e.times_healed != 0)));
    //console.log('gotoPage HealLog: ' + JSON.stringify(getHealLog()));
    
    var f = function() {
        window.location.href = url;
    };
    if (goToPageTime != null)
        delay = goToPageTime;
    setTimeout(f, delay);
}

function getBaseByName(baseName) {
    var ret = null;
    $('#base_list tbody tr').each(function () {
        var name = $(this).find('.base_name button').text().trim();
        if (name == baseName.trim())
            ret = $(this).find('.base_name button');
    });

    if (ret == null) {
        addLog("tried to find unexisting base by name: " + baseName);
        var o = newHealLog(baseName);
        o.msg_extra = 'Could not get base in getBaseByName';
        addHealLog(o);
        return null;
    }
    return ret;
}

function getTime() {
    var d = new Date();
    return d.toLocaleString() + ': ';
}
/* END HELPERS */

//used to save data between pages

///////////////checking turf mode (sets current turf name/etc)
//setCheckingTurf, isCheckingTurf
function setCurrTurf(val) {
    GM_setValue("turf_check", val);
}
function getCurrTurf() {
    return GM_getValue("turf_check", null);
}
function isCheckingTurf() {
    return GM_getValue("turf_check", null) != null;
}
///////////////when we reach turf list should we run or nah?
function shouldRunOnBaseList() {
    return GM_getValue("run_on_base", false);
}
function setRunOnBaseList(val) {
    return GM_setValue("run_on_base", val);
}
///////////////get a heal base from a list, or set new list
function getNextHealBase() {
    var ret = GM_getValue("base_list", null);
    if (ret == null || ret.length == 0)
        return null;
    var next = ret.pop();
    GM_setValue("base_list", ret);
    return next;
}
//make the list for checking bases
function setHealBaseList(lst) {
    GM_setValue("base_list", lst);
}
///////////////logs
function resetAll() {
    resetLogs();
    setRunOnBaseList(false);
    setCurrTurf(null);
    setHealBaseList(null);
}

function resetLogs() {
    GM_setValue("log", []); GM_setValue('heal_log', []);
}

function addLog(str) {
    str = getTime() + str;
    console.log(str);
    var l = GM_getValue("log", []);
    l.push(str);
    GM_setValue("log", l);
}

function getLog() {
    return GM_getValue("log", []);
}

function addHealLog(logObj) {
    addLog('heal log: ' + JSON.stringify(logObj));
    var healL = GM_getValue("heal_log", []);
    logObj.time = getTime();
    healL.push(logObj);
    GM_setValue("heal_log", healL);
}

function getHealLog() {
    return GM_getValue("heal_log", []);
}
///////////////


/*function kk_afterHeal(json) {
    if (json.body.new_cost) {
        _gel("heal_cost").innerHTML = json.body.new_cost_fmt
    } else {
        _gel("heal_button").style.display = "none"
    }
    baseHealth.innerHTML = json.body.new_health;
    baseInfluence.innerHTML = json.body.new_influence;
    baseArea.innerHTML = json.body.new_area;
    baseCRadius.innerHTML = json.body.new_cradius
}
   <button class="actbtn" id="heal_button" onclick="entityHeal(716765283,afterHeal,this);" aria-busy="false">Repair for <span id="heal_cost" class="n_cash">$26.8k</span></button>
*/