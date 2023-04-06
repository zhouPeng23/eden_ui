<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-nav">
            <MenuItem name="1">
              <Icon type="md-cloud-outline" />
              当前应用:<span style="font-size: 15px;font-weight: bold;color: white">{{selectedAppName}}</span>
            </MenuItem>
            <MenuItem name="2">
              <Icon type="md-checkmark-circle" />
              项目 => 库
            </MenuItem>
            <MenuItem name="3">
              <Icon type="md-checkmark-circle" />
              库 => 项目
            </MenuItem>
            <MenuItem name="4">
              <span @click="logout()">
                <Icon type="ios-log-out" />
                退出
              </span>
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu active-name="1-1" theme="light" width="auto" :open-names="['1']">
            <Submenu name="1">
              <template slot="title">
                <Icon type="ios-navigate"></Icon>
                {{mainMenu1}}
              </template>
              <MenuItem name="1-1"><router-link to="/manage/appmanage/appList">{{mainMenu1_01}}</router-link></MenuItem>
              <MenuItem name="1-2"><router-link to="/manage/appmanage/appModule">{{mainMenu1_02}}</router-link></MenuItem>
              <MenuItem name="1-3"><router-link to="/manage/appmanage/defineVariables">{{mainMenu1_03}}</router-link></MenuItem>
              <MenuItem name="1-4"><router-link to="/manage/appmanage/dataSource">{{mainMenu1_04}}</router-link></MenuItem>
            </Submenu>
            <Submenu name="2">
              <template slot="title">
                <Icon type="ios-keypad"></Icon>
                {{mainMenu2}}
              </template>
              <MenuItem name="2-1"><router-link to="/manage/flowmanage/filter">{{mainMenu2_01}}</router-link></MenuItem>
              <MenuItem name="2-2"><router-link to="/manage/flowmanage/flowList">{{mainMenu2_02}}</router-link></MenuItem>
              <MenuItem name="2-3"><router-link to="/manage/flowmanage/timeTtrigger">{{mainMenu2_03}}</router-link></MenuItem>
            </Submenu>
            <Submenu name="3">
              <template slot="title">
                <Icon type="ios-analytics"></Icon>
                {{mainMenu3}}
              </template>
              <MenuItem name="3-1"><router-link to="/manage/logmanage/logList">{{mainMenu3_01}}</router-link></MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <Content :style="{padding: '0px', minHeight: '490px', background: '#f5f7f9'}">
            <router-view></router-view>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>

<script>
  import {querySelectedApp} from "../../api/ApiList";

  export default {
    name:"baseLayout",
    data() {
      return {
        //菜单
        mainMenu1:'应用管理',
          mainMenu1_01:'应用列表',
          mainMenu1_02:'应用模块',
          mainMenu1_03:'定义变量',
          mainMenu1_04:'数据源配置',
        mainMenu2:'流程管理',
          mainMenu2_01:'过滤器',
          mainMenu2_02:'流程列表',
          mainMenu2_03:'定时任务',
        mainMenu3:'日志管理',
          mainMenu3_01:'日志列表',
        //已选择的应用
        selectedAppId:"",
        selectedAppName:"",
      }
    },
    methods:{
      logout:function () {
        this.$router.push({path:'/login'});
      },
    },
    mounted:async function () {
      let res = await querySelectedApp();
      if (res.code === '0000' && res.data!=null) {
        this.selectedAppId = res.data.appId;
        this.selectedAppName = res.data.appName;
      }
    }
  }
</script>

<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }
  .layout-logo{
    width: 135px;
    height: 55px;
    background: #cdb5f9;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 5px;
    left: -20px;
  }
  .layout-nav{
    width: 60%;
    margin: 0 auto;
    margin-right: 20px;
  }
</style>
