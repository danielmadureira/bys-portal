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
export default {
  name: 'Loader',
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
    sleep(ms) {
      return new Promise(res => {
        setTimeout(res, ms);
      });
    }
  },
  async mounted() {
    await this.$store.dispatch('loadBaseData');
    await this.sleep(500); // waits for the animation to finish
    await this.redirect();
  }
}
</script>
