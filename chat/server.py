# coding: utf-8
#!/usr/bin/env python

import os, sys

file_server_path = os.path.abspath(os.path.dirname(__file__))
sys.path.insert(0, os.path.abspath("%s/.." % file_server_path))

from tornado.ioloop import IOLoop
from tornado.web import Application

from chat.controllers import *

application = Application([
    (r"/", HomeHandler),
    (r"/chat", ChatWebSocketHandler),
],
template_path='templates',
static_path='static')

if __name__ == "__main__":
    application.listen(8989)
    IOLoop.instance().start()