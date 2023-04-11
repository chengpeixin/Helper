interface RequestInterceptRule {
    test: RegExp | string;
    action: (xhr: XMLHttpRequest) => void;
}

export class XHRInterceptor {
    private rules: RequestInterceptRule[];

    constructor() {
        this.rules = [];
        this.intercept();
    }

    /**
     * 添加一个拦截规则
     * @param rule 拦截规则
     */
    public addRule(rule: RequestInterceptRule): void {
        this.rules.push(rule);
    }

    /**
     * 在 XMLHttpRequest.prototype 上拦截 open 和 send 方法
     */
    private intercept(): void {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        const that = this;

        XMLHttpRequest.prototype.open = function (method: string, url: string): void {
            for (const rule of that.rules) {
                const isStringRule = typeof rule.test === 'string';
                if ((isStringRule && url.includes(rule.test as string)) || (!isStringRule && (rule.test as RegExp).test(url))) {
                    const xhr = this;
                    xhr.addEventListener('load', () => rule.action(xhr));
                }
            }

            originalOpen.apply(this, arguments as any);
        };

        XMLHttpRequest.prototype.send = function (...args: [Document | XMLHttpRequestBodyInit | null | undefined]): void {
            originalSend.apply(this, args);
        };

    }
}
