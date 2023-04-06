<template>
  <div>

    <Row>
      <Col span="3">
        <!--添加应用按钮-->
        <Button type="success" size="small" style="margin: 10px 0 10px 0" @click="showAddModal">添加应用</Button>
      </Col>
      <Col span="8">
        <div v-if="selectedAppId" style="margin: 12px 0 0 0">
          <span style="font-size: 13px;font-weight: lighter;">当前选择的应用:</span>
          <span style="font-size: 15px;font-weight: bold;color: #00b33a">{{selectedAppName}}</span>
          <span v-if="selectedAppId" style="font-size: 12px;font-weight: lighter;">(应用id:{{selectedAppId}})</span>
        </div>
        <div v-else style="margin: 12px 0 0 0">
          <span style="font-size: 13px;font-weight: bold; color: red;">请选择应用^_^</span>
        </div>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <!--列表展示数据-->
        <Table border :columns="columns" :data="data">
          <template #action="{ row, index }">
            <Row>
              <Col span="4"><Button type="primary" size="small" @click="showUpdateModal(index)">更新</Button></Col>
              <Col span="4"><Button type="error" size="small" @click="showDeleteModal(index)">删除</Button></Col>
              <Col span="6">
                <Button v-if="selectedAppId === data[index].appId" type="success" ghost size="small">已选择应用</Button>
                <Button v-else type="success" size="small" @click="selectThisApp(index)">选择此应用</Button>
              </Col>
              <Col span="4"><Icon v-if="selectedAppId === data[index].appId" type="md-return-left" size="25" color="red"/></Col>
            </Row>
          </template>
        </Table>
      </Col>
    </Row>

    <!--添加应用弹框-->
    <confirmModal ref="addAppModalRef" modal-title="添加应用:" :modal-width="600" @handleSubmit="addApp()">
      <Form ref="addAppFormRef" :model="addAppForm" :label-width="80" @submit.native.prevent>
        <FormItem label="应用名称" prop="appName">
          <Input type="text" v-model="addAppForm.appName"></Input>
        </FormItem>
      </Form>
    </confirmModal>

    <!--更新应用弹框-->
    <confirmModal ref="updateAppModalRef" modal-title="更新应用:" :modal-width="600" @handleSubmit="updateApp()">
      <Form ref="updateAppFormRef" :model="updateAppForm" :label-width="80" @submit.native.prevent>
        <FormItem label="应用名称" prop="appName">
          <Input type="text" v-model="updateAppForm.appName"></Input>
        </FormItem>
      </Form>
    </confirmModal>

    <!--确认删除应用弹框-->
    <confirmModal ref="deleteAppModalRef" modal-title="提示:" :modal-width="260" @handleSubmit="deleteApp()">
      <div style="font-size: 14px;;">确认删除: {{deleteAppForm.appName}} ?</div>
    </confirmModal>

  </div>
</template>

<script>
    import {queryAppList,addApp,deleteApp,updateApp,querySelectedApp,selectThisApp} from "../../../api/ApiList";
    import confirmModal from "../../utils/modal/confirmModal";

    export default {
      name: "appList",
      components: {confirmModal},
      data () {
        return {
          selectedAppId:"",
          selectedAppName:"",
          data: [],
          addAppForm:{
            appName:"",
          },
          updateAppForm:{
            appId:"",
            appName:"",
          },
          deleteAppForm:{
            appId:"",
            appName:""
          },
          columns: [
            {
              title: '应用名称',
              key: 'appName',
              render: (h, params) => {
                return h('div', [
                  h('strong' ,params.row.appName)
                ]);
              }
            },
            {
              title: '应用id',
              key: 'appId'
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
        // 查询应用集合
        queryAppList :async function () {
          let params = {};
          let res = await queryAppList(params);
          this.data = res.data;
        },
        // 显示添加应用弹框
        showAddModal:function(){
          this.$refs.addAppModalRef.showModal();
        },
        // 显示更新应用弹框
        showUpdateModal:function(index){
          this.updateAppForm.appId = this.data[index].appId;
          this.updateAppForm.appName = this.data[index].appName;
          this.$refs.updateAppModalRef.showModal();
        },
        // 显示删除应用弹框
        showDeleteModal:function(index){
          this.deleteAppForm.appId = this.data[index].appId;
          this.deleteAppForm.appName = this.data[index].appName;
          this.$refs.deleteAppModalRef.showModal();
        },
        // 选择此应用
        selectThisApp:async function(index){
          let params = {
            'appId':this.data[index].appId,
          };
          let res = await selectThisApp(params);
          if (res.code === '0000') {
            this.$Message.success(res.msg);
            this.selectedAppId = res.data.appId;
            this.selectedAppName = res.data.appName;
            // 选择成功延迟 1s 刷新页面
            setTimeout(function () {
              window.location.href = "/manage/appmanage/appList";
            }, 1000);
          }else{
            this.$Message.error(res.msg);
          }
        },
        //添加应用
        addApp:async function(){
          let params = {
            'appName':this.addAppForm.appName
          };
          let res = await addApp(params);
          if (res.code === '0000') {
            this.$refs.addAppFormRef.resetFields();
            this.$Message.success(res.msg);
            this.queryAppList();
          }else {
            this.$Message.error(res.msg);
          }
        },
        //更新应用
        updateApp:async function () {
          let params = {
            'appId':this.updateAppForm.appId,
            'appName':this.updateAppForm.appName
          };
          let res = await updateApp(params);
          if (res.code === '0000') {
            this.$refs.updateAppFormRef.resetFields();
            this.$Message.success(res.msg);
            this.queryAppList();
            if (this.updateAppForm.appId === this.selectedAppId) {
              // 更新成功延迟 1s 刷新页面
              setTimeout(function () {
                window.location.href = "/manage/appmanage/appList";
              }, 1000);
            }
          }else {
            this.$Message.error(res.msg);
          }
        },
        //删除应用
        deleteApp:async function () {
          if (this.deleteAppForm.appId === this.selectedAppId) {
            this.$Message.warning("无法删除，应用正在被选择！");
            return;
          }
          let params = {
            'appId':this.deleteAppForm.appId
          };
          let res = await deleteApp(params);
          if (res.code === '0000') {
            this.$Message.success(res.msg);
            this.queryAppList();
          }else {
            this.$Message.error(res.msg);
          }
        },
      },
      mounted:async function () {
        this.queryAppList();
        let res = await querySelectedApp();
        if (res.code === '0000' && res.data!=null) {
          this.selectedAppId = res.data.appId;
          this.selectedAppName = res.data.appName;
        }
      }
    }
</script>

<style scoped>

</style>
