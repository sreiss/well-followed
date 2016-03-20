import base64, requests, threading
from PIL import Image

def test():
    image = Image.open('deer.jpg', 'r')
    image.save('deer.jpg', quality=50)
    with open('deer.jpg', 'rb') as image:
        base64image = base64.b64encode(image.read())
        print(base64image)
        requests.post('http://localhost:8086/api/VideoStreams/createStream', data={'cameraName':'camera1', 'changes':base64image})
    threading.Timer(1, test).start()

test()
