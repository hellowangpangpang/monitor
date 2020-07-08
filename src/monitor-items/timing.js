import getLastEvent from '../utils/getLastEvent';
import getSelector from '../utils/getSelector';
import context from '../context/index';
import debugLogger from '../utils/debugLogger';

function load() {
    let timer;
    function check() {
        if (window.performance.timing.loadEventEnd) {
            clearTimeout(timer);
        } else {
            timer = setTimeout(check, 100);
        }
    }
    window.addEventListener('load', check, false);
}

export default function () {
    if (!context.isSupportPerformance) return debugLogger('当前浏览器不支持performance检测');

    let FMP, LCP;
    if (!context.isSupportPerformanceObserver) {
        return debugLogger('当前浏览器不支持performanceObserver检测');
    } else {
        // 增加一个性能条目的观察者
        new PerformanceObserver((entryList, observer) => {
            let perfEntries = entryList.getEntries();
            FMP = perfEntries[0]; //startTime 2000以后
            observer.disconnect(); //不再观察了
        }).observe({ entryTypes: ['element'] }); //观察页面中的意义的元素

        new PerformanceObserver((entryList, observer) => {
            let perfEntries = entryList.getEntries();
            LCP = perfEntries[0];
            observer.disconnect(); //不再观察了
        }).observe({ entryTypes: ['largest-contentful-paint'] }); //观察页面中的意义的元素

        new PerformanceObserver((entryList, observer) => {
            let lastEvent = getLastEvent();
            let firstInput = entryList.getEntries()[0];
            if (firstInput) {
                //processingStart开始处理的时间 startTime开点击的时间 差值就是处理的延迟
                let inputDelay = firstInput.processingStart - firstInput.startTime;
                let duration = firstInput.duration; //处理的耗时
                if (inputDelay > 0 || duration > 0) {
                    const log = {
                        kind: 'experience', //用户体验指标
                        type: 'firstInputDelay', //首次输入延迟
                        inputDelay, //延时的时间
                        duration, //处理的时间
                        startTime: firstInput.startTime,
                        selector: lastEvent ? getSelector(lastEvent.path || lastEvent.target) : '',
                    };
                    debugLogger('发送首次输入延迟埋点, 埋点内容 => ', log);
                    context.report.handleLog(log);
                }
            }
            observer.disconnect(); //不再观察了
        }).observe({ type: 'first-input', buffered: true }); //观察页面中的意义的元素
    }

    //用户的第一次交互 点击页面
    // 定时器结束需要再次判断domContentLoadedTime等参数是否为负数，如果是负数，则需要继续设置定时器
    load(function () {
        setTimeout(() => {
            const {
                fetchStart,
                connectStart,
                connectEnd,
                requestStart,
                responseStart,
                responseEnd,
                domLoading,
                domInteractive,
                domContentLoadedEventStart,
                domContentLoadedEventEnd,
                loadEventStart,
            } = performance.timing;

            const timintLog = {
                kind: 'experience', //用户体验指标
                type: 'timing', //统计每个阶段的时间
                connectTime: connectEnd - connectStart, //连接时间
                ttfbTime: responseStart - requestStart, //首字节到达时间
                responseTime: responseEnd - responseStart, //响应的读取时间
                parseDOMTime: loadEventStart - domLoading, //DOM解析的时间
                domContentLoadedTime: domContentLoadedEventEnd - domContentLoadedEventStart,
                timeToInteractive: domInteractive - fetchStart, //首次可交互时间
                loadTIme: loadEventStart - fetchStart, //完整的加载时间
                code: 2002,
            };

            debugLogger('发送performance指标埋点, 埋点内容 => ', log);
            context.report.handleLog(timintLog);

            let FP = performance.getEntriesByName('first-paint')[0];
            let FCP = performance.getEntriesByName('first-contentful-paint')[0];

            const paintLog = {
                kind: 'experience', //用户体验指标
                type: 'paint', //统计每个阶段的时间
                firstPaint: FP.startTime,
                firstContentfulPaint: FCP.startTime,
                firstMeaningfulPaint: FMP ? FMP.startTime : '',
                largestContentfulPaint: LCP ? LCP.startTime : '',
                code: 2003,
            };

            debugLogger('发送pain性能指标埋点, 埋点内容 => ', log);

            //开始发送性能指标
            context.report.handleLog(paintLog);
        }, 0);
    });
}
