import ddddocr
from pathlib import Path

folder = Path('./images_tix')

rightCount = 0
wrongCount = 0
totalCount = 0

    # v3
    # import_onnx_path="./models/v3/tixcraftv3_0.6666666666666666_14100_423000_2023-04-13-09-40-09.onnx",
    # charsets_path="./models/v3/charsets.json"
ocr = ddddocr.DdddOcr(
    show_ad=False,
    det=False,
    ocr=False,
    import_onnx_path="./models/v4/tixcraft_0413_1_0.875_33_2000_2023-04-13-13-58-01.onnx",
    charsets_path="./models/v4/charsets.json"
)


allList = []

for file in folder.rglob('*'):
    ans = file.name.split('_')[0]

    if 'jpg' not in file.name:
        continue

    print(f'{str(totalCount)} {file.name}')

    totalCount += 1

    with open('./images_tix/' + file.name, 'rb') as f:
        image_bytes = f.read()

    res = ocr.classification(image_bytes)

    allList.append(f'{res}_{file.name}')

print('rightCount: ' + str(rightCount))
print('wrongCount: ' + str(wrongCount))

str = '\n'.join(allList)

with open('sign_tix.txt', 'w') as f:
     f.write(str)