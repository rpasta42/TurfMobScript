
#### guiAndroidBotTool
This folder has a remote control tool for android (using ADB), and a separate (outdated) script which automates entering invite codes for Turf Wars Android game. Check out guiAndroidBotTool/README.md for more info.

The remote control tool can be used to create automate clicks and keyboard events on Android device for various apps.

One problem is that it's somewhat slow, and second main problem is there is no feedback after click/keyboard events so it's impossible to check success/fail status.

#### hardHax
This is new version of code puncher I made as a Tampermonkey extension which runs in Chrome.

Here's a list of reasons for making new version:
- Old version couldn't get status of code after punching it, so I didn't know which once succeeded and which once failed.
- It relied on click hardcoded locations on screen, so it only worked on Nexus 7 tablets.
- Often codes were skipped and I couldn't check the return status
- Click stuff is slow
- Had to have a tablet hooked up during the script, which made the tablet unusable while it's running
- Recently started breaking after captcha was added to Turf Wars

Turf Wars doesn't have a website version and only runs inside an app. By reverse-engineering the java code, I figured out that the game runs inside a website, but it's inaccessible from desktop Browser because LogIn page only gets displayed in the app.

I figured out that by rooting device I can get the session cookie stored in SQLite database in /data/data/com.meanfreepathllc.turfwars/app_webiview/Cookies.

I automated the process of getting cookies by running ./hardhax/cookie.sh on a rooted tablet, and manually modyfing cookie in Chrome with an extension (I'm using EditThisCookie). Output of ./cookie.sh should print something like:

`name,value
SA,sdfTsd3lkz-Tdsf3B59
`
The part after SA, is the cookie, in this case "sdfTsd3lkz-Tdsf3B59".

The new version of the hack:
- Works much faster (it's not recommended to run it at top speed)
- Stores the status of every invite, and skips people who were already invited
- Solves captcha
- Has optional delays between every code

