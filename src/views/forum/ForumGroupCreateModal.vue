<template>
  <CModal
    title="Criar um novo grupo"
    size="lg"
    centered
    :show="show"
    @update:show="updateShow"
  >
    <CForm>
      <CInput
          label="Nome do grupo"
          placeholder="Nome que aparecerá na tela de grupos"
          v-model="name"
      />
      <CTextarea
          label="Descrição do grupo"
          placeholder="Descrição que aparecerá abaixo do nome do grupo"
          rows="2"
          v-model="description"
      />

      <CAlert v-if="saveError.length" show class="m-0" color="warning">
        <ul class="m-0">
          <li v-for="error in saveError" :key="error">{{ error }}</li>
        </ul>
      </CAlert>
    </CForm>

    <template #footer>
      <CButton
          color="secondary"
          :disabled="disabledActions"
          @click="emitCloseModal()"
      >
        Cancelar
      </CButton>
      <CButton
          color="success"
          :disabled="disabledActions"
          @click="emitCloseModal(newGroup)"
      >
        Criar grupo
      </CButton>
    </template>
  </CModal>
</template>

<script>
export default {
  name: 'ForumGroupCreateModal',
  data() {
    return {
      name: '',
      description: '',
      disabledActions: false
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    saveError: {
      type: Array,
      default: () => [ ]
    }
  },
  computed: {
    newGroup() {
      return {
        name: this.name,
        description: this.description
      };
    }
  },
  watch: {
    show(newValue) {
      if (newValue) {
        this.disabledActions = false;
        this.name = '';
        this.description = '';
      }
    },
    saveError() {
      this.disabledActions = false;
    }
  },
  methods: {
    updateShow(shouldShow) {
      if (!shouldShow) this.emitCloseModal();
    },
    emitCloseModal(createdGroup = null) {
      this.disabledActions = true;
      this.$emit('close-modal', createdGroup);
    }
  }
}
</script>
