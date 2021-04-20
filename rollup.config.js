const { join } = require('path')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const alias = require('@rollup/plugin-alias')
const externals = require('rollup-plugin-node-externals')
const multiInput = require('rollup-plugin-multi-input').default
const json = require('@rollup/plugin-json')

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
    external: [
        'electron',
        'electron-store',
    ],
    plugins: [
        multiInput(),
        nodeResolve({ preferBuiltins: true }),
        commonjs({ transformMixedEsModules:true }),
        alias({
            entries: [
                { find: '@', replacement: root },
                { find: '~', replacement: root },
                { find: '@app', replacement: join(__dirname, 'app', 'src') },
            ],
        }),
        externals(),
        json(),
    ],
}
