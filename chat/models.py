# coding: utf-8
#!/usr/bin/env python

from tornado.database import Connection

__db__ = None

def get_db():
    global __db__
    if not __db__:
        __db__ = Connection("localhost", "chat", user="root", password=None)
        del __db__._db_args['init_command']
        __db__.reconnect()
    return __db__

def get_mensagens():
    db = get_db()
    mensagens = db.query("SELECT * FROM chat_log ORDER BY data DESC LIMIT 40")
    mensagens.reverse()
    return mensagens

def save_mensagens(nickname, mensagem, data):
    db = get_db()
    db.execute("INSERT INTO chat_log (nickname, mensagem, data) VALUES ('%s', '%s', '%s')" % (nickname, mensagem, data))