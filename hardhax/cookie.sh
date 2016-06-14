#!/bin/bash

adb shell su -c "cp /data/data/com.meanfreepathllc.turfwars/app_webview/Cookies /sdcard" >/dev/null
adb shell su -c "chmod a+r /sdcard/Cookies" >/dev/null
adb pull /sdcard/Cookies
mv Cookies /tmp

sqlite3 /tmp/Cookies <<!
.headers on
.mode csv
--.output out.csv
select name,value from cookies where name='SA';
!

