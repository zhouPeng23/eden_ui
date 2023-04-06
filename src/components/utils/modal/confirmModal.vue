<template>
  <span>
    <Modal
      v-model="showFormModal"
      :width="modalWidth"
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
    name: "confirmModal",
    props: {
      modalTitle: {
        type: String,
        default: "模态框标题"
      },
      modalWidth: {
        type: [Number,String],
        //当其值不大于 100 时以百分比显示，大于 100 时为像素
        default: 600
      },
      footerHide: {
        type: Boolean,
        default: false,
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
