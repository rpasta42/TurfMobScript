#!/usr/bin/env python

from subprocess import Popen, PIPE, STDOUT

#from pycloak import shellutils as sh
adb_path = '/usr/bin/adb'

def adb_cmd1(cmd):
   #print(sh.adb("shell", sh.echo(cmd + ';exit')))
   #print(sh.adb("shell", sh.echo("ls")))
   #print(sh.adb('shell ' + cmd))
   pass

def click(x, y):
   adb_cmd('input tap %s %s' % (x, y))

def adb_cmd(cmd):
   cmd += '; exit\n'
   print('running command: ' + cmd)
   p = Popen([adb_path, 'shell'], stdout = PIPE, stdin = PIPE, stderr = STDOUT)
   return p.communicate(input=bytes(cmd))[0]


def screenshot():
   #pic_raw = adb_cmd('screencap -p >/tmp/pic')
   #adb_cmd('screencap -p >/tmp/pic')
   pic_raw = adb_cmd('echo')

   num_exits = 0
   exit_i = 0

   png = b""
   for c in pic_raw:
      if c == '\r':
         continue
      if num_exits != 2 and (exit_n==0 and c=='e') || (exit_n==1 && c=='x') && exit_n == 2 && c == '
      if exit_n == 2:
         png += c

   with open('screenshot.png', 'w') as f:
      f.write(png)


if __name__ == "__main__":
   screenshot()
   #click(100, 100)
   #click(0, 0)
