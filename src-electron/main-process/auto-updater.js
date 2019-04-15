import { app, dialog } from "electron"
import isDev from "electron-is-dev"
import { autoUpdater } from "electron-updater"

let isUpdating = false

function checkForUpdate (onQuitAndInstall) {
    // Disable for development
    if (isDev) {
        return
    }

    autoUpdater.logger = console
    autoUpdater.autoDownload = false

    autoUpdater.on("error", (err) => {
        if (isUpdating) {
            dialog.showErrorBox("Update Error: ", err == null ? "unknown" : err.message)
            isUpdating = false
            console.error("Error in auto-updater.", err.message)
        }
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
                if (onQuitAndInstall) {
                    onQuitAndInstall(autoUpdater)
                }
            }
        })
    })

    autoUpdater.checkForUpdates()
}

export { checkForUpdate }
