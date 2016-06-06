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
   pic_raw = adb_cmd('screencap -p')
   png = b""

   first_exit = pic_raw.find("exit", 0, 200) 
   second_exit = pic_raw.find("exit", first_exit, 200)
   data_start = second_exit + 4

   for c in pic_raw[data_start:]:
      if c == '\r':
         continue
      
      if exit_n == 2:
         png += c

   with open('screenshot.png', 'w') as f:
      f.write(png)


if __name__ == "__main__":
   screenshot()
   #click(100, 100)
   #click(0, 0)
