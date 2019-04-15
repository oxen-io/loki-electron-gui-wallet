export default {
    buttons: {
        // All button text is uppercased in the gui
        all: "ALL",
        back: "BACK",
        browse: "BROWSE",
        cancel: "CANCEL",
        change: "CHANGE",
        close: "CLOSE",
        contacts: "CONTACTS",
        copyAddress: "COPY ADDRESS",
        createWallet: "CREATE WALLET",
        delete: "DELETE",
        edit: "EDIT",
        export: "EXPORT",
        import: "IMPORT",
        importWallet: "IMPORT WALLET | IMPORT WALLETS",
        next: "NEXT",
        openWallet: "OPEN WALLET",
        receive: "RECEIVE",
        registerServiceNode: "REGISTER SERVICE NODE",
        rescan: "RESCAN",
        restoreWallet: "RESTORE WALLET",
        save: "SAVE",
        saveTxNotes: "SAVE TX NOTES",
        selectLocation: "SELECT LOCATION",
        selectWalletFile: "SELECT WALLET FILE",
        send: "SEND",
        sendCoins: "SEND COINS",
        serviceNode: "SERVICE NODE",
        settings: "SETTINGS",
        showQRCode: "SHOW QR CODE",
        showTxDetails: "SHOW TX DETAILS",
        stake: "STAKE",
        unlockServiceNode: "UNLOCK SERVICE NODE",
        viewOnExplorer: "VIEW ON EXPLORER"
    },
    dialog: {
        // Generic buttons
        buttons: {
            ok: "OK",
            cancel: "CANCEL",
            open: "OPEN"
        },

        // Dialogs
        banPeer: {
            title: "Ban peer",
            peerDetailsTitle: "Peer details",
            message: "Enter length to ban peer in seconds.\nDefault 3600 = 1 hour.",
            ok: "Ban peer"
        },
        copyAddress: {
            title: "Copy address",
            message: "There is a payment id associated with this address.\nBe sure to copy the payment id separately."
        },
        copyPrivateKeys: {
            // Copy {seedWords/viewKey/spendKey}
            title: "Copy {type}",
            message: "Be careful who you send your private keys to as they control your funds.",
            seedWords: "Seed Words",
            viewKey: "View Key",
            spendKey: "Spend Key"
        },
        deleteWallet: {
            title: "Delete wallet",
            message: "Are you absolutely sure you want to delete your wallet?\nMake sure you have your private keys backed up.\nTHIS PROCESS IS NOT REVERSIBLE!",
            ok: "DELETE"
        },
        exit: {
            title: "Exit",
            message: "Are you sure you want to exit?",
            ok: "EXIT"
        },
        keyImages: {
            title: "{type} key images",
            message: "Do you want to {type} key images?",
            export: "Export",
            import: "Import"
        },
        noPassword: {
            title: "No password set",
            message: "Are you sure you want to create a wallet with no password?",
            ok: "YES"
        },
        password: {
            title: "Password",
            message: "Enter wallet password to continue."
        },
        registerServiceNode: {
            title: "Register service node",
            message: "Do you want to register the service node?",
            ok: "REGISTER"
        },
        rescan: {
            title: "Rescan wallet",
            message: "Warning: Some information about previous transactions\nsuch as the recipient's address will be lost.",
            ok: "RESCAN"
        },
        restart: {
            title: "Restart",
            message: "Changes require restart. Would you like to restart now?",
            ok: "RESTART"
        },
        showPrivateKeys: {
            title: "Show private keys",
            message: "Do you want to view your private keys?",
            ok: "SHOW"
        },
        stake: {
            title: "Stake",
            message: "Do you want to stake?",
            ok: "STAKE"
        },
        switchWallet: {
            title: "Switch wallet",
            closeMessage: "Are you sure you want to close the current wallet?",
            restartMessage: "The wallet RPC is currently syncing. \nIf you wish to switch wallets then you must restart the application. \nYou will lose your syncing progress and have to rescan the blockchain again."
        },
        transactionDetails: {
            title: "Transaction details",
            ok: "CLOSE"
        },
        transfer: {
            title: "Transfer",
            message: "Do you want to send the transaction?",
            ok: "SEND"
        },
        unlockConfirm: {
            title: "Confirm unlock",
            ok: "UNLOCK"
        },
        unlockServiceNode: {
            title: "Unlock service node",
            confirmTitle: "Confirm unlock",
            message: "Do you want to unlock the service node?",
            ok: "UNLOCK"
        }
    },
    fieldLabels: {
        // Field labels are also all uppercased
        address: "ADDRESS",
        amount: "AMOUNT",
        awardRecepientAddress: "AWARD RECEPIENT ADDRESS",
        confirmPassword: "CONFIRM PASSWORD",
        daemonLogLevel: "DAEMON LOG LEVEL",
        daemonP2pPort: "DAEMON P2P PORT",
        daemonZMQPort: "DAEMON ZMQ PORT",
        dataStoragePath: "DATA STORAGE PATH",
        filterTransactionType: "FILTER BY TRANSACTION TYPE",
        filterTxId: "FILTER BY TXID",
        internalWalletPort: "INTERNAL WALLET PORT",
        keyImages: {
            exportDirectory: "KEY IMAGE EXPORT DIRECTORY",
            importFile: "KEY IMAGE IMPORT FILE"
        },
        limitDownloadRate: "LIMIT DOWNLOAD RATE",
        limitUploadRate: "LIMIT UPLOAD RATE",
        localDaemonIP: "LOCAL DAEMON IP",
        localDaemonPort: "LOCAL DAEMON PORT",
        maxIncomingPeers: "MAX INCOMING PEERS",
        maxOutgoingPeers: "MAX OUTGOING PEERS",
        mnemonicSeed: "MNEMONIC SEED",
        name: "NAME",
        newWalletName: "NEW WALLET NAME",
        notes: "NOTES",
        optional: "OPTIONAL",
        password: "PASSWORD",
        paymentId: "PAYMENT ID",
        priority: "PRIORITY",
        remoteNodeHost: "REMOTE NODE HOST",
        remoteNodePort: "REMOTE NODE PORT",
        restoreFromBlockHeight: "RESTORE FROM BLOCK HEIGHT",
        restoreFromDate: "RESTORE FROM DATE",
        seedLanguage: "SEED LANGUAGE",
        serviceNodeCommand: "SERVICE NODE COMMAND",
        serviceNodeKey: "SERVICE NODE KEY",
        walletFile: "WALLET FILE",
        walletLogLevel: "WALLET LOG LEVEL",
        walletName: "WALLET NAME",
        walletRPCPort: "WALLET RPC PORT",
        walletStoragePath: "WALLET STORAGE PATH",

        // These are specific labels which do not get uppercased
        confirmNewPassword: "Confirm New Password",
        newPassword: "New Password",
        oldPassword: "Old Password",
        rescanFullBlockchain: "Rescan full blockchain",
        rescanSpentOutputs: "Rescan spent outputs",
        transactionNotes: "Transaction Notes",
        chooseNetwork: "Choose a Network",
        network: "Network"
    },
    footer: {
        ready: "READY",
        scanning: "SCANNING",
        status: "Status",
        syncing: "SYNCING",
        remote: "Remote",
        wallet: "Wallet"
    },
    menuItems: {
        about: "About",
        changePassword: "Change Password",
        copyAddress: "Copy address",
        copyQR: "Copy QR code",
        copySeedWords: "Copy seed words",
        copySpendKey: "Copy spend key",
        copyTransactionId: "Copy transaction ID",
        copyViewKey: "Copy view key",
        createNewWallet: "Create new wallet",
        deleteWallet: "Delete Wallet",
        exit: "Exit Loki GUI Wallet",
        importOldGUIWallet: "Import wallets from old GUI",
        manageKeyImages: "Manage Key Images",
        openWallet: "Open wallet",
        rescanWallet: "Rescan Wallet",
        restoreWalletFile: "Restore wallet from file",
        restoreWalletSeed: "Restore wallet from seed",
        saveQR: "Save QR code to file",
        sendToThisAddress: "Send to this address",
        settings: "Settings",
        showDetails: "Show details",
        showPrivateKeys: "Show Private Keys",
        showQRCode: "Show QR Code",
        switchWallet: "Switch Wallet",
        viewOnExplorer: "View on explorer"
    },
    notification: {
        positive: {
            addressCopied: "Address copied to clipboard",
            bannedPeer: "Banned {host} until {time}",
            copied: "{item} copied to clipboard",
            itemSaved: "{item} saved to {filename}",
            keyImages: {
                exported: "Key images exported to {filename}",
                imported: "Key images imported"
            },
            passwordUpdated: "Password updated",
            qrCopied: "QR code copied to clipboard",
            registerServiceNodeSuccess: "Successfully registered service node",
            sendSuccess: "Transaction successfully sent",
            stakeSuccess: "Successfully staked",
            transactionNotesSaved: "Transaction notes saved"
        },
        errors: {
            banningPeer: "Error banning peer",
            cannotAccessRemoteNode: "Could not access remote node, please try another remote node",
            changingPassword: "Error changing password",
            copyWalletFail: "Failed to copy wallet",
            copyingPrivateKeys: "Error copying private keys",
            dataPathNotFound: "Data storage path not found",
            differentNetType: "Remote node is using a different nettype",
            enterSeedWords: "Enter seed words",
            enterWalletName: "Enter a wallet name",
            errorSavingItem: "Error saving {item}",
            failedServiceNodeUnlock: "Failed to unlock service node",
            failedToSetLanguage: "Failed to set language: {lang}",
            failedWalletImport: "Failed to import wallet",
            failedWalletOpen: "Failed to open wallet. Please try again.",
            internalError: "Internal error",
            invalidAddress: "Address not valid",
            invalidAmount: "Amount not valid",
            invalidOldPassword: "Invalid old password",
            invalidPassword: "Invalid password",
            invalidPaymentId: "Payment id not valid",
            invalidPrivateViewKey: "Invalid private viewkey",
            invalidPublicAddress: "Invalid public address",
            invalidRestoreDate: "Invalid restore date",
            invalidRestoreHeight: "Invalid restore height",
            invalidSeedLength: "Invalid seed word length",
            invalidServiceNodeCommand: "Please enter the service node registration command",
            invalidServiceNodeKey: "Service node key not valid",
            invalidWalletPath: "Invalid wallet path",
            keyImages: {
                exporting: "Error exporting key images",
                reading: "Error reading key images",
                importing: "Error importing key images"
            },
            negativeAmount: "Amount cannot be negative",
            newPasswordNoMatch: "New passwords do not match",
            newPasswordSame: "New password must be different",
            notEnoughBalance: "Not enough unlocked balance",
            passwordNoMatch: "Passwords do not match",
            remoteCannotBeReached: "Remote daemon cannot be reached",
            unknownError: "An unknown error occurred",
            walletAlreadyExists: "Wallet with name already exists",
            walletPathNotFound: "Wallet data storage path not found",
            zeroAmount: "Amount must be greater than zero"
        },
        warnings: {
            noKeyImageExport: "No key images found to export",
            usingLocalNode: "Could not access remote node, switching to local only",
            usingRemoteNode: "lokid not found, using remote node"
        }
    },
    placeholders: {
        additionalNotes: "Additional notes",
        addressBookName: "Name that belongs to this address",
        enterAnId: "Enter an ID",
        hexCharacters: "{count} hexadecimal characters",
        mnemonicSeed: "25 (or 24) word mnemonic seed",
        selectAFile: "Please select a file",
        transactionNotes: "Additional notes to attach to the transaction",
        walletName: "A name for your wallet",
        walletPassword: "An optional password for the wallet"
    },
    strings: {
        addAddressBookEntry: "Add address book entry",
        addressBookDetails: "Address book details",
        addressBookIsEmpty: "Address book is empty",
        addresses: {
            myPrimaryAddress: "My primary address",
            myUnusedAddresses: "My unused addresses",
            myUsedAddresses: "My used addresses",
            notYourAddress: "Not your address!",
            primaryAddress: "Primary address",
            subAddress: "Sub-address",
            yourPrimaryAddress: "Your primary address",
            yourUnusedAddress: "Your unused address",
            yourUsedAddress: "Your used address"
        },
        advancedOptions: "Advanced Options",
        bannedPeers: {
            title: "Banned peers (bans will cleared if wallet is restarted)",
            bannedUntil: "Banned until {time}"
        },
        blockHeight: "Height",
        transactionConfirmed: "confirmed",
        closing: "Closing",
        connectingToBackend: "Connecting to backend",
        daemon: {
            local: {
                title: "Local Daemon Only",
                description: "Full security, wallet will download the full blockchain. You will not be able to transact until sync is completed."
            },
            localRemote: {
                title: "Local + Remote Daemon",
                description: "Get started quickly with this default option. Wallet will download the full blockchain, but use a remote node while syncing."
            },
            remote: {
                title: "Remote Daemon Only",
                description: "Less security, wallet will connect to a remote node to make all transactions."
            }
        },
        priorityOptions: {
            automatic: "Automatic",
            slow: "Slow",
            normal: "Normal",
            fast: "Fast",
            fastest: "Fastest"
        },
        destinationUnknown: "Destination Unknown",
        editAddressBookEntry: "Edit address book entry",
        loadingSettings: "Loading settings",
        lokiBalance: "Balance",
        lokiUnlockedBalance: "Unlocked balance",
        lokiUnlockedShort: "Unlocked",
        noTransactionsFound: "No transactions found",
        notes: "Notes",
        numberOfUnspentOutputs: "Number of unspent outputs",
        paymentID: "Payment ID",
        peerList: "Peer list",
        readingWalletList: "Reading wallet list",
        recentIncomingTransactionsToAddress: "Recent incoming transactions to this address",
        recentTransactionsWithAddress: "Recent transactions with this address",
        rescanModalDescription: "Select full rescan or rescan of spent outputs only.",
        saveSeedWarning: "Please copy and save these in a secure location!",
        saveToAddressBook: "Save to address book",
        seedWords: "Seed words",
        selectLanguage: "Select language",
        serviceNodeRegistrationDescription: "Enter the {registerCommand} command produced by the daemon that is registering to become a Service Node using the \"{prepareCommand}\" command",
        spendKey: "Spend key",
        startingDaemon: "Starting daemon",
        startingWallet: "Starting wallet",
        switchToDateSelect: "Switch to date select",
        switchToHeightSelect: "Switch to height select",
        transactionID: "Transaction ID",
        transactions: {
            amount: "Amount",
            description: "{type} transaction",
            fee: "Fee",
            paidBySender: "paid by sender",
            received: "Received",
            sent: "Sent",
            sentTo: "{type} transaction sent to",
            timestamp: "Timestamp",
            types: {
                all: "All",
                incoming: "Incoming",
                outgoing: "Outgoing",
                pending: "Pending",
                pendingIncoming: "Pending incoming",
                pendingOutgoing: "Pending outgoing",
                miner: "Miner",
                serviceNode: "Service Node",
                governance: "Governance",
                stake: "Stake",
                failed: "Failed"
            }
        },
        unspentOutputs: "Unspent outputs",
        userNotUsedAddress: "You have not used this address",
        userUsedAddress: "You have used this address",
        viewKey: "View key",
        viewOnlyMode: "View only mode. Please load full wallet in order to send coins."
    },
    titles: {
        addressBook: "Address book",
        addressDetails: "Address details",
        changePassword: "Change password",
        configure: "Configure",
        privateKeys: "Private keys",
        rescanWallet: "Rescan wallet",
        serviceNode: {
            registration: "REGISTRATION",
            staking: "STAKING",
            unlock: "UNLOCK"
        },
        settings: {
            title: "Settings",
            tabs: {
                general: "General",
                language: "Language",
                peers: "Peers"
            }
        },
        transactionDetails: "Transaction details",
        transactions: "Transactions",
        wallet: {
            createNew: "Create new wallet",
            createdOrRestored: "Wallet created/restored",
            importFromFile: "Import wallet from file",
            importFromLegacyGUI: "Import wallet from legacy GUI",
            importFromOldGUI: "Import wallet from old GUI",
            restoreFromSeed: "Restore wallet from seed",
            restoreViewOnly: "Restore view-only wallet"
        },
        welcome: "Welcome",
        yourWallets: "Your Wallets"
    }
}
