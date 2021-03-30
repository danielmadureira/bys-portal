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
        :items="currentPagePosts"
        :fields="fields"
        :noItemsView="noItemLabels"
        striped
        hover
        border
        small
    >
      <template #id="{item}">
        <td>
          #{{ item['id'] }}
        </td>
      </template>
      <template #created_at="{item}">
        <td>{{ formatDate(item.created_at) }}</td>
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
import { mapState } from 'vuex';

export default {
  name: 'PostsTable',
  data() {
    return {
      fields: [
        { key: 'id', label: 'Identificador' },
        { key: 'title', label: 'Título' },
        { key: 'headline', label: 'Headline' },
        { key: 'created_at', label: 'Data de criação', },
        { key: 'actions', label: 'Remover' }
      ],
      noItemLabels: {
        noResults: 'Nenhum resultado para a pesquisa',
        noItems: 'Nada para exibir'
      }
    }
  },
  computed: {
    ...mapState('feedPost', {
      isLoading: 'downloadInProgress',
      currentPage: 'currentPage',
      numberOfPages: 'numberOfPages'
    }),
    currentPagePosts() {
      return this.$store.state.feedPost.paginatedRecords[this.currentPage]
    }
  },
  methods: {
    emitRemove(record) {
      this.$emit('click-remove', record);
    },
    async pageChange(pageNumber) {
      await this.$store.dispatch('feedPost/assertPageExists', pageNumber);
      this.$store.commit('feedPost/setCurrentPage', pageNumber);
    },
    formatDate(date) {
      if (!date) return '- - -';
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
