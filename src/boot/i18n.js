import VueI18n from "vue-i18n";
import messages from "src/i18n";
import { Quasar } from "quasar";

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
  console.log("changeLanguage, lang: " + lang);
  const quasarLang = Quasar.lang;
  console.log("quasarLang is: ");
  console.log(quasarLang);
  return new Promise((resolve, reject) => {
    import(`src/i18n/${lang}`)
      .then(({ default: messages }) => {
        i18n.locale = lang;
        i18n.setLocaleMessage(lang, messages);

        // Setting the quasar language is optional
        // There may be cases where they don't have the language
        import(`quasar/lang/${lang}`)
          .then(resultLang => {
            console.log("lang in import and lang.default are:");
            console.log(resultLang);
            console.log(resultLang.default);
            quasarLang.set(resultLang.default);
          })
          .catch(() => {
            console.warn(`Failed to set quasar language: ${lang}`);
          })
          .finally(() => {
            console.log("lang in resolve: " + lang);
            resolve(lang);
          });
      })
      .catch(() => {
        reject(new Error("Language not found"));
      });
  });
};

export { i18n, changeLanguage };
