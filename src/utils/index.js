import { merge, clone, get, isFunction } from 'lodash-es';
import debugLogger from './debugLogger';
import getLastEvent from './getLastEvent';
import getSelector from './getSelector';

/**
 * debounce
 *
 * @param {Function} func 实际要执行的函数
 * @param {Number} delay 延迟时间，单位是 ms
 * @param {Function} callback 在 func 执行后的回调
 *
 * @return {Function}
 */
function debounce(func, delay, callback) {
    var timer;

    return function () {
        var context = this;
        var args = arguments;

        clearTimeout(timer);

        timer = setTimeout(function () {
            func.apply(context, args);

            !callback || callback();
        }, delay);
    };
}

export default {
    merge,
    clone,
    get,
    isFunction,
    debounce,
    debugLogger,
    getLastEvent,
    getSelector,
};

export { merge, clone, get, isFunction, debounce, debugLogger, getLastEvent, getSelector };
