#!/usr/bin/python

import sys
from pymouse import PyMouse
import time

m = PyMouse()

def sleep(x):
   #sleep(x)
   #time.sleep(0.1)
   pass

#http://stackoverflow.com/questions/3545230/simulate-mouse-clicks-on-python
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

text("hel143ls")
exit()


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
   print("error: usage: %s [get] [run invite.lst]" % sys.argv[0])
