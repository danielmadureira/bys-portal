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
      <template #created_at="{item}">
        <td>
          {{ formatDate(item.created_at) }}
        </td>
      </template>
      <template #actions="{item}">
        <td>
          <div class="d-flex justify-content-center">
            <CButtonGroup>
              <CButton
                  color="success"
                  size="sm"
                  :disabled="isLoading"
                  @click="emitCreateRoom(item)"
              >
                Criar&nbsp;sala
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
  name: 'ForumGroupTable',
  data() {
    return {
      fields: [
        { key: 'id', label: 'Identificador' },
        { key: 'name', label: 'Nome do grupo' },
        { key: 'description', label: 'Descrição' },
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
    ...mapState('forumRoom', {
      isRoomLoading: 'downloadInProgress',
    }),
    ...mapState('forumGroup', {
      isGroupLoading: 'downloadInProgress',
      currentPage: 'currentPage',
      numberOfPages: 'numberOfPages'
    }),
    currentPageRecords() {
      return this.$store.state.forumGroup.paginatedRecords[this.currentPage]
    },
    isLoading() {
      return (this.isGroupLoading || this.isRoomLoading)
    }
  },
  methods: {
    emitCreateRoom(group) {
      this.$emit('click-create-room', group);
    },
    emitRemove(group) {
      this.$emit('click-remove', group);
    },
    async pageChange(pageNumber) {
      await this.$store.dispatch('forumGroup/assertPageExists', pageNumber);
      this.$store.commit('forumGroup/setCurrentPage', pageNumber);
    },
    formatDate(date) {
      return [
        date.getDate(),
        `0${(date.getMonth() + 1)}`.substr(-2),
        date.getFullYear()
      ].join('/');
    }
  },
  async mounted() {
    await this.pageChange(1);
  }
}
</script>
