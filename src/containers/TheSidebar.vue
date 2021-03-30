<template>
  <CSidebar
    fixed
    :minimize="minimize"
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
  >
    <CSidebarBrand class="d-md-down-none" to="/">
      <CImg
          :src="require('../../public/img/bys-logo.png')"
          class="brand-image"
          alt="Logo By Your Side"
          fluid-grow
      />
    </CSidebarBrand>

    <CRenderFunction flat :content-to-render="$options.nav"/>
  </CSidebar>
</template>

<script>
import nav from './_nav'

export default {
  name: 'TheSidebar',
  nav,
  computed: {
    show () {
      return this.$store.state.sidebarShow
    },
    minimize () {
      return this.$store.state.sidebarMinimize
    }
  }
}
</script>

<style scoped>
.brand-image {
  max-width: 70%;
  margin: 5px;
}
</style>
