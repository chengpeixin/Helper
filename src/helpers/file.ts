/**
 * 下载文件
 * @param url 下载链接
 * @param fileName 文件名称
 * @param fileType 文件类型，默认为 'application/octet-stream'
 * @param errorCallback 下载失败的回调函数，可选
 * @returns Promise<void>
 */
export function downloadFile(
    url: string,
    fileName: string,
    fileType: string = 'application/octet-stream',
    errorCallback?: (error: Error) => void
): Promise<void> {
    // 创建一个a标签
    const a = document.createElement('a');
    a.style.display = 'none';
    document.body.appendChild(a);

    return fetch(url, { mode: 'cors' })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then((blob) => {
            // 创建 blob
            const blobUrl = window.URL.createObjectURL(blob);
            a.href = blobUrl;
            a.download = fileName;
            a.type = fileType;

            // 判断下载链接是否有效
            if (a.href.indexOf('blob:') !== 0) {
                throw new Error('Invalid download url');
            }

            // 模拟点击下载
            a.dispatchEvent(new MouseEvent('click'));

            // 释放 blobUrl 资源
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
        })
        .catch((error) => {
            console.error('Download failed:', error);
            if (errorCallback) {
                errorCallback(error);
            }
            document.body.removeChild(a);
            throw error;
        });
}
