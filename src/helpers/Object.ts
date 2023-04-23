/**
 * 从一个对象中删除指定属性，返回被删除的属性及其值的键值对组成的新对象。
 * @param obj 待操作的对象。
 * @param props 要删除的属性名数组。
 * @returns 被删除的属性及其值的键值对组成的新对象。
 * @throws 如果 obj 不是对象类型，将抛出异常。
 */
export function removeProps(obj: Record<string, any>, props: string[]): {[key: string]: any} {
    if (typeof obj !== 'object' || obj === null) {
        throw new Error('无效的输入：obj 必须是一个对象');
    }

    const newObj = Object.assign({}, obj);
    const deletedProps: {[key: string]: any} = {};

    for (const prop of props) {
        const descriptor = Object.getOwnPropertyDescriptor(newObj, prop);

        if (descriptor && descriptor.configurable) {
            deletedProps[prop] = newObj[prop];
            delete newObj[prop];
        }
    }

    return deletedProps;
}
