/*
# Testing In Development
You may want to enable this in dev-mode the ensure everything
is working properly. To do this, you'll need to have a config
file called "dev-app-update.yml" in the project's root.
If you're shipping via S3 or another provider, please the
[electron-builder docs](https://github.com/electron-userland/electron-builder/wiki/Publishing-Artifacts).

# Example File
```yml
provider: 'github'
repo: 'loki-electron-gui-wallet'
owner: 'loki-project'
```
Heads up: dev-app-update.yml is in the .gitignore file.
*/

import path from "path"
import { app, dialog } from "electron"
import isDev from "electron-is-dev"
import { autoUpdater } from "electron-updater"

let isUpdating = false

function checkForUpdate () {
    autoUpdater.logger = console
    autoUpdater.autoDownload = false

    autoUpdater.on("error", (err) => {
        if (isUpdating) {
            dialog.showErrorBox("Update Error: ", err == null ? "unknown" : err.message)
            isUpdating = false
            console.error("Error in auto-updater.", err.message)
        }
    })

    autoUpdater.on("checking-for-update", () => {
        console.error("Checking for updates...")
    })

    autoUpdater.on("update-available", info => {
        console.log(`Update available: ${info.version}`)
        dialog.showMessageBox({
            type: "info",
            title: "Update available",
            message: `Update ${info.version} found. Do you want to download the update?`,
            buttons: ["Download", "No"]
        }, (buttonIndex) => {
            if (buttonIndex === 0) {
                isUpdating = true
                autoUpdater.downloadUpdate()
            }
        })
    })

    autoUpdater.on("update-not-available", () => {
        console.log("Update not available")
    })

    autoUpdater.on("update-downloaded", (info) => {
        console.log("Update downloaded")
        isUpdating = false
        let detail = `${app.getName()} ${info.version} is now available. It will be installed the next time you restart the application.`
        if (info.releaseNotes) {
            const splitNotes = info.releaseNotes.split(/[^\r]\n/)
            detail += "\n\nRelease notes:\n"
            splitNotes.forEach(notes => {
                detail += notes + "\n\n"
            })
        }

        dialog.showMessageBox({
            type: "question",
            buttons: ["Install", "Later"],
            defaultId: 0,
            message: `A new version of ${app.getName()} has been downloaded`,
            detail
        }, (buttonIndex) => {
            if (buttonIndex === 0) {
                setTimeout(() => autoUpdater.quitAndInstall(), 100)
            }
        })
    })

    if (isDev) {
        autoUpdater.updateConfigPath = path.join(__dirname, "../../", "dev-app-update.yml")
    }

    autoUpdater.checkForUpdates()
}

export { checkForUpdate }
