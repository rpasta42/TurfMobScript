#!/bin/bash

#sudo apt-get install android-tools-adb

#on ubuntu 14.04
#sudo add-apt-repository ppa:openjdk-r/ppa
#sudo apt-get update
#sudo apt-get install openjdk-8-jdk
#sudo update-alternatives --config java
#sudo update-alternatives --config javac

cp kkrun.sh Adb-Remote-Screen
sudo pip install pymouse

git clone git@github.com:MajeurAndroid/Adb-Remote-Screen.git
#sudo apt-get install libudev1 libudev-dev
#sudo modprobe uinput
#sudo pip install uinput
#git clone https://github.com/tuomasjjrasanen/python-uinput.git
#cd python-uinput; sudo pip install python-uinput #or easy_install python-uinput

cd Adb-Remote-Screen/; ./kkrun.sh  &
cd ..;

./hax.py
