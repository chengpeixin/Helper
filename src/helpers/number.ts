export const toFixedNumber = (num: number | string, fractionDigits: number = 0): number => {
    // 对 num 进行类型转换和校验，如果无效则返回 NaN
    if (typeof num === 'string') {
        num = parseFloat(num);
    } else if (typeof num !== 'number' || !Number.isFinite(num)) {
        return NaN;
    }

    // 对 fractionDigits 参数进行校验，如果无效则使用默认值 0
    if (!Number.isInteger(fractionDigits) || fractionDigits < 0) {
        fractionDigits = 0;
    }

    // 对数字进行四舍五入
    const rounded = num.toFixed(fractionDigits);

    // 将结果转换为数字并返回
    return parseFloat(rounded);
}
