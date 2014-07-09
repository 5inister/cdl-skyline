#!/usr/bin/python
###############################################################################
#proccessBuffer.py                                                            #
#This file is the core of the printer-webserver interface it probes the       #
#buffer.json file on the server once every 10 seconds, prints the images in   #
#chronological order and removes the most recently printed image from the     #
#buffer file.                                                                 #
#Dependencies are urllib, urlib2 and json.                                    #
#Written by Diego Trujillo Pisanty and Tom Schofield as part of the CDL       #
#project at Newcastle University.                                             #
#Contact: diego[dot]trujillo-pisanty[at]ncl[dot]ac[dot]uk                     #
###############################################################################
import urllib
import urllib2
import json
from time import sleep,strftime,gmtime
import Image
#import py-thermal-printer THIS IS A MODIFIED VERSION OF luopio's library
import printer
import RPi.GPIO as GPIO
#Enable printer power on pin 11 (GPIO 17)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(11,GPIO.OUT)
GPIO.output(11,GPIO.HIGH)
#TODO Read uId from a config file
uId='USER000' #For now while we get the correct uId from config
buffer_url='https://di.ncl.ac.uk/cdl/'+uId+'/buffer.json'
print buffer_url
remove_url='https://di.ncl.ac.uk/cdl/remove_from_buffer.php'
print remove_url
import sys
print "Starting"
sys.path.append("/home/pi/cdl-skyline/r-pi")
def get_buffer(buffer_path=buffer_url):
	'''Gets the buffer json data from buffer_path and converts it into a list.
	Takes:
	buffer_path-> str (usually a url pointing to a *.json file)
	Returns
	buffer_list->list	
	'''
	response=urllib2.urlopen(buffer_path)
	buffer_json=response.read()
	try:
		buffer_list=json.loads(buffer_json)
	except ValueError:
		buffer_list=None
		attempts=0
		while buffer_list==None and attempts<10:
			print("Can not get JSON, re-try %d / 10" % attempts)
			response=urllib2.urlopen(buffer_path)
			buffer_json=response.read()
			buffer_list=json.loads(buffer_json)
			attempts += 1
	return buffer_list
def remove_from_buffer(itemId,user=uId,remove_php_path=remove_url):
	'''Posts the item Id (iId) to the remove script on the server and returns
	the server's response
	Takes:
	itemId-> str
	user-> str
	remove_php_path-> str (A URL pointing to the correct php script on a server
	Returns:
	echoed->str
	'''
	data={"uId":user,"iId":itemId}
	data=urllib.urlencode(data)
	remove_request=urllib2.Request(remove_php_path,data)
	response=urllib2.urlopen(remove_request)
	echoed=response.read()
	return str(echoed)
def image_print(image_path,serialport='/dev/ttyAMA0'):
	'''Prints the corresponding image file on paper.
	Takes:
	image_path-> str (pointing to an RGB/RGBA image)
	Returns:
	1-> int
	'''
	thermal=printer.ThermalPrinter(serialport=serialport)
	img=Image.open(image_path)
	img=img.convert("1") #Convert to single channel
	data=list(img.getdata())
	w,h=img.size
	thermal.print_bitmap(data,w,h,False)
	return 1
def byte_print(byte_file_path,serialport='/dev/ttyAMA0'):
	'''Prints the corresponding byte file on paper.
	Takes:
	byte_path-> str (pointing to a text file)
	Returns:
	1-> int
	'''
	thermal=printer.ThermalPrinter(serialport=serialport)
	thermal.print_from_byte_file(byte_file_path)
	print("printing %s" % byte_file_path)
	return 1
def main():
	'''The main function, it performs the following tasks:
	Every 5 seconds get the buffer.
	If the buffer isn't empty then process it.
	If it is wait for new item to be added.
	Takes:
	nothing
	Returns:
	nothing
	'''
	buffer=get_buffer()
	if len(buffer)>0:
		print "Got %d items in buffer" % len(buffer)
		for item in buffer:
			try:
				path='images/'+item['fname'].split('.')[0]+'.dat'
				byte_print(path)
			except IOError:
				print path
				path='images/'+item['fname']
				image_print(path)
			echoed=remove_from_buffer(item['iId'])
			print "removed "+str(item['iId'])+" from buffer with status "+echoed
			if echoed == "0":
				break
	else:
		sleep(0.1)
while __name__=="__main__":
	try:
		main()
	except urllib2.URLError:
		time=strftime("%Y-%m-%d %H:%M:%S", gmtime())
		print(time+" urllib2.URLError, retrying in 3 minutes.")
		with open("systemdown.log","a") as sysDown:
			sysDown.write("System down, attempted restart at: "+time+"\n")
		sleep(180)
		print("re-starting")
		main()
