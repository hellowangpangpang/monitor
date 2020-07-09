import context from '../context/index';
import { debugLogger } from '../utils/index';

export default function () {
    let XMLHttpRequest = window.XMLHttpRequest;
    let oldOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function (method, url, async, username, password) {
        if (!url.match(/logstores/) && !url.match(/sockjs/)) {
            this.logData = {
                method,
                url,
                async,
                username,
                password,
            };
        }

        return oldOpen.apply(this, arguments);
    };

    let oldSend = XMLHttpRequest.prototype.send;
    let start;
    XMLHttpRequest.prototype.send = function (body) {
        if (this.logData) {
            start = Date.now();

            let handler = (type) => () => {
                let duration = Date.now() - start;
                let status = this.status;
                let statusText = this.statusText;

                const log = {
                    eventType: type, //load error abort
                    pathname: this.logData.url, //接口的url地址
                    status: status + '-' + statusText,
                    duration: '' + duration, //接口耗时
                    response: this.response ? JSON.stringify(this.response) : '',
                    params: body || '',
                    code: 4,
                };
                debugLogger('发送xhr指标埋点 埋点内容 => ', log);
                context.report.handleLog(log);
            };

            this.addEventListener('load', handler('load'), false);
            this.addEventListener('error', handler('error'), false);
            this.addEventListener('abort', handler('abort'), false);
        }

        return oldSend.apply(this, arguments);
    };
}
