import babel from 'rollup-plugin-babel';

export default {
    input: './src/index.js',
    output: {
        file: './lib/monitor.js',
        format: 'umd',
        name: 'hasagei',
    },
    watch: {
        exclude: 'node_modules/**',
    },
    plugins: [
        babel({
            babelrc: false,
            presets: ['@babel/preset-env'],
        }),
    ],
};
