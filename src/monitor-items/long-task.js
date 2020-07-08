import getLastEvent from '../utils/getLastEvent';
import getSelector from '../utils/getSelector';
import context from '../context/index';
import debugLogger from '../utils/debugLogger';

export default function () {
    if (!context.isSupportPerformanceObserver && !window.requestIdleCallback) return;

    new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.duration > 100) {
                let lastEvent = getLastEvent();
                requestIdleCallback(() => {
                    const log = {
                        kind: 'experience',
                        type: 'longTask',
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
