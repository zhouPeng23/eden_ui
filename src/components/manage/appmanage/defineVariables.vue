<template>
  <div>

    <Row>
      <Col span="3">
        <!--添加变量按钮-->
        <Button type="warning" size="small" style="margin: 10px 0 10px 0" @click="showAddModal">添加变量</Button>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <!--列表展示数据-->
        <Table border :columns="columns" :data="data">
          <template #action="{ row, index }">
            <Button type="primary" size="small" @click="showUpdateModal(index)">更新</Button>
            <Button type="error" size="small" @click="showDeleteModal(index)">删除</Button>
          </template>
        </Table>
      </Col>
    </Row>

    <!--添加变量弹框-->
    <confirmModal ref="addVariableModalRef" modal-title="添加变量:" :modal-width="600" @handleSubmit="addVariable()">
      <Form ref="addVariableFormRef" :model="addVariableForm" :label-width="80" @submit.native.prevent>
        <FormItem label="变量名" prop="varName">
          <Input type="text" v-model="addVariableForm.varName"></Input>
        </FormItem>
        <FormItem label="变量值" prop="varValue">
          <Input type="text" v-model="addVariableForm.varValue"></Input>
        </FormItem>
      </Form>
    </confirmModal>

    <!--更新变量弹框-->
    <confirmModal ref="updateVariableModalRef" modal-title="更新变量:" :modal-width="600" @handleSubmit="updateVariable()">
      <Form ref="updateVariableFormRef" :model="updateVariableForm" :label-width="80" @submit.native.prevent>
        <FormItem label="变量名" prop="varName">
          <Input type="text" v-model="updateVariableForm.varName"></Input>
        </FormItem>
        <FormItem label="变量值" prop="varValue">
          <Input type="text" v-model="updateVariableForm.varValue"></Input>
        </FormItem>
      </Form>
    </confirmModal>

    <!--确认删除变量弹框-->
    <confirmModal ref="deleteVariableModalRef" modal-title="提示:" :modal-width="260" @handleSubmit="deleteVariable()">
      <div style="font-size: 14px;;">确认删除: {{deleteVariableForm.varName}} ?</div>
    </confirmModal>

  </div>
</template>

<script>
  import {querySelectedApp,queryVariableList,addVariable,deleteVariable,updateVariable} from "../../../api/ApiList";
  import confirmModal from "../../utils/modal/confirmModal";

  export default {
    name: "defineVariables",
    components: {confirmModal},
    data () {
      return {
        selectedAppId:'',
        selectedAppName:'',
        data: [],
        addVariableForm:{
          varName:"",
          varValue:"",
        },
        updateVariableForm:{
          id:"",
          varName:"",
          varValue:"",
        },
        deleteVariableForm:{
          id:"",
          varName:"",
        },
        columns: [
          {
            title: '变量名',
            key: 'varName',
            render: (h, params) => {
              return h('div', [
                h('strong' ,params.row.varName)
              ]);
            }
          },
          {
            title: '变量值',
            key: 'varValue'
          },
          {
            title: '所属应用',
            key: 'appId',
            width: 200,
            render: (h, params) => {
              return h('div', this.selectedAppName);
            }
          },
          {
            title: '操作',
            slot: 'action',
            width: 300,
            align: 'center'
          }
        ],
      }
    },
    methods:{
      // 查询变量集合
      queryVariableList :async function () {
        let params = {
          'appId':this.selectedAppId,
        };
        let res = await queryVariableList(params);
        this.data = res.data;
      },
      // 显示添加变量弹框
      showAddModal:function(){
        this.$refs.addVariableModalRef.showModal();
      },
      // 显示更新变量弹框
      showUpdateModal:function(index){
        this.updateVariableForm.id = this.data[index].id;
        this.updateVariableForm.varName = this.data[index].varName;
        this.updateVariableForm.varValue = this.data[index].varValue;
        this.$refs.updateVariableModalRef.showModal();
      },
      // 显示删除变量弹框
      showDeleteModal:function(index){
        this.deleteVariableForm.id = this.data[index].id;
        this.deleteVariableForm.varName = this.data[index].varName;
        this.$refs.deleteVariableModalRef.showModal();
      },
      //添加变量
      addVariable:async function(){
        let params = {
          'appId':this.selectedAppId,
          'varName':this.addVariableForm.varName,
          'varValue':this.addVariableForm.varValue,
        };
        let res = await addVariable(params);
        if (res.code === '0000') {
          this.$refs.addVariableFormRef.resetFields();
          this.$Message.success(res.msg);
          this.queryVariableList();
        }else {
          this.$Message.error(res.msg);
        }
      },
      //更新变量
      updateVariable:async function () {
        let params = {
          'appId':this.selectedAppId,
          'id':this.updateVariableForm.id,
          'varName':this.updateVariableForm.varName,
          'varValue':this.updateVariableForm.varValue,
        };
        let res = await updateVariable(params);
        if (res.code === '0000') {
          this.$refs.updateVariableFormRef.resetFields();
          this.$Message.success(res.msg);
          this.queryVariableList();
        }else {
          this.$Message.error(res.msg);
        }
      },
      //删除变量
      deleteVariable:async function () {
        let params = {
          'appId':this.selectedAppId,
          'id':this.deleteVariableForm.id
        };
        let res = await deleteVariable(params);
        if (res.code === '0000') {
          this.$Message.success(res.msg);
          this.queryVariableList();
        }else {
          this.$Message.error(res.msg);
        }
      },
    },
    mounted:async function () {
      let res = await querySelectedApp();
      if (res.code === '0000' && res.data!=null) {
        this.selectedAppId = res.data.appId;
        this.selectedAppName = res.data.appName;
        this.queryVariableList();
      }
    }
  }
</script>

<style scoped>

</style>



