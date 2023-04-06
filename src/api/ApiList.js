// 所有界面的跨站请求在此统一管理，统一为POST异步请求
import {POST} from './POST'
const baseUrl = '/edenWebApi';

//应用
export const queryAppList = (params) => POST(baseUrl+'/app/queryAppList',params);
export const addApp = (params) => POST(baseUrl+'/app/addApp',params);
export const deleteApp = (params) => POST(baseUrl+'/app/deleteApp',params);
export const updateApp = (params) => POST(baseUrl+'/app/updateApp',params);
export const querySelectedApp = (params) => POST(baseUrl+'/app/querySelectedApp',params);
export const selectThisApp = (params) => POST(baseUrl+'/app/selectThisApp',params);

//应用模块
export const queryAppModuleList = (params) => POST(baseUrl+'/appModule/queryAppModuleList',params);
export const addAppModule = (params) => POST(baseUrl+'/appModule/addAppModule',params);
export const deleteAppModule = (params) => POST(baseUrl+'/appModule/deleteAppModule',params);
export const updateAppModule = (params) => POST(baseUrl+'/appModule/updateAppModule',params);

//自定义变量
export const queryVariableList = (params) => POST(baseUrl+'/defineVariable/queryVariableList',params);
export const addVariable = (params) => POST(baseUrl+'/defineVariable/addVariable',params);
export const deleteVariable = (params) => POST(baseUrl+'/defineVariable/deleteVariable',params);
export const updateVariable = (params) => POST(baseUrl+'/defineVariable/updateVariable',params);

//数据源
export const queryDataSourceList = (params) => POST(baseUrl+'/dataSource/queryDataSourceList',params);
export const addDataSource = (params) => POST(baseUrl+'/dataSource/addDataSource',params);
export const deleteDataSource = (params) => POST(baseUrl+'/dataSource/deleteDataSource',params);
export const updateDataSource = (params) => POST(baseUrl+'/dataSource/updateDataSource',params);

//应用模块流程
export const queryAppModuleFlowList = (params) => POST(baseUrl+'/appModuleFlow/queryAppModuleFlowList',params);
export const addAppModuleFlow = (params) => POST(baseUrl+'/appModuleFlow/addAppModuleFlow',params);
export const deleteAppModuleFlow = (params) => POST(baseUrl+'/appModuleFlow/deleteAppModuleFlow',params);
export const updateAppModuleFlow = (params) => POST(baseUrl+'/appModuleFlow/updateAppModuleFlow',params);









