import { app, ipcMain, BrowserWindow, Menu, dialog } from "electron"
import { version, productName } from "../../package.json"
import { Backend } from "./modules/backend"
import { checkForUpdate } from './auto-updater'
// looks ok by Brian

import menuTemplate from "./menu"
import isDev from "electron-is-dev"
const portscanner = require("portscanner")
const windowStateKeeper = require("electron-window-state")
const path = require("upath")

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
    global.__statics = path.join(__dirname, "statics").replace(/\\/g, "\\\\")
    global.__ryo_bin = path.join(__dirname, "..", "bin").replace(/\\/g, "\\\\")
} else {
    global.__ryo_bin = path.join(process.cwd(), "bin").replace(/\\/g, "\\\\")
}

let mainWindow, backend
let showConfirmClose = true
let forceQuit = false
let installUpdate = false



const title = `${productName} v${version}`

const selectionMenu = Menu.buildFromTemplate([
    { role: "copy" },
    { type: "separator" },
    { role: "selectall" }
])

const inputMenu = Menu.buildFromTemplate([
    { role: "cut" },
    { role: "copy" },
    { role: "paste" },
    { type: "separator" },
    { role: "selectall" }
])

// the above code is to create the menu button based on the template and set
// the template string

function createWindow () {
    /**
     * Initial window options
     */

    let mainWindowState = windowStateKeeper({
        defaultWidth: 900,
        defaultHeight: 700
    })

    mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        minWidth: 640,
        minHeight: 480,
        icon: require("path").join(__statics, "icon_512x512.png"),
        title
    })

    // when a window starts; it has a lot of default GUI setting;
    // it has things like icon title and etc.


    //why does everything starts with close Brian 
    mainWindow.on("close", (e) => {

        if(installUpdate) {
            return
            // by default the installUpdate is set as false but how can we set it to true
        }
        //how does the above function works


        if (process.platform === "darwin") {
            if (forceQuit) {
                forceQuit = false
                //if running on MacOS and see the forceQuit is true and 
                // set back the forceQuit to false but why
                // as the force quit by default is set as false in here anyway
                if (showConfirmClose) {
                    e.preventDefault()
                    mainWindow.show()
                    mainWindow.webContents.send("confirmClose")
                } else {
                    e.defaultPrevented = false
                }
            } else {
                e.preventDefault()
                mainWindow.hide()
            }
        } else {
            if (showConfirmClose) {
                e.preventDefault()
                mainWindow.webContents.send("confirmClose")
            } else {
                e.defaultPrevented = false
            }
        }
    })
    //there is a lot of settings above regarding how the windows behave in
    // the context of the OSX and other OS. I don't fully undersetand so far.


    ipcMain.on("confirmClose", (e, restart) => {
        showConfirmClose = false

        // In dev mode, this will launch a blank white screen
        if (restart && !isDev) app.relaunch()

        if (backend) {
            backend.quit().then(() => {
                backend = null
                app.quit()
            })
        } else {
            app.quit()
        }
    })
    // what happens with devMode? How can run a devMode in electron at and what is the dev mode?



    mainWindow.webContents.on("did-finish-load", () => {
        // Set the title
        mainWindow.setTitle(title)

        require("crypto").randomBytes(64, (err, buffer) => {
            // if err, then we may have to use insecure token generation perhaps
            if (err) throw err

            let config = {
                port: 12313,
                token: buffer.toString("hex")
            }

            portscanner.checkPortStatus(config.port, "127.0.0.1", (e, status) => {
                if (status === "closed") {
                    backend = new Backend(mainWindow)
                    backend.init(config)
                    mainWindow.webContents.send("initialize", config)
                } else {
                    dialog.showMessageBox(mainWindow, {
                        title: "Startup error",
                        message: `Loki Wallet is already open, or port ${config.port} is in use`,
                        type: "error",
                        buttons: ["ok"]
                    }, () => {
                        showConfirmClose = false
                        app.quit()
                    })
                }
            })
        })
    })

    mainWindow.webContents.on("context-menu", (e, props) => {
        const { selectionText, isEditable } = props
        if (isEditable) {
            inputMenu.popup(mainWindow)
        } else if (selectionText && selectionText.trim() !== "") {
            selectionMenu.popup(mainWindow)
        }
    })

    mainWindow.loadURL(process.env.APP_URL)
    mainWindowState.manage(mainWindow)
}

app.on("ready", () => {
    console.log(checkForUpdate, 'definitely is run in here')
    // below part is for checking the auto update; 
    // I don't understand how come this checkForUpdate functions actually takes in 
    checkForUpdate(
        // this bits is super confusing;
        // it basically says we defined an anynoumous function in here;
        // this anonymous function will then interact on of the app event listener to define the behaviour of 
        // 

        autoUpdater => {
        if (mainWindow) {
            mainWindow.webContents.send("showQuitScreen")
        }

        const promise = backend ? backend.quit() : Promise.resolve()
        promise.then(() => {
            installUpdate = true
            backend = null
            autoUpdater.quitAndInstall()
        })
    })


    if (process.platform === "darwin") {
        const menu = Menu.buildFromTemplate(menuTemplate)
        Menu.setApplicationMenu(menu)
    }

    createWindow()
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow()
    } else if (process.platform === "darwin") {
        mainWindow.show()
    }
})

app.on("before-quit", () => {

    if (installUpdate) {
        return
    }

// again why do we need this line of code?

    if (process.platform === "darwin") {
        forceQuit = true
    } else {
        if (backend) {
            backend.quit().then(() => {
                mainWindow.close()
            })
        }
    }
})

app.on("quit", () => {

})
