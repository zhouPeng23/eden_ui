<template>
  <div>

    <div draggable="true" @dragstart="dragstart($event, globalVar)">{{globalVar}}</div>
    <div @drop="drop($event)" @dragover="dragover($event)">
      <Input v-model="inputName" type="textarea" :rows="2" placeholder="Enter something..." style="width: 200px"/>
    </div>

  </div>
</template>

<script>
    export default {
      name: "filter",
      components:{},
      data(){
          return {
            globalVar: "hello",
            inputName: '',
          }
      },
      methods:{
        dragstart: function (event, content) {
          event.dataTransfer.setData("dragContent", content);
        },
        drop: function (event) {
          this.inputName = this.inputName + event.dataTransfer.getData("dragContent");
        },
        dragover: function (event) {
          event.preventDefault();
        },
      }
    }
</script>

<style scoped>

</style>
