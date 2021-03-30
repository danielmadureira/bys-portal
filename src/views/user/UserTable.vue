<template>
  <div>
    <CRow>
      <CCol>
        <CPagination
            :activePage="currentPage"
            :pages="numberOfPages"
            @update:activePage="pageChange"
        />
      </CCol>
      <CCol>
        <CAlert
            color="warning"
            class="m-0 p-2"
            :show="isLoading"
        >
          Carregando dados
        </CAlert>
      </CCol>
    </CRow>

    <CDataTable
        :items="currentPageRecords"
        :fields="fields"
        :noItemsView="noItemLabels"
        striped
        hover
        border
        small
    >
      <template #id="{item}">
        <td>
          #{{ item.id }}
        </td>
      </template>
      <template #profession="{item}">
        <td>
          {{ item.profession || '- - -' }}
        </td>
      </template>
      <template #user_type="{item}">
        <td>
          {{ getUserTypeName(item) }}
        </td>
      </template>
      <template #created_at="{item}">
        <td>
          {{ formatDate(item.created_at) }}
        </td>
      </template>
      <template #actions="{item}">
        <td>
          <div class="d-flex justify-content-center">
            <CButtonGroup v-if="hasActions(item)">
              <CButton
                  :color="getAdminButtonColor(item)"
                  size="sm"
                  :disabled="isLoading"
                  @click="emitPrivilegeEvent(item)"
              >
                {{ getAdminButtonLabel(item) }}
              </CButton>
              <CButton
                  color="danger"
                  size="sm"
                  :disabled="isLoading"
                  @click="emitRemove(item)"
              >
                Remover
              </CButton>
            </CButtonGroup>
            <CButton
                v-else
                color="secondary"
                size="sm"
                disabled
            >
              Nenhuma ação disponível
            </CButton>
          </div>
        </td>
      </template>
    </CDataTable>

    <CPagination
        :activePage="currentPage"
        :pages="numberOfPages"
        @update:activePage="pageChange"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: 'UserTable',
  data() {
    return {
      fields: [
        { key: 'id', label: 'Identificador' },
        { key: 'name', label: 'Nome' },
        { key: 'email', label: 'E-mail' },
        { key: 'profession', label: 'Profissão', },
        { key: 'user_type', label: 'Tipo', },
        { key: 'created_at', label: 'Data de criação', },
        { key: 'actions', label: 'Ações' }
      ],
      noItemLabels: {
        noResults: 'Nenhum resultado para a pesquisa',
        noItems: 'Nada para exibir'
      }
    }
  },
  computed: {
    ...mapState('user', {
      isLoading: 'downloadInProgress',
      currentPage: 'currentPage',
      numberOfPages: 'numberOfPages'
    }),
    currentPageRecords() {
      return this.$store.state.user.paginatedRecords[this.currentPage]
    }
  },
  methods: {
    emitPrivilegeEvent(user) {
      this.$emit('click-privilege', user);
    },
    emitRemove(user) {
      this.$emit('click-remove', user);
    },
    async pageChange(pageNumber) {
      await this.$store.dispatch('user/assertPageExists', pageNumber);
      this.$store.commit('user/setCurrentPage', pageNumber);
    },
    formatDate(date) {
      return [
        date.getDate(),
        `0${(date.getMonth() + 1)}`.substr(-2),
        date.getFullYear()
      ].join('/');
    },
    hasActions(user) {
      return !(user.id === 1 || user.id === this.$store.state.user.id);
    },
    getUserTypeName(user) {
      if (user.user_type === 'ADMIN') {
        return 'Administrador';
      }
      return 'Usuário';
    },
    getAdminButtonColor(user) {
      if (user.user_type === 'ADMIN') {
        return 'warning';
      }
      return 'success';
    },
    getAdminButtonLabel(user) {
      if (user.user_type === 'ADMIN') {
        return 'Revogar privilégios';
      }
      return 'Conceder privilégios';
    }
  },
  async mounted() {
    await this.pageChange(1);
  }
}
</script>
