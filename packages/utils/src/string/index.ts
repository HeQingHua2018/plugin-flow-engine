/**
 * 生成指定位数随机字符串，默认去掉了容易混淆的字符 oOLl,9gq,Vv,Uu,I1，未指定位数默认 32 位。
 * @param length - 要生成的随机字符串的长度，可选参数，默认值为 32。
 * @returns 生成的随机字符串。
 */
function generateRandomString(length: number = 32): string {
  // 定义不包含易混淆字符的字符集
  const characters = 'ABCDEFGHJKLMNPQRSTWXYZabcdefhijkmnpqrstwxyz2345678';
  let result = '';
  // 循环指定的次数，每次从字符集中随机选取一个字符添加到结果字符串中
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

function getUUID(): string {
  const uuid = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
    const r = (Math.random() * 16) | 0;
    return r.toString(16);
  });
  return uuid;
}
/*
 * 将字符串按每行 len 的长度添加换行符
 * @param str
 * @param len
 * @returns
 */
function linefeed(str: string, len: number): string {
  const text = str.replace(/\n/g, '');
  const reg = new RegExp(`(.{${len}})`, 'g');
  return ('' + text).replace(reg, '$1\n');
}

export { generateRandomString, getUUID, linefeed };
