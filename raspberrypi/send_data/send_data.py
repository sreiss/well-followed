#!/usr/bin/env python
import pika, random, threading, math, signal, sys, time, requests, datetime, ConfigParser

Config = ConfigParser.ConfigParser()
Config.read('send_data.ini')

credentials = pika.PlainCredentials(Config.get('RabbitMQ', 'user'), Config.get('RabbitMQ', 'password'))
parameters = pika.ConnectionParameters(Config.get('RabbitMQ', 'host'),
                                       int(Config.get('RabbitMQ', 'port')),
                                       '/',
                                       credentials)
connection = pika.BlockingConnection(parameters)
channel = connection.channel()
channel.queue_declare(queue='well_followed_sensor', durable=True)
t = None


def get_current_date():
    now = datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S%z')
    return now


def create_message(is_signal, value):
    now = get_current_date()
    body = '{"sensorId":"' + Config.get('Sensor', 'id') + '", "isSignal":' + str(is_signal).lower() + ', "value":"' + value + '", "date": "' + now + '"}'
    return body


def send_message(message):
    channel.basic_publish(exchange='',
                          routing_key='well_followed_sensor',
                          body=message)


def send_start():
    sensor_data = {
        'id': Config.get('Sensor', 'id'),
        'tag': Config.get('Sensor', 'tag'),
        'description': Config.get('Sensor', 'description'),
        'type': Config.get('Sensor', 'type')
    }
    result = requests.post(Config.get('Api', 'url'), data=sensor_data)

    if result.status_code == 200:
        message = create_message(True, 'start')
        send_message(message)
        time.sleep(1)
        print "Starting exchange."
        print '[send_start] ' + message
    else:
        if result.status_code == 500:
            message = "Error: a sensor with this name has already been plugged in."
        else:
            message = "Error: unable to start the transmission."
        print '[send_start] ' + message
        sys.exit(0)


def send_stop():
    message = create_message(True, 'stop')
    send_message(message)
    print '[send_stop] ' + message
    print 'End of transmission.'


def send_data():
    global t
    val = str(math.ceil(random.uniform(14, 20)))
    message = create_message(False, val)
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
