import context from '../context/index';
import { get, debugLogger } from '../utils/index';

export default function () {
    const isNeedReport = get(context, ['config', 'record', 'blank']);

    if (!isNeedReport) {
        return debugLogger(`config.record.blank值为false, 跳过白屏指标打点`);
    }

    let wrapperElement = ['html', 'body', '#container', '.content'];

    let emptyPoints = 0;

    function getSelector(element) {
        if (element.id) {
            return '#' + element.id;
        } else if (element.className) {
            return (
                '.' +
                element.className
                    .split(' ')
                    .filter((item) => !!item)
                    .join('.')
            );
        } else {
            return element.nodeName.toLowerCase();
        }
    }

    function isWrapper(element) {
        if (!element) return;
        let selector = getSelector(element);
        // 判断检测的点是存在wrapperElement，如果存在，则说明检测点为空白内容
        if (wrapperElement.indexOf(selector) !== -1) {
            emptyPoints++;
        }
    }

    // onload执行判断白屏检测点数
    window.addEventListener(
        'load',
        function () {
            if (!document.elementsFromPoint) return;
            for (let i = 1; i <= 9; i++) {
                let xElement = document.elementsFromPoint((window.innerWidth * i) / 10, window.innerHeight / 2);
                let yElement = document.elementsFromPoint(window.innerWidth / 2, (window.innerHeight * i) / 10);
                isWrapper(xElement[0]);
                isWrapper(yElement[0]);
            }

            if (emptyPoints >= 18) {
                let centerElements = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight / 2);

                const log = {
                    emptyPoints,
                    screen: window.screen.width + 'X' + window.screen.height,
                    viewPoint: window.innerWidth + 'X' + window.innerHeight,
                    selector: getSelector(centerElements[0]),
                    code: 601,
                };

                debugLogger('发送白屏指标埋点, 埋点内容 => ', log);
                context.report.handleLog(log);
            }
        },
        false
    );
}
