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

    // let autoUpdater listen to error event; but why we need to do a condition check to see status of isUpdating.

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
                // if the button index is select as 0; set the downloadAndInstall to true;
                downloadAndInstall = true
                if (!progressBar) {

                    //after you set the downloadAndInstall as true;
                    // show the progress bar
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


    //progressbar is already there and show the progress bar value;
    autoUpdater.on("download-progress", progress => {
        progressBar.value = progress.percent
    })

    autoUpdater.on("update-downloaded", () => {
        console.log("Update downloaded")
        isUpdating = false
        // again, we need to set the status for this isUpdating back to false, 
        // actually always set this to true only when the download is in progress but why this is the 
        // case .

        if (progressBar) {
            progressBar.setCompleted()
            progressBar = null
            //indicate the download progress finishes and set the progressBar back to null
            // does this mean it close the progress bar
        }

        // If download and install was selected then quit and install
        if (downloadAndInstall && onQuitAndInstall) {
            onQuitAndInstall(autoUpdater)
            downloadAndInstall = false
            //not sure why this line of code is needed.
        }
    })

    autoUpdater.checkForUpdates()
    //this line of code is self explainatory; check always set the autoUpdater to check for updates.
    //then all there will be some event that triggers that all the event listener we have set in above.
}

// the whole file is only a giant function



export { checkForUpdate }