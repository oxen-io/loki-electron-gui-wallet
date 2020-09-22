<template>
  <div class="language-select column items-center justify-center">
    <h6 class="q-my-md" style="font-weight: 300">
      {{ $t("strings.selectLanguage") }}:
    </h6>
    <div class="row justify-center">
      <q-btn
        v-for="option in options"
        :key="option.value"
        class="row justify-center items-center"
        :color="lang === option.value ? 'primary' : 'secondary'"
        size="md"
        @click="setLanguage(option.value)"
      >
        <span :class="`flag-icon flag-icon-${option.flag}`" />
        <span>{{ option.label }}</span>
      </q-btn>
    </div>
  </div>
</template>

<script>
import { languages } from "src/i18n";

export default {
  name: "LanguageSelect",
  computed: {
    lang() {
      return this.$i18n.locale;
    },
    options() {
      return languages.map(lang => ({
        label: lang.name,
        value: lang.code,
        flag: lang.flag
      }));
    }
  },
  methods: {
    setLanguage(lang) {
      this.$gateway.send("core", "set_language", { lang });
      this.$emit("select", lang);
    }
  }
};
</script>

<style lang="scss">
.language-select {
  .q-btn {
    margin: 2px;
  }

  .flag-icon {
    margin-right: 4px;
  }
}
</style>
