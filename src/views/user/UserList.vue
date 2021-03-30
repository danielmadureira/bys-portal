<template>
  <div>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <slot name="header">
              <CIcon name="cil-group"/>&nbsp;Todos os usuários
            </slot>
          </CCardHeader>
          <CCardBody>
            <!-- Table -->
            <UserTable
                @click-privilege="triggerRevokeModal"
                @click-remove="triggerRemoveModal"
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <Dialog
        :title="privModal.data.title"
        :message="privModal.data.message"
        :confirm-button-options="privModal.data.buttonOptions"
        :show="privModal.show"
        @close-modal="confirmRevoke"
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
import UserTable from './UserTable';
import Dialog from '@/views/modal/Dialog';
import modalMixin from "@/mixins/modal-mixin";

export default {
  name: 'UserList',
  mixins: [ modalMixin ],
  components: {
    UserTable,
    Dialog
  },
  data() {
    return {
      privModal: { ...modalMixin.data().modal },
      removeModal: { ...modalMixin.data().modal }
    };
  },
  methods: {
    async confirmRemove(confirmed) {
      if (confirmed) {
        await this.$store.dispatch(
            'user/deleteUser',
            this.removeModal.data.user
        );
      }

      this.hideModal(this.removeModal);
      this.removeModal.data.user = { };
    },
    async confirmRevoke(confirmed) {
      if (confirmed) {
        await this.$store.dispatch(
            'user/togglePrivileges',
            this.privModal.data.user
        );
      }

      this.hideModal(this.privModal);
      this.privModal.data.user = { };
    },
    triggerRemoveModal(user) {
      this.showModal(this.removeModal, {
        title: 'Remover usuário',
        message: `Tem certeza que deseja remover o usuário "${user.name}"?`,
        user
      });
    },
    triggerRevokeModal(user) {
      let term = 'Conceder';
      let color = 'success';
      if (user.user_type === 'ADMIN') {
        term = 'Revogar';
        color = 'warning';
      }

      const message = `Tem certeza que deseja ${term.toLowerCase()} os`
          + ` privilégios de administrador de ${user.name}?`;

      this.showModal(this.privModal, {
        title: `${term} privilégios de administrador`,
        message,
        buttonOptions: { label: 'Confirmar', color },
        user
      });
    }
  }
}
</script>
