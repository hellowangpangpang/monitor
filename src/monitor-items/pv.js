import context from '../context/index';
import debugLogger from '../utils/debugLogger';

export default function () {
    let connection = navigator.connection;
    context.report.handleLog({
        kind: 'business',
        type: 'pv',
        effectiveType: connection.effectiveType, //网络环境
        rtt: connection.rtt, //往返时间
        screen: `${window.screen.width}x${window.screen.height}`, //设备分辨率
        code: 1001,
    });

    // 用户在线时长统计
    const OFFLINE_MILL = 15 * 60 * 1000; // 15分钟不操作认为不在线
    const SEND_MILL = 5 * 1000; // 每5s打点一次

    let lastTime = Date.now();

    window.addEventListener(
        'click',
        () => {
            const now = Date.now();
            const duration = now - lastTime;
            if (duration > OFFLINE_MILL) {
                lastTime = Date.now();
            } else if (duration > SEND_MILL) {
                lastTime = Date.now();
                const log = {
                    kind: 'business',
                    type: 'onlineDuration',
                    duration,
                };
                debugLogger('发送用户留存时间埋点, 埋点内容 => ', log);
                // 用户在线时长
                context.report.handleLog(log);
            }
        },
        false
    );
}
