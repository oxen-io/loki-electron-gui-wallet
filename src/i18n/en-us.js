export default {
  buttons: {
    // All button text is uppercased in the gui
    advanced: "ADVANCED",
    all: "ALL",
    back: "BACK",
    browse: "BROWSE",
    cancel: "CANCEL",
    change: "CHANGE",
    check: "CHECK",
    clear: "CLEAR",
    close: "CLOSE",
    contacts: "CONTACTS",
    copyAddress: "COPY ADDRESS",
    copySignature: "COPY SIGNATURE",
    createWallet: "CREATE WALLET",
    decrypt: "DECRYPT",
    delete: "DELETE",
    edit: "EDIT",
    export: "EXPORT",
    generate: "GENERATE",
    import: "IMPORT",
    importWallet: "IMPORT WALLET | IMPORT WALLETS",
    lns: "LOKI NAME SERVICE",
    max: "MAX",
    min: "MIN",
    next: "NEXT",
    openWallet: "OPEN WALLET",
    purchase: "PURCHASE",
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
    serviceNode: "SERVICE NODES",
    settings: "SETTINGS",
    showQRCode: "SHOW QR CODE",
    showTxDetails: "SHOW TX DETAILS",
    stake: "STAKE",
    sweepAll: "SWEEP ALL",
    unlock: "UNLOCK",
    update: "UPDATE",
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
      message:
        "There is a payment id associated with this address.\nBe sure to copy the payment id separately."
    },
    copyPrivateKeys: {
      // Copy {seedWords/viewKey/spendKey}
      title: "Copy {type}",
      message:
        "Be careful who you send your private keys to as they control your funds.",
      seedWords: "Seed Words",
      viewKey: "View Key",
      spendKey: "Spend Key"
    },
    deleteWallet: {
      title: "Delete wallet",
      message:
        "Are you absolutely sure you want to delete your wallet?\nMake sure you have your private keys backed up.\nTHIS PROCESS IS NOT REVERSIBLE!",
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
    lnsUpdate: {
      title: "Update LNS record",
      message: "Do you want to update the LNS record?",
      ok: "UPDATE"
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
    purchase: {
      title: "Purchase name",
      message: "Do you want to purchase the name?",
      ok: "PURCHASE"
    },
    registerServiceNode: {
      title: "Register service node",
      message: "Do you want to register the service node?",
      ok: "REGISTER"
    },
    rescan: {
      title: "Rescan wallet",
      message:
        "Warning: Some information about previous transactions\nsuch as the recipient's address will be lost.",
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
    sweepAll: {
      title: "Sweep all",
      message: "Do you want to sweep all?",
      ok: "SWEEP ALL"
    },
    sweepAllWarning: {
      title: "Sweep all warning",
      message:
        "You are about to combine all of your unspent funds by sending a transaction to yourself, your wallet may show a balance of 0 temporarily, after 10 blocks your funds will unlock and you may stake normally.",
      ok: "CONTINUE"
    },
    switchWallet: {
      title: "Switch wallet",
      closeMessage: "Are you sure you want to close the current wallet?",
      restartMessage:
        "The wallet RPC is currently syncing. \nIf you wish to switch wallets then you must restart the application. \nYou will lose your syncing progress and have to rescan the blockchain again.",
      restartWalletMessage:
        "If you wish to switch wallets then you must restart the application. Are you sure you want to close the current wallet and restart?"
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
    confirmTransaction: {
      title: "Confirm transaction",
      sendTo: "Send to",
      priority: "Priority"
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
    },
    unlockServiceNodeWarning: {
      title: "Unlock service node warning",
      message:
        "Unlocking a partial stake in a node will also unstake for any other participants, if staking in a shared node its best to let the operator and other participants know you are unstaking.",
      ok: "CONTINUE"
    }
  },
  fieldLabels: {
    // Field labels are also all uppercased
    address: "ADDRESS",
    amount: "AMOUNT",
    backupOwner: "BACKUP OWNER",
    confirmPassword: "CONFIRM PASSWORD",
    daemonLogLevel: "DAEMON LOG LEVEL",
    daemonP2pPort: "DAEMON P2P PORT",
    daemonZMQPort: "DAEMON ZMQ PORT",
    dataStoragePath: "DATA STORAGE PATH",
    decryptRecord: "DECRYPT RECORD",
    filter: "FILTER",
    filterTransactionType: "FILTER BY TRANSACTION TYPE",
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
    message: "MESSAGE",
    mnemonicSeed: "MNEMONIC SEED",
    name: "NAME",
    newWalletName: "NEW WALLET NAME",
    notes: "NOTES",
    optional: "OPTIONAL",
    owner: "OWNER",
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
    sessionId: "SESSION ID",
    signature: "SIGNATURE",
    transactionId: "TRANSACTION ID",
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
    wallet: "Wallet",
    updateRequired: "UPDATE REQUIRED"
  },
  menuItems: {
    about: "About",
    changePassword: "Change Password",
    copyAddress: "Copy address",
    copyBackupOwner: "Copy backup owner",
    copyName: "Copy name",
    copyOwner: "Copy owner",
    copyQR: "Copy QR code",
    copySeedWords: "Copy seed words",
    copySessionId: "Copy session ID",
    copySpendKey: "Copy spend key",
    copyServiceNodeKey: "Copy service node key",
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
      backupOwnerCopied: "Backup owner copied to clipboard",
      bannedPeer: "Banned {host} until {time}",
      copied: "{item} copied to clipboard",
      decryptedLNSRecord: "Successfully decrypted LNS Record for {name}",
      itemSaved: "{item} saved to {filename}",
      keyImages: {
        exported: "Key images exported to {filename}",
        imported: "Key images imported"
      },
      lnsRecordUpdated: "LNS Record was successfully updated",
      passwordUpdated: "Password updated",
      namePurchased: "Name successfully purchased",
      nameCopied: "Name copied to clipboard",
      ownerCopied: "Owner copied to clipboard",
      qrCopied: "QR code copied to clipboard",
      registerServiceNodeSuccess: "Successfully registered service node",
      sendSuccess: "Transaction successfully sent",
      serviceNodeInfoFilled: "Service node key and min amount filled",
      sessionIdCopied: "Session ID copied to clipboard",
      signatureCopied: "Signature copied to clipboard",
      stakeSuccess: "Successfully staked",
      transactionNotesSaved: "Transaction notes saved"
    },
    errors: {
      banningPeer: "Error banning peer",
      cannotAccessRemoteNode:
        "Could not access remote node, please try another remote node",
      changingPassword: "Error changing password",
      copyWalletFail: "Failed to copy wallet",
      copyingPrivateKeys: "Error copying private keys",
      dataPathNotFound: "Data storage path not found",
      decryptLNSRecord: "Failed to decrypt LNS Record for {name}",
      differentNetType: "Remote node is using a different nettype",
      enterSeedWords: "Enter seed words",
      enterTransactionId: "Enter transaction ID",
      enterTransactionProof: "Enter transaction proof",
      enterWalletName: "Enter a wallet name",
      enterName: "Enter a name",
      errorSavingItem: "Error saving {item}",
      failedServiceNodeUnlock: "Failed to unlock service node",
      failedToSetLanguage: "Failed to set language: {lang}",
      failedWalletImport: "Failed to import wallet",
      failedWalletOpen: "Failed to open wallet. Please try again.",
      failedWalletRead: "Failed to read wallets",
      internalError: "Internal error",
      invalidAddress: "Address not valid",
      invalidAmount: "Amount not valid",
      invalidBackupOwner: "Backup owner address not valid",
      invalidNameLength: "Name must be between 1 and 64 characters long",
      invalidNameFormat:
        "Name may only contain alphanumerics, hyphens and underscore",
      invalidNameHypenNotAllowed:
        "Name may only begin or end with alphanumerics or an underscore",
      invalidOldPassword: "Invalid old password",
      invalidOwner: "Owner address not valid",
      invalidPassword: "Invalid password",
      invalidPaymentId: "Payment id not valid",
      invalidPrivateViewKey: "Invalid private viewkey",
      invalidPublicAddress: "Invalid public address",
      invalidRestoreDate: "Invalid restore date",
      invalidRestoreHeight: "Invalid restore height",
      invalidSeedLength: "Invalid seed word length",
      invalidServiceNodeCommand:
        "Please enter the service node registration command",
      invalidServiceNodeKey: "Service node key not valid",
      invalidSessionId: "Session ID not valid",
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
      selectWalletFile: "Select a wallet file",
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
    filterTx: "Enter an ID, name, address or amount",
    hexCharacters: "{count} hexadecimal characters",
    lnsName: "The name to purchase via Loki Name Service",
    lnsBackupOwner: "The wallet address of the backup owner",
    lnsDecryptName: "A LNS name that belongs to you",
    mnemonicSeed: "25 (or 24) word mnemonic seed",
    pasteTransactionId: "Paste transaction ID",
    pasteTransactionProof: "Paste transaction proof",
    proveOptionalMessage:
      "Optional message against which the signature is signed",
    recipientWalletAddress: "Recipient's wallet address",
    selectAFile: "Please select a file",
    sessionId: "The Session ID to link to Loki Name Service",
    transactionNotes: "Additional notes to locally attach to the transaction",
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
      primaryAddress: "Primary address",
      subAddress: "Sub-address",
      subAddressIndex: "Index {index}"
    },
    advancedOptions: "Advanced Options",
    awaitingConfirmation: "Awaiting confirmation",
    bannedPeers: {
      title: "Banned peers (bans will cleared if wallet is restarted)",
      bannedUntil: "Banned until {time}"
    },
    blockHeight: "Height",
    checkTransaction: {
      description:
        "Verify that funds were paid to an address by supplying the transaction ID, the recipient address, the message used for signing and the signature.\nFor a 'Spend Proof' you dont need to provide the recipient address.",
      infoTitles: {
        confirmations: "Confirmations",
        inPool: "In pool",
        validTransaction: "Valid transaction",
        received: "Received amount"
      },
      validTransaction: {
        no: "NO",
        yes: "YES"
      }
    },
    closing: "Closing",
    connectingToBackend: "Connecting to backend",
    contribution: "Contribution",
    contributor: "Contributor",
    daemon: {
      local: {
        title: "Local Daemon Only",
        description:
          "Full security, wallet will download the full blockchain. You will not be able to transact until sync is completed."
      },
      localRemote: {
        title: "Local + Remote Daemon",
        description:
          "Get started quickly with this default option. Wallet will download the full blockchain, but use a remote node while syncing."
      },
      remote: {
        title: "Remote Daemon Only",
        description:
          "Less security, wallet will connect to a remote node to make all transactions."
      }
    },
    destinationUnknown: "Destination Unknown",
    editAddressBookEntry: "Edit address book entry",
    lnsDescription:
      "Purchase or update a name for a Session ID. If you purchase a name, it may take a minute or two for it to show up in the list.",
    loadingSettings: "Loading settings",
    lokiBalance: "Balance",
    lokiUnlockedBalance: "Unlocked balance",
    lokiUnlockedShort: "Unlocked",
    me: "Me",
    noTransactionsFound: "No transactions found",
    notes: "Notes",
    numberOfUnspentOutputs: "Number of unspent outputs",
    operator: "Operator",
    paymentID: "Payment ID",
    peerList: "Peer list",
    priorityOptions: {
      automatic: "Automatic",
      slow: "Slow",
      normal: "Normal",
      fast: "Fast",
      fastest: "Fastest",
      blink: "Blink"
    },

    proveTransactionDescription:
      "Generate a proof of your incoming/outgoing payment by supplying the transaction ID, the recipient address and an optional message.\nFor the case of outgoing payments, you can get a 'Spend Proof' that proves the authorship of a transaction. In this case, you don't need to specify the recipient address.",
    readingWalletList: "Reading wallet list",
    recentIncomingTransactionsToAddress:
      "Recent incoming transactions to this address",
    recentTransactionsWithAddress: "Recent transactions with this address",
    rescanModalDescription:
      "Select full rescan or rescan of spent outputs only.",
    saveSeedWarning: "Please copy and save these in a secure location!",
    saveToAddressBook: "Save to address book",
    seedWords: "Seed words",
    selectLanguage: "Select language",
    serviceNodeContributionDescription:
      "Staking contributes to the safety of the Loki network. For your contribution, you earn LOKI. Once staked, you will have to wait either 15 or 30 days to have your Loki unlocked, depending on if a stake was unlocked by a contributor or the node was deregistered. To learn more about staking, please visit the",
    serviceNodeRegistrationDescription:
      'Enter the {registerCommand} command produced by the daemon that is registering to become a Service Node using the "{prepareCommand}" command',
    serviceNodeStartStakingDescription:
      "To start staking, please visit the Staking tab",
    noServiceNodesCurrentlyAvailable:
      "There are currently no service nodes available for contribution",
    serviceNodeDetails: {
      contributors: "Contributors",
      lastRewardBlockHeight: "Last reward block height",
      lastUptimeProof: "Last uptime proof",
      maxContribution: "Max contribution",
      minContribution: "Min contribution",
      operatorFee: "Operator Fee",
      registrationHeight: "Registration height",
      unlockHeight: "Unlock height",
      reserved: "Reserved",
      serviceNodeKey: "Service Node Key",
      snKey: "SN Key",
      stakingRequirement: "Staking requirement",
      totalContributed: "Total contributed"
    },
    spendKey: "Spend key",
    startingDaemon: "Starting daemon",
    startingWallet: "Starting wallet",
    switchToDateSelect: "Switch to date select",
    switchToHeightSelect: "Switch to height select",
    syncingDaemon: "Syncing Daemon",
    transactionID: "Transaction ID",
    transactionConfirmed: "confirmed",
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
    unlockingAtHeight: "Unlocking at height {number}",
    unspentOutputs: "Unspent outputs",
    userNotUsedAddress: "You have not used this address",
    userUsedAddress: "You have used this address",
    viewKey: "View key",
    viewOnlyMode:
      "View only mode. Please load full wallet in order to send coins.",
    website: "website"
  },
  titles: {
    addressBook: "Address book",
    addressDetails: "Address details",
    advanced: {
      checkTransaction: "CHECK TRANSACTION",
      prove: "PROVE"
    },
    availableForContribution: "Service nodes available for contribution",
    changePassword: "Change password",
    configure: "Configure",
    currentlyStakedNodes: "Currently staked nodes",
    lnsRecordDetails: "LNS record details",
    privateKeys: "Private keys",
    rescanWallet: "Rescan wallet",
    serviceNode: {
      registration: "REGISTRATION",
      staking: "STAKING",
      myStakes: "MY STAKES"
    },
    serviceNodeDetails: "Service node details",
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
};
