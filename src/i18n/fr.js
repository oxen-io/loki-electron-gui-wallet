export default {
  buttons: {
    // All button text is uppercased in the gui
    advanced: "ADVANCED",
    all: "TOUT",
    back: "RETOUR",
    browse: "NAVIGUER",
    cancel: "ANNULER",
    change: "CHANGER",
    check: "CHECK",
    clear: "CLEAR",
    close: "FERMER",
    contacts: "CONTACTS",
    copyAddress: "ADRESSE DE COPIE",
    copySignature: "COPY SIGNATURE",
    createWallet: "CRÉER UN PORTEFEUILLE",
    delete: "SUPPRIMER",
    edit: "MODIFIER",
    export: "EXPORTER",
    generate: "GENERATE",
    import: "IMPORTER",
    importWallet: "IMPORTER UN PORTEFEUILLE | IMPORTER DES PORTEFEUILLE",
    next: "SUIVANT",
    openWallet: "OUVRIR LE PORTEFEUILLE",
    receive: "RECEVOIR",
    registerServiceNode: "ENREGISTRER UN NOEUD DE SERVICE",
    rescan: "RÉANALYSER",
    restoreWallet: "RESTAURER LE PORTEFEUILLE",
    save: "SAUVEGARDER",
    saveTxNotes: "SAUVEGARDER LES NOTES DE TRANSACTION",
    selectLocation: "SÉLECTIONNEZ L'EMPLACEMENT",
    selectWalletFile: "SÉLECTIONNER LE FICHIER PORTEFEUILLE",
    send: "ENVOYER",
    sendCoins: "ENVOYER DES PIECES",
    serviceNode: "NOEUD DE SERVICE",
    settings: "RÉGLAGES",
    showQRCode: "AFFICHER LE QR CODE",
    showTxDetails: "AFFICHER LES DETAILS DE TRANSACTION",
    stake: "STAKE",
    sweepAll: "TOUT BALAYER",
    unlock: "UNLOCK",
    viewOnExplorer: "VUE SUR L’EXPLORATEUR"
  },
  dialog: {
    // Generic buttons
    buttons: {
      ok: "OK",
      cancel: "ANNULER",
      open: "OUVRIR"
    },

    // Dialogs
    banPeer: {
      title: "Pair exclu",
      peerDetailsTitle: "Détails du pair",
      message: "Entrez le temps en secondes pour exclure un pair.\nDefaut 3600 = 1 heure.",
      ok: "Pair exclu"
    },
    copyAddress: {
      title: "Adresse de copie",
      message:
        "Un identifiant de paiement est associé à cette adresse.\nAssurez-vous de copier l'identifiant de paiement séparément."
    },
    copyPrivateKeys: {
      // Copy {seedWords/viewKey/spendKey}
      title: "Copier {type}",
      message: "Faites attention à qui vous envoyez vos clés privées, car ils peuvent contrôler vos fonds.",
      seedWords: "mots-clés",
      viewKey: "Clé d’affichage",
      spendKey: "Clé de dépenses"
    },
    deleteWallet: {
      title: "Supprimer le portefeuille",
      message:
        "Êtes-vous absolument certain de vouloir supprimer votre portefeuille?\nAssurez-vous que vos clés privées sont sauvegardées. \nCE PROCESSUS N'EST PAS REVERSIBLE !",
      ok: "Supprimer"
    },
    exit: {
      title: "Quitter",
      message: "Êtes-vous sûr de vouloir quitter?",
      ok: "Quitter"
    },
    keyImages: {
      title: "{type} images clés",
      message: "Souhaitez-vous {type} les images clés ?",
      export: "Exporter",
      import: "Importer"
    },
    noPassword: {
      title: "Aucun mot de passe défini",
      message: "Êtes-vous sûr de vouloir créer un portefeuille sans mot de passe ?",
      ok: "OUI"
    },
    password: {
      title: "Mot de passe",
      message: "Entrez le mot de passe du portefeuille pour continuer."
    },
    registerServiceNode: {
      title: "Enregistrer le nœud de service",
      message: "Voulez-vous enregistrer le nœud de service ?",
      ok: "ENREGISTRER"
    },
    rescan: {
      title: "Réanalyser le portefeuille",
      message:
        "Avertissement: Quelques informations sur les transactions précédentes \nTelles que l'adresse du destinataire seront perdues.",
      ok: "RÉANALYSER"
    },
    restart: {
      title: "REDÉMARRER",
      message: "Les modifications nécessitent un redémarrage. Voulez-vous redémarrer maintenant ?",
      ok: "REDÉMARRER"
    },
    showPrivateKeys: {
      title: "AFFICHER LES CLÉS PRIVÉES",
      message: "Voulez-vous afficher vos clés privées ?",
      ok: "AFFICHER"
    },
    stake: {
      title: "Stake",
      message: "Voulez-vous miser ?",
      ok: "STAKE"
    },
    sweepAll: {
      title: "Tout balayer",
      message: "Voulez-vous tout balayer?",
      ok: "TOUT BALAYER"
    },
    sweepAllWarning: {
      title: "Sweep all warning",
      message:
        "You are about to combine all of your unspent funds by sending a transaction to yourself, your wallet may show a balance of 0 temporarily, after 10 blocks your funds will unlock and you may stake normally.",
      ok: "CONTINUE"
    },
    switchWallet: {
      title: "CHANGER DE PORTEFEUILLE",
      closeMessage: "Êtes-vous sûr de vouloir fermer le portefeuille actuel ?",
      restartMessage:
        "Le portefeuille RPC est en cours de synchronisation. \nSi vous souhaitez changer de portefeuille, vous devez redémarrer l'application. \nVous allez perdre votre progression concernant la  synchronisation, vous devrez à nouveau analyser la blockchain."
    },
    transactionDetails: {
      title: "Détails de la transaction",
      ok: "FERMER"
    },
    transfer: {
      title: "Transfert",
      message: "Voulez-vous envoyer la transaction ?",
      ok: "ENVOYER"
    },
    unlockConfirm: {
      title: "Confirmer le déverrouillage",
      ok: "DÉVERROUILLER"
    },
    unlockServiceNode: {
      title: "Déverrouiller le nœud de service",
      confirmTitle: "Confirmer le déverrouillage",
      message: "Voulez-vous déverrouiller le nœud de service ?",
      ok: "DÉVERROUILLER"
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
    amount: "MONTANT",
    awardRecepientAddress: "ADRESSE DU BÉNÉFICIAIRE POUR LA RÉCOMPENSE",
    confirmPassword: "CONFIRMER LE MOT DE PASSE",
    daemonLogLevel: "NIVEAU D'IMPORTANCE DU DÉMON",
    daemonP2pPort: "PORT P2P DU DÉMON",
    daemonZMQPort: "PORT ZMQ DU DÉMON",
    dataStoragePath: "CHEMIN DE STOCKAGE DE DONNÉES",
    filter: "FILTER",
    filterTransactionType: "FILTRER PAR TYPE DE TRANSACTION",
    internalWalletPort: "PORT DE PORTEFEUILLE INTERNE",
    keyImages: {
      exportDirectory: "RÉPERTOIRE D'EXPORTATION D'IMAGES CLÉS",
      importFile: "FICHIER D'IMPORTATION D'IMAGES CLÉS"
    },
    limitDownloadRate: "TAUX LIMITE DE TÉLÉCHARGEMENT",
    limitUploadRate: "TAUX LIMITE D’UPLOAD",
    localDaemonIP: "IP DU DÉMON LOCAL",
    localDaemonPort: "PORT DU DÉMON LOCAL",
    maxIncomingPeers: "MAXIMUM DE PAIRS ENTRANTS",
    maxOutgoingPeers: "NOMBRE MAXIMUM DE PAIRS SORTANTS",
    message: "MESSAGE",
    mnemonicSeed: "MOT MNÉMONIQUE",
    name: "NOM",
    newWalletName: "NOUVEAU NOM DU PORTEFEUILLE",
    notes: "NOTES",
    optional: "OPTIONNEL",
    password: "MOT DE PASSE",
    paymentId: "ID DE PAIEMENT",
    priority: "PRIORITÉ",
    remoteNodeHost: "HÔTE À DISTANCE DE NOEUD",
    remoteNodePort: "PORT DE NOEUD DISTANT",
    restoreFromBlockHeight: "RESTAURATION DE LA HAUTEUR DU BLOC",
    restoreFromDate: "RESTAURATION A PARTIR DE LA DATE",
    seedLanguage: "LANGAGE SEED",
    serviceNodeCommand: "COMMANDE DE NŒUD DE SERVICE",
    serviceNodeKey: "CLÉ DE SERVICE NODE",
    signature: "SIGNATURE",
    transactionId: "TRANSACTION ID",
    walletFile: "DOSSIER DU PORTEFEUILLE",
    walletLogLevel: "NIVEAU D'IMPORTANCE DU PORTEFEUILLE",
    walletName: "NOM DU PORTEFEUILLE",
    walletRPCPort: "PORT RPC DU PORTEFEUILLE",
    walletStoragePath: "CHEMIN DE STOCKAGE DU PORTEFEUILLE",

    // These are specific labels which do not get uppercased
    confirmNewPassword: "Confirmez le nouveau mot de passe",
    newPassword: "Nouveau mot de passe",
    oldPassword: "Ancien mot de passe",
    rescanFullBlockchain: "Scanner de nouveau la blockchain complète",
    rescanSpentOutputs: "Nouvelle analyse des sorties dépensées",
    transactionNotes: "Notes de transaction",
    chooseNetwork: "Choisir un réseau",
    network: "Réseau"
  },
  footer: {
    ready: "PRÊT",
    scanning: "ANALYSE",
    status: "Statut",
    syncing: "SYNCHRONISATION",
    remote: "Nœuds éloignés",
    wallet: "Portefeuille"
  },
  menuItems: {
    about: "A propos",
    changePassword: "Changer le mot de passe",
    copyAddress: "Copier l’adresse",
    copyQR: "Copier le QR code",
    copySeedWords: "Copier les mots clés",
    copySpendKey: "Copier la clé de dépense",
    copyServiceNodeKey: "Copy service node key",
    copyTransactionId: "Copier l'ID de transaction",
    copyViewKey: "Copier la clé de visibilité",
    createNewWallet: "Créer un nouveau portefeuille",
    deleteWallet: "Supprimer le portefeuille",
    exit: "Quitter le portefeuille Loki GUI",
    importOldGUIWallet: "Importer le portefeuille depuis l’ancien GUI",
    manageKeyImages: "Gérer les images clés",
    openWallet: "Ouvrir le portefeuille",
    rescanWallet: "Nouvelle analyse du portefeuille",
    restoreWalletFile: "Restaurer le portefeuille à partir d'un fichier",
    restoreWalletSeed: "Restaurer le portefeuille depuis les mots clés(SEED)",
    saveQR: "Enregistrer le QR code dans un fichier",
    sendToThisAddress: "Envoyer à cette adresse",
    settings: "Réglages",
    showDetails: "Afficher les détails",
    showPrivateKeys: "Afficher les clés privées",
    showQRCode: "Afficher le QR code",
    switchWallet: "Changer de portefeuille",
    viewOnExplorer: "Voir sur l'explorateur"
  },
  notification: {
    positive: {
      addressCopied: "Adresse copiée dans le presse-papier",
      bannedPeer: "Banni {host} jusqu'au {time}",
      copied: "{item}copié dans le presse-papier",
      itemSaved: "{item}enregistré dans {filename}",
      keyImages: {
        exported: "Images clés exportées vers {filename}",
        imported: "Images clés importées"
      },
      passwordUpdated: "Mot de passe mis à jour",
      qrCopied: "QR code copié dans le presse-papier",
      registerServiceNodeSuccess: "Nœud de service enregistré avec succès",
      sendSuccess: "Transaction envoyée avec succès",
      signatureCopied: "Signature copied to clipboard",
      stakeSuccess: "Mise placée avec succès",
      transactionNotesSaved: "Notes de transaction enregistrées"
    },
    errors: {
      banningPeer: "Erreur d'exclusion d'un pair",
      cannotAccessRemoteNode: "Impossible d'accéder au nœud distant, veuillez essayer un autre nœud distant",
      changingPassword: "Erreur de changement de mot de passe",
      copyWalletFail: "Echec de la copie du portefeuille",
      copyingPrivateKeys: "Erreur de la copie des clés privées",
      dataPathNotFound: "Chemin de stockage des données introuvable",
      differentNetType: "Le nœud distant utilise un 'nettoype' différent",
      enterSeedWords: "Entrez les mots clés",
      enterTransactionId: "Enter transaction ID",
      enterTransactionProof: "Enter transaction proof",
      enterWalletName: "Entrez un nom de portefeuille",
      errorSavingItem: "Erreur de sauvegarde {item}",
      failedServiceNodeUnlock: "Erreur de déverrouillage du nœud de service",
      failedToSetLanguage: "Impossible de définir la langue : {lang}",
      failedWalletImport: "Echec d'import du portefeuille",
      failedWalletOpen: "Echec de l'ouverture du portefeuille : veuillez essayer de nouveau.",
      internalError: "Erreur interne",
      invalidAddress: "Adresse non valide",
      invalidAmount: "Montant non valide",
      invalidOldPassword: "Ancien mot de passe non valide",
      invalidPassword: "Mot de passe non valide",
      invalidPaymentId: "ID de paiement non valide",
      invalidPrivateViewKey: "Clé de visibilité privée non valide",
      invalidPublicAddress: "Adresse publique non valide",
      invalidRestoreDate: "Date de restauration non valide",
      invalidRestoreHeight: "Hauteur de restauration non valide",
      invalidSeedLength: "Longueur de mot clé non valide",
      invalidServiceNodeCommand: "Veuillez entrer la commande d'inscription d'un nœud de service",
      invalidServiceNodeKey: "Clé du nœud de service non valide",
      invalidWalletPath: "Chemin du portefeuille non valide",
      keyImages: {
        exporting: "Erreur de l'exportation des clés images",
        reading: "Erreur de lecture des clés images",
        importing: "Erreur d'importation des clés images"
      },
      negativeAmount: "Le montant ne peut être négatif",
      newPasswordNoMatch: "Les nouveaux mots de passe ne correspondent pas",
      newPasswordSame: "Le nouveau mot de passe doit être différent",
      notEnoughBalance: "Pas assez de solde débloqué",
      passwordNoMatch: "Les mots de passe ne correspondent pas",
      remoteCannotBeReached: "La démon distant ne peut pas être atteint",
      selectWalletFile: "Select a wallet file",
      unknownError: "Une erreur inconnue s'est produite",
      walletAlreadyExists: "Un portefeuille avec ce nom existe déjà",
      walletPathNotFound: "Chemin de stockage des données du portefeuille introuvable",
      zeroAmount: "Le montant doit être supérieur à zéro"
    },
    warnings: {
      noKeyImageExport: "Aucune clé image n'a été trouvé pour l'export",
      usingLocalNode: "Impossible d'accéder au nœud distant, basculement en local uniquement",
      usingRemoteNode: "lokid introuvable, utilisation du nœud distant"
    }
  },
  placeholders: {
    additionalNotes: "Notes supplémentaires",
    addressBookName: "Nom rattaché à cette adresse",
    filterTx: "Enter an ID, name, address or amount",
    hexCharacters: "{count} caractères hexadécimaux",
    mnemonicSeed: "25 (ou 24) mot mnémonique",
    pasteTransactionId: "Paste transaction ID",
    pasteTransactionProof: "Paste transaction proof",
    proveOptionalMessage: "Optional message against which the signature is signed",
    recipientWalletAddress: "Recipient's wallet address",
    selectAFile: "Veuillez sélectionner un fichier",
    transactionNotes: "Notes additionnelles attachées à la transaction",
    walletName: "Un nom pour votre portefeuille",
    walletPassword: "Un mot de passe optionnel pour votre portefeuille"
  },
  strings: {
    addAddressBookEntry: "Ajoutez une entrée de carnet d'adresses",
    addressBookIsEmpty: "Le carnet d'adresses est vide",
    addressBookDetails: "Détails du carnet d’adresse",
    addresses: {
      myPrimaryAddress: "Mon adresse principale",
      myUnusedAddresses: "Mes adresses non utilisées",
      myUsedAddresses: "Mes adresses utilisées",
      notYourAddress: "Ce n'est pas votre adresse !",
      primaryAddress: "Adresse principale",
      subAddress: "Sous adresse",
      subAddressIndex: "Index {index}"
    },
    advancedOptions: "Options avancées",
    bannedPeers: {
      title: "Les pairs exclus (les exclusions seront effacées si le portefeuille est redémarré)",
      bannedUntil: "Exclu jusqu'au {time}"
    },
    blockHeight: "Hauteur",
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
    closing: "Fermeture",
    connectingToBackend: "Connexion à l'arrière-plan",
    contribution: "Contribution",
    daemon: {
      local: {
        title: "Démon local seulement",
        description:
          "Sécurité totale, le portefeuille téléchargera la chaîne de blocs entière. Vous ne pourrez pas faire de transactions jusqu'à ce que la synchronisation soit complète."
      },
      localRemote: {
        title: "Local + démon distant",
        description:
          "Vous pourrez utiliser rapidement le portefeuille avec cette option par défaut. Le portefeuille téléchargera la chaîne de blocs entière, mais utilise un nœud distant pendant la synchronisation."
      },
      remote: {
        title: "Démon distant seulement",
        description:
          "Moins de sécurité, le portefeuille se connectera à un noeud distant pour faire toutes les transactions."
      }
    },
    destinationUnknown: "Destination inconnue",
    editAddressBookEntry: "Modifiez l'entrée du carnet d'adresses",
    loadingSettings: "Chargement des réglages",
    lokiBalance: "Solde",
    lokiUnlockedBalance: "Solde débloqué",
    lokiUnlockedShort: "Débloqué",
    noTransactionsFound: "Aucune transaction trouvée",
    notes: "Notes",
    numberOfUnspentOutputs: "Nombre de sorties non dépensées",
    paymentID: "ID de paiement",
    peerList: "Liste des pairs",
    proveTransactionDescription:
      "Generate a proof of your incoming/outgoing payment by supplying the transaction ID, the recipient address and an optional message.\nFor the case of outgoing payments, you can get a 'Spend Proof' that proves the authorship of a transaction. In this case, you don't need to specify the recipient address.",
    priorityOptions: {
      automatic: "Automatique",
      slow: "Lent",
      normal: "Normal",
      fast: "Rapide",
      fastest: "Le plus rapide"
    },
    readingWalletList: "Liste des portefeuilles lisibles",
    recentIncomingTransactionsToAddress: "Transactions récentes entrantes vers cette adresse",
    recentTransactionsWithAddress: "Transactions récentes avec cette adresse",
    rescanModalDescription:
      "Sélectionnez une nouvelle analyse complète ou une nouvelle analyse des sorties dépensées seulement.",
    saveSeedWarning: "Veuillez copier et enregistrer cela dans un lieu sécurisé !",
    saveToAddressBook: "Enregistrez dans le carnet d'adresses",
    seedWords: "Mots clés",
    selectLanguage: "Sélectionnez une langue",
    serviceNodeRegistrationDescription:
      'Entrez la commande {registerCommand} produite par le démon qui est enregistrée pour devenir un noeud de service en utilisant la commande "{prepareCommand}"',
    spendKey: "Clé dépensée",
    startingDaemon: "Démarrage du démon",
    startingWallet: "Démarrage du portefeuille",
    switchToDateSelect: "Basculer vers la sélection par date",
    switchToHeightSelect: "Basculer vers la sélection par hauteur",
    transactionID: "ID de transaction",
    transactionConfirmed: "confirmée",
    transactions: {
      amount: "Montant",
      description: "Transaction {type}",
      fee: "Frais",
      paidBySender: "Payé par l'expéditeur",
      received: "Reçu",
      sent: "Envoyé",
      sentTo: "Transaction {type} envoyée à",
      timestamp: "Horodatage",
      types: {
        all: "Toutes",
        incoming: "Entrantes",
        outgoing: "Sortantes",
        pending: "En attente",
        pendingIncoming: "Entrantes en attente",
        pendingOutgoing: "Sortantes en attente",
        miner: "Miner",
        serviceNode: "Noeud de service",
        governance: "Gouvernance",
        stake: "Stake",
        failed: "Echouées"
      }
    },
    unspentOutputs: "Sorties non dépensées",
    userNotUsedAddress: "Vous n'avez pas utilisé cette adresse",
    userUsedAddress: "Vous avez utilisé cette adresse",
    viewKey: "Clé de visibilité",
    viewOnlyMode: "Mode d'affichage seulement. Veuillez charger le portefeuille complet pour envoyer des pièces."
  },
  titles: {
    addressBook: "Carnet d'adresses",
    addressDetails: "Détails de l'adresse",
    advanced: {
      checkTransaction: "CHECK TRANSACTION",
      prove: "PROVE"
    },
    changePassword: "Changer de mot de passe",
    configure: "Configurer",
    currentlyStakedNodes: "Currently staked nodes",
    privateKeys: "Clés privées",
    rescanWallet: "Analysez de nouveau le portefeuille",
    serviceNode: {
      registration: "ENREGISTREMENT",
      staking: "STAKING"
    },
    settings: {
      title: "Réglages",
      tabs: {
        general: "Général",
        language: "Langue",
        peers: "Pairs"
      }
    },
    transactionDetails: "Détails de la transaction",
    transactions: "Transactions",
    wallet: {
      createNew: "Créer un nouveau portefeuille",
      createdOrRestored: "Créer ou restaurer un portefeuille",
      importFromFile: "Importer un portefeuille à partir d'un fichier",
      importFromLegacyGUI: "Importer un portefeuille à partir d'un héritage GUI",
      importFromOldGUI: "Importer un portefeuille à partir d'un ancien GUI",
      restoreFromSeed: "Restaurer un portefeuille à partir de mots clés",
      restoreViewOnly: "Restaurer un portefeuille en mode d'affichage seulement"
    },
    welcome: "Bienvenue",
    yourWallets: "Vos portefeuilles"
  }
};
