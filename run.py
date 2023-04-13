import ddddocr
import sys
import base64

# 檢查是否有足夠的參數
if len(sys.argv) < 2:
    print("Usage: python my_script.py arg1")
    exit()

# 獲取參數
arg1 = sys.argv[1]

# 使用參數
# print("arg1:", arg1)

# ocr = ddddocr.DdddOcr(det=False, ocr=False, import_onnx_path="myproject_0.984375_139_13000_2022-02-26-15-34-13.onnx", charsets_path="charsets.json")

ocr = ddddocr.DdddOcr(show_ad=False)

# with open('workspaces/ocr/captcha.png', 'rb') as f:
#     image_bytes = f.read()

# base64_code = "VER30QHI30JFOIAIO3020085723F"  # this is just a example

# img_data = arg1.encode()

# print(arg1)

string = base64.b64decode(arg1)

# print(string)

# content = base64.b64decode(img_data)

res = ocr.classification(string)

print(res)
