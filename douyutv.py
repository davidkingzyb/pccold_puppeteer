# 2019/3/6 by DKZ
import subprocess
import hashlib
import re
import time
import uuid

from requests.adapters import HTTPAdapter

from streamlink.plugin import Plugin
from streamlink.plugin.api import http, validate, useragents
from streamlink.stream import HTTPStream, HLSStream, RTMPStream

def getPlay():
    js=subprocess.Popen(['node','index.js'],stdout=subprocess.PIPE)
    stdout,stderr=js.communicate()
    returncode=js.wait() # 0 ok , 1 not get url , 3 time out , 4 error
    print('return code',returncode)
    print(stdout.decode())
    if returncode==0 and '$$$$' in stdout.decode():
        return stdout.decode().split('$$$$')[1]
    else:
        exit(returncode)


STREAM_WEIGHTS = {
    'default':1
}

rtmp_url=getPlay()

_url_re = re.compile(r"""
    http(s)?://
    (?:
        (?P<subdomain>.+)
        \.
    )?
    douyu.com/
    (?:
        show/(?P<vid>[^/&?]+)|
        (?P<channel>[^/&?]+)
    )
""", re.VERBOSE)


class Douyutv(Plugin):
    @classmethod
    def can_handle_url(cls, url):
        return _url_re.match(url)

    @classmethod
    def stream_weight(cls, stream):
        if stream in STREAM_WEIGHTS:
            return STREAM_WEIGHTS[stream], "douyutv"
        return Plugin.stream_weight(stream)

    def _get_streams(self):    
        if 'rtmp:' in rtmp_url:
            stream = RTMPStream(self.session, {
                    "rtmp": rtmp_url,
                    "live": True
                    })
            yield 'default', stream
        else:
            yield 'default', HTTPStream(self.session, rtmp_url)

__plugin__ = Douyutv

if __name__ == '__main__':
    print(rtmp_url)
