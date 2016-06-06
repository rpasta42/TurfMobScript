#!/usr/bin/env python

import sys, adblib
#from pymouse import PyMouse
import time
import gui

import os
import struct

class UnknownImageFormat(Exception):
    pass

#stole from stack overflow, can't find original link coz im drunk
def get_image_size(file_path):
    """
    Return (width, height) for a given img file content - no external
    dependencies except the os and struct modules from core
    """
    size = os.path.getsize(file_path)

    with open(file_path) as input:
        height = -1
        width = -1
        data = input.read(25)

        if (size >= 10) and data[:6] in ('GIF87a', 'GIF89a'):
            # GIFs
            w, h = struct.unpack("<HH", data[6:10])
            width = int(w)
            height = int(h)
        elif ((size >= 24) and data.startswith('\211PNG\r\n\032\n')
              and (data[12:16] == 'IHDR')):
            # PNGs
            w, h = struct.unpack(">LL", data[16:24])
            width = int(w)
            height = int(h)
        elif (size >= 16) and data.startswith('\211PNG\r\n\032\n'):
            # older PNGs?
            w, h = struct.unpack(">LL", data[8:16])
            width = int(w)
            height = int(h)
        elif (size >= 2) and data.startswith('\377\330'):
            # JPEG
            msg = " raised while trying to decode as JPEG."
            input.seek(0)
            input.read(2)
            b = input.read(1)
            try:
                while (b and ord(b) != 0xDA):
                    while (ord(b) != 0xFF): b = input.read(1)
                    while (ord(b) == 0xFF): b = input.read(1)
                    if (ord(b) >= 0xC0 and ord(b) <= 0xC3):
                        input.read(3)
                        h, w = struct.unpack(">HH", input.read(4))
                        break
                    else:
                        input.read(int(struct.unpack(">H", input.read(2))[0])-2)
                    b = input.read(1)
                width = int(w)
                height = int(h)
            except struct.error:
                raise UnknownImageFormat("StructError" + msg)
            except ValueError:
                raise UnknownImageFormat("ValueError" + msg)
            except Exception as e:
                raise UnknownImageFormat(e.__class__.__name__ + msg)
        else:
            raise UnknownImageFormat(
                "Sorry, don't know how to get information from this file."
            )

    return width, height

def interface_test():
   pic_path = 'screenshot.png'
   adblib.screenshot(pic_path)

   scaled_width = 400.0
   width, height = get_image_size(pic_path)

   prop = scaled_width / width

   print('width: %f; height: %f; prop: %f' % (width, height, prop))

   w = gui.Window(100, 100, "Hax", debug=True)
   w.load('index.html')

   def on_click(msg):
      #print(msg)
      prop = float(msg['prop'])
      adblib.click(msg['x']/prop, msg['y']/prop)

   w.on_gui_event += on_click

   def update():
      done = False
      from multiprocessing import Process
      p = Process(target=lambda:adblib.screenshot(pic_path))
      p.start()

      js_call = 'setPic("%s", %f, %f, %f)' % (pic_path, width, height, prop)
      #print(js_call)
      w.exec_js(js_call)
      done = True
      w.timeout(2000, update)
   update()

   #w.run(update, 1000)
   w.run()

def sleep(x):
   #sleep(x)
   #time.sleep(0.1)
   pass

def set_pos(x, y):
   m.move(x, y)
   sleep(0.1)

def click(x, y):
   m.click(x,y)
   sleep(0.05)

def in_list(lst, item):
   try:
      lst.index(item)
      return True
   except:
      return False


#when i left, 243

top_lst = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
mid_lst = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']
bot_lst = ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.']

num_lst = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

def switch_in_type():
   click(199, 801) #convert to numbers input

def letter(l, prev_num=False):
   q_x = 170
   q_y = 570

   a_x = 202
   a_y = 659

   z_x = 253
   z_y = 735

   num_x = 177
   num_y = 580

   if in_list(num_lst, l) and not prev_num:
      switch_in_type()
   if not in_list(num_lst, l) and prev_num:
      switch_in_type()

   #set_pos(q_x + 55*top_lst.index(l), q_y)
   if in_list(top_lst, l):
      click(q_x + 52*top_lst.index(l), q_y)
   elif in_list(mid_lst, l):
      click(a_x + 52*mid_lst.index(l), a_y)
   elif in_list(bot_lst, l):
      click(z_x + 52*bot_lst.index(l), z_y)
   elif in_list(num_lst, l):
      #click(199, 801) #convert to number input
      click(num_x + 52*num_lst.index(l), num_y)
      #click(199, 801) #convert to letters input
   else:
      print('error: unknown position for %s' % l)
   #if l == 'q':
   #   click(177, 573)
   #if l == 'w':
   #   click(230, 570)

def text(s):
   click(167, 495)
   if len(s) == 0:
      return
   prev_num = False
   for c in s:
      letter(c, prev_num)
      prev_num = in_list(num_lst, c)

def goto_invite_page():
   click(605, 122) #mob top tab
   click(348, 321) #invite mobsters
   sleep(0.5)

def invite(name):
   goto_invite_page()

   click(316, 560) #invite field

   text(name)
   click(508, 447) #(508, 552) #invite button


#./hax.py run invite.lst
def main(invite_file_path):
   invites_str = ""
   with open(invite_file_path, "r") as f:
         invites_str += f.read()
   invites_lst = invites_str.split('\n')

   for player in invites_lst:
      print('inviting ' + player)
      invite(player.lower())

from Xlib import display

def get_mouse_pos():
   data = display.Display().screen().root.query_pointer()._data
   print(data["root_x"], data["root_y"])

if len(sys.argv) == 2 and sys.argv[1] == "get":
      get_mouse_pos()
elif len(sys.argv) == 3 and sys.argv[1] == "run":
      main(sys.argv[2])
else:
   interface_test()
   print("error: usage: %s [get] [run invite.lst]" % sys.argv[0])

