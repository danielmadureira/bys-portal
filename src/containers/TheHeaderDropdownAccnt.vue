<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNav class="c-nav">
        <CHeaderNavItem class="p-2 text-black-50 d-md-down-none">
          {{ userName }}
        </CHeaderNavItem>
        <CHeaderNavLink>
          <div class="c-avatar">
            <img
                :src="userImage"
                class="c-avatar-img h-100"
            />
          </div>
        </CHeaderNavLink>
      </CHeaderNav>
    </template>
    <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>Opções</strong>
    </CDropdownHeader>
<!--    <CDropdownItem>-->
<!--      <CIcon name="cil-face"/>-->
<!--      <p class="m-0 pl-2">Perfil</p>-->
<!--    </CDropdownItem>-->
    <CDropdownItem @click="logout">
      <CIcon name="cil-lock-locked" />
      <p class="m-0 pl-2">Logout</p>
    </CDropdownItem>
  </CDropdown>
</template>

<script>
export default {
  name: 'TheHeaderDropdownAccnt',
  computed: {
    userName() {
      return this.$store.state.user.name;
    },
    userImage() {
      const stockPic = require('../../public/img/avatars/1.png');
      return this.$store.state.user.profile_picture || stockPic;
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout');
      this.$router.push({ name: 'Login' });
    }
  }
}
</script>

<style scoped>
  .c-nav {
    cursor: pointer; user-select: none;
  }
</style>
