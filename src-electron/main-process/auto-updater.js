import { dialog } from "electron"
import isDev from "electron-is-dev"
import { autoUpdater } from "electron-updater"
import ProgressBar from "electron-progressbar"

let progressBar = null
let isUpdating = false
let downloadAndInstall = false

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

        const message = `Update ${info.version} found. Do you want to download the update?`
        const detail = `View the release notes at: https://github.com/loki-project/loki-electron-gui-wallet/releases/tag/v${info.version}`

        dialog.showMessageBox({
            type: "info",
            title: "Update available",
            message,
            detail,
            buttons: ["Download and Install", "Download and Install Later", "No"],
            defaultId: 0
        }, (buttonIndex) => {
            // Download and install
            if (buttonIndex === 0) {
                downloadAndInstall = true
                if (!progressBar) {
                    progressBar = new ProgressBar({
                        indeterminate: false,
                        title: "Downloading...",
                        text: `Downloading wallet v${info.version}`
                    })
                }
            }

            // Download
            if (buttonIndex !== 2) {
                isUpdating = true
                autoUpdater.downloadUpdate()
            }
        })
    })

    autoUpdater.on("download-progress", progress => {
        progressBar.value = progress.percent
    })

    autoUpdater.on("update-downloaded", () => {
        console.log("Update downloaded")
        isUpdating = false

        if (progressBar) {
            progressBar.setCompleted()
            progressBar = null
        }

        // If download and install was selected then quit and install
        if (downloadAndInstall && onQuitAndInstall) {
            onQuitAndInstall(autoUpdater)
            downloadAndInstall = false
        }
    })

    autoUpdater.checkForUpdates()
}

export { checkForUpdate }