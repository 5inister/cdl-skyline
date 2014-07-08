#! /bin/sh
# /etc/init.d/bufferprocess.sh
case "$1" in
	start)
		echo "Starting bufferprocess"
		cd /home/pi/cdl-skyline/r-pi
		python proccessBuffer.py &
		;;
	stop)
		echo "Stopping bufferprocess"
		killall python
		;;
	*)
		echo "Usage: /etc/init.d/bufferprocess.sh {start|stop}"
		exit 1
		;;
esac

exit 0
