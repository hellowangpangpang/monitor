import context from '../context/index';

export default function () {
    if (context.config.mode === 'development') {
        console.info(...arguments);
    }
}
