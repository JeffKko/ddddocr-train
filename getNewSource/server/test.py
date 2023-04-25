import glob
import base64

image_list = []

for filename in glob.glob('./uncheck-image/*.jpg'):
    # im=Image.open(filename)
    image_list.append(filename)

pathname = image_list[0]

print(pathname)

filename = pathname.split('/')[2]



print(filename)

