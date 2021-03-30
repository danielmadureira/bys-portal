<template>
  <CModal
      title="Criar uma nova sala"
      size="lg"
      centered
      :show="show"
      @update:show="updateShow"
  >
    <CForm>
      <CInput
          label="Nome da sala"
          placeholder="Nome que aparecerá na tela de salas"
          v-model="name"
      />
      <CTextarea
          label="Descrição da sala"
          placeholder="Descrição que aparecerá abaixo do nome da sala"
          rows="2"
          v-model="description"
      />
      <CInput
          label="Grupo da sala"
          value="Nome do grupo aqui"
          disabled
          v-model="group.name"
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
          @click="emitCloseModal(newRoom)"
      >
        Criar sala
      </CButton>
    </template>
  </CModal>
</template>

<script>
export default {
  name: 'ForumRoomCreateModal',
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
    },
    group: {
      type: Object,
      default() { return { }; }
    }
  },
  computed: {
    newRoom() {
      return {
        name: this.name,
        description: this.description,
        groupId: this.group.id
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
    emitCloseModal(createdRoom = null) {
      this.disabledActions = true;
      this.$emit('close-modal', createdRoom);
    }
  }
}
</script>
