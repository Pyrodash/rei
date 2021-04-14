const { join } = require('path')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const alias = require('@rollup/plugin-alias')
const externals = require('rollup-plugin-node-externals')
const multiInput = require('rollup-plugin-multi-input').default

const root = join(__dirname, 'src')

module.exports = {
    input: [
        join(root, 'index.js'),
        join(root, 'preload.js')
    ],
    output: [
        {
            //file: join(__dirname, 'dist', 'main', 'index.js'),
            dir: join(__dirname, 'dist', 'main'), // multi input
            format: 'cjs',
            sourcemap: true,
            exports: 'auto',
        },
    ],
    plugins: [
        multiInput(),
        nodeResolve({ preferBuiltins: true }),
        commonjs(),
        alias({
            entries: [
                { find: '@', replacement: root },
                { find: '~', replacement: root },
            ],
        }),
        externals(),
    ],
}
