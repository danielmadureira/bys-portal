<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="4">
          <CCard
              text-color="white"
              class="text-center py-2 d-md-down-none"
              body-wrapper
          >
            <CCardBody>
              <CImg
                  :src="require('../../../public/img/bys-logo.png')"
                  alt="Logo By Your Side"
                  fluid-grow
              />
              <CContainer class="mt-5">
                <CRow>
                  <CCol>
                    <h3 class="text-black-50">Carregando dados</h3>
                  </CCol>
                </CRow>

                <template v-if="error">
                  <CRow>
                    <CCol>
                      <CAlert show class="mt-0 mb-1" color="warning">
                        <p class="m-0">
                          Houve um erro ao tentar carregar os dados.
                        </p>
                      </CAlert>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol class="m-0">
                      <CButton color="link" size="sm" @click="$router.go()">
                        Clique aqui para recarregar a página.
                      </CButton>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CButton color="link" size="sm" @click="redirectToLogin">
                        Clique aqui para realizar login novamente.
                      </CButton>
                    </CCol>
                  </CRow>
                </template>

                <CRow>
                  <CCol>
                    <CProgress class="mt-1" :max="100" show-value>
                      <CProgressBar
                          :value="progress"
                          color="gradient-success"
                          show-percentage
                      />
                    </CProgress>
                  </CCol>
                </CRow>
              </CContainer>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import { HTTPError } from "@/errors";
import { HTTP_STATUS_CODE } from "@/enums";
import { AuthToken } from "@/adapters";

export default {
  name: 'Loader',
  data() {
    return {
      error: false
    }
  },
  props: {
    redirectTo: {
      type: String,
      default: 'Root'
    }
  },
  computed: {
    progress() {
      return this.$store.state.loadingProgress;
    }
  },
  methods: {
    async redirect() {
      let destination = this.redirectTo;
      if (destination === 'Loader') {
        destination = 'Root';
      }

      await this.$router.push({ name: destination });
    },
    async redirectToLogin() {
      AuthToken.delete();
      await this.$router.push({ name: 'Login' })
    },
    sleep(ms) {
      return new Promise(res => {
        setTimeout(res, ms);
      });
    }
  },
  async mounted() {
    this.error = false;
    try {
      await this.$store.dispatch('loadBaseData');
      await this.sleep(500); // waits for the animation to finish
      await this.redirect();
    } catch (error) {
      if (
        error instanceof HTTPError &&
        error.code === HTTP_STATUS_CODE.UNAUTHORIZED
      ) {
        await this.redirectToLogin();
        return;
      }
    }
    this.error = true;
  }
}
</script>
