# zhi-yuan-helper

这是一个npm工具库，提供了一系列常用的工具函数，包括但不限于以下函数：

- `toFixedNumber(num: number | string, fractionDigits: number): number`：对数字进行四舍五入并保留指定位数小数的函数。
- `validateLicensePlateNumber(licensePlateNumber: string): boolean`：校验车牌号的函数，支持普通车牌和新能源车牌。
- `validateIDCardNumber(idCardNumber: string): boolean`：校验身份证号的函数

所有函数均使用TypeScript编写，经过AI代码验证，确保代码质量和安全性。

## 安装
```bash
npm install zhi-yuan-helper
```

## 使用
```typescript
import { toFixedNumber, validateLicensePlateNumber, validateIDCardNumber } from 'zhi-yuan-helper';

console.log(toFixedNumber(1.2345, 2)); // 1.23
console.log(validateLicensePlateNumber('粤A12345')); // true
console.log(validateIDCardNumber('110101199003077656')); // true
```

## API文档
`toFixedNumber(num: number | string, fractionDigits: number): number`
对数字进行四舍五入并保留指定位数小数的函数。

- `num`：要进行四舍五入的数字，可以是数字或数字的字符串。
- `fractionDigits`：保留的小数位数。

返回值：四舍五入后的数字。

`validateLicensePlateNumber(licensePlateNumber: string): boolean`
校验车牌号的函数，支持普通车牌和新能源车牌。

- `licensePlateNumber`：要校验的车牌号。
返回值：校验结果，如果车牌号格式正确，返回t`rue`，否则返回`false`。

- `validateIDCardNumber(idCardNumber: string): boolean`
校验身份证号的函数。

`idCardNumber`：要校验的身份证号。

返回值：校验结果，如果身份证号格式正确，返回t`rue`，否则返回`false`。

---
函数名称：removeProps

函数描述：移除对象中指定的属性，并返回这些属性的键值对

函数签名：function removeProps(obj: object, props: string[]): {[key: string]: any}

参数：

obj: 要移除属性的对象
props: 要移除的属性名列表
返回值：包含被删除的属性及其对应值的对象

使用示例：
```typescript
const obj = { name: "join", age: 18, gender: "male" };
const deletedProps = removeProps(obj, ["name", "gender"]);

console.log(obj); // { age: 18 }
console.log(deletedProps); // { name: "xpc", gender: "male" }

```

## 贡献
欢迎提出建议和意见，也欢迎提交PR。