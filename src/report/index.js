import { debounce } from '../utils/index';
import { merge, get } from 'lodash-es';
import context from '../context/index';
import ruler from '../constants/ruler';
import debugLogger from '../utils/debugLogger';
const userAgent = require('user-agent');

class Report {
    constructor(dig = null) {
        this.dig = dig;
        this.logList = [];

        this.config = {
            concat: true,
            delay: 3000, // 错误处理间隔时间
            maxLength: 16, // 异常报错数量限制
            sampling: 1, // 采样率
        };

        this.report = debounce(this.basicReport, this.config.delay, () => (this.logList = []));
    }

    // 初始化处理传入的config
    // 生成debounce生成report函数
    // 判断logList是否存在待发送的日志以及monitor配置是否完成，如果完成清空一次logList
    init(config = {}) {
        // 防止多次调用
        if (context.isReady) return;
        merge(this.config, config);
        // 如果组合日志，则设置delay为0
        if (!this.config.concat) this.config.delay = 0;
        // 初始化的时候判断一下log是否存在，如果存在，则会判断是否需要发送
        if (this.logList.length > 0 && context.isReady) this.report(this.logList);

        window.addEventListener('unload', this.beforeUnload.bind(this), false);
        return this;
    }

    // report函数
    // 1：根据config判断logList的每一项是否需要上报，过滤掉无需上报的项，上报剩余符合上报日志
    basicReport(logList = []) {
        const checkNeedReport = get(context, ['config', 'checkNeedReport']);
        const formatLog = get(context, ['config', 'formatLog']);

        const validLog = logList.reduce((prev, current) => {
            let needReport = false;
            const logData = formatLog(current);

            try {
                needReport = checkNeedReport(logData);
            } catch (error) {
                debugLogger('config.checkNeedReport配置项执行错误，可能会导致上报数据异常');
                needReport = true;
            }

            if (needReport) {
                debugLogger('上报日志, 日志内容为=>', logData);
                return prev.concat(logData);
            }

            debugLogger(`${logData.type}未通过checkNeedReport校验，跳过${logData.kind}指标打点`);
            return prev;
        }, []);

        this.dig(validLog);
    }

    // 尝试上报
    tryToReport() {
        if (context.config.isReady && this.logList.length) this.report(this.logList);
    }

    pushLog(log = {}) {
        this.logList.push(log);
    }

    getValidityOfLog(log) {
        const { code } = log;
        // 判断消费规则是否存在，存在就进行判断，如果不存在默认返回true：todo
        if (ruler[code]) {
            const requireFields = ruler[code].df;
            const needFields = requireFields.reduce((prev, current) => (!log.hasOwnProperty(current) ? [...prev, current] : prev), []);
            // 如果不符合直接返回false，不会再次判断config中的配置
            if (needFields.length) return [false, `code: ${code} 要求 ${needFields.join(',')}字段必填`];
        }
        // 默认返回true,执行到这一步说明log为自定义日志，用户可以在config中配置checkNeedReport来决定是否上报
        return [true];
    }

    // 1:判断日志字段是否符合规定，符合规定则进入下一步
    // 2:判断是否可组装日志列表，如果可以则发送整个日志列表，不可以就发送单个日志
    // 3:判断monitor是否ready，符合就调用report进行上报，不符合就直接发送
    handleLog(logData) {
        const [isValid, message = ''] = this.getValidityOfLog(logData);
        // 如果log字段不符合要求，则终止并且提示错误信息
        if (!isValid && message) return debugLogger(message);
        logData = this.enhancerLog(logData);

        // 判断是否需要组合
        const logList = this.config.concat ? (this.pushLog(logData), this.logList) : [logData];

        // 判断monitor状态是否可以上报
        if (!context.isReady) return;

        this.report(logList);
    }

    beforeUnload() {
        if (this.logList.length) {
            if (context.isReady) {
                // report()
                // this.logList = [];
                console.log('直接发送所有的日志');
            } else {
                // 将日志存储到localstorage中，下一次进入页面会读取local中的数据，并且会发送日志
            }
        }
    }

    // 增强log
    enhancerLog(log) {
        return {
            title: document.title,
            url: location.href,
            timestamp: Date.now(),
            userAgent: userAgent.parse(navigator.userAgent).name,
            ...log,
        };
    }
}

export default Report;
