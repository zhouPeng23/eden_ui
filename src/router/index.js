//==============================================开始引入组件============================================================
import Vue from 'vue'
import Router from 'vue-router'
const baseLayout = () => import('../components/layout/baseLayout');
const loginPage  = () => import('../components/login/loginPage');
//应用管理
const appList  = () => import('../components/manage/appmanage/appList');
const appModule  = () => import('../components/manage/appmanage/appModule');
const defineVariables  = () => import('../components/manage/appmanage/defineVariables');
const dataSource  = () => import('../components/manage/appmanage/dataSource');
//流程管理
const filter  = () => import('../components/manage/flowmanage/filter');
const flowList  = () => import('../components/manage/flowmanage/flowList');
const timeTtrigger  = () => import('../components/manage/flowmanage/timeTtrigger');
//日志管理
const logList  = () => import('../components/manage/logmanage/logList');


Vue.use(Router);

//==============================================引入二级模块============================================================
//应用管理
const appManageRouters = [
  {path:'appList',component:appList},
  {path:'appModule',component:appModule},
  {path:'defineVariables',component:defineVariables},
  {path:'dataSource',component:dataSource},
];
//流程管理
const flowManageRouters = [
  {path:'filter',component:filter},
  {path:'flowList',component:flowList},
  {path:'timeTtrigger',component:timeTtrigger},
];
//日志管理
const logManageRouters = [
  {path:'logList',component:logList},
];


//==============================================引入一级模块============================================================
export default new Router({
  //去掉#号
  mode:'history',
  base:'eden_ui',
  routes: [
    {path:'/manage/appmanage',component:baseLayout,children:appManageRouters},//应用管理
    {path:'/manage/flowmanage',component:baseLayout,children:flowManageRouters},//流程管理
    {path:'/manage/logmanage',component:baseLayout,children:logManageRouters},//日志管理
    {path: '/login', component:loginPage },
    {path: '*', component:loginPage },
  ]
})
