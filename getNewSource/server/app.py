from flask import Flask, jsonify, request
import requests
import time
import base64

# GET 請求
response = requests.get('https://httpbin.org/get')
print(response.text)

# POST 請求
# data = {'username': 'user123', 'password': 'pass123'}
# response = requests.post('https://httpbin.org/post', data=data)
# print(response.text)


app = Flask(__name__)

# 設定 Access-Control-Allow-Origin header
@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/api', methods=['GET'])
def get_data():
    data = {'message': 'This is a sample JSON response.'}
    return jsonify(data)

@app.route('/api/refresh', methods=['GET'])
def refresh_captcha():

    # 取得 Unix timestamp（秒數）
    now = time.time()
    print("Unix timestamp:", now)

    sid = 'mnppnj57gpfk0vrplupiecvgbb'
    csrf = 'ead889b737b1e30ee9b9f58cef8070a07560708d82cee638ae9fc5ec152a323fa%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22xWxPT1B9xP5VWTZUsqJ0EnOUNQeQBPXJ%22%3B%7D'

    # 設置 cookie
    cookies = {
        "SID": sid,
        "_csrf": csrf,
    }

    # 設置 headers
    headers = {
        "User-Agent": "Mozilla/5.0",
    }

    session = requests.Session()

    # response1 = session.get(url1)
    # print(response1.status_code)

    # response2 = session.get(url2)
    # print(response2.status_code)

    time_stamp = now * 1000

    response = session.get(
        f'https://tixcraft.com/ticket/captcha?refresh=1&_={time_stamp}',
        headers=headers,
        cookies=cookies
    )

    print(response.text)

    data = response.json()

    print(data)

    image_url = data.get("url")

    print(image_url)

    # https://tixcraft.com/ticket/captcha?v=644164f7e5e265.85825256
    url = f'https://tixcraft.com{image_url}'

    print(url)

    response2 = session.get(url,
        headers=headers,
        cookies=cookies
    )

    # print(response2)
    # print(response2.content)

    image_content = response2.content

    # 將圖片轉為 base64 字串
    image_base64 = base64.b64encode(image_content).decode('utf-8')

    print(image_base64)

    # print(response)
    # print(response.headers)

    return {'base64': image_base64}
    # payload = {'message': '1234'}
    # return payload

@app.route('/api/save', methods=['POST'])
def new_save():

    data = request.get_json()
    imageBase64 = data['imageBase64']
    code = data['code']

    # 將 base64 字串轉換成 bytes
    img_data = base64.b64decode(imageBase64)

    # 取得 Unix timestamp（秒數）
    now = time.time()

    time_stamp = now * 1000

    file_name = f'{code}_{time_stamp}.jpg'

    # 將 bytes 寫入檔案
    with open(f'./image-source/{file_name}', 'wb') as f:
        f.write(img_data)

    return 'ok'

if __name__ == '__main__':
    app.run(debug=True)