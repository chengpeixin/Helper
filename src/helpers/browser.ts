export const parseUrlParamsToJson = (url: string): { [key: string]: string } => {
    if (!url || !url.includes('?')) {
        return {};
    }
    try {
        const paramsStr = url.split('?')[1];
        const paramsArr = paramsStr.split('&');
        const paramsObj: { [key: string]: string } = {};

        paramsArr.forEach((param) => {
            const [key, value] = param.split('=');
            paramsObj[key] = decodeURIComponent(value);
        });

        return paramsObj;
    } catch (e) {
        if (e instanceof URIError) {
            console.error('解析URL参数失败:', e);
        } else {
            console.error('意外错误:', e);
        }

        return {};
    }
}

export const parseJsonToUrlParams = (json: { [key: string]: string }): string => {
    if (!json || typeof json !== 'object') {
        return '';
    }

    const params: string[] = [];

    try {
        for (const [key, value] of Object.entries(json)) {
            params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        }

        return `?${params.join('&')}`;
    } catch (e) {
        console.error('将 JSON 转换为 URL 参数失败:', e);
        return '';
    }
}


export const mergeUrlParams = (...urls: (string | undefined)[]): string => {
    const params = new URLSearchParams();
    urls.forEach((url) => {
        if (typeof url !== 'string') {
            console.error('无效的输入，期望是一个字符串');
            return '';
        }
        if (!url.includes('?')) {
            return;
        }
        try {
            const urlParams = new URLSearchParams(url.replace(/^.*\?/, ''));
            urlParams.forEach((value, key) => params.set(key, value));
        } catch (e) {
            console.error('合并 URL 参数失败:', e);
        }
    });
    return `?${params.toString()}`;
}
