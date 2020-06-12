<template>
  <div class="CONTENTLogin">
    <div class="login_box animated slideInLeft">
      <h3>欢迎登录</h3>
      <el-form ref="LoginFormRef" :model="LoginForm" :rules="loginRules">
        <el-form-item prop="loginName">
          <el-input
            v-model="LoginForm.loginName"
            prefix-icon="el-icon-user-solid"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="userPassword">
          <el-input
            type="password"
            v-model="LoginForm.userPassword"
            prefix-icon="el-icon-view"
            placeholder="请输入密码"
            @keyup.13.native="handleLogin"
          ></el-input>
        </el-form-item>

        <!-- <el-button type="danger" @click.prevent.stop="reset">重 置</el-button> -->
        <el-button
          type="primary"
          @click.prevent.stop="handleLogin"
          style="width:50%"
          class="loginBtn"
          >登 录</el-button
        >
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      LoginForm: {
        loginName: "",
        userPassword: "",
      },
      loginRules: {
        loginName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        userPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 16,
            message: "长度在 5 到 16 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 登录
    handleLogin() {
      this.$refs.LoginFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("doc/login", {
          userName: this.LoginForm.loginName.trim(),
          password: this.$md5(this.LoginForm.userPassword).trim(),
        });
        if (res.code != 200) return this.$toast.fail(res.data);
        // token 存入 sessionstorage
        window.sessionStorage.setItem("token", res.data.token);
        window.localStorage.setItem("mess", JSON.stringify(res.data));
        // 跳转
        this.$router.push({
          path: "/home",
        });
      });
    },
    // 重置
    reset() {
      this.LoginForm = {};
    },
  },
};
</script>
<style scoped>
.CONTENTLogin {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center; /*垂直居中*/
  justify-content: center; /*水平居中*/
  background: url("../assets/images/loginbg.jpg") no-repeat center;
  background-size: cover;
}
.CONTENTLogin .login_box {
  overflow: hidden;
  width: 60%;
  max-width: 800px;
  box-sizing: border-box;
  padding: 5%;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.6);
}

.CONTENTLogin form {
  width: 80%;
  margin: 0 auto;
  max-width: 400px;
}
.CONTENTLogin h3 {
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  padding-bottom: 10%;
  color: #000046;
}
.btnBox {
  float: right;
  overflow: hidden;
}
.loginBtn {
  display: block;
  margin: 0 auto;
  border: none;
  background-image: linear-gradient(60deg, #000046,#1CB5E0,#004e92) !important;
}
.loginBtn:hover {
  transition: 1s linear;
  width: 100%!important;
}
</style>
