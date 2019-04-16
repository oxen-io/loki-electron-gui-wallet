export default {
    buttons: {
        // All button text is uppercased in the gui
        all: "ВСЕ",
        back: "НАЗАД",
        browse: "ОБЗОР",
        cancel: "ОТМЕНА",
        change: "ИЗМЕНИТЬ",
        close: "ЗАКРЫТЬ",
        contacts: "КОНТАКТЫ",
        copyAddress: "КОПИРОВАТЬ АДРЕС",
        createWallet: "СОЗДАТЬ КОШЕЛЕК",
        delete: "УДАЛИТЬ",
        edit: "РЕДАКТИРОВАТЬ",
        export: "ЭКСПОРТИРОВАТЬ",
        import: "ИМПОРТИРОВАТЬ",
        importWallet: "ИМПОРТИРОВАТЬ КОШЕЛЕК | ИМПОРТИРОВАТЬ КОШЕЛЬКИ",
        next: "ДАЛЕЕ",
        openWallet: "ОТКРЫТЬ КОШЕЛЕК",
        receive: "ПОЛУЧИТЬ",
        registerServiceNode: "ЗАРЕГИСТРИРОВАТЬ СЕРВИСНУЮ НОДУ",
        rescan: "ПЕРЕСКАНИРОВАТЬ",
        restoreWallet: "ВОССТАНОВИТЬ КОШЕЛЕК",
        save: "СОХРАНИТЬ",
        saveTxNotes: "СОХРАНИТЬ ТРАНЗ. ЗАМЕТКИ",
        selectLocation: "ВЫБРАТЬ ПАПКУ",
        selectWalletFile: "ВЫБРАТЬ ФАЙЛ КОШЕЛЬКА",
        send: "ОТПРАВИТЬ",
        sendCoins: "ОТПРАВИТЬ МОНЕТЫ",
        serviceNode: "СЕРВИСНАЯ НОДА",
        settings: "НАСТРОЙКИ",
        showQRCode: "ПОКАЗАТЬ QR КОД",
        showTxDetails: "ПОКАЗАТЬ ДЕТАЛИ ТРАНЗАКЦИИ",
        stake: "СТЕЙК",
        unlockServiceNode: "РАЗБЛОКИРОВАТЬ СЕРВИСНУЮ НОДУ",
        viewOnExplorer: "ПОСМОТРЕТЬ В ЭКСПЛОРЕРЕ"
    },
    dialog: {
        // Generic buttons
        buttons: {
            ok: "ОК",
            cancel: "ОТМЕНИТЬ",
            open: "ОТКРЫТЬ"
        },

        // Dialogs
        banPeer: {
            title: "Забанить пира",
            peerDetailsTitle: "Данные пира",
            message: "Введите время, на которое нужно забанить пира (сек).\nПо-умолчанию 3600 = 1 час.",
            ok: "Забанить"
        },
        copyAddress: {
            title: "Копировать адрес",
            message: "С этим адресом ассоциирован payment id.\nPayment id необходимо скопировать отдельно."
        },
        copyPrivateKeys: {
            // Copy {seedWords/viewKey/spendKey}
            title: "Скопировать: {type}",
            message: "Будьте внимательны, владелец приватных ключей может контролировать ваши средства.",
            seedWords: "Seed-фраза",
            viewKey: "Ключ Просмотра",
            spendKey: "Ключ Отправки"
        },
        deleteWallet: {
            title: "Удалить кошелек",
            message: "Уверены, что хотите удалить кошелек?\nУбедитесь, что сохранили приватные ключи в надежном месте.\nЭТО НЕОБРАТИМЫЙ ПРОЦЕСС!",
            ok: "УДАЛИТЬ"
        },
        exit: {
            title: "Выйти",
            message: "Уверены, что хотите выйти?",
            ok: "ВЫЙТИ"
        },
        keyImages: {
            title: "{type} ключевых образов",
            message: "Вы уверены, что хотите произвести {type} ключевых образов?",
            export: "Экспорт",
            import: "Импорт"
        },
        noPassword: {
            title: "Пароль не задан",
            message: "Вы уверены, что хотите создать кошелек без пароля?",
            ok: "СОЗДАТЬ"
        },
        password: {
            title: "Пароль",
            message: "Введите пароль кошелька"
        },
        registerServiceNode: {
            title: "Регистрация сервисной ноды",
            message: "Вы уверены, что хотите зарегистрировать сервисную ноду?",
            ok: "ЗАРЕГИСТРИРОВАТЬ"
        },
        rescan: {
            title: "Пересканировать кошелек",
            message: "Внимание: Часть информации о предыдущих тразакциях\n(например, адрес получателя) будет потеряна.",
            ok: "ПЕРЕСКАНИРОВАТЬ"
        },
        restart: {
            title: "ПЕРЕЗАГРУЗИТЬ",
            message: "Изменения требуют перезагрузки. Выполнить сейчас?",
            ok: "ПЕРЕЗАГРУЗИТЬ"
        },
        showPrivateKeys: {
            title: "Показать приватные ключи",
            message: "Вы уверены, что хотите посмотреть приватные ключи?",
            ok: "ПОКАЗАТЬ"
        },
        stake: {
            title: "Стейк",
            message: "Вы уверены, что хотите начать стейк ноды?",
            ok: "ПРОДОЛЖИТЬ"
        },
        switchWallet: {
            title: "Переключить кошельки",
            closeMessage: "Вы уверены, что хотите закрыть текущий кошелек?",
            restartMessage: "Запущен RPC кошелька.\nЕсли вы хотите переключить кошельки, перезапустите приложение. \nПрогресс синхронизации будет потерян и вам придется пересканировать блокчейн."
        },
        transactionDetails: {
            title: "Детали транзакции",
            ok: "ЗАКРЫТЬ"
        },
        transfer: {
            title: "Перевод",
            message: "Вы уверены, что хотите отправить эту транзакцию?",
            ok: "ОТПАРВИТЬ"
        },
        unlockConfirm: {
            title: "Подтвердить разблокировку",
            ok: "РАЗБЛОКИРОВАТЬ"
        },
        unlockServiceNode: {
            title: "Разблокировать сервисную ноду",
            confirmTitle: "Подтверждение разблокировки",
            message: "Вы уверены, что хотите разблокировать сервисную ноду?",
            ok: "РАЗБЛОКИРОВАТЬ"
        }
    },
    fieldLabels: {
        // Field labels are also all uppercased
        address: "АДРЕС",
        amount: "СУММА",
        awardRecepientAddress: "АДРЕС ПОЛУЧАТЕЛЯ ВОЗНАГРАЖДЕНИЯ",
        confirmPassword: "ПОДТВЕРЖДЕНИЕ ПАРОЛЯ",
        daemonLogLevel: "УРОВЕНЬ ЛОГА ДЕМОНА",
        daemonP2pPort: "P2P ПОРТ ДЕМОНА",
        daemonZMQPort: "ZMQ ПОРТ ДЕМОНА",
        dataStoragePath: "ПАПКА ХРАНИЛИЩА ДАННЫХ",
        filterTransactionType: "ТИП ТРАНЗАКЦИИ",
        filterTxId: "ID ТРАНЗАКЦИИ",
        internalWalletPort: "ВНУТРЕННЫЙ ПОРТ КОШЕЛЬКА",
        keyImages: {
            exportDirectory: "ПАПКА ЭКСПОРТА КЛЮЧЕВОГО ОБРАЗА",
            importFile: "ФАЙЛ ИМПОРТА КЛЮЧЕВОГО ОБРАЗА"
        },
        limitDownloadRate: "ОГРАНИЧИТЬ СКОРОСТЬ ЗАГРУЗКИ",
        limitUploadRate: "ОГРАНИЧИТЬ СКОРОСТЬ АПЛОАДА",
        localDaemonIP: "IP ЛОКАЛЬНОГО ДЕМОНА",
        localDaemonPort: "ПОРТ ЛОКАЛЬНОГО ДЕМОНА",
        maxIncomingPeers: "МАКСИМУМ ВХОДЯЩИХ ПИРОВ",
        maxOutgoingPeers: "МАКСИМУМ ИСХОДЯЩИХ ПИРОВ",
        mnemonicSeed: "МНЕМОНИЧЕСКАЯ SEED-ФРАЗА",
        name: "ИМЯ",
        newWalletName: "ИМЯ НОВОГО КОШЕЛЬКА",
        notes: "ЗАМЕТКИ",
        optional: "НЕОБЯЗАТЕЛЬНО",
        password: "ПАРОЛЬ",
        paymentId: "PAYMENT ID",
        priority: "ПРИОРИТЕТ",
        remoteNodeHost: "ХОСТ УДАЛЕННОЙ НОДЫ",
        remoteNodePort: "ПОРТ УДАЛЕННОЙ НОДЫ",
        restoreFromBlockHeight: "ВОССТАНОВИТЬ НАЧИНАЯ С ВЫСОТЫ БЛОКА",
        restoreFromDate: "ВОССТАНОВИТЬ НАЧИНАЯ С ДАТЫ",
        seedLanguage: "ЯЗЫК SEED-ФРАЗЫ",
        serviceNodeCommand: "КОМАНДА РЕГИСТРАЦИИ СЕРВИСНОЙ НОДЫ",
        serviceNodeKey: "КЛЮЧ СЕРВИСНОЙ НОДЫ",
        walletFile: "ФАЙЛ КОШЕЛЬКА",
        walletLogLevel: "УРОВЕНЬ ЛОГА КОШЕЛЬКА",
        walletName: "ИМЯ КОШЕЛЬКА",
        walletRPCPort: "RPC ПОРТ КОШЕЛЬКА",
        walletStoragePath: "ПАПКА КОШЕЛЬКА",

        // These are specific labels which do not get uppercased
        confirmNewPassword: "Подтвердите Новый Пароль",
        newPassword: "Новый Пароль",
        oldPassword: "Старый Пароль",
        rescanFullBlockchain: "Пересканировать весь блокчейн",
        rescanSpentOutputs: "Пересканировать потраченные выходы",
        transactionNotes: "Заметки Транзакции",
        chooseNetwork: "Выберите сеть",
        network: "Сеть"
    },
    footer: {
        ready: "СИНХРОНИЗИРОВАН",
        scanning: "СКАНИРОВАНИЕ",
        status: "Статус",
        syncing: "СИНХРОНИЗАЦИЯ",
        remote: "Удаленная нода",
        wallet: "Кошелек"
    },
    menuItems: {
        about: "Информация",
        changePassword: "Сменить Пароль",
        copyAddress: "Копировать адрес",
        copyQR: "Копировать QR код",
        copySeedWords: "Копировать seed-фразу",
        copySpendKey: "Копировать Ключ Отправки",
        copyTransactionId: "Копировать ID транзакции",
        copyViewKey: "Копировать Ключ Просмотра",
        createNewWallet: "Создать новый кошелек",
        deleteWallet: "Удалить Кошелек",
        exit: "Закрыть Кошелек Loki",
        importOldGUIWallet: "Импортировать кошельки из старого GUI",
        manageKeyImages: "Управлять Ключевыми Образами",
        openWallet: "Открыть кошелек",
        rescanWallet: "Пересканировать кошелек",
        restoreWalletFile: "Восстановить кошелек из файла",
        restoreWalletSeed: "Восстановить кошелек из seed-фразы",
        saveQR: "Сохранить QR код в файл",
        sendToThisAddress: "Отправить на этот адрес",
        settings: "Настройки",
        showDetails: "Показать подробности",
        showPrivateKeys: "Показать приватные ключи",
        showQRCode: "Показать QR Код",
        switchWallet: "Переключить Кошелек",
        viewOnExplorer: "Посмотреть в обозревателе блокчейна"
    },
    notification: {
        positive: {
            addressCopied: "Адрес скопирован в буфере",
            bannedPeer: "{host} забанен до {time}",
            copied: "{item} скопирован в буфер",
            itemSaved: "{item} сохранен в {filename}",
            keyImages: {
                exported: "Ключевые образы экспортированы в {filename}",
                imported: "Ключевые образы импортированы"
            },
            passwordUpdated: "Пароль обновлен",
            qrCopied: "QR код скопирован в буфер",
            registerServiceNodeSuccess: "Сервисная нода успешно зарегистрирована",
            sendSuccess: "Транзакция успешно отправлена",
            stakeSuccess: "Стейк успешно начат",
            transactionNotesSaved: "Заметка о транзакции сохранена"
        },
        errors: {
            banningPeer: "Ошибка бана пира",
            cannotAccessRemoteNode: "Не удалось подключиться к удаленной ноде, пожалуйста выберите другую ноду",
            changingPassword: "Ошибка смены пароля",
            copyWalletFail: "Не удалось скопировать кошелек",
            copyingPrivateKeys: "Не удалось скопировать приватные ключи",
            dataPathNotFound: "Папка хранилища данных не найдена",
            differentNetType: "Удаленная нода использует другой тип сети (nettype)",
            enterSeedWords: "Введите seed-фразу",
            enterWalletName: "Введите имя кошелька",
            errorSavingItem: "Ошибка сохранения {item}",
            failedServiceNodeUnlock: "Не удалось разблокировать сервисную ноду",
            failedToSetLanguage: "Не удалось переключить язык: {lang}",
            failedWalletImport: "Не удалось импортировать кошелек",
            failedWalletOpen: "Не удалось открыть кошелек. Попробуйте еще раз.",
            internalError: "Внутренняя ошибка",
            invalidAddress: "Адрес не верен",
            invalidAmount: "Сумма не верна",
            invalidOldPassword: "Старый пароль не верен",
            invalidPassword: "Неверный пароль",
            invalidPaymentId: "Payment id не верен",
            invalidPrivateViewKey: "Неверный приватный ключ просмотра",
            invalidPublicAddress: "Неверный публичный адрес",
            invalidRestoreDate: "Неверная дата восстановления",
            invalidRestoreHeight: "Неверная высота блока восстановления",
            invalidSeedLength: "Неверная длина seed-фразы",
            invalidServiceNodeCommand: "Пожалуйста введите команду регистрации сервисной ноды",
            invalidServiceNodeKey: "Ключ сервисной ноды указан неверно",
            invalidWalletPath: "Неверный путь к кошельку",
            keyImages: {
                exporting: "Ошибка экспорта ключевых образов",
                reading: "Ошибка чтения ключевых образов",
                importing: "Ошибка импорта ключевых образов"
            },
            negativeAmount: "Сумма не может быть отрицательной",
            newPasswordNoMatch: "Новые пароли не совпадают",
            newPasswordSame: "Новый пароль должен отличаться от старого",
            notEnoughBalance: "Разблокированный баланс недостаточен",
            passwordNoMatch: "Пароли не совпадают",
            remoteCannotBeReached: "Не удалось связаться с удаленным демоном",
            unknownError: "Произошла неизвестная ошибка",
            walletAlreadyExists: "Кошелек с таким именем уже существует",
            walletPathNotFound: "Путь к хранилищу данных кошелька не найден",
            zeroAmount: "Сумма должна быть больше нуля"
        },
        warnings: {
            noKeyImageExport: "Не найдено ключевых образов для экспорта",
            usingLocalNode: "Не удалось подключиться к удаленной ноде, переключаемся на локальную ноду",
            usingRemoteNode: "Не найден файл lokid, используется удаленная нода"
        }
    },
    placeholders: {
        additionalNotes: "Дополнительные заметки",
        addressBookName: "Имя для этого адреса",
        enterAnId: "Введите ID",
        hexCharacters: "Шестнадцатеричных символов: {count}",
        mnemonicSeed: "Seed-фраза, состоящая из 25 или 24 слов",
        selectAFile: "Пожалуйста, выберите файл",
        transactionNotes: "Дополнительные заметки для приосединения к транзакции",
        walletName: "Имя вашего кошелька",
        walletPassword: "Пароль кошелька (необязательно)"
    },
    strings: {
        addAddressBookEntry: "Добавить запись в адресную книгу",
        addressBookDetails: "Детальные данные адресной книги",
        addressBookIsEmpty: "Адресная книга пуста",
        addresses: {
            myPrimaryAddress: "Мой основной адрес",
            myUnusedAddresses: "Мои неиспользованные адреса",
            myUsedAddresses: "Мои использованные адреса",
            notYourAddress: "Не ваш адрес!",
            primaryAddress: "Основной адрес",
            subAddress: "Суб-адрес",
            yourPrimaryAddress: "Ваш основной адрес",
            yourUnusedAddress: "Ваш неиспользованный адрес",
            yourUsedAddress: "Ваш использованный адрес"
        },
        advancedOptions: "Расширенные настройки",
        bannedPeers: {
            title: "Забаненные пиры (баны будут сняты при перезагрузке кошелька)",
            bannedUntil: "Забанено до {time}"
        },
        blockHeight: "Высота блока",
        transactionConfirmed: "подтверждено",
        closing: "Закрытие",
        connectingToBackend: "Подключение...",
        daemon: {
            local: {
                title: "Только Локальная Нода",
                description: "Полная безопасность, кошелек загрузит весь блокчейн. Вы не сможете совершать платежи до завершения синхронизации."
            },
            localRemote: {
                title: "Локальная + Удаленная Нода",
                description: "Начните рабоать с кошельком быстрее, используя эту опцию (по-умолчанию). Кошелек загрузит весь блокчейн, но до окончания синхронизации будет использовать удаленную ноду."
            },
            remote: {
                title: "Только Удаленная Нода",
                description: "Меньшая безопасность, кошелек подключится к удаленной ноде для проведения всех транзакций."
            }
        },
        priorityOptions: {
            automatic: "Автоматически",
            slow: "Медленно",
            normal: "Нормально",
            fast: "Быстро",
            fastest: "Очень быстро"
        },
        destinationUnknown: "Назначение Неизвестно",
        editAddressBookEntry: "Редактировать запись адресной книги",
        loadingSettings: "Загрузка настроек",
        lokiBalance: "Баланс",
        lokiUnlockedBalance: "Разблокированый баланс",
        lokiUnlockedShort: "Разблокировано",
        noTransactionsFound: "Транзакции не найдены",
        notes: "Заметки",
        numberOfUnspentOutputs: "Количество непотраченных выходов",
        paymentID: "Payment ID",
        peerList: "Список пиров",
        readingWalletList: "Получение списка кошельков",
        recentIncomingTransactionsToAddress: "Недавние входящие транзакции на этот адрес",
        recentTransactionsWithAddress: "Недавние транзакции с этим адресом",
        rescanModalDescription: "Выберите полное пересканирование или персканирование только потраченных выходов.",
        saveSeedWarning: "Пожалуйста, скопируйте фразу и храните ее в безопасном месте!",
        saveToAddressBook: "Сохранить в адресной книге",
        seedWords: "Seed-фраза",
        selectLanguage: "Выберите язык",
        serviceNodeRegistrationDescription: "Введите команду {registerCommand}, созданную демоном при регистрации Сервисной Ноды с помощью команды \"{prepareCommand}\"",
        spendKey: "Ключ Отправки",
        startingDaemon: "Запуск демона",
        startingWallet: "Запуск кошелька",
        switchToDateSelect: "Переключиться на выбор даты",
        switchToHeightSelect: "Переключиться на выбор высоты блока",
        transactionID: "ID транзакции",
        transactions: {
            amount: "Сумма",
            description: "Транзакция: {type}",
            fee: "Комиссия",
            paidBySender: "оплачивается отправителем",
            received: "Получено",
            sent: "Отправлено",
            sentTo: "Транзакция отправлена: {type}",
            timestamp: "Отметка времени",
            types: {
                all: "Все",
                incoming: "Входящие",
                outgoing: "Исходящие",
                pending: "Ожидающие",
                pendingIncoming: "Ожидающие входящие",
                pendingOutgoing: "Ожидающие исходящие",
                miner: "Майнинг",
                serviceNode: "Сервисная Нода",
                governance: "Управление",
                stake: "Стейк",
                failed: "Не удавшиеся"
            }
        },
        unspentOutputs: "Непотраченные выходы",
        userNotUsedAddress: "Вы не использовали этот адрес",
        userUsedAddress: "Вы использовали этот адрес",
        viewKey: "Ключ Просмотра",
        viewOnlyMode: "Режим просмотра. Пожалуйста загрузите полный кошелек, чтобы отправлять монеты."
    },
    titles: {
        addressBook: "Адресная книга",
        addressDetails: "Данные адреса",
        changePassword: "Сменить пароль",
        configure: "Настройки",
        privateKeys: "Приватные ключи",
        rescanWallet: "Пересканировать кошелек",
        serviceNode: {
            registration: "РЕГИСТРАЦИЯ",
            staking: "СТЕЙК",
            unlock: "РАЗБЛОКИРОВКА"
        },
        settings: {
            title: "Настройки",
            tabs: {
                general: "Общие",
                language: "Язык",
                peers: "Пиры"
            }
        },
        transactionDetails: "Данные транзакции",
        transactions: "Транзакции",
        wallet: {
            createNew: "Создать новый кошелек",
            createdOrRestored: "Кошелек создан/восстановлен",
            importFromFile: "Импортировать кошелек из файла",
            importFromLegacyGUI: "Импортировать кошелек из предыдущего GUI",
            importFromOldGUI: "Импортировать кошелек из старого  GUI",
            restoreFromSeed: "Восстановить кошелек из seed-фразы",
            restoreViewOnly: "Восстановить кошелек только-для-чтения"
        },
        welcome: "Добро пожаловать",
        yourWallets: "Ваши Кошельки"
    }
}
