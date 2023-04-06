<template>
  <div>

    <Row>
      <Col span="3">
        <!--添加模块按钮-->
        <Button type="primary" size="small" style="margin: 10px 0 10px 0" @click="showAddModal">添加模块</Button>
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

    <!--添加模块弹框-->
    <confirmModal ref="addModuleModalRef" modal-title="添加模块:" :modal-width="600" @handleSubmit="addModule()">
      <Form ref="addModuleFormRef" :model="addModuleForm" :label-width="80" @submit.native.prevent>
        <FormItem label="模块名" prop="moduleName">
          <Input type="text" v-model="addModuleForm.moduleName"></Input>
        </FormItem>
      </Form>
    </confirmModal>

    <!--更新模块弹框-->
    <confirmModal ref="updateModuleModalRef" modal-title="更新模块:" :modal-width="600" @handleSubmit="updateModule()">
      <Form ref="updateModuleFormRef" :model="updateModuleForm" :label-width="80" @submit.native.prevent>
        <FormItem label="模块名" prop="moduleName">
          <Input type="text" v-model="updateModuleForm.moduleName"></Input>
        </FormItem>
      </Form>
    </confirmModal>

    <!--确认删除模块弹框-->
    <confirmModal ref="deleteModuleModalRef" modal-title="提示:" :modal-width="260" @handleSubmit="deleteModule()">
      <div style="font-size: 14px;;">确认删除: {{deleteModuleForm.moduleName}} ?</div>
    </confirmModal>

  </div>
</template>

<script>
  import {querySelectedApp,queryAppModuleList,addAppModule,deleteAppModule,updateAppModule} from "../../../api/ApiList";
  import confirmModal from "../../utils/modal/confirmModal";

  export default {
    name: "appModule",
    components: {confirmModal},
    data () {
      return {
        selectedAppId:'',
        selectedAppName:'',
        data: [],
        addModuleForm:{
          moduleName:"",
        },
        updateModuleForm:{
          moduleId:"",
          moduleName:"",
        },
        deleteModuleForm:{
          moduleId:"",
          moduleName:"",
        },
        columns: [
          {
            title: '模块名称',
            key: 'moduleName',
            render: (h, params) => {
              return h('div', [
                h('strong' ,params.row.moduleName)
              ]);
            }
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
      // 查询模块集合
      queryModuleList :async function () {
        let params = {
          'appId':this.selectedAppId,
        };
        let res = await queryAppModuleList(params);
        this.data = res.data;
      },
      // 显示添加模块弹框
      showAddModal:function(){
        this.$refs.addModuleModalRef.showModal();
      },
      // 显示更新模块弹框
      showUpdateModal:function(index){
        this.updateModuleForm.moduleId = this.data[index].moduleId;
        this.updateModuleForm.moduleName = this.data[index].moduleName;
        this.$refs.updateModuleModalRef.showModal();
      },
      // 显示删除模块弹框
      showDeleteModal:function(index){
        this.deleteModuleForm.moduleId = this.data[index].moduleId;
        this.deleteModuleForm.moduleName = this.data[index].moduleName;
        this.$refs.deleteModuleModalRef.showModal();
      },
      //添加模块
      addModule:async function(){
        let params = {
          'appId':this.selectedAppId,
          'moduleName':this.addModuleForm.moduleName,
        };
        let res = await addAppModule(params);
        if (res.code === '0000') {
          this.$refs.addModuleFormRef.resetFields();
          this.$Message.success(res.msg);
          this.queryModuleList();
        }else {
          this.$Message.error(res.msg);
        }
      },
      //更新模块
      updateModule:async function () {
        let params = {
          'appId':this.selectedAppId,
          'moduleId':this.updateModuleForm.moduleId,
          'moduleName':this.updateModuleForm.moduleName,
        };
        let res = await updateAppModule(params);
        if (res.code === '0000') {
          this.$refs.updateModuleFormRef.resetFields();
          this.$Message.success(res.msg);
          this.queryModuleList();
        }else {
          this.$Message.error(res.msg);
        }
      },
      //删除模块
      deleteModule:async function () {
        let params = {
          'appId':this.selectedAppId,
          'moduleId':this.deleteModuleForm.moduleId
        };
        let res = await deleteAppModule(params);
        if (res.code === '0000') {
          this.$Message.success(res.msg);
          this.queryModuleList();
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
        this.queryModuleList();
      }
    }
  }
</script>

<style scoped>

</style>



