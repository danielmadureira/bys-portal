<template>
  <CModal
      :title="title"
      size="lg"
      centered
      :show="show"
      @update:show="updateShow"
  >
    <p>
      {{ message }}
    </p>
    <template #footer>
      <CButton
          color="secondary"
          :disabled="disabledActions"
          @click="emitCloseModal(false)"
      >
        Cancelar
      </CButton>
      <CButton
          :color="confirmButtonOptions.color"
          :disabled="disabledActions"
          @click="emitCloseModal(true)"
      >
        {{ confirmButtonOptions.label }}
      </CButton>
    </template>
  </CModal>
</template>

<script>
export default {
  name: 'Dialog',
  data() {
    return {
      disabledActions: false
    };
  },
  props: {
    title: {
      type: String,
      default: 'Confirmar',
    },
    message: {
      type: String,
      default: 'Tem certeza de que deseja prosseguir com a operação?'
    },
    confirmButtonOptions: {
      type: Object,
      default() {
        return {
          label: 'Confirmar',
          color: 'primary'
        }
      }
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    show(newValue) {
      if (newValue) {
        this.disabledActions = false;
      }
    }
  },
  methods: {
    updateShow(shouldShow) {
      if (!shouldShow) this.emitCloseModal(false);
    },
    emitCloseModal(hasConfirmed) {
      this.disabledActions = true;
      this.$emit('close-modal', hasConfirmed);
    }
  }
}
</script>

<style></style>
