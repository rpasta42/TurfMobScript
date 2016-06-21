#!/usr/bin/python

import sys
if len(sys.argv) != 2:
   print('Usage: %s <comma-file>' % sys.argv[0])

with open(sys.argv[1], 'r') as f:
   s = f.read()
   splitted = s.split(',')
   #fucked ip
   #i = 0
   for x in splitted:
      #if i > 72936:
      #   print(x)
      #i+=1
      print(x)
