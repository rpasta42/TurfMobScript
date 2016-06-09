#!/usr/bin/env python

from subprocess import Popen, PIPE, STDOUT

#from pycloak import shellutils as sh
adb_path = '/usr/bin/adb'

#list of args
def adb_cmd(cmd):
   return Popen([adb_path] + cmd)

def adb_sh_cmd(cmd):
   cmd += '; exit\n'
   #print('running command: ' + cmd)
   p = Popen([adb_path, 'shell'], stdout = PIPE, stdin = PIPE, stderr = STDOUT)
   return p.communicate(input=bytes(cmd))[0]


def start_video():
   adb_sh_cmd('mkdir /sdcard/video-data')

def video(fpath, width=1024, height=768, bitrate=None, time=None):
   #default is 4Mbps, but lower bitrate == higher fps
   if bitrate is None:
      bitrate = 2 * 1000 * 1000
   time_str
   adb_sh_cmd

def screenshot(name = 'screenshot.png'):
   """puts the screenshot in the current directory"""
   fpath = '/mnt/sdcard/' + name
   pic_raw = adb_sh_cmd('screencap -p ' + fpath)

   adb_cmd(['pull', fpath])

   #with open('screenshot.png', 'w') as f:
   #   f.write(bytes(png))

def click(x, y):
   adb_sh_cmd('input tap %s %s' % (x, y))

def text(string):
   adb_sh_cmd('input text %s' % string)

if __name__ == "__main__":
   text("hello")
   #screenshot()
   #click(100, 100)
   #click(0, 0)
