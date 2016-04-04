#!/usr/bin/env python
import datetime
import pika, random, threading, math, signal, sys, time, requests

credentials = pika.PlainCredentials('wellfollowed', 'wellfollowed')
parameters = pika.ConnectionParameters('localhost',
                                       5672,
                                       '/',
                                       credentials)
connection = pika.BlockingConnection(parameters)
channel = connection.channel()
channel.queue_declare(queue='well_followed_sensor', durable=True)
t = None


def get_current_date():
    now = datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S%z')
    return now


def create_message(type, value):
    now = get_current_date()
    body = '{"sensorId":"sensor2", "type":"' + type + '", "value":"' + value + '", "date": "' + now + '"}'
    return body


def send_message(message):
    channel.basic_publish(exchange='',
                          routing_key='well_followed_sensor',
                          body=message)


def send_start():
    sensor_data = {
        'id': 'sensor2',
        'tag': 'Capteur 1',
        'description': ''
    }
    result = requests.post('http://localhost:8086/api/Sensors', data=sensor_data)

    if result.status_code == 200:
        message = create_message('signal', 'start')
        send_message(message)
        time.sleep(1)
        print "Debut de l'echange."
        print '[send_start] ' + message
    else:
        if result.status_code == 500:
            message = "Erreur: un capteur portant cet identifiant est deja branche."
        else:
            message = "Erreur: impossible de demarrer l'echange."
        print '[send_start] ' + message
        sys.exit(0)





def send_stop():
    message = create_message('signal', 'stop')
    send_message(message)
    print '[send_stop] ' + message
    print 'Fin de la transmission.'


def send_data():
    global t
    val = str(math.ceil(random.uniform(14, 20)))
    message = create_message('numeric', val)
    send_message(message)
    print '[send_data] ' + message
    t = threading.Timer(1, send_data)
    t.start()


def interruption_handler(signal, frame):
    global t
    send_stop()
    t.cancel()
    sys.exit(0)

send_start()
send_data()
signal.signal(signal.SIGINT, interruption_handler)
signal.pause()
