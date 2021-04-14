// renderer app vite config

const { defineConfig } = require('vite')
const { join } = require('path')

const vue = require('@vitejs/plugin-vue')
const externals = require('rollup-plugin-node-externals')

const root = join(__dirname, 'app')

// https://vitejs.dev/config/
module.exports = defineConfig({ 
    root,
    resolve: {
        alias: {
            '@': root,
            '~': root,
        },
    },
    base: './',
    build: {
        outDir: join(__dirname, 'dist', 'renderer'),
        emptyOutDir: true,
        sourcemap: true,
        polyfillDynamicImport: false,
        rollupOptions: {
            plugins: [
                externals()
            ],
        },
    },
    server: {
        port: process.env.PORT || undefined,
    },
    plugins: [
        vue()
    ],
    optimizeDeps: {
        exclude: [
            'electron-is-dev',
            'electron-store',
        ],
    },
})
