export default {
  buttons: {
    // All button text is uppercased in the gui
    advanced: "ADVANCED",
    all: "ALLES",
    back: "ZURÜCK",
    browse: "DURCHSUCHEN",
    cancel: "ABBRECHEN",
    change: "ÄNDERN",
    check: "CHECK",
    clear: "CLEAR",
    close: "SCHLIESSEN",
    contacts: "KONTAKTE",
    copyAddress: "ADRESSE KOPIEREN",
    copySignature: "COPY SIGNATURE",
    createWallet: "WALLET ERSTELLEN",
    delete: "LÖSCHEN",
    edit: "BEARBEITEN",
    export: "EXPORTIEREN",
    generate: "GENERATE",
    import: "IMPORTIEREN",
    importWallet: "WALLET IMPORTIEREN | WALLETS IMPORTIEREN",
    next: "WEITER",
    openWallet: "WALLET ÖFFNEN",
    receive: "EMPFANGEN",
    registerServiceNode: "SERVICE NODE REGISTRIEREN",
    rescan: "ERNEUT SCANNEN",
    restoreWallet: "WALLET WIEDERHERSTELLEN",
    save: "SPEICHERN",
    saveTxNotes: "TX NOTES SPEICHERN",
    selectLocation: "STANDORT AUSWÄHLEN",
    selectWalletFile: "WALLET DATEU AUSWÄHLEN",
    send: "SENDEN",
    sendCoins: "COINS SENDEN",
    serviceNode: "SERVICE NODE",
    settings: "EINSTELLUNGEN",
    showQRCode: "QR CODE ANZEIGEN",
    showTxDetails: "TX DETAILS ANZEIGEN",
    stake: "STAKE",
    sweepAll: "ALLES BEREINIGEN",
    unlock: "UNLOCK",
    viewOnExplorer: "IN EXPLORER ANZEIGEN"
  },
  dialog: {
    // Generic buttons
    buttons: {
      ok: "OK",
      cancel: "ABBRECHEN",
      open: "ÖFFNEN"
    },
    // Dialogs
    banPeer: {
      title: "Peer blockieren",
      peerDetailsTitle: "Peer Details",
      message: "Dauer der Blockierung des Peers eingeben.\nStandard 3600 = 1 Stunde.",
      ok: "Peer blockieren"
    },
    copyAddress: {
      title: "Adresse kopieren",
      message: "Es is eine Payment ID mit dieser Adresse verbunden.\n Bitte die Paymend ID separat kopieren"
    },
    copyPrivateKeys: {
      // Copy {seedWords/viewKey/spendKey}
      title: "Kopieren {type}",
      message:
        "Sei vorsichtig, wem du deine Private Keys sendest, denn derjenige erhält dadurch die Kontrolle über deine Einlagen",
      seedWords: "Seed Wörter",
      viewKey: "View Key",
      spendKey: "Spend Key"
    },
    deleteWallet: {
      title: "Wallet löschen",
      message:
        "Bist du dir absolut sicher, dass du deine Wallet löschen willst?\n Bitte stelle sicher, dass du deinen Private Key gesichert hast.\n DIESER SCHRITT KANN NICHT RÜCKGÄNGIG GEMACHT WERDEN!",
      ok: "LÖSCHEN"
    },
    exit: {
      title: "Beenden",
      message: "Bist du sicher, dass du das Programm beenden möchtest?",
      ok: "Beenden"
    },
    keyImages: {
      title: "{type} key images",
      message: "Möchtest du key images {type}",
      export: "Exportieren",
      import: "Importieren"
    },
    noPassword: {
      title: "Kein Passwort angelegt",
      message: "Bist du sicher, dass du eine Wallet ohne Passwort erstellen möchtest?",
      ok: "JA"
    },
    password: {
      title: "Passwort",
      message: "Wallet Passwort eingeben um fortzufahren"
    },
    registerServiceNode: {
      title: "Service Node registrieren",
      message: "Möchtest du einen Service Node registrieren?",
      ok: "REGISTRIEREN "
    },
    rescan: {
      title: "Wallet erneut scannen",
      message:
        "Warnung: Einige Informationen über vorherige Transaktionen\nsowie Adressen von Empfängern gehen verloren",
      ok: "ERNEUT SCANNEN"
    },
    restart: {
      title: "Erneut starten",
      message: "Änderungen erfordern einen Neustart. Möchtest du jetzt neu starten?",
      ok: "NEUSTART"
    },
    showPrivateKeys: {
      title: "Private Keys Anzeigen",
      message: "Möchtest du deinen Private Key anzeigen?",
      ok: "ANZEIGEN"
    },
    stake: {
      title: "Stake",
      message: "Möchtest du staken?",
      ok: "Stake"
    },
    sweepAll: {
      title: "Alles Bereinigen",
      message: "Möchtest du alles bereinigen?",
      ok: "ALLES BEREINIGEN"
    },
    sweepAllWarning: {
      title: "Sweep all warning",
      message:
        "You are about to combine all of your unspent funds by sending a transaction to yourself, your wallet may show a balance of 0 temporarily, after 10 blocks your funds will unlock and you may stake normally.",
      ok: "CONTINUE"
    },
    switchWallet: {
      title: "Wallet wechseln",
      closeMessage: "Bist du sicher, dass du die aktuelle Wallet schliessen möchtest?",
      restartMessage:
        "Die Wallet RPC synchronisiert sich gerade\n Wenn du deine Wallet wechseln möchtest, musst du die Anwendung erneut starten. \n Die Synchronisation wird abgebrochen und du musst die Blockchain erneut scannen. "
    },
    transactionDetails: {
      title: "Transaktionsdetails",
      ok: "SCHLIESSEN"
    },
    transfer: {
      title: "Transferieren",
      message: "Möchtest du die Transaktion senden?",
      ok: "SENDEN"
    },
    unlockConfirm: {
      title: "Unlock bestätigen",
      ok: "UNLOCK"
    },
    unlockServiceNode: {
      title: "Unlock Service Node",
      confirmTitle: "Unlock bestätigen",
      message: "Möchtest du den Service Node „unlocken“?",
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
    address: "ADRESSE",
    amount: "BETRAG",
    awardRecepientAddress: "EMPFÄNGER ADRESSE FÜR DIE VERGÜTUNG",
    confirmPassword: "PASSWORT BESTÄTIGEN",
    chooseNetwork: "NETZWERK AUSWÄHLEN",
    daemonLogLevel: "DAEMON LOG LEVEL",
    daemonP2pPort: "DAEMON P2P PORT",
    daemonZMQPort: "DAEMON ZMQ PORT",
    dataStoragePath: "DATENSICHERUNGSPFAD",
    filter: "FILTER",
    filterTransactionType: "FILTERN NACH TRANSAKTIONSTYP",
    internalWalletPort: "INTERNER WALLET PORT",
    keyImages: {
      exportDirectory: "KEY IMAGE EXPORTVERZEICHNIS",
      importFile: "KEY IMAGE IMPORT FILE"
    },
    limitDownloadRate: "DOWNLOAD RATE LIMITIEREN",
    limitUploadRate: "UPLOAD RATE LIMITIEREN",
    localDaemonIP: "LOKALE DAEMON IP",
    localDaemonPort: "LOKALER DAEMON PORT",
    maxIncomingPeers: "MAX EINGEHENDE PEERS",
    maxOutgoingPeers: "MAX AUSGEHENDE PEERS",
    message: "MESSAGE",
    mnemonicSeed: "MNEMONIC SEED",
    name: "NAME",
    newWalletName: "NEUER WALLET NAME",
    network: "NETZWERK",
    notes: "NOTIZEN",
    optional: "OPTIONAL",
    password: "PASSWORT",
    paymentId: "PAYMENT ID",
    priority: "PRIORITÄT",
    remoteNodeHost: "REMOTE NODE HOST",
    remoteNodePort: "REMOTE NODE PORT",
    restoreFromBlockHeight: "WIEDERHERSTELLUNG VON BLOCKHÖHE",
    restoreFromDate: "WIEDERHERSTELLUNG VON DATUM",
    seedLanguage: "SEED SPRACHE",
    serviceNodeCommand: "SERVICE NODE COMMAND",
    serviceNodeKey: "SERVICE NODE KEY",
    signature: "SIGNATURE",
    transactionId: "TRANSACTION ID",
    walletFile: "WALLET FILE",
    walletLogLevel: "WALLET LOG LEVEL",
    walletName: "WALLET NAME",
    walletRPCPort: "WALLET RPC PORT",
    walletStoragePath: "WALLET SICHERUNGSPFAD",
    // These are specific labels which do not get uppercased
    confirmNewPassword: "Neues Passwort bestätigen",
    newPassword: "Neues Passwort",
    oldPassword: "Altes Passwort",
    rescanFullBlockchain: "Gesamte Blockchain erneut scannen",
    rescanSpentOutputs: "Spent Outputs erneut scannen",
    transactionNotes: "Transaktionsnotizen"
  },
  footer: {
    ready: "FERTIG",
    remote: "REMOTE",
    scanning: "SCANNEN",
    status: "Status",
    syncing: "Synchronisierung",
    wallet: "Wallet"
  },
  menuItems: {
    about: "Über ",
    changePassword: "Passwort ändern",
    copyAddress: "Adresse kopieren",
    copyQR: "QR Code kopieren",
    copySeedWords: "Seed Wörter kopieren",
    copySpendKey: "Spend Key kopieren",
    copyServiceNodeKey: "Copy service node key",
    copyTransactionId: "Transaktions ID kopieren",
    copyViewKey: "View Key kopieren",
    createNewWallet: "Neue Wallet erstellen",
    deleteWallet: "Wallet löschen",
    exit: "Loki GUI Wallet schliessen",
    importOldGUIWallet: "Wallets von alter GUI importieren",
    manageKeyImages: "Key Images verwalten",
    openWallet: "Wallet öffnen",
    rescanWallet: "Wallet erneut scannen",
    restoreWalletFile: "Wallet aus Datei wiederherstellen",
    restoreWalletSeed: "Wallet aus Seed wiederherstellen ",
    saveQR: "QR in Datei speichern",
    sendToThisAddress: "Zu dieser Adresse senden",
    settings: "Einstellungen",
    showDetails: "Details anzeigen",
    showPrivateKeys: "Zeige Private Keys",
    showQRCode: "Zeige QR Code",
    switchWallet: "Wallet wechseln",
    viewOnExplorer: "Zeige in Explorer"
  },
  notification: {
    positive: {
      addressCopied: "Adresse in die Zwischenablage kopiert",
      bannedPeer: "Blockiert {host} bis {time}",
      copied: "{item} in Zwischenablage kopiert",
      itemSaved: "{item} gespeichert nach {filename}",
      keyImages: {
        exported: "Key images exportiert nach {filename}",
        imported: "Key images importiert"
      },
      passwordUpdated: "Passwort aktualisiert",
      qrCopied: "QR Code in die Zwischenablage kopiert",
      registerServiceNodeSuccess: "Service Node erfolgreich registriert ",
      sendSuccess: "Transaktion erfolgreich gesendet",
      signatureCopied: "Signature copied to clipboard",
      stakeSuccess: "Staking erfolgreich",
      transactionNotesSaved: "Notizen zur Transaktion gesichert"
    },
    errors: {
      banningPeer: "Fehler bei der Blockierung des Peer",
      cannotAccessRemoteNode: "Remote Node nicht erreichbar, bitte versuche es mit einer anderen Remote Node",
      changingPassword: "Fehler beim Ändern des Passworts",
      copyWalletFail: "Fehler beim Kopieren der Wallet",
      copyingPrivateKeys: "Fehler beim Kopieren der Private Keys",
      dataPathNotFound: "Pfad zur Speicherung nicht gefunden",
      differentNetType: "Remote Node benutzt einen anderen „nettype“",
      enterSeedWords: "Seed Wörter eingeben",
      enterTransactionId: "Enter transaction ID",
      enterTransactionProof: "Enter transaction proof",
      enterWalletName: "Wallet Namen eingeben",
      errorSavingItem: "Fehler beim Speichern {item}",
      failedServiceNodeUnlock: "Fehler beim Service Node unlock",
      failedToSetLanguage: "Fehler bei der Auswahl der Sprache: {lang}",
      failedWalletImport: "Fehler beim Importieren der Wallet",
      failedWalletOpen: "Fehler beim Öffnen der Wallet. Bitte versuche es erneut",
      internalError: "Interner Fehler",
      invalidAddress: "Adresse nicht gültig",
      invalidAmount: "Betrag nicht gültig",
      invalidOldPassword: "Ungültiges altes Passwort",
      invalidPassword: "Ungültiges Passwort",
      invalidPaymentId: "Payment ID nicht gültig",
      invalidPrivateViewKey: "Ungültiger Private View Key",
      invalidPublicAddress: "Ungültige öffentliche Adresse",
      invalidRestoreDate: "Ungültiges Wiederherstellungsdatum",
      invalidRestoreHeight: "Ungültige Wiederherstellungshöhe",
      invalidSeedLength: "Ungültige Seed Wortlänge",
      invalidServiceNodeCommand: "Bitte füge den Service Node Registrierungsbefehl ein",
      invalidServiceNodeKey: "Service Node Key nicht gültig",
      invalidWalletPath: "Ungültiger Wallet Pfad",
      keyImages: {
        exporting: "Fehler beim Export der Key images",
        reading: "Fehler beim lesen der Key images",
        importing: "Fehler beim Import der Key Images"
      },
      negativeAmount: "Betrag kann nicht negativ sein ",
      newPasswordNoMatch: "Neue Passwörter stimmen nicht überein",
      newPasswordSame: "Neues Passwort darf nicht identisch sein",
      notEnoughBalance: "Nicht genug frei verfügbares Guthaben",
      passwordNoMatch: "Passwörter stimmen nicht überein",
      remoteCannotBeReached: "Remote daemon ist nicht erreichbar",
      selectWalletFile: "Select a wallet file",
      unknownError: "Ein unbekannter Fehler ist aufgetreten ",
      walletAlreadyExists: "Wallet mit diesem Namen existiert bereits",
      walletPathNotFound: "Wallet Daten Pfad nicht gefunden",
      zeroAmount: "Betrag muss grösser als null sein"
    },
    warnings: {
      noKeyImageExport: "Keine Key Images zum Exportieren gefunden",
      usingLocalNode: "Zugang zur Remote Node nicht möglich, wechsle zur lokalen Node",
      usingRemoteNode: "llokid nicht gefunden, benutze eine Remote Node"
    }
  },
  placeholders: {
    additionalNotes: "Zusätzliche Notizen",
    addressBookName: "Zugehörige Namen zu dieser Adresse",
    filterTx: "Enter an ID, name, address or amount",
    hexCharacters: "{count} Hexadezimal Zeichen",
    mnemonicSeed: "25 (oder 24) mnemonic Seed Wörter",
    pasteTransactionId: "Paste transaction ID",
    pasteTransactionProof: "Paste transaction proof",
    proveOptionalMessage: "Optional message against which the signature is signed",
    recipientWalletAddress: "Recipient's wallet address",
    selectAFile: "Bitte Datei auswählen",
    transactionNotes: "Zusätzliche Notizen die an die Transaktions gehängt werden sollen",
    walletName: "Ein Name für deine Wallet",
    walletPassword: "Ein optionales Passwort für die Wallet"
  },
  strings: {
    addAddressBookEntry: "Adressbuch Eintrag hinzufügen",
    addressBookDetails: "Adressbuch details",
    addressBookIsEmpty: "Adressbuch ist leer",
    addresses: {
      myPrimaryAddress: "Meine primäre Adresse",
      myUnusedAddresses: "Meine ungenutzten Adressen",
      myUsedAddresses: "Meine benutzen Adressen",
      primaryAddress: "Primäre Adresse",
      subAddress: "Sub-Adresse",
      subAddressIndex: "Index {index}"
    },
    advancedOptions: "Erweiterte Optionen",
    bannedPeers: {
      title: "Blockierte Peers (Blockierungen werden entfernt, wenn Wallet neu gestartet wird)",
      bannedUntil: "Blockieren bis {time}"
    },
    blockHeight: "Höhe",
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
    closing: "schliessen",
    connectingToBackend: "Verbinden zum Backend",
    contribution: "Contribution",
    daemon: {
      local: {
        title: "Nur lokaler Daemon",
        description:
          "Volle Sicherheit. Wallet wird die gesamte Blockchain herunterladen. Du kannst keine Transaktionen durchführen, solange die Synchronisation nicht vollständig beendet wurde"
      },
      localRemote: {
        title: "Lokal + Remote Daemon",
        description:
          "Schnell starten mit dieser Standard Option. Wallet wird die Blockchain vollständig herunterladen, aber während der Synchronisation eine Remote Node nutzen"
      },
      remote: {
        title: "Nur Remote Node",
        description:
          "Etwas weniger sicher. Wallet verbindet sich mit einer Remote Node, um Transaktionen über diese durchzuführen"
      }
    },
    destinationUnknown: "Ziel unbekannt",
    editAddressBookEntry: "Adressbucheintrag bearbeiten",
    loadingSettings: "Einstellungen werden geladen",
    lokiBalance: "Guthaben",
    lokiUnlockedBalance: "frei verfügbares Guthaben",
    lokiUnlockedShort: "frei verfügbar",
    noTransactionsFound: "Keine Transaktionen gefunden",
    notes: "Notizen",
    numberOfUnspentOutputs: "Anzahl der unspent outputs",
    paymentID: "Payment ID",
    peerList: "Peer Liste",
    priorityOptions: {
      automatic: "Automatisch",
      fast: "Schnell",
      fastest: "Am schnellsten",
      normal: "Normal",
      slow: "Langsam"
    },
    proveTransactionDescription:
      "Generate a proof of your incoming/outgoing payment by supplying the transaction ID, the recipient address and an optional message.\nFor the case of outgoing payments, you can get a 'Spend Proof' that proves the authorship of a transaction. In this case, you don't need to specify the recipient address.",
    readingWalletList: "Lese Wallet Liste",
    recentIncomingTransactionsToAddress: "Kürzlich eingegangene Transaktionen zu dieser Adresse",
    recentTransactionsWithAddress: "Kürzlich durchgeführte Transaktionen mit dieser Adresse",
    rescanModalDescription: "Auswahl gesamter Rescan oder nur spent outputs",
    saveSeedWarning: 'Bitte kopiere und verwahre deinen "Seed" an einem sicheren Ort',
    saveToAddressBook: "In Adressbuch speichern",
    seedWords: "Seed Wörter",
    selectLanguage: "Sprache auswählen",
    serviceNodeRegistrationDescription:
      "Hier den {registerComand} Befehl, der mit Hilfe des Daemons durch das Kommando {prepareCommand} erzeugt wurde, eingeben, um eine Service Node zu aktivieren",
    spendKey: "Spend key",
    startingDaemon: "Daemon wird gestartet",
    startingWallet: "Wallet wird gestartet",
    switchToDateSelect: "Wechsel zur Selektion nach Datum",
    switchToHeightSelect: "Wechsel zu Selektion nach Höhe",
    transactionID: "Transaktions ID",
    transactionConfirmed: "Transaktion bestätigt",
    transactions: {
      amount: "Betrag",
      description: "{type} Transaktion",
      fee: "Gebühr",
      paidBySender: "Vom Absender bezahlt",
      received: "Empfangen",
      sent: "Gesendet",
      sentTo: "{type} Transaktion gesendet nach",
      timestamp: "Zeitstempel",
      types: {
        all: "Alles",
        incoming: "Eingehend",
        outgoing: "Ausgehend",
        pending: "Ausstehend",
        pendingIncoming: "Ausstehend eingehend",
        pendingOutgoing: "Ausstehend ausgehend",
        miner: "Miner",
        serviceNode: "Service Node",
        governance: "Governance",
        stake: "Stake",
        failed: "Fehlgeschlagen"
      }
    },
    unspentOutputs: "Unspent outputs",
    userNotUsedAddress: "Du hast diese Adresse nicht benutzt",
    userUsedAddress: "Du hast diese Adresse benutzt",
    viewKey: "View Key",
    viewOnlyMode: "Nur Anzeige Modus. Bitte die volle Wallet laden um Coins zu senden"
  },
  titles: {
    addressBook: "Adressbuch",
    addressDetails: "Adressdetails",
    advanced: {
      checkTransaction: "CHECK TRANSACTION",
      prove: "PROVE"
    },
    changePassword: "Passwort ändern",
    configure: "Konfiguaration",
    currentlyStakedNodes: "Currently staked nodes",
    privateKeys: "Private Keys",
    rescanWallet: "Wallet erneut scannen",
    serviceNode: {
      registration: "REGISTRIERUNG",
      staking: "STAKING"
    },
    settings: {
      title: "Einstellungen",
      tabs: {
        general: "Allgemein",
        language: "Sprache",
        peers: "Peers"
      }
    },
    transactionDetails: "Transaktionsdetails",
    transactions: "Transaktionen",
    wallet: {
      createNew: "Neue Wallet erstellen",
      createdOrRestored: "Wallet erstellt/wiederhergestellt",
      importFromFile: "Importieren der Wallet aus Datei",
      importFromLegacyGUI: "Wiederherstellung der Wallet von legacy GUI",
      importFromOldGUI: "Wiederherstellung der Wallet von altem GUI",
      restoreFromSeed: "Wiederherstellung Wallet von Seed Wörtern",
      restoreViewOnly: "Wiederherstellung Anzeige Wallet"
    },
    welcome: "Willkommen",
    yourWallets: "Deine Wallets"
  }
};
