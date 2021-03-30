<template>
  <div>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <slot name="header">
              <CIcon name="cil-comment-square"/>&nbsp;Comentários do forum
            </slot>
          </CCardHeader>
          <CCardBody>
            <!-- Table -->
            <ForumCommentTable
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
import ForumCommentTable from './ForumCommentTable';
import Dialog from '@/views/modal/Dialog';
import modalMixin from "@/mixins/modal-mixin";

export default {
  name: 'ForumCommentList',
  mixins: [ modalMixin ],
  components: {
    ForumCommentTable,
    Dialog
  },
  data() {
    return {
      removeModal: { ...modalMixin.data().modal }
    }
  },
  methods: {
    async confirmRemove(confirmed) {
      if (confirmed) {
        await this.$store.dispatch(
            'forumComment/deleteComment',
            this.removeModal.data.comment
        );
      }

      this.hideModal(this.removeModal);
      this.removeModal.data.comment = {};
    },
    triggerRemoveModal(comment) {
      let commentText = comment.text;
      if (commentText.length > 50) {
        commentText = comment.text.substr(0, 50);
        commentText += '...';
      }

      this.showModal(this.removeModal, {
        title: 'Remover comentário',
        message: `Tem certeza que deseja remove o comentário "${commentText}"?`,
        comment
      });
    }
  }
}
</script>
