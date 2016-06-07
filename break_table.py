#!/usr/bin/python

import sys

if len(sys.argv) != 2:
   print('usage: %s invitelst.raw >invite.lst' % sys.argv[0])

with open(sys.argv[1], 'r') as f:
   s = f.read()
   lines = s.split('\n')
   for line in lines:
      print(line.split('\t')[0])
