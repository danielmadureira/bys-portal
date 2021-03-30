<template>
  <CFooter :fixed="false">
    <div>
      <span class="ml-1">
        &copy; {{new Date().getFullYear()}}
        <a href="https://bys-app.com" target="_blank">By Your Side</a>
      </span>
    </div>
    <div class="mfs-auto">
      <span class="mr-1" target="_blank">Powered by</span>
      <a href="https://coreui.io/vue">CoreUI for Vue</a>
    </div>
  </CFooter>
</template>

<script>
export default {
  name: 'TheFooter'
}
</script>
