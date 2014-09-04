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
from PIL import Image
import subprocess
import xml.etree.ElementTree as ET
from socket import timeout
#import py-thermal-printer THIS IS A MODIFIED VERSION OF luopio's library
import printer
import RPi.GPIO as GPIO
sleep(5)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(13,GPIO.OUT)
GPIO.output(13,GPIO.HIGH)
GPIO.setup(11,GPIO.OUT)
#Enable printer power on pin 11 (GPIO 17)
GPIO.output(11,GPIO.HIGH)
#Detect edge falling on pin 12
GPIO.setup(12,GPIO.IN,pull_up_down=GPIO.PUD_UP)
GPIO.add_event_detect(12,GPIO.FALLING)
import signal
import sys
print "Starting"
sys.path.append("/home/pi/cdl-skyline/r-pi")
def configure(element,xml_file="/home/pi/cdl-skyline/r-pi/config.xml"):
	'''Returns the text from the first appearance element in xml_file.
	If the root tag is not "config" this will return None.
	Takes:
	element->str
	Returns:
	text->str/None
	'''
	tree=ET.parse(xml_file)
	root=tree.getroot()
	if root.tag == 'config':
		text=root.find(element).text
		return text
	else:
		return None
uId=configure('uId')
server=configure('server')
buffer_url=server+'/'+uId+'/buffer.json'
print buffer_url
remove_url=server+'/remove_from_buffer.php'
print remove_url
histogram_url=server+'/'+uId+'/histogram.json'
print histogram_url
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
def get_histogram(histogram_path=histogram_url):
	'''Gets the histogram json data from buffer_path and converts it into a dictionary.
	Takes:
	histogram_path-> str (usually a url pointing to a *.json file)
	Returns
	histogram->dictionary
	'''
	response=urllib2.urlopen(histogram_path)
	histogram_json=response.read()
	try:
		histogram=json.loads(histogram_json)
	except ValueError:
		histogram=None
		attempts=0
		while histogram==None and attempts<10:
			print("Can not get JSON, re-try %d / 10" % attempts)
			response=urllib2.urlopen(histogram_path)
			histogram_json=response.read()
			histogram=json.loads(histogram_json)
			attempts += 1
	return histogram
def compute_path(histogram,category):
	'''Defines what version of the image to use based on the categories frequency.
	Takes:
	histogram->dict
	image->str
	Returns
	path->str
	'''
	path=""
	frequency=histogram[category.decode('unicode-escape')]
	if frequency>115:
		path='images/v3/'+category
	elif frequency>57:
		path='images/v2/'+category
	elif frequency>28:
		path='images/v1/'+category
	else:
		path='images/'+category
	return path
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
def shutdown():
	'''Shuts down the printer and turns off the LED on
	pin 11.
	Takes:
	button_pin ->int
	Returns:
	Nothing
	'''
	print("Shutdown signal detected")
	GPIO.output(11,GPIO.LOW)
	GPIO.output(13,GPIO.LOW)
	GPIO.cleanup()
	subprocess.call(['shutdown','-h','now'])
	sleep(0.15)
def check_internet(server_url=server):
	'''Ties to connect to reach the specified server and returns
	true if possible and false if not possible.
	Takes:
	servr_url->str
	Returns:
	Ture/False->Bool
	'''
	try:
		response=urllib2.urlopen(server_url,timeout=1)
		return True
	except urllib2.URLError as err: 
		pass
	return False
def signal_handler(signal, frame):
	'''A signal catcher for when system calls SIGTERM through
	a killall command.
	'''
	print("SIGTERM recieved, terminatng")
	GPIO.output(11,GPIO.LOW)
	GPIO.output(13,GPIO.LOW)
	GPIO.cleanup()
        sys.exit(0)
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
	is_internet=check_internet()
	while is_internet==False:
		if GPIO.event_detected(12):
			shutdown()
		GPIO.output(13,GPIO.LOW)
		sleep(1)
		GPIO.output(13,GPIO.HIGH)
		sleep(1)
		is_internet=check_internet()
	GPIO.output(13,GPIO.HIGH)
	buffer=get_buffer()
	if len(buffer)>0:
		histogram=get_histogram()
		print "Got %d items in buffer" % len(buffer)
		for item in buffer:
			category=item['fname'].split('.')[0]
			path=compute_path(histogram,category)
			try:
				byte_print(path+'.dat')
			except IOError:
				print path
				image_print(path+'.png')
			echoed=remove_from_buffer(item['iId'])
			print "removed "+str(item['iId'])+" from buffer with status "+echoed
			if echoed == "0":
				break
	else:
		sleep(0.05)	
signal.signal(signal.SIGTERM, signal_handler)
while __name__=="__main__":
	try:
		main()
	except (urllib2.URLError,timeout):
		GPIO.output(13,GPIO.LOW)
		time=strftime("%Y-%m-%d %H:%M:%S", gmtime())
		print(time+" urllib2.URLError, retrying in 30 seconds.")
		with open("systemdown.log","a") as sysDown:
			sysDown.write("System down, attempted restart at: "+time+"\n")
		sleep(30)
		print("re-starting")
	except (KeyboardInterrupt, SystemExit):
		GPIO.output(11,GPIO.LOW)
		GPIO.output(13,GPIO.LOW)
		GPIO.cleanup()
	except:
		print("undefined error, rebooting")
		GPIO.output(13,GPIO.LOW)
		GPIO.cleanup()
		subprocess.call(['shutdown','-r','now'])
	if GPIO.event_detected(12):
		shutdown()
