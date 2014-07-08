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
sudo ln -s /usr/lib/arm-linux-gnueabi/libjpeg.so /usr/lib <-Check this
sudo ln -s /usr/lib/arm-linux-gnueabi/libfreetype.so /usr/lib
sudo ln -s /usr/lib/arm-linux-gnueabi/libz.so /usr/lib
sudo apt-get install libjpeg-dev libfreetype6 libfreetype6-dev zlib1g-dev
sudo pip install
echo "Adding auto login"
sudo cp ~/cdl-skyline/r-pi/inittab /etc/
echo "Backing up rc.local as rc.local.bkup"
sudo cp /etc/init.d/rc.local /etc/init.d/rc.local.bkup
echo "system ready!"