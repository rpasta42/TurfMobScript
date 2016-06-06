#!/usr/bin/env python

#from pycloak import shellutils as sh
import sh

#adb_path = '/usr/bin/adb'

def adb_cmd(cmd):
   #cmd = '%s %s' % (adb_path, cmd)
   #sh.exec_prog(cmd)
   print(cmd)
   sh.adb(cmd)

def click(x, y):
   adb_cmd('input tap %s %s' % (x, y))

click(100, 100)

if __name__ == "__main__":
   print('hello')
