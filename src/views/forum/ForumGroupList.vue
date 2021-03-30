<template>
  <div>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <slot name="header">
              <CRow>
                <CCol>
                  <CIcon name="cil-group"/>&nbsp;Grupos do forum
                </CCol>
                <CCol col="2">
                  <CButton
                      color="success"
                      size="sm"
                      block
                      @click="showModal(createGroupModal, { error: [ ] })"
                  >
                    Criar&nbsp;novo&nbsp;grupo
                  </CButton>
                </CCol>
              </CRow>
            </slot>
          </CCardHeader>
          <CCardBody>
            <!-- Table -->
            <ForumGroupTable
              @click-create-room="triggerCreateRoomModal"
              @click-remove="triggerRemoveModal"
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <ForumRoomCreateModal
      :show="createRoomModal.show"
      :group="createRoomModal.data.group"
      :save-error="createRoomModal.data.error"
      @close-modal="confirmCreateRoom"
    />
    <ForumGroupCreateModal
        :show="createGroupModal.show"
        :save-error="createGroupModal.data.error"
        @close-modal="confirmCreateGroup"
    />
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
import ForumGroupTable from './ForumGroupTable';
import ForumRoomCreateModal from './ForumRoomCreateModal';
import ForumGroupCreateModal from './ForumGroupCreateModal';
import Dialog from '@/views/modal/Dialog';
import modalMixin from "@/mixins/modal-mixin";

export default {
  name: 'FormGroupList',
  mixins: [ modalMixin ],
  components: {
    ForumGroupTable,
    ForumRoomCreateModal,
    ForumGroupCreateModal,
    Dialog
  },
  data() {
    return {
      createRoomModal: { ...modalMixin.data().modal },
      createGroupModal: { ...modalMixin.data().modal },
      removeModal: { ...modalMixin.data().modal }
    };
  },
  methods: {
    async confirmCreateGroup(group) {
      if (group !== null) {
        try {
          await this.$store.dispatch('forumGroup/createGroup', group);
          this.createGroupModal.data.group = { };
        } catch (error) {
          this.createGroupModal.data.error = error.data;
          return;
        }
      }
      this.hideModal(this.createGroupModal);
    },
    async confirmCreateRoom(room) {
      if (room !== null) {
        try {
          await this.$store.dispatch('forumRoom/createRoom', room);
          this.$router.push({ name: 'Salas' });
        } catch (error) {
          this.createRoomModal.data.error = error.data;
          return;
        }
      }
      this.hideModal(this.createRoomModal);
    },
    async confirmRemove(confirmed) {
      if (confirmed) {
        await this.$store.dispatch(
            'forumGroup/deleteGroup',
            this.removeModal.data.group
        );
      }

      this.hideModal(this.removeModal);
      this.removeModal.data.group = { };
    },
    triggerRemoveModal(group) {
      this.showModal(this.removeModal, {
        title: 'Remover grupo',
        message: `Tem certeza que deseja remover o grupo "${group.name}"?`,
        group
      });
    },
    triggerCreateRoomModal(group) {
      this.showModal(this.createRoomModal, { group, error: [  ] });
    }
  }
}
</script>
