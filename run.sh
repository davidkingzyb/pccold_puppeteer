#!/bin/bash
DATE=$(date +%m%d_%H%M)
ps aux | grep pccoldmain | awk '{print $2}'|xargs kill -9 
ps aux | grep pccolddanmu | awk '{print $2}'|xargs kill -9 
nohup python3 -u /usr/local/bin/pccold -n pccoldmain >logfile/pccold_${DATE}.log 2>&1 &
nohup python3 -u /usr/local/bin/pccolddanmu -n pccolddanmu >logfile/danmu_${DATE}.log 2>&1 &
