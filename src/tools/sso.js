import {checkContainsInString, checkEmpty, checkNotEmpty, setCookie} from "./index"
import {RefreshToken} from "../api/ApiList";

const _checkAdminLogin = function () {
  let roleName = localStorage.getItem("roleName");
  return roleName === "admin" && !_checkHasExpired();

}

const _checkHasLogin = function () {
  let userName = localStorage.getItem("userName");
  var isLogin = localStorage.getItem("isLogin");
  var token = localStorage.getItem("tokenString");
  return !checkEmpty(userName) && !checkEmpty(isLogin) && !checkEmpty(token) && isLogin === "isLogin" && !_checkHasExpired();
};

const _checkHasExpired = function () {
  var expiredTime = localStorage.getItem("expiredTime");
  if (expiredTime != null && new Date().getTime() < expiredTime) {
    return false;
  }
  return true;
}

const _getLoginUserName = function () {
  return _checkHasExpired() ? "" : localStorage.getItem("userName");
};

// sso 登陆拦截
const _checkSSOLogin = function (to, from, next) {
  // 1、必须要登录但是没登录
  // 2、必须要 admin 登录但是没登录或者不是 admin 登录
  if ((_mustLogin(to.path) && !_checkHasLogin()) || (_mustAdminLogin(to.path) && (!_checkHasLogin() || !_checkAdminLogin()))) {
    if (!checkContainsInString(from.path, "/sso/login/")) {
      // 跳往登录页面
      window.location.href = "/sso/login/?redirectUrl=" + window.location.href;
    }
  } else {
    next();
  }
};

const _mustLogin = function (target) {
  // 注册必须要登录的地址白名单
  return target.indexOf("/ilearning/courseSpace") >= 0;
}

const _mustAdminLogin = function (target) {
  // 包含 /background/ 必须 admin 登录
  return checkContainsInString(target, "/background/");
}

const _checkNotLogin = function () {
  if (checkContainsInString(window.location.href, "/sso/login") || checkContainsInString(window.location.href, "/sso/regist")) {
    return true;
  }
  return false;
}

const _deleteLoginInfo = function () {
  localStorage.removeItem("tokenString");
  localStorage.removeItem("userName");
  localStorage.removeItem("isLogin");
  localStorage.removeItem("expiredTime");
}

const _getNickName = function () {
  return _checkHasExpired() ? "" : localStorage.getItem("nickName");
}

const _setLoginInfo = function (loginResult) {
  // tokenString 用于登录鉴权
  localStorage.setItem("tokenString", loginResult.tokenString);
  localStorage.setItem("userName", loginResult.userName);
  localStorage.setItem("nickName", loginResult.nickName);
  localStorage.setItem("isLogin", "isLogin");
  localStorage.setItem("roleName", loginResult.roleName);
  let expiredTime = new Date().getTime() + loginResult.expireSecond * 1000;     // 毫秒数
  localStorage.setItem("expiredTime", expiredTime);
  localStorage.setItem("domain", loginResult.domain);
  // cookie 在指定的 domain 进行绑定
  setCookie("tokenString", loginResult.tokenString, 365, loginResult.domain);
}

// 是否正在刷新 token
// 自定登录刷新 token：目的主要是为了体验
// tokenString 有效期设置过长有安全为题，设置太短频繁登录，所以当登录失效是调用改接口可自动登录
var isRefreshingTokening = false;

const _refreshToken = function (store, failCallback) {
  try {
    if (!isRefreshingTokening) { // 此处需要加个 isRefreshingTokening 变量进行去重防止并发
      isRefreshingTokening = true;
      RefreshToken({tokenString: localStorage.getItem("tokenString")}).then(function (result) {
        if (result.status === "SUCCESS") {
          // 尝试自动连接
          store.dispatch('autoLogin', {autoLogin: true});
          // 重新存储用户信息
          localStorage.setItem("tokenString", result.tokenString);
          let expiredTime = new Date().getTime() + result.expireSecond * 1000;     // 毫秒数
          localStorage.setItem("expiredTime", expiredTime);
          setCookie("tokenString", result.tokenString, 365, localStorage.getItem("domain"));
        } else {
          failCallback();
        }
      });
    }
  } finally {
    isRefreshingTokening = false;
  }
}

// 判断过期时间是否是最近 3 小时之内
const checkRecently = function () {
  return new Date().getTime() - localStorage.getItem("expiredTime") < 3 * 3600 * 1000;
}


const _checkCanRefresh = function () {
  // 之前登录过，即有 tokenString
  // 在最近过期 N 小时内才可以自动登录
  return checkNotEmpty(localStorage.getItem("tokenString")) && checkRecently();
};

export const checkSSOLogin = (to, from, next) => _checkSSOLogin(to, from, next);
export const checkNotLogin = () => _checkNotLogin();
export const checkHasLogin = () => _checkHasLogin();
export const checkAdminLogin = () => _checkAdminLogin();
export const getLoginUserName = () => _getLoginUserName();
export const deleteLoginInfo = () => _deleteLoginInfo();
export const getNickName = () => _getNickName();
export const setLoginInfo = (loginResult) => _setLoginInfo(loginResult);
export const refreshToken = (store, failCallback) => _refreshToken(store, failCallback);
export const checkCanRefresh = () => _checkCanRefresh();
