#import picamera
import base64, requests, threading
from PIL import Image

#camera = picamera.PiCamera()

def test():
    #camera.capture('deer.jpg')
    image = Image.open('deer.jpg', 'r')
    image.save('deer.jpg', quality=50)
    with open('deer.jpg', 'rb') as image:
        base64image = base64.b64encode(image.read())
        #print(base64image)
        try:
            requests.post('http://localhost:8086/api/VideoStreams/createStream', data={'cameraName':'camera1', 'changes':base64image})
            threading.Timer(0.25, test).start()
        # Si le serveur est injoignable, on reessaye toutes les 10 secondes
        except requests.exceptions.ConnectionError as e:
            print('Unable to reach server.')
            threading.Timer(10, test).start()

test()
