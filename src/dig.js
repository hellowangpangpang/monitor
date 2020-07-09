import context from './context/index';
import { debugLogger, get } from './utils/index';

function dig(logList = []) {
    if (!logList.length) return debugLogger('日志列表长度为0，无法上报');

    const url = get(context, ['config', 'url']);

    if (!url) return debugLogger('config.url无效，请设置有效的上报地址');

    const xhr = new XMLHttpRequest();

    let body = JSON.stringify({
        __logs__: logList,
    });

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json'); //请求体类型
    xhr.setRequestHeader('x-log-apiversion', '0.6.0'); //版本号
    xhr.setRequestHeader('x-log-bodyrawsize', body.length); //请求体的大小
    xhr.onload = function () {};
    xhr.onerror = function () {};
    xhr.send(body);
}

export default dig;
