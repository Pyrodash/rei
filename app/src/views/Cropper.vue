<template>
    <div v-if="isMac" class="topBar" />
    <canvas
        id="editor"
        ref="canvas"
        @pointerdown="onMouseDown"
        @pointermove="onMouseMove"
        @pointerup="onMouseUp"
    />
</template>

<script>
const dpr = window.devicePixelRatio || 1

export default {
    data() {
        return {
            image: null,
            rect: {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            },
            dragging: false,
        }
    },
    computed: {
        isMac() {
            return navigator.platform.toUpperCase().indexOf('MAC') >= 0
        },
        scaledRect() {
            const rect = {}

            for (var i in this.rect) {
                rect[i] = this.rect[i] * dpr
            }

            return rect
        },
        ctx() {
            const { canvas } = this.$refs

            return canvas.getContext('2d')
        }
    },
    methods: {
        onWindowResize() {
            const { canvas } = this.$refs
            const ctx = canvas.getContext('2d')

            const width = window.innerWidth
            const height = window.innerHeight

            canvas.width = width * dpr
            canvas.height = height * dpr

            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`

            ctx.scale(dpr, dpr)
        },
        onMouseDown(e) {
            const { canvas } = this.$refs
            
            this.rect.x = e.pageX - canvas.offsetLeft
            this.rect.y = e.pageY - canvas.offsetTop

            this.rect.width = 0
            this.rect.height = 0

            this.dragging = true
            canvas.setPointerCapture(e.pointerId)
        },
        onMouseMove(e) {
            if (this.dragging) {
                const { canvas } = this.$refs

                this.rect.width = (e.pageX - canvas.offsetLeft) - this.rect.x
                this.rect.height = (e.pageY - canvas.offsetTop) - this.rect.y

                this.render()
            }
        },
        onMouseUp(e) {
            this.$refs.canvas.releasePointerCapture(e.pointerId)
            this.dragging = false

            if (this.rect.width && this.rect.height) {
                window.api.capture({
                    type: 'screenshot',
                    rect: this.scaledRect,
                })
            }
        },
        clear() {
            const { canvas } = this.$refs
            const ctx = canvas.getContext('2d')

            ctx.clearRect(0, 0, canvas.width, canvas.height)
        },
        renderRect() {
            const { ctx } = this

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'

            ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height)
            ctx.strokeRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height)
        },
        renderImage() {
            const { canvas } = this.$refs
            const ctx = canvas.getContext('2d')

            this.ctx.drawImage(this.image, 0, 0, canvas.width / dpr, canvas.height / dpr)
        },
        render() {             
            this.clear()
            this.renderImage()
            this.renderRect()
        },
        load(url) {
            const image = new Image()
            
            image.onload = () => {
                this.image = image
                this.render()
                
                window.api.cropperReady()
            }

            image.src = url
        }
    },
    mounted() {
        this.onWindowResize()
        window.addEventListener('resize', this.onWindowResize)
        window.api.getImage().then(this.load)
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.onWindowResize)
    },
}
</script>

<style scoped>
/* topBar is used to dim a border in transparent windows on macOS */
.topBar {
    display:  none;
    position: fixed;
    top: 0;
    left: 0;
    background: #000;
    height: 1px;
    width: 100%
}

@media (prefers-color-scheme: dark) {
    .topBar {
        display: block;
    }
}
</style>