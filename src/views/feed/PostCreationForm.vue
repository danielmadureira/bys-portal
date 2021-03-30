<template>
  <div>
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <CIcon name="cil-newspaper"/>&nbsp;Novo post
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CInput
                  label="Título do post"
                  placeholder="Este é o título que aparecerá no feed"
                  v-model="title"
              />
              <CInput
                  label="Headline do post"
                  placeholder="Este é o trecho que aparecerá abaixo do título do post"
                  v-model="headline"
              />
              <PostTextEditor
                  @text-changed="setText"
              />
              <br/>
              <hr/>
              <CInputFile
                  label="Imagem do post"
                  description="Esta é a imagem do post"
                  accept="image/jpg,image/jpeg,image/png,image/gif"
                  @change="setFile"
              />
              <CInput
                  label="Descrição da imagem"
                  placeholder="Esta é a descrição vertical que aparecerá ao lado da imagem durante a leitura do post [Opcional]"
                  v-model="picture_description"
              />
            </CForm>
            <CAlert v-if="errors.length" show class="m-0" color="warning">
              <ul class="m-0">
                <li v-for="error in errors" :key="error">{{ error }}</li>
              </ul>
            </CAlert>
          </CCardBody>
          <CCardFooter>
            <CButton
                type="submit"
                color="success"
                :disabled="isLoading"
                @click="submitForm"
            >
              Salvar
            </CButton>
            &nbsp;
            <small v-if="isLoading">Carregando</small>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import PostTextEditor from './PostTextEditor';
import { DisplayableError } from "@/errors";
import modalMixin from "@/mixins/modal-mixin";

export default {
  name: 'PostCreationForm',
  mixins: [ modalMixin ],
  components: {
    PostTextEditor
  },
  props: {
    postToEdit: Object
  },
  data() {
    return {
      isLoading: false,
      errors: [ ],
      title: '',
      text: '',
      headline: '',
      picture: null,
      picture_description: ''
    };
  },
  methods: {
    setText(text) {
      this.text = text;
    },
    setFile(files) {
      this.picture = files[0];
    },
    async submitForm() {
      this.errors = [ ];
      this.isLoading = true;
      const postData = {
        title: this.title,
        text: this.text,
        headline: this.headline,
        picture: this.picture,
        picture_description: this.picture_description
      };

      try {
        await this.$store.dispatch('feedPost/createPost', postData);

        this.$router.push({ name: 'Posts' });
      } catch (error) {
        if (error instanceof DisplayableError) {
          this.errors = error.data;
        } else {
          this.errors = [ `Houve um erro ao tentar salvar este post` ];
        }
      }

      this.isLoading = false;
    }
  }
}
</script>
