#!/bin/bash

sudo pip install pymouse

#sudo apt-get install libudev1 libudev-dev
#sudo modprobe uinput
#sudo pip install uinput
#git clone https://github.com/tuomasjjrasanen/python-uinput.git
#cd python-uinput; sudo pip install python-uinput #or easy_install python-uinput

cd ..; ../Adb-Remote-Screen/kkrun.sh &

./hax.py
