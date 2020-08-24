import { Gateway } from "src/gateway/gateway";

/* This plugin gets called early in the life-cycle
   In the future, we can detect what platform we
   are on and include the correct gateway.

   The gateway just gets stored into the app global
   object to be called from anywhere within the
   frontend
*/

export default ({ app, router, Vue }) => {
  Vue.prototype.$gateway = new Gateway(app, router);
};
