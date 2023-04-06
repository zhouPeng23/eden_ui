<template>
  <div id="login_area">
    <div>
      <Input v-model="username" size="large" placeholder="手机 / 邮箱..." type="text" style="width: 300px;height: 40px;margin: 15px 0 0 0; padding: 0 20px 0 20px"/>
      <Input v-model="passwd" size="large" placeholder="密码..." type="password" style="width: 300px;height: 40px;margin: 15px 0 0 0; padding: 0 20px 0 20px"/>
      <Button type="success" long @click="login" style="width: 260px;height: 40px;margin: 15px 0 0 20px; ">登录</Button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "loginPage",
    data() {
      return {
        username:'',
        passwd:'',
      }
    },
    methods: {
      login: async function () {
        if (this.username === 'zhoupeng' && this.passwd==='123456789') {
          this.$Message.success("登录成功");
          this.$router.push({path: '/manage/appmanage/appList'});
        }else{
          this.$Message.error("用户名或密码错误");
        }
      },
    },
    async mounted () {

    }
  }
</script>

<style scoped>
  #login_area {
    width: 300px;
    height: 200px;
    background: lightyellow;
    margin-top: 150px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
