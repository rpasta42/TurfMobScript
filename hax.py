#!/usr/bin/python

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

exit()

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

exit()

def set_pos(x, y):
   #device.emit(uinput.REL_X, -10000)
   #device.emit(uinput.REL_Y,  -10000)
   device.emit(uinput.REL_X, x)
   device.emit(uinput.REL_Y,  y)

#for i in range(20):
#    device.emit(uinput.REL_X, 5)
#    device.emit(uinput.REL_Y, 5)

def mainn():
   set_pos(10, 10) #invite mobsters


from Xlib import display

def get_mouse_pos():
   data = display.Display().screen().root.query_pointer()._data
   print(data["root_x"], data["root_y"])

if len(sys.argv) == 2:
   if sys.argv[1] == "get":
      get_mouse_pos()
   elif sys.argv[1] == "run":
      mainn()
   else:
      print("error: unsupport command")
else:
   print("error: usage: %s [get] [run]" % sys.argv[0])

#device = uinput.Device([
#        uinput.KEY_E,
#        uinput.KEY_H,
#        uinput.KEY_L,
#        uinput.KEY_O,
#        ])

#device.emit_click(uinput.KEY_H)
#device.emit_click(uinput.KEY_E)
#device.emit_click(uinput.KEY_L)
#device.emit_click(uinput.KEY_L)
#device.emit_click(uinput.KEY_O)

