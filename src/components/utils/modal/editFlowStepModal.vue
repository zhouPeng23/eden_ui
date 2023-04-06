<template>
  <span>
    <Modal
      :styles="{top: '20px',width:'1100px'}"
      v-model="showFormModal"
      :title="modalTitle"
      :transfer="false"
      :footer-hide="footerHide"
      @on-ok="handleSubmit"
      :mask-closable="false">
      <div>
        <slot></slot>
      </div>
    </Modal>
  </span>
</template>

<script>
  export default {
    name: "editFlowStepModal",
    props: {
      modalTitle: {
        type: String,
        default: "模态框标题"
      },
      footerHide: {
        type: Boolean,
        default: true,
      }
    },
    data() {
      return {
        showFormModal: false,
      }
    },
    methods: {
      showModal: function () {
        this.showFormModal = true;
      },
      hideModal: function () {
        this.showFormModal = false;
      },
      handleSubmit: function () {
        this.$emit("handleSubmit");
      }
    }
  }
</script>

<style scoped>

</style>
