import cv2, sys, os
import numpy as np

def yuv422_to_jpg():
    path = "/media/multimedia/"
    file_list = [path+file for file in os.listdir(path) if file.endswith(".yuv")] 
    
    for input in file_list:
        with open(input, 'rb') as f:
            yuv_data = f.read()
            
        yuv = np.frombuffer(yuv_data, dtype=np.uint8).reshape((480, 640, 2))
        bgr = cv2.cvtColor(yuv, cv2.COLOR_YUV2BGR_YUYV)

        ouput = input.replace(".yuv",".jpg")
        cv2.imwrite(ouput, bgr)
        os.remove(input)

if __name__ == "__main__":
    yuv422_to_jpg()