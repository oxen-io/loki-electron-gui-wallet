import VueTimeago from "vue-timeago";
export default ({ Vue }) => {
  Vue.use(VueTimeago, {
    name: "Timeago",
    locale: "en",
    locales: {
      ru: require("date-fns/locale/ru"),
      de: require("date-fns/locale/de"),
      fr: require("date-fns/locale/fr"),
      es: require("date-fns/locale/es"),
      pt: require("date-fns/locale/pt")
    }
  });
};
