<template>
  <div>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <slot name="header">
              <CRow>
                <CCol>
                  <CIcon name="cil-notes"/>&nbsp;Posts do feed
                </CCol>
                <CCol col="2">
                  <router-link to="/pages/feed/post/new">
                    <CButton color="success" size="sm" block>
                      Criar&nbsp;novo&nbsp;post
                    </CButton>
                  </router-link>
                </CCol>
              </CRow>
            </slot>
          </CCardHeader>
          <CCardBody>
            <!-- Table -->
            <PostsTable
              @click-remove="triggerRemoveModal"
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <Dialog
      :title="removeModal.data.title"
      :message="removeModal.data.message"
      :show="removeModal.show"
      :confirm-button-options="{ label: 'Remover', color: 'danger' }"
      @close-modal="confirmRemove"
    />
  </div>
</template>

<script>
import PostsTable from './PostsTable';
import Dialog from '@/views/modal/Dialog';
import modalMixin from "@/mixins/modal-mixin";

export default {
  name: 'PostList',
  mixins: [ modalMixin ],
  components: {
    PostsTable,
    Dialog
  },
  data() {
    return {
      removeModal: { ...modalMixin.data().modal }
    };
  },
  methods: {
    async confirmRemove(confirmed) {
      if (confirmed) {
        await this.$store.dispatch(
            'feedPost/deletePost',
            this.removeModal.data.post
        );
      }

      this.hideModal(this.removeModal);
      this.removeModal.data.post = { };
    },
    triggerRemoveModal(post) {
      this.showModal(this.removeModal, {
        title: 'Remover post',
        message: `Tem certeza que deseja remove o post "${post.title}"?`,
        post
      });
    }
  }
}
</script>
