import VueTimeago from "vue-timeago"
export default ({
    app,
    router,
    store,
    Vue
}) => {
    Vue.use(VueTimeago, {
        name: "Timeago",
        locale: "en",
        locales: {
            ru: require("date-fns/locale/ru")
        }
    })
}
