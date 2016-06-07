# TurfMobScript
Remote control tool for android (using ADB), and automation script for entering invite codes for Turf Wars.

Usage:

./hax.py = very primitive remote control tool for android which enables you to click on the screen

./hax.py run invite.lst = reads file from invite.lst and enters them in Turf Wars (need to have "Mob" tab open)

The first version is generic Remote Control tool, and will print location of clicks, and pass them to android.
Note that for the second example, I hardcoded Nexus 7 resolution so the script probably won't work on your phone/tablet unless you modify the click locations.


Most of the code should be cross-platform, but I only tested it on Ubuntu 14.04.
Gtk Webkit is used for remote control GUI interface (not sure if Gtk Webkit supports non-Linux platforms). 


The project uses python (and a little of javascript) as a thin wrapper for adb. Check out adblib.py for adb wrapper.


I basically use "adb shell screencap -p /mnt/sdcard/file.png" and then "adb pull /mnt/sdcard/file.png" to update the android remote control GUI (this is extremely slow ~0.5 frames/second).
I also use "adb shell input tap x y" to simulate mouse clicks, and "adb shell input text blahblah" to simulate keyboard.


It should be very simple to re-use adblib.py to to create your own automation scripts for android devices.
By running ./hax.py (without arguments), you can get locations of your clicks, and then use adblib.py to chain together click/keyboard commands.
