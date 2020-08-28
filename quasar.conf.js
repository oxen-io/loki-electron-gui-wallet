/* eslint-disable no-template-curly-in-string */
// Configuration for your app

module.exports = function() {
  return {
    // app boot (/src/boot)
    boot: ["i18n", "axios", "vuelidate", "gateway", "timeago"],
    css: ["app.styl", "~flag-icon-css/css/flag-icon.min.css"],
    extras: [
      // ctx.theme.mat ? "roboto-font" : null,
      "material-icons" // optional, you are not bound to it
      // "ionicons-v4",
      // "mdi-v5",
      // "fontawesome-v5"
    ],
    supportIE: false,
    build: {
      scopeHoisting: true,
      vueRouterMode: "history",
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack() {
        /*
                cfg.module.rules.push({
                    enforce: "pre",
                    test: /\.(js|vue)$/,
                    loader: "eslint-loader",
                    exclude: /(node_modules|quasar)/
                })
                */
      },
      chainWebpack(chain) {
        chain.module
          .rule("images")
          .use("url-loader")
          .tap(options => {
            options.name = "img/[path][name].[ext]";
            return options;
          });
      }
    },
    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },
    // framework: "all" --- includes everything; for dev only!
    framework: {
      components: [
        "QLayout",
        "QHeader",
        "QFooter",
        "QDrawer",
        "QPageContainer",
        "QPage",
        "QToolbar",
        "QToolbarTitle",
        "QTooltip",
        "QField",
        "QInput",
        "QRadio",
        "QOptionGroup",
        "QBtn",
        "QBtnToggle",
        "QIcon",
        "QTabs",
        "QTab",
        "QRouteTab",
        "QBtnDropdown",
        "QMenu",
        "QDialog",
        "QStep",
        "QStepper",
        "QStepperNavigation",
        "QSpinner",
        "QList",
        "QItemLabel",
        "QItem",
        "QSeparator",
        "QItemSection",
        "QSelect",
        "QToggle",
        "QPageSticky",
        "QExpansionItem",
        "QCheckbox",
        "QInnerLoading",
        "QInfiniteScroll",
        "QDate",
        "QTime",
        "QScrollArea"
      ],
      directives: ["Ripple"],
      // Quasar plugins
      plugins: ["Notify", "Loading", "LocalStorage", "Dialog"]
      // iconSet: ctx.theme.mat ? "material-icons" : "ionicons-v4"
      // i18n: "de" // Quasar language
    },
    // animations: "all" --- includes all animations
    animations: [],
    pwa: {
      // workboxPluginMode: "InjectManifest",
      // workboxOptions: {},
      manifest: {
        // name: "Quasar App",
        // short_name: "Quasar-PWA",
        // description: "Best PWA App in town!",
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#43BD43",
        icons: [
          {
            src: "statics/icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    },
    cordova: {
      // id: "org.cordova.quasar.app"
    },
    electron: {
      bundler: "builder", // or "packager"
      extendWebpack() {
        // cfg
        // do something with Electron process Webpack cfg
      },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: "",
        // appCategoryType: "",
        // osxSign: "",
        // protocol: "myapp://path",

        // Window only
        // win32metadata: { ... }

        extraResource: ["bin"]
      },
      builder: {
        // https://www.electron.build/configuration/configuration

        appId: "com.loki-project.electron-wallet",
        productName: "Loki Electron Wallet",
        copyright: "Copyright © 2018-2019 Loki Project, 2018 Ryo Currency Project",
        afterSign: "build/notarize.js",
        artifactName: "loki-electron-wallet-${version}-${os}.${ext}",
        publish: "github",

        linux: {
          target: ["AppImage", "deb"],
          icon: "src-electron/icons/icon_512x512.png",
          category: "Finance"
        },

        mac: {
          // We need zip for auto-updating
          // Ref: https://github.com/electron-userland/electron-builder/issues/2199
          target: ["dmg", "zip"],
          icon: "src-electron/icons/icon.icns",
          category: "public.app-category.finance",
          // Notarizing: https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/
          hardenedRuntime: true,
          gatekeeperAssess: false,
          entitlements: "build/entitlements.mac.plist",
          entitlementsInherit: "build/entitlements.mac.plist"
        },

        dmg: {
          background: "src-electron/build/loki-dmg.tiff",
          sign: false
        },

        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true
        },

        files: ["!build/*.js", "!.env", "!dev-app-update.yml"],

        extraResources: ["bin"]
      }
    }
  };
};
