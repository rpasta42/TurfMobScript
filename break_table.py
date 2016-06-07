#!/usr/bin/python

import sys

#./break_table.py -t 0 invitelst.raw
#./break_table.py -s 0 invitelst.raw

args = sys.argv
args_len = len(args)

def usage():
   print('usage: %s -t|-s|-x n invitelst.raw >invite.lst [cut_n]' % args[0])
   print('n is the column to select which contains code')
   print('use -t for tab delimiter, and -s for space, -x for custom character x')
   print('use [cut_n] to specify number of characters to leave out after delimiter')

if args_len != 4 and args_len != 5: #cut off is optional
   usage()
   exit()

with open(args[3], 'r') as f:
   s = f.read()
   lines = s.split('\n')
   col = int(args[2])

   d = ' '
   if args[1] == '-t':
      d = '\t'
   elif args[1] == '-s':
      d = ' '
   else:
      #usage()
      #exit()
      d = args[1]

   #cut of first cut_n characters from beginning of delimiter
   cut_n = None
   if args_len == 5:
      cut_n = int(args[4])

   for line in lines:
      out = line.split(d)[col]
      if cut_n is None:
         print(out)
      else:
         print(out[cut_n:])

