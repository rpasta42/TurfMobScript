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

scaled_width = 400.0
prop = 0.333 #hardcoded for nexus

def interface_test():
   pic_path = 'screenshot.png'
   adblib.screenshot(pic_path)

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
   time.sleep(x)
   pass

def click(x, y):
   adblib.click(x/prop,y/prop)
   sleep(0.05)

def text(s):
   adblib.text(s)

def goto_invite_page():
   #kk tmp comment click(354, 64) #mob top tab
   click(168, 200) #invite mobsters
   sleep(0.2)

def invite(name):
   goto_invite_page()

   click(58, 352) #invite field

   #kk "FRIGS67`1"
   splitted = name.split('`')
   if len(splitted) > 1:
      name = splitted[0] + "\\" + '`' + splitted[1]

   text(name)
   click(245, 352) #invite button

   sleep(0.1) ##kk last time i tried this broke. testing 0.5
   #sleep(0.4)

#./hax.py run invite.lst
def main(invite_file_path, ignore_repeats=True):

   old = open('codes-old/archive.1', 'r')
   data = old.read()
   old.close()

   old_lst = data.split('\n')

   invites_str = ""
   with open(invite_file_path, "r") as f:
         invites_str += f.read()
   invites_lst = invites_str.split('\n')

   for player in invites_lst:
      extra = ''
      skip = False
      if player in old_lst:
         skip = True
         extra = ' (ALREADY INVITED, SKIPPING)'
      print 'inviting %s %s' % (player, extra)
      if skip and ignore_repeats:
         continue

      invite(player.lower())


if len(sys.argv) == 3 and sys.argv[1] == "run":
   main(sys.argv[2]) #(sys.argv[2], False) to try entering repeats
else:
   interface_test()
   print("error: usage: %s [run invite.lst]" % sys.argv[0])

