/**
 * 判断指定值是否匹配正则
 * @param reg 正则表达式
 * @param value 要判断的值
 * @returns 是否匹配
 */
function isMatchRegex(reg: RegExp, value: any): boolean {
  return reg.test(String(value));
}

/**
 * 判断值是否为一个 url 地址
 * @param value 要判断的值
 * @returns 是否为 url 地址
 */
function isUrl(value: string): boolean {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlRegex.test(value);
}

/**
 * 判断值是否为一个邮箱地址
 * @param value 要判断的值
 * @returns 是否为邮箱地址
 */
function isEmail(value: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(value);
}

/**
 * 判断值是否为一个联系电话
 * 这里简单假设是 11 位数字
 * @param value 要判断的值
 * @returns 是否为联系电话
 */
function isPhone(value: string): boolean {
  const phoneRegex = /^\d{11}$/;
  return phoneRegex.test(value);
}

/**
 * 判断值是否为一个身份证号
 * 这里简单验证 18 位身份证号
 * @param value 要判断的值
 * @returns 是否为身份证号
 */
function isIdNumber(value: string): boolean {
  const idRegex =
    /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[0-9Xx]$/;
  return idRegex.test(value);
}

/**
 * 判断是否为 true
 * @param value 要判断的值
 * @returns 是否为 true
 */
function isTrue(value: boolean): boolean {
  return value === true;
}

/**
 * 判断值是否为 false
 * @param value 要判断的值
 * @returns 是否为 false
 */
function isFalse(value: boolean): boolean {
  return value === false;
}

/**
 * 判断值是否为数字
 * @param value 要判断的值
 * @returns 是否为数字
 */
function isNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * 判断值是否为非零整数
 * @param value 要判断的值
 * @returns 是否为非零整数
 */
function isPositiveInteger(value: any): boolean {
  return Number.isInteger(value) && value > 0;
}

/**
 * 判断值是否非负整数（包含 0）
 * @param value 要判断的值
 * @returns 是否非负整数（包含 0）
 */
function isPositiveIntegerAndZero(value: any): boolean {
  return Number.isInteger(value) && value >= 0;
}

/**
 * 判断值是否包含英文字母 、数字和下划线
 * @param value 要判断的值
 * @returns 是否包含英文字母 、数字和下划线
 */
function isGeneral(value: string): boolean {
  const generalRegex = /^[a-zA-Z0-9_]+$/;
  return generalRegex.test(value);
}

/**
 * 判断字符串是否包含 HTML 代码
 * @param value 要判断的字符串
 * @returns 是否包含 HTML 代码
 */
function isIncludeHtml(value: string): boolean {
  const htmlRegex = /<[a-z][\s\S]*>/i;
  return htmlRegex.test(value);
}

export {
  isEmail,
  isFalse,
  isGeneral,
  isIdNumber,
  isIncludeHtml,
  isMatchRegex,
  isNumber,
  isPhone,
  isPositiveInteger,
  isPositiveIntegerAndZero,
  isTrue,
  isUrl,
};
