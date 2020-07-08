import { merge, clone, get, isFunction } from 'lodash-es';
import DEFAULT_CONFIG from '../config/index';
import debugLogger from './utils/debugLogger';
import Report from './report/index';
import context from './context/index';
import * as monitorItems from './monitor-items/index';
import dig from './dig';

const _ = {
    merge,
    clone,
    get,
    isFunction,
};

// 初始化函数，这里会初始化 jserror xhr timint...
function init() {
    // monitor设置config数据，set结束时需要对config进行一次判断，判断必填项的值是否完整有效，如果符合要求
    // 则会标志当前的monitor的状态
    function set(customerConfig = {}, isOverWrite = false) {
        // 如果已经set并且参数正常，则无法再次设置
        if (context.isReady) return;
        // 保存原始config
        let commonConfig = _.clone(DEFAULT_CONFIG);

        // 判断是否覆盖config
        if (isOverWrite) {
            commonConfig = { ...customerConfig };
        } else {
            _.merge(commonConfig, customerConfig);
        }

        // 更新context中的config属性
        context.config = commonConfig;

        let isDevMode = _.get(commonConfig, ['mode'], _.get(DEFAULT_CONFIG, ['mode'])) === 'developmnt';

        const unValidityConfig = [];

        // 检测配置项
        const digUrl = _.get(commonConfig, ['url'], '');
        if (digUrl === '') {
            debugLogger('警告: 未设置监控数据上报地址, 无法上报数据');
            unValidityConfig.push('config.url');
        }

        const uuid = _.get(commonConfig, ['uuid'], '');
        if (uuid === '') {
            debugLogger('警告: 未设置uuid(设备唯一标识), 无法统计设备分布数等信息');
        }

        const ucid = _.get(commonConfig, ['ucid'], '');
        if (ucid === '') {
            debugLogger('警告: 未设置ucid(用户唯一标识), 无法统计新增用户数');
        }

        const checkNeedReportFunc = _.get(commonConfig, ['checkNeedReport']);
        if (_.isFunction(checkNeedReportFunc) === false) {
            debugLogger('警告: config.checkNeedReport 不是可执行函数, 将导致打点数据上报异常');
            unValidityConfig.push('config.checkNeedReport');
        }

        const getPageTypeFunc = _.get(commonConfig, ['getPageType']);
        if (_.isFunction(getPageTypeFunc) === false) {
            debugLogger('警告: config.getPageType 不是可执行函数, 将导致打点数据异常!');
            unValidityConfig.push('config.getPageType');
        }

        if (unValidityConfig.length > 0) {
            debugLogger('配置参数缺失或者不符合要求，需重新设置', unValidityConfig);
        } else {
            if (isDevMode) {
                debugLogger('配置更新完毕');
                debugLogger('当前为测试模式');
                debugLogger('Tip: 测试模式下打点数据仅供浏览, 不会展示在系统中');
                debugLogger('更新后配置为:', commonConfig);
            }
            // 标志monitor可以开始上报
            context.isReady = true;
        }
    }

    // 初始化report
    // report只处理日志上报，并且会上报，不分辨log的kind
    // 初始化的时候会判断log队列的长度，同时需要判断判断set方法是否被调用，如果调用，需要判断config的
    // 关键字段是否符合要求，如果不符合要求，则会在控制台警告，log列表会存在内存中
    // 等待set方法重新执行
    context.report = new Report(dig);
    context.report.init();

    // 执行所有监听函数
    Object.keys(monitorItems).forEach((fnName) => monitorItems[fnName]());

    // 停止monitor, 停止之后。将不会上报log至服务端，但是日志会继续保存
    function stopDig() {
        context.isReady = false;
    }

    // 重启monitor，更改配置中isReady选项
    function reStart() {
        context.isReady = true;
        // 执行report中尝试上报函数
        context.report.trytoReport();
    }

    // 初始化设置config为默认的配置
    context.config = _.clone(DEFAULT_CONFIG);

    const monitor = {
        setOptions: set,
        context,
        stop: stopDig,
        reStart,
    };

    debugLogger('monitor初始化完毕');
    debugLogger('monitor开始收集监控日志');
    debugLogger('等待设置monitor配置信息，设置完成之后，monitor会自动上报日志');
    return monitor;
}

export default init();
