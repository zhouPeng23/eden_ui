<template>
  <div>

    <Row style="margin: 10px 0 10px 0">
      <Col span="3">
        <!--添加流程按钮-->
        <Button type="success" size="small" @click="showAddModal">添加流程</Button>
      </Col>
    </Row>
    <Row style="margin: 10px 0 10px 0">
      <Col span="24">
        <Button icon="ios-search" @click="queryAllFlow()"><span style="font-size: 12px;font-weight: lighter">全部流程</span></Button>
        <!--显示各个模块-->
        <span v-for="(appModle,index) in appModules">
          <code class="AppModuleClass" @click="clickThisModule(index)" :style="{backgroundColor:index===currentClickModuleIndex?'rgba(255, 136, 47, 0.66)':''}">
            {{appModle.moduleName}}
          </code>
        </span>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <!--列表展示数据-->
        <Table border :columns="columns" :data="data">
          <template #action="{ row, index }">
            <Button type="primary" size="small" @click="showUpdateModal(index)">更新</Button>
            <Button type="error" size="small" @click="showDeleteModal(index)">删除</Button>
            <Button type="success" size="small" @click="showEditFlowStep(index)">编辑流程步骤</Button>
          </template>
        </Table>
      </Col>
    </Row>

    <!--添加流程弹框-->
    <confirmModal ref="addFlowModalRef" modal-title="添加流程:" :modal-width="600" @handleSubmit="addFlow()">
      <Form ref="addFlowFormRef" :model="addFlowForm" :label-width="80" @submit.native.prevent>
        <FormItem label="所属模块" prop="moduleId">
          <Select v-model="addFlowForm.moduleId">
            <Option v-for="item in appModules" :value="item.moduleId" :key="item.moduleId">{{ item.moduleName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="流程名称" prop="flowName">
          <Input type="text" v-model="addFlowForm.flowName"></Input>
        </FormItem>
      </Form>
    </confirmModal>

    <!--更新流程弹框-->
    <confirmModal ref="updateFlowModalRef" modal-title="更新流程:" :modal-width="600" @handleSubmit="updateFlow()">
      <Form ref="updateFlowFormRef" :model="updateFlowForm" :label-width="80" @submit.native.prevent>
        <FormItem label="所属模块" prop="moduleId">
          <Select v-model="updateFlowForm.moduleId" disabled>
            <Option v-for="item in appModules" :value="item.moduleId" :key="item.moduleId">{{ item.moduleName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="流程名称" prop="flowName">
          <Input type="text" v-model="updateFlowForm.flowName"></Input>
        </FormItem>
      </Form>
    </confirmModal>

    <!--确认删除流程弹框-->
    <confirmModal ref="deleteFlowModalRef" modal-title="提示:" :modal-width="260" @handleSubmit="deleteFlow()">
      <div style="font-size: 14px;;">确认删除: {{deleteFlowForm.flowName}} ?</div>
    </confirmModal>

    <!--编辑流程步骤弹框-->
    <editFlowStepModal ref="editFlowStepModalRef" :modal-title="editing + editFlowStepForm.flowName" @handleSubmit="editFlowStep()">
        <Row style="height: 450px;">
          <!--左侧函数和现有流程-->
          <Col span="5">
            <Tabs type="card">
              <TabPane label="函数方法">
                <div draggable="true" @dragstart="dragstart($event, globalVar)">
                  <span class="ExistingMethodAndVariableClass">{{globalVar}}</span>
                </div>
              </TabPane>
              <TabPane label="现有流程">
                <Collapse v-for="(appModule,modalIndex) in appModules" v-model="existingFlowValue" accordion>
                  <Panel :name="appModule.moduleName">
                    {{appModule.moduleName}}
                    <template #content>
                      <div v-for="(appFlow,flowIndex) in allAppFlows">
                        <div v-if="appModule.moduleId===appFlow.moduleId" draggable="true" @dragstart="dragstart($event, appFlow.flowName)">
                          <span class="ExistingFlowClass">{{appFlow.flowName}}</span>
                        </div>
                      </div>
                    </template>
                  </Panel>
                </Collapse>
              </TabPane>
            </Tabs>
          </Col>
          <Col span="1">&nbsp;</Col>
          <!--中间是流程步骤-->
          <Col span="13">
            <!--入参-->
            <div style="margin-bottom: 10px">
                <Row>
                  <div style="font-size: 14px;font-weight: bold;">
                    入参<Icon type="ios-add-circle-outline" size="20" style="cursor: pointer" />
                  </div>
                </Row>
                <Row style="margin-bottom: 5px">
                  <Col span="4">
                    <Select>
                      <Option value="String">String</Option>
                      <Option value="Number">Number</Option>
                    </Select>
                  </Col>
                  <Col span="8">
                    <Input type="text"></Input>
                  </Col>
                  <Col span="1">
                    <Icon type="ios-remove-circle-outline" size="20" style="cursor: pointer;margin-top: 7px"/>
                  </Col>
                </Row>
            </div>
            <div style="font-size: 14px;font-weight: bold;">步骤<Icon type="ios-add-circle-outline" size="20" style="cursor: pointer" /></div>
            <Collapse accordion v-model="flowStepValue_1">
              <Panel name="1">
                步骤1
                <template #content>
                  <div @drop="drop($event)" @dragover="dragover($event)">
                      <Input v-model="inputName" type="textarea" :rows="2" placeholder="edit step ..."/>
                  </div>
                </template>
              </Panel>
              <Panel name="2">
                步骤2
                <template #content>
                  内容
                </template>
              </Panel>
            </Collapse>
            <div style="font-size: 14px;font-weight: bold;margin-top: 10px">
              <div style="font-size: 14px;font-weight: bold;">返回<Icon type="ios-add-circle-outline" size="20" style="cursor: pointer" /></div>
            </div>
          </Col>
          <Col span="1">&nbsp;</Col>
          <!--右侧数据源-->
          <Col span="4">
            <Tabs type="card">
              <TabPane label="数据源">
                <div v-for="(dataSource,index) in dataSources">
                  <div draggable="true" @dragstart="dragstart($event, dataSource.dataSourceName)">
                    <span class="ExistingDataSourcesClass">{{dataSource.dataSourceName}}</span>
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </Col>
        </Row>
    </editFlowStepModal>

  </div>
</template>

<script>
  import {querySelectedApp,queryDataSourceList,queryAppModuleList,queryAppModuleFlowList,
    addAppModuleFlow,deleteAppModuleFlow,updateAppModuleFlow} from "../../../api/ApiList";
  import confirmModal from "../../utils/modal/confirmModal";
  import editFlowStepModal from "../../utils/modal/editFlowStepModal";
  import FlowParamsInput from "../../utils/flowparams/flowParamsInput";

  export default {
    name: "flowList",
    components: {confirmModal,editFlowStepModal},
    data() {
      return {
        selectedAppId:'',
        selectedAppName:'',
        appModules:[],
        currentClickModuleIndex:'',
        data:[],
        allAppFlows:[],
        existingFlowValue:'',
        flowStepValue_1:'',
        flowStepValue_2:'',
        globalVar: "这是函数方法",
        dataSources:[],
        inputName: '',
        addFlowForm:{
          moduleId:"",
          flowName:"",
        },
        updateFlowForm:{
          moduleId:"",
          flowId:"",
          flowName:"",
        },
        deleteFlowForm:{
          moduleId:"",
          flowId:"",
          flowName:"",
        },
        editing:'正在编辑流程: ',
        editFlowStepForm:{
          moduleId:"",
          flowId:"",
          flowName:"",
        },
        columns: [
          {
            title: '流程名称',
            key: 'flowName',
            render: (h, params) => {
              return h('div', [
                h('strong' ,params.row.flowName)
              ]);
            }
          },
          {
            title: '所属模块',
            key: 'flowName',
            render: (h, params) => {
              return h('div',this.renderModuleName(params.row.moduleId))
            }
          },
          {
            title: '所属应用',
            key: 'appId',
            width: 100,
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
    methods: {
      // 查询流程集合
      queryFlowList :async function () {
        let params = {
          'appId':this.selectedAppId,
          'moduleId':this.currentClickModuleIndex===''?"":this.appModules[this.currentClickModuleIndex].moduleId,
        };
        let res = await queryAppModuleFlowList(params);
        this.data = res.data;
        //在初始化的时候，将所有流程备份一下，添加流程左侧展示"现有流程"会用到
        if (this.allAppFlows.length === 0) {
          this.allAppFlows = res.data;
        }
      },
      // 显示添加流程弹框
      showAddModal:function(){
        this.$refs.addFlowModalRef.showModal();
      },
      // 显示更新流程弹框
      showUpdateModal:function(index){
        this.updateFlowForm.moduleId = this.data[index].moduleId;
        this.updateFlowForm.flowId = this.data[index].flowId;
        this.updateFlowForm.flowName = this.data[index].flowName;
        this.$refs.updateFlowModalRef.showModal();
      },
      // 显示删除流程弹框
      showDeleteModal:function(index){
        this.deleteFlowForm.moduleId = this.data[index].moduleId;
        this.deleteFlowForm.flowId = this.data[index].flowId;
        this.deleteFlowForm.flowName = this.data[index].flowName;
        this.$refs.deleteFlowModalRef.showModal();
      },
      //显示编辑流程步骤弹框
      showEditFlowStep:function(index){
        this.editFlowStepForm.moduleId = this.data[index].moduleId;
        this.editFlowStepForm.flowId = this.data[index].flowId;
        this.editFlowStepForm.flowName = this.data[index].flowName;
        this.$refs.editFlowStepModalRef.showModal();
      },
      //编辑流程
      editFlowStep:function(){
        this.$Message.info("ok")
      },
      //添加流程
      addFlow:async function(){
        let params = {
          'appId':this.selectedAppId,
          'moduleId':this.addFlowForm.moduleId,
          'flowName':this.addFlowForm.flowName,
        };
        let res = await addAppModuleFlow(params);
        if (res.code === '0000') {
          this.$refs.addFlowFormRef.resetFields();
          this.$Message.success(res.msg);
          this.queryFlowList();
        }else {
          this.$Message.error(res.msg);
        }
      },
      //更新流程
      updateFlow:async function(){
        let params = {
          'appId':this.selectedAppId,
          'moduleId':this.updateFlowForm.moduleId,
          'flowId':this.updateFlowForm.flowId,
          'flowName':this.updateFlowForm.flowName,
        };
        let res = await updateAppModuleFlow(params);
        if (res.code === '0000') {
          this.$refs.updateFlowFormRef.resetFields();
          this.$Message.success(res.msg);
          this.queryFlowList();
        }else {
          this.$Message.error(res.msg);
        }
      },
      //删除流程
      deleteFlow:async function () {
        let params = {
          'appId':this.selectedAppId,
          'moduleId':this.deleteFlowForm.moduleId,
          'flowId':this.deleteFlowForm.flowId
        };
        let res = await deleteAppModuleFlow(params);
        if (res.code === '0000') {
          this.$Message.success(res.msg);
          this.queryFlowList();
        }else {
          this.$Message.error(res.msg);
        }
      },
      //渲染模块名称
      renderModuleName:function (moduleId) {
        let appModule = this.appModules.filter(module => module.moduleId === moduleId)[0];
        return appModule.moduleName;
      },
      //点击模块，变橙色背景
      clickThisModule:function(index){
        this.currentClickModuleIndex = index;
        this.queryFlowList();
      },
      //查询全部流程
      queryAllFlow:function () {
        this.currentClickModuleIndex = '';
        this.queryFlowList();
      },
      dragstart: function (event, content) {
        event.dataTransfer.setData("dragContent", content);
      },
      drop: function (event) {
        this.inputName = this.inputName + event.dataTransfer.getData("dragContent");
      },
      dragover: function (event) {
        event.preventDefault();
      },
    },
    mounted:async function () {
      //查询当前应用
      let res = await querySelectedApp();
      if (res.code === '0000' && res.data!=null) {
        this.selectedAppId = res.data.appId;
        this.selectedAppName = res.data.appName;
        //查询应用下的模块
        let params = {'appId':this.selectedAppId};
        let result = await queryAppModuleList(params);
        if (result.code === '0000') {
          this.appModules = result.data;
          //查询流程集合
          this.queryFlowList();
        }
        //查询应用下数据源集合
        let dataSourcesRes = await queryDataSourceList({'appId':this.selectedAppId});
        if (dataSourcesRes.code==='0000'){
          this.dataSources = dataSourcesRes.data;
        }
      }
    }
  }
</script>

<style scoped>
 @import "../../../assets/css/eden_ui.css";
</style>
