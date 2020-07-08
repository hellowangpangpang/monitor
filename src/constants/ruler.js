//编号详情规则数组
const CODE_DETAIL_RULE = {};

// 稳定性指标 code 范围 1~1000 （error：1 ~ 600；其他：601 ~ 1000）
// 产品指标 code 范围 1001 ~ 2000
// 性能指标 code 范围 2001 ~ 3000
// 行为指标 code 范围 3000 ~ 4000 （开发者自定义指标，在校验时会根据范围进行检验，可以在设置config时重写）

// load resource error
CODE_DETAIL_RULE[1] = {
    df: ['kind', 'type', 'errorType', 'filename', 'tagName', 'selector'],
    ef: [],
};

// js runtime error
CODE_DETAIL_RULE[2] = {
    df: ['kind', 'type', 'errorType', 'message', 'filename', 'position', 'stack', 'selector'],
    ef: [],
};

// promise error
CODE_DETAIL_RULE[3] = {
    df: ['kind', 'type', 'errorType', 'message', 'filename', 'position', 'stack', 'selector'],
    ef: [],
};

// xhr
CODE_DETAIL_RULE[4] = {
    df: ['kind', 'type', 'eventType', 'pathname', 'status', 'duration', 'response', 'params'],
    ef: [],
};

// blank白屏
CODE_DETAIL_RULE[601] = {
    df: ['kind', 'type', 'emptyPoints', 'screen', 'viewPoint', 'selector'],
    ef: [],
};

// pv
CODE_DETAIL_RULE[1001] = {
    df: ['kind', 'type', 'effectiveType', 'rtt', 'screen'], //必填字段
    dft: {},
};

// 在线时长
CODE_DETAIL_RULE[1002] = {
    df: ['duration'],
    ef: [],
};

// longTask
CODE_DETAIL_RULE[2001] = {
    df: ['kind', 'type', 'eventType', 'startTime', 'duration', 'selector'],
    ef: [],
};

// perf timing
CODE_DETAIL_RULE[2002] = {
    df: ['kind', 'type', 'connectTime', 'ttfbTime', 'responseTime', 'parseDOMTime', 'domContentLoadedTime', 'timeToInteractive', 'loadTIme'],
    ef: [],
};

// perf paint
CODE_DETAIL_RULE[2003] = {
    df: ['kind', 'type', 'firstPaint', 'firstContentfulPaint', 'firstMeaningfulPaint', 'largestContentfulPaint'],
    ef: ['name'],
    dft: {
        code: 'error_no',
    },
};

// perf firstInputDelay
CODE_DETAIL_RULE[2004] = {
    df: ['kind', 'type', 'inputDelay', 'duration', 'startTime', 'selector'],
    ef: [],
};

export default CODE_DETAIL_RULE;
