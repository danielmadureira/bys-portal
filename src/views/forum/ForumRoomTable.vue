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
      <template #group_name="{item}">
        <td>
          {{ getGroupName(item) }}
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
            <CButton
                color="danger"
                size="sm"
                :disabled="isLoading"
                @click="emitRemove(item)"
            >
              Remover
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
  name: 'ForumRoomTable',
  data() {
    return {
      fields: [
        { key: 'id', label: 'Identificador' },
        { key: 'name', label: 'Nome' },
        { key: 'description', label: 'Descrição' },
        { key: 'group_name', label: 'Grupo' },
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
      isLoading: 'downloadInProgress',
      currentPage: 'currentPage',
      numberOfPages: 'numberOfPages'
    }),
    currentPageRecords() {
      return this.$store.state.forumRoom.paginatedRecords[this.currentPage]
    }
  },
  methods: {
    emitRemove(room) {
      this.$emit('click-remove', room);
    },
    async pageChange(pageNumber) {
      await this.$store.dispatch('forumRoom/assertPageExists', pageNumber);
      this.$store.commit('forumRoom/setCurrentPage', pageNumber);
    },
    formatDate(date) {
      if (!date) return '- - -';
      return [
        date.getDate(),
        `0${(date.getMonth() + 1)}`.substr(-2),
        date.getFullYear()
      ].join('/');
    },
    getGroupName(room) {
      let roomName = '- - -';
      if (room.forum_group) {
        roomName = room.forum_group.name;
      }

      return roomName;
    }
  },
  async mounted() {
    await this.pageChange(1);
  }
}
</script>
