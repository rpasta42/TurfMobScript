#!/usr/bin/env python

from subprocess import Popen, PIPE, STDOUT

#from pycloak import shellutils as sh
#import sh
adb_path = '/usr/bin/adb'

def adb_cmd1(cmd):
   #print(sh.adb("shell", sh.echo(cmd + ';exit')))
   #print(sh.adb("shell", sh.echo("ls")))
   #print(sh.adb('shell ' + cmd))
   pass

def adb_cmd(cmd):
   cmd += '; exit\n'
   print('running command: ' + cmd)
   #p = Popen(['adb', 'shell'], stdout=PIPE, stdin = PIPE, stderr=STDOUT)
   p = Popen([adb_path, 'shell'], stdout = PIPE, stdin = PIPE, stderr = STDOUT)
   std_out = p.communicate(input=bytes(cmd))[0]
   print('adb out: ' + std_out)
   #cmd = '%s %s' % (adb_path, cmd)
   #sh.exec_prog(cmd)
   #sh.adb(cmd)

def click(x, y):
   adb_cmd('input tap %s %s' % (x, y))


if __name__ == "__main__":
   click(100, 100)
   click(0, 0)
