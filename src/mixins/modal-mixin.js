const modalMixin = {
  data() {
    return {
      modal: {
        data: { },
        show: false,
        isAvailable: true
      }
    };
  },
  methods: {
    showModal(modalObj, data) {
      if (!modalObj.isAvailable) return;
      modalObj.isAvailable = false;
      modalObj.data = data;
      modalObj.show = true;
    },
    async hideModal(modalObj) {
      modalObj.show = false;
      // Waits for 500ms.
      await new Promise(res => setTimeout(res, 500));
      modalObj.isAvailable = true;
      modalObj.data = { };
    }
  }
};


export default modalMixin;
