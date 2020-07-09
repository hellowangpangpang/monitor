let defalutConfig = {
    url: '',
    uuid: '',
    pid: '',
    mode: process.env.NODE_ENV, // 默认为项目运行的环境
    ready: false,
    record: {
        resource_error: true,
        js_error: true,
        promise_error: true,
        xhr: true,
        blank: true,
        pv: true,
        online_duration: true,
        long_task: true,
        timing: true,
        paint: true,
        first_input_delay: true,
    },
    // 配置是否需要上报的函数，会在report最后进行判断，可能会导致record配置项在特定情况失效
    checkNeedReport: function (log) {
        if (log.isTest) {
            return false;
        }
        return true;
    },
    //
    formatLog: function (log) {
        return log;
    },
    version: '1.0.0',
    getPageType: function (location) {
        return `${location.host}${location.pathname}`;
    },
};

export default defalutConfig;
