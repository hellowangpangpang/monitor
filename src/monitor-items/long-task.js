import context from '../context/index';
import { debugLogger, getLastEvent, getSelector } from '../utils/index';

// https://zhuanlan.zhihu.com/p/39292837
// 关于监控页面卡顿，也可以考虑使用raf来计算每一秒中执行的次数，生成一个连续的FPS数据进行上报
// PerformanceObserver api浏览器支持性不好，对比来说raf更佳

export default function () {
    if (!context.isSupportPerformanceObserver && !window.requestIdleCallback) return;

    new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.duration > 100) {
                let lastEvent = getLastEvent();
                requestIdleCallback(() => {
                    const log = {
                        eventType: lastEvent ? lastEvent.type : '',
                        startTime: entry.startTime, // 开始时间
                        duration: entry.duration, // 持续时间
                        selector: lastEvent ? getSelector(lastEvent.path || lastEvent.target) : '',
                        code: 2001,
                    };
                    debugLogger('发送长时间任务指标，埋点内容 => ', log);
                    context.report.handleLog(log);
                });
            }
        });
    }).observe({ entryTypes: ['longtask'] });
}
