import VueI18n from "src/boot/vue-i18n";
import messages from "src/boot/src/i18n";
import { Quasar } from "src/boot/quasar";

let i18n;

export default ({ app, Vue }) => {
  Vue.use(VueI18n);

  // Set i18n instance on app
  app.i18n = new VueI18n({
    locale: "en-us",
    fallbackLocale: "en-us",
    messages
  });

  i18n = app.i18n;
};

const changeLanguage = lang => {
  const quasarLang = Quasar.i18n.lang;
  return new Promise((resolve, reject) => {
    import(`src/lang/${lang}`)
      .then(({ default: messages }) => {
        i18n.locale = lang;
        i18n.setLocaleMessage(lang, messages);

        // Setting the quasar language is optional
        // There may be cases where they don't have the language
        import(`quasar-framework/lang/${lang}`)
          .then(lang => {
            quasarLang.set(lang.default);
          })
          .catch(() => {
            console.warn(`Failed to set quasar language: ${lang}`);
          })
          .finally(() => {
            resolve(lang);
          });
      })
      .catch(() => {
        reject(new Error("Language not found"));
      });
  });
};

export { i18n, changeLanguage };
