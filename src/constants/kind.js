// 大类 kind
const LOG_KIND_STABILITY = 'stability'; // 错误日志
const LOG_KIND_BUSINESS = 'business'; // 产品指标
const LOG_KIND_EXPERIENCE = 'experience'; // 性能指标
const LOG_KIND_BEHAVIOR = 'behavior'; // 行为指标

// type 类型包含 error（runtime error; promise error loadResource error）paint stayTime pv ....
const LOAD_RESOURCE_ERROR = 'LOAD_RESOURCE_ERROR';
const RUNTIME_ERROR = 'RUNTIME_ERROR';
const PROMISE_ERROR = 'PROMISE_ERROR';
const XHR_RELATED = 'XHR_RELATED';
const BLANK_SCREEN = 'BLANK_SCREEN';
const PV = 'PV';
const ONLINE_DURATION = 'ONLINE_DURATION';
const LONG_TASK = 'LONG_TASK';
const PERF_TIMING = 'PERFORMANCE_TIMING';
const PERF_PAINT = 'PERF_PAINT';
const FIRST_INPUT_DELAY = 'FIRST_INPUT_DELAY';

const LOG_KIND_MAP = {
    1000: LOG_KIND_STABILITY,
    2000: LOG_KIND_BUSINESS,
    3000: LOG_KIND_EXPERIENCE,
    4000: LOG_KIND_BEHAVIOR,
};

const TYPE_CODE_MAP = {
    1: LOAD_RESOURCE_ERROR,
    2: RUNTIME_ERROR,
    3: PROMISE_ERROR,
    4: XHR_RELATED,
    601: BLANK_SCREEN,
    1001: PV,
    1002: ONLINE_DURATION,
    2001: LONG_TASK,
    2002: PERF_TIMING,
    2003: PERF_PAINT,
    2004: FIRST_INPUT_DELAY,
};

export { LOG_KIND_MAP, TYPE_CODE_MAP };
