<template>
  <div>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <slot name="header">
              <CIcon name="cil-room"/>&nbsp;Salas do forum
            </slot>
          </CCardHeader>
          <CCardBody>
            <!-- Table -->
            <ForumRoomTable
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
import ForumRoomTable from './ForumRoomTable';
import Dialog from '@/views/modal/Dialog';
import modalMixin from "@/mixins/modal-mixin";

export default {
  name: 'ForumRoomList',
  mixins: [ modalMixin ],
  components: {
    ForumRoomTable,
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
            'forumRoom/deleteRoom',
            this.removeModal.data.room
        );
      }

      this.hideModal(this.removeModal);
      this.removeModal.data.room = { };
    },
    triggerRemoveModal(room) {
      this.showModal(this.removeModal, {
        title: 'Remover sala',
        message: `Tem certeza que deseja remove a sala "${room.name}"?`,
        room
      });
    }
  }
}
</script>
