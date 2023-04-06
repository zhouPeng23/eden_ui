<template>
  <div>

    <Row>
      <Col span="3">
        <!--添加数据源按钮-->
        <Button type="error" size="small" style="margin: 10px 0 10px 0" @click="showAddModal">添加数据源</Button>
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

    <!--添加数据源弹框-->
    <confirmModal ref="addDataSourceModalRef" modal-title="添加数据源:" :modal-width="600" @handleSubmit="addDataSource()">
      <Form ref="addDataSourceFormRef" :model="addDataSourceForm" :label-width="80" @submit.native.prevent>
        <FormItem label="数据源名称" prop="dataSourceName">
          <Input type="text" v-model="addDataSourceForm.dataSourceName"></Input>
        </FormItem>
        <FormItem label="驱动" prop="driverClassName">
          <Input type="text" v-model="addDataSourceForm.driverClassName"></Input>
        </FormItem>
        <FormItem label="url" prop="url">
          <Input type="text" v-model="addDataSourceForm.url"></Input>
        </FormItem>
        <FormItem label="用户名" prop="username">
          <Input type="text" v-model="addDataSourceForm.username"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input type="text" v-model="addDataSourceForm.password"></Input>
        </FormItem>
      </Form>
    </confirmModal>

    <!--更新数据源弹框-->
    <confirmModal ref="updateDataSourceModalRef" modal-title="更新数据源:" :modal-width="600" @handleSubmit="updateDataSource()">
      <Form ref="updateDataSourceFormRef" :model="updateDataSourceForm" :label-width="80" @submit.native.prevent>
        <FormItem label="数据源名称" prop="dataSourceName">
          <Input type="text" v-model="updateDataSourceForm.dataSourceName"></Input>
        </FormItem>
        <FormItem label="驱动" prop="driverClassName">
          <Input type="text" v-model="updateDataSourceForm.driverClassName"></Input>
        </FormItem>
        <FormItem label="url" prop="url">
          <Input type="text" v-model="updateDataSourceForm.url"></Input>
        </FormItem>
        <FormItem label="用户名" prop="username">
          <Input type="text" v-model="updateDataSourceForm.username"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input type="text" v-model="updateDataSourceForm.password"></Input>
        </FormItem>
      </Form>
    </confirmModal>

    <!--确认删除数据源弹框-->
    <confirmModal ref="deleteDataSourceModalRef" modal-title="提示:" :modal-width="260" @handleSubmit="deleteDataSource()">
      <div style="font-size: 14px;;">确认删除: {{deleteDataSourceForm.dataSourceName}} ?</div>
    </confirmModal>

  </div>
</template>

<script>
  import {querySelectedApp,queryDataSourceList,addDataSource,deleteDataSource,updateDataSource} from "../../../api/ApiList";
  import confirmModal from "../../utils/modal/confirmModal";

  export default {
    name: "dataSource",
    components: {confirmModal},
    data () {
      return {
        selectedAppId:'',
        selectedAppName:'',
        data: [],
        addDataSourceForm:{
          dataSourceName:"",
          driverClassName:"",
          url:"",
          username:"",
          password:"",
        },
        updateDataSourceForm:{
          id:"",
          dataSourceName:"",
          driverClassName:"",
          url:"",
          username:"",
          password:"",
        },
        deleteDataSourceForm:{
          id:"",
          dataSourceName:"",
        },
        columns: [
          {
            title: '数据源名称',
            key: 'dataSourceName',
            width:200,
            render: (h, params) => {
              return h('div', [
                h('strong' ,params.row.dataSourceName)
              ]);
            }
          },
          {
            title: '驱动',
            key: 'driverClassName',
            width:150
          },
          {
            title: 'url',
            key: 'url',
            width:150
          },
          {
            title: '用户名',
            key: 'username',
            width:100
          },
          {
            title: '密码',
            key: 'password',
            width:100
          },
          {
            title: '所属应用',
            key: 'appId',
            render: (h, params) => {
              return h('div', this.selectedAppName);
            }
          },
          {
            title: '操作',
            slot: 'action',
            width: 150,
            align: 'center'
          }
        ],
      }
    },
    methods:{
      // 查询数据源集合
      queryDataSourceList :async function () {
        let params = {
          'appId':this.selectedAppId,
        };
        let res = await queryDataSourceList(params);
        this.data = res.data;
      },
      // 显示添加数据源弹框
      showAddModal:function(){
        this.$refs.addDataSourceModalRef.showModal();
      },
      // 显示更新数据源弹框
      showUpdateModal:function(index){
        this.updateDataSourceForm.id = this.data[index].id;
        this.updateDataSourceForm.dataSourceName = this.data[index].dataSourceName;
        this.updateDataSourceForm.driverClassName = this.data[index].driverClassName;
        this.updateDataSourceForm.url = this.data[index].url;
        this.updateDataSourceForm.username = this.data[index].username;
        this.updateDataSourceForm.password = this.data[index].password;
        this.$refs.updateDataSourceModalRef.showModal();
      },
      // 显示删除数据源弹框
      showDeleteModal:function(index){
        this.deleteDataSourceForm.id = this.data[index].id;
        this.deleteDataSourceForm.dataSourceName = this.data[index].dataSourceName;
        this.$refs.deleteDataSourceModalRef.showModal();
      },
      //添加数据源
      addDataSource:async function(){
        let params = {
          'appId':this.selectedAppId,
          'dataSourceName':this.addDataSourceForm.dataSourceName,
          'driverClassName':this.addDataSourceForm.driverClassName,
          'url':this.addDataSourceForm.url,
          'username':this.addDataSourceForm.username,
          'password':this.addDataSourceForm.password,
        };
        let res = await addDataSource(params);
        if (res.code === '0000') {
          this.$refs.addDataSourceFormRef.resetFields();
          this.$Message.success(res.msg);
          this.queryDataSourceList();
        }else {
          this.$Message.error(res.msg);
        }
      },
      //更新数据源
      updateDataSource:async function () {
        let params = {
          'appId':this.selectedAppId,
          'id':this.updateDataSourceForm.id,
          'dataSourceName':this.updateDataSourceForm.dataSourceName,
          'driverClassName':this.updateDataSourceForm.driverClassName,
          'url':this.updateDataSourceForm.url,
          'username':this.updateDataSourceForm.username,
          'password':this.updateDataSourceForm.password,
        };
        let res = await updateDataSource(params);
        if (res.code === '0000') {
          this.$refs.updateDataSourceFormRef.resetFields();
          this.$Message.success(res.msg);
          this.queryDataSourceList();
        }else {
          this.$Message.error(res.msg);
        }
      },
      //删除数据源
      deleteDataSource:async function () {
        let params = {
          'appId':this.selectedAppId,
          'id':this.deleteDataSourceForm.id
        };
        let res = await deleteDataSource(params);
        if (res.code === '0000') {
          this.$Message.success(res.msg);
          this.queryDataSourceList();
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
        this.queryDataSourceList();
      }
    }
  }
</script>

<style scoped>

</style>



