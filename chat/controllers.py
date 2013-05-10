# coding: utf-8
#!/usr/bin/env python

import simplejson

from tornado.web import RequestHandler
from tornado.websocket import WebSocketHandler

from chat import __version__, __release_date__
from chat.models import *
from datetime import datetime

class HomeHandler(RequestHandler):

    def get(self):

        mensagens = get_mensagens()
        
        self.render("home.html",
                    versao=__version__,
                    data_versao=__release_date__,
                    mensagens=mensagens)

class ChatWebSocketHandler(WebSocketHandler):

    waiters = set()
    
    def open(self):
        self.waiters.add(self)

    def on_close(self):
        self.waiters.remove(self)
        
    def on_message(self, message):
        
        message_dict = simplejson.loads(message)
        
        if message_dict['tipo'] == 'QTD':
            message_dict['qtd'] = len(self.waiters)
            self.write_message(message_dict)        

        if message_dict['tipo'] == 'SAIR':
            self.write_message(message_dict)        

        if message_dict['tipo'] == 'MSG':
            now = datetime.now()
            
            save_mensagens(message_dict['nickname'], message_dict['mensagem'], now.strftime('%Y-%m-%d %H:%M:%S'))
            
            message_dict['data'] = now.strftime('%d/%m/%Y %H:%M:%S')
        
            for waiter in self.waiters:
                waiter.write_message(message_dict)
