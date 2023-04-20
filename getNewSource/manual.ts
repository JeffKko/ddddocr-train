import { getCapchaBase64ByRefresh,downloadCaptchaToBase64, requestOCR } from './lib';
import axios from 'axios';

(async () => {
  const newPath = await getCapchaBase64ByRefresh()

  const imageBase64 = await downloadCaptchaToBase64(newPath);

  const result = await requestOCR(imageBase64);

  console.log('resultq')
})();
