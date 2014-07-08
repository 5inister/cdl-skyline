#!/bin/bash
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install python-pip python-dev python2.7-dev
sudo pip uninstall pil
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
sudo pip install pil
echo "system ready!"