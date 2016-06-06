#!/usr/bin/python

from pymouse import PyMouse

m = PyMouse()
m.position() #gets mouse current position coordinates
x = 0
y = 100
m.move(x,y)
m.click(x,y) #the third argument "1" represents the mouse button
m.press(x,y) #mouse button press

import uinput

device = uinput.Device([
        uinput.BTN_LEFT,
        uinput.BTN_RIGHT,
        uinput.REL_X,
        uinput.REL_Y,
        ])

for i in range(20):
    device.emit(uinput.REL_X, 5)
    device.emit(uinput.REL_Y, 5)

import time
time.sleep(1)
