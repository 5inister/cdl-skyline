#!/bin/bash
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install python-pip python-dev python2.7-dev
sudo pip uninstall pil
echo "Installing PIL"
wget http://www.ijg.org/files/jpegsrc.v9.tar.gz
tar xvfz jpegsrc.v9.tar.gz
cd jpeg-9c
./configure --enable-shared --prefix=$CONFIGURE_PREFIX
make
sudo make install
cd ~
sudo ln -s /usr/lib/arm-linux-gnueabi/libjpeg.so /usr/lib
sudo ln -s /usr/lib/arm-linux-gnueabi/libfreetype.so /usr/lib
sudo ln -s /usr/lib/arm-linux-gnueabi/libz.so /usr/lib
sudo apt-get install libjpeg-dev libfreetype6 libfreetype6-dev zlib1g-dev
sudo pip install pil
echo "Adding auto login"
sudo cp ~/cdl-skyline/r-pi/inittab /etc/
echo "Modifying startup files"
sudo cp ~/cdl-skyline/r-pi/bufferprocess.sh /etc/init.d/
sudo chmod 755 /etc/init.d/bufferprocess.sh
sudo update-rc.d bufferprocess.sh defaults

exit 0
