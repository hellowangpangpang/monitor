import getLastEvent from '../utils/getLastEvent';
import getSelector from '../utils/getSelector';
import context from '../context/index';
import debugLogger from '../utils/debugLogger';

export default function () {
    window.addEventListener(
        'error',
        function (event) {
            const lastEvent = getLastEvent();
            let log;
            if (event.target && (event.target.src || event.target.href)) {
                log = {
                    kind: 'stability', //监控指标大类
                    type: 'error', // 小类型
                    errorType: 'resouceError', //JS执行错误
                    filename: event.target.src || event.target.href,
                    tagName: event.target.tagName.toLowerCase(), //SCRIPT
                    selector: getSelector(event.target),
                    code: 1,
                };
            } else {
                log = {
                    kind: 'stability', //监控指标大类
                    type: 'error', // 小类型
                    errorType: 'jsError', //JS执行错误
                    message: event.message, //报错信息
                    filename: event.filename,
                    position: `${event.lineno}:${event.colno}`,
                    stack: getLines(event.error.stack),
                    selector: lastEvent ? getSelector(lastEvent.path) : '',
                    code: 2,
                };
            }

            debugLogger('发送错误指标埋点, 埋点内容 => ', log);
            context.report.handleLog(log);
        },
        true
    );
    window.addEventListener(
        'unhandledrejection',
        function (event) {
            let lastEvent = getLastEvent();
            let message,
                filename,
                lineno = 0,
                colno = 0,
                stack = '',
                reason = event.reason;
            if (typeof reason === 'string') {
                message = reason;
            } else if (typeof reason === 'object') {
                if (reason.stack) {
                    let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
                    message = reason.message;
                    filename = matchResult[1];
                    lineno = matchResult[2];
                    colno = matchResult[3];
                }
                stack = getLines(reason.stack);
            }

            const log = {
                kind: 'stability', //监控指标大类
                type: 'error', // 小类型
                errorType: 'promiseError', //JS执行错误
                message, //报错信息
                filename,
                position: `${lineno}:${colno}`,
                stack,
                selector: lastEvent ? getSelector(lastEvent.path) : '',
                code: 3,
            };

            debugLogger('发送错误指标埋点, 埋点内容 => ', log);
            context.report.handleLog(log);
        },
        true
    );

    function getLines(stack) {
        return stack
            .split('\n')
            .slice(1)
            .map((item) => item.replace(/^\s+at\s+/g, ''))
            .join('^');
    }
}
