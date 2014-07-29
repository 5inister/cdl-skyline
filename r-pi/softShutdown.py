#!/usr/bin/python
import subprocess
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BOARD)
GPIO.setup(11,GPIO.OUT)
#TODO agree should be controlled by a button
agree=raw_input("Shutdown (y/n): ")
if agree.lower()=='y' or agree.lower()=='yes':
	GPIO.output(11,GPIO.LOW)
	print("Shutting down, see ya!")
	subprocess.call(['shutdown','-h','now'])
else:
	print("Shutdown cancelled")
