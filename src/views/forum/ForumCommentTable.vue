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
      <template #author="{item}">
        <td>
          {{ getAuthorName(item) }}
        </td>
      </template>
      <template #room="{item}">
        <td>
          {{ getRoomName(item) }}
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
  name: 'ForumCommentTable',
  data() {
    return {
      fields: [
        { key: 'id', label: 'Identificador' },
        { key: 'author', label: 'Autor' },
        { key: 'room', label: 'Sala' },
        { key: 'text', label: 'Texto' },
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
    ...mapState('forumComment', {
      isLoading: 'downloadInProgress',
      currentPage: 'currentPage',
      numberOfPages: 'numberOfPages'
    }),
    currentPageRecords() {
      return this.$store.state.forumComment.paginatedRecords[this.currentPage]
    }
  },
  methods: {
    emitRemove(room) {
      this.$emit('click-remove', room);
    },
    async pageChange(pageNumber) {
      await this.$store.dispatch('forumComment/assertPageExists', pageNumber);
      this.$store.commit('forumComment/setCurrentPage', pageNumber);
    },
    formatDate(date) {
      return [
        date.getDate(),
        `0${(date.getMonth() + 1)}`.substr(-2),
        date.getFullYear()
      ].join('/');
    },
    getAuthorName(comment) {
      let authorName = '- - -';
      if (comment.created_by) {
        authorName = comment.created_by.name;
      }

      return authorName;
    },
    getRoomName(comment) {
      let roomName = '- - -';
      if (comment.forum_room) {
        roomName = comment.forum_room.name;
      }

      return roomName;
    }
  },
  async mounted() {
    await this.pageChange(1);
  }
}
</script>
