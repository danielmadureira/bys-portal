<template>
  <div>
    <label>Conteúdo</label>

    <div style="position: relative; min-height: 300px;">
      <QuillEditor
          :options="options"
          @change="onEditorChange($event)"
      />
    </div>

    <small class="form-text text-muted w-100">Conteúdo do post</small>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor as QuillEditor } from 'vue-quill-editor'

export default {
  name: 'PostTextEditor',
  components: {
    QuillEditor
  },
  data() {
    return {
      options: {
        placeholder: 'Digite aqui o conteúdo do post'
      }
    }
  },
  methods: {
    onEditorChange(event) {
      this.$emit(
        'text-changed',
        `<div class="ql-container"><div class="ql-editor">${event.html}</div></div>`
      );
    }
  }
}
</script>

<style>
.ql-editor{
  min-height: 250px;
}
</style>
