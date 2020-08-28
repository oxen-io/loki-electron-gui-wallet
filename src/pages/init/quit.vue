<template>
  <q-page>
    <div class="init-screen-page text-center">
      <div class="absolute-center">
        <img src="loki.svg" width="400" class="q-mb-md" />

        <div class="q-mt-xl q-mb-lg">
          <q-spinner color="primary" :size="30" />
        </div>

        <div class="message">{{ $t("strings.closing") }}...</div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {};
</script>

<style lang="scss">
.init-screen-page {
  height: 100vh;
  position: relative;
}
</style>
