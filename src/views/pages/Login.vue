<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8">
          <CCardGroup>
            <CCard
                color="success"
                text-color="white"
                class="text-center py-lg-5 d-md-down-none"
                body-wrapper
            >
              <CCardBody>
                <CImg
                    :src="require('../../../public/img/bys-logo-white.png')"
                    alt="Logo By Your Side"
                    fluid-grow
                />
              </CCardBody>
            </CCard>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1>Login</h1>
                  <p class="text-muted">Faça login na sua conta de administrador</p>
                  <CInput
                    v-model="email"
                    type="email"
                    placeholder="Email"
                    autocomplete="username email"
                  >
                    <template #prepend-content><CIcon name="cil-user"/></template>
                  </CInput>
                  <CInput
                    v-model="password"
                    placeholder="Senha"
                    type="password"
                    autocomplete="curent-password"
                  >
                    <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                  </CInput>
                  <CRow>
                    <CCol col="6" class="text-left">
                      <CButton
                          color="success"
                          class="px-4"
                          :disabled="loginBtnDisabled"
                          @click="attemptLogin"
                      >
                        Login
                      </CButton>
                    </CCol>
                    <CCol col="6" class="text-left">
                      <small class="form-text text-danger w-100">{{ errorMessage }}</small>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import { DisplayableError } from '@/errors';
import { AuthToken } from '@/adapters/AuthToken';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      loginBtnDisabled: false
    }
  },
  props: {
    redirectTo: {
      type: String,
      default: 'Root'
    }
  },
  methods: {
    async attemptLogin() {
      this.loginBtnDisabled = true;
      try {
        await this.$store.dispatch('user/login', {
          email: this.email,
          password: this.password
        });
      } catch (error) {
        this.handleLoginError(error);
        return;
      }

      this.handleLoginSuccess();
      this.loginBtnDisabled = true;
    },
    handleLoginSuccess() {
      this.$router.push({
        name: 'Loader',
        params: {
          redirectTo: this.redirectTo
        }
      });
    },
    handleLoginError(error) {
      this.loginBtnDisabled = false;
      if (error instanceof DisplayableError) {
        this.errorMessage = error;
        return;
      }

      this.errorMessage = 'Houve um erro ao tentar realizar login.';
    }
  },
  mounted() {
    if (AuthToken.token !== null) {
      this.handleLoginSuccess();
    }
  }
}
</script>
