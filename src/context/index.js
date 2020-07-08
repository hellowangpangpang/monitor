const context = {
    isReady: false, // 是否准备好
    config: {}, // 当前monitor的完整的配置
    isSupportPerformance: window.performance ? true : false, // 是否支持performance
    isSupportPerformanceObserver: window.PerformanceObserver ? true : false, // 是否支持PerformanceObserver
    report: null,
};

export default context;
