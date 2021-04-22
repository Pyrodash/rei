const { app, Tray, Menu, nativeImage } = require('electron')
const { join } = require('path')

const Component = require('./component')

module.exports = class TrayComponent extends Component {
    constructor(parent) {
        super(parent)

        this.init()
    }

    init() {
        app.on('ready', () => {
            const imagePath = join(__dirname, '..', '..', 'icon.png')
            const image = nativeImage.createFromPath(imagePath)
            
            const contextMenu = Menu.buildFromTemplate([
                {
                    label: 'Show',
                    type: 'normal',
                    click: () => {
                        this.parent.components.main.show()
                    },
                },
                {
                    label: 'Exit',
                    type: 'normal',
                    click: () => {
                        app.quit()
                    },
                },
            ])
            
            this.tray = new Tray(image.resize({ width: 16, height: 16 }))
            this.tray.setContextMenu(contextMenu)
        })
    }
}
