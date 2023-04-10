export const VERIFY_CODE_ARR = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

/**
 * 验证车牌号是否有效
 * @param licensePlateNumber 车牌号
 * @returns 是否有效
 */
export const validateLicensePlateNumber = (licensePlateNumber: string): boolean => {
    // 匹配普通车牌号
    const REGULAR_LICENSE_PLATE_NUMBER = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/;
    // 匹配新能源车牌号
    const NEW_ENERGY_LICENSE_PLATE_NUMBER = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{4}[DF][A-HJ-NP-Z0-9]{1}$/;

    // 检查是否是普通车牌号或新能源车牌号
    if (!REGULAR_LICENSE_PLATE_NUMBER.test(licensePlateNumber) && !NEW_ENERGY_LICENSE_PLATE_NUMBER.test(licensePlateNumber)) {
        return false;
    }

    // 检查第二个字符是否为 D 或 F（新能源车牌号）
    if (licensePlateNumber[1] === 'D' || licensePlateNumber[1] === 'F') {
        return NEW_ENERGY_LICENSE_PLATE_NUMBER.test(licensePlateNumber);
    }

    return REGULAR_LICENSE_PLATE_NUMBER.test(licensePlateNumber);
}


/**
 * 校验身份证号码是否合法
 * @param idCardNumber 身份证号码
 * @returns 是否合法
 */
export function validateIDCardNumber(idCardNumber: string): boolean {
    // 判断身份证号码格式是否正确
    const regExp = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
    if (!regExp.test(idCardNumber)) {
        return false;
    }

    // 判断身份证号码中的出生年月日是否合法
    const year = parseInt(idCardNumber.substr(6, 4));
    const month = parseInt(idCardNumber.substr(10, 2));
    const day = parseInt(idCardNumber.substr(12, 2));
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return false;
    }
    const birthDate = new Date(year, month - 1, day);
    if (isNaN(birthDate.getTime())) {
        return false;
    }

    // 判断身份证号码的校验码是否正确
    const idCardNumberChars = idCardNumber.split('');
    const coefficientArr = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const sum = idCardNumberChars.slice(0, 17).reduce((acc, cur, index) => {
        return acc + parseInt(cur) * coefficientArr[index];
    }, 0);
    const remainder = sum % 11;
    return idCardNumberChars[17].toUpperCase() === VERIFY_CODE_ARR[remainder];
}
