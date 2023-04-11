interface RequestInterceptRule {
    test: RegExp | string; // 匹配规则
    action: (response: Response) => Promise<Response>; // 匹配成功后的处理函数
}

export class FetchInterceptor {
    private rules: RequestInterceptRule[]; // 请求拦截规则数组

    constructor() {
        this.rules = [];
        this.intercept(); // 拦截请求
    }

    public addRule(rule: RequestInterceptRule): void { // 添加拦截规则
        this.rules.push(rule);
    }

    private intercept(): void { // 拦截请求
        const that = this; // 保存当前对象的引用
        const originalFetch = window.fetch; // 保存原始的fetch函数

        // @ts-ignore
        window.fetch = function (url: RequestInfo, options?: RequestInit): Promise<Response> { // 重写fetch函数
            let modifiedUrl = url.toString(); // 将url转为字符串

            for (let i = 0; i < that.rules.length; i++) { // 遍历请求拦截规则
                const rule = that.rules[i];
                if (typeof rule.test === 'string') { // 如果是字符串类型的匹配规则
                    if (modifiedUrl.indexOf(rule.test) !== -1) { // 如果url中包含该字符串
                        return Promise.resolve().then(() => { // 返回一个立即resolve的Promise
                            return rule.action(new Response()); // 执行匹配成功后的处理函数
                        });
                    }
                } else { // 如果是正则表达式类型的匹配规则
                    if (rule.test.test(modifiedUrl)) { // 如果url符合该正则表达式
                        return Promise.resolve().then(() => { // 返回一个立即resolve的Promise
                            return rule.action(new Response()); // 执行匹配成功后的处理函数
                        });
                    }
                }
            }

            return originalFetch.apply(window, [url, options]).then((response) => { // 如果没有匹配成功的规则，执行原始的fetch请求
                for (let i = 0; i < that.rules.length; i++) { // 遍历请求拦截规则
                    const rule = that.rules[i];
                    if (typeof rule.test === 'string') { // 如果是字符串类型的匹配规则
                        if (modifiedUrl.indexOf(rule.test) !== -1) { // 如果url中包含该字符串
                            return rule.action(response); // 执行匹配成功后的处理函数
                        }
                    } else { // 如果是正则表达式类型的匹配规则
                        if (rule.test.test(modifiedUrl)) { // 如果url符合该正则表达式
                            return rule.action(response); // 执行匹配成功后的处理函数
                        }
                    }
                }

                return response; // 如果没有匹配成功的规则，返回原始的响应
            });
        };
    }
}
