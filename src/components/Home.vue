<template>
  <div class="connect">
    <div class="asdie">
      <img :src="this.hosMess.photoUrl" alt class="logoImg" />
      <h3>{{hosMess.hospital}}</h3>
      <el-menu
        background-color="#fff"
        text-color="#BFCBD9"
        active-text-color="#fff"
        :unique-opened="true"
        router
        :default-active="$route.path"
      >
        <!-- 一级菜单 -->
        <el-menu-item
          :index="'/' + item.path"
          v-for="item in menuList"
          :key="item.id"
          @click="saveNavState('/' + item.path)"
        >
          <template slot="title">
            <i :class="item.icon" height="24px"></i>
            <span>{{item.name}}</span>
          </template>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="rightBox">
      <div class="header">
        <div class="loginDiv">
          <span class="userName">
            您好
            <a href="javascript:;">{{hosMess.name}}</a> 欢迎来到PHM检测中心后台！
          </span>
          <span class="editPass" @click.prevent.stop="editPassword">修改密码</span> |
          <span class="loginOut" @click.prevent.stop="loginOut">退出登录</span>
          <img
            class="warningImg"
            src="../assets/images/warning.png"
            @click.prevent.stop="jumpconsulation"
          />
        </div>
      </div>
      <div class="main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      hosMess: {},
      menuList: [
        {
          icon: "iconfont icon-shouye",
          name: "首   页",
          path: "home/index",
          id: "1"
        },
        {
          icon: "iconfont icon-yonhu",
          name: "用户中心",
          path: "home/userCenter",
          id: "2"
        },
        {
          icon: "iconfont icon-liangbiao",
          name: "他评量表",
          path: "home/HisScale",
          id: "3"
        },
        {
          icon: "iconfont icon-baogao-copy",
          name: "检测报告",
          path: "home/examiningReport",
          id: "4"
        },
        {
          icon: "iconfont icon-yujing",
          name: "预警提醒",
          path: "home/warning",
          id: "5"
        },
        {
          icon: "iconfont icon-huizhen",
          name: "会诊操作",
          path: "home/consultation",
          id: "6"
        },
        {
          icon: "iconfont icon-icon-",
          name: "数据统计",
          path: "home/dataStatistics",
          id: "7"
        }
      ],
      activePath: "/home/index"
    };
  },
  created() {
    this.activePath = window.sessionStorage.getItem("activePath");
    this.hosMess = JSON.parse(window.localStorage.getItem("mess"));
  },
  methods: {
    // 退出
    async loginOut() {
      const { data: res } = await this.$http.post("doc/loginOut", {});
      if (res.code != 200) return this.$message.error("退出失败");
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    jumpconsulation() {
      this.$router.push("consultation");
    },
    // 保持连接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
    }
  }
};
</script>
<style scoped>
html,
body {
  height: 100%;
}
.connect {
  overflow: hidden;
  height: 100%;
}
.asdie {
  overflow: hidden;
  float: left;
  width: 10%;
  height: 100%;
  padding: 2% 1%;
}
.rightBox {
  overflow: hidden;
  float: right;
  width: 88%;
  height: 100%;
}
.header {
  overflow: hidden;
  display: -webkit-flex;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 80px;
  padding-right: 5%;
  border-left: 5px solid #f7f7f7;
  background-color: #fff;
}
.main {
  width: 100%;
  height: 100%;
  padding: 1%;
  box-sizing: border-box;
  background-color: #f7f7f7;
}
.logoImg {
  display: block;
  width: 80%;
  max-width: 80px;
  max-height: 80px;
  border-radius: 50%;
  margin: 0 auto;
}
h3 {
  font-weight: 700;
  font-size: 20px;
  text-align: center;
}
a {
  color: #2c8cf0;
}
.loginDiv {
  color: #b6b6b6;
  line-height: 30px;
  padding-right: 2%;
}
.loginDiv a {
  text-decoration: underline;
}
.loginOut {
  padding-right: 10px;
}
.warningImg {
  cursor: pointer;
  vertical-align: top;
}
.editPass,
.loginOut {
  cursor: pointer;
}
.blue {
  background-color: #2c8cf0;
}
.blue a {
  color: #fff !important;
}
.el-menu {
  margin-top: 25%;
  border-right: none;
}
.el-menu-item {
  color: #8f929c !important;
  box-sizing: border-box;
  margin-top: 5%;
  border-radius: 7px;
  padding: 0 !important;
  text-align: center;
}
.el-menu-item.is-active {
  color: #fff !important;
  background-color: #2c8cf0 !important;
}
.el-menu-item span {
  margin-left: 10%;
}
.el-menu-item:hover {
  color: #8f929c !important;
  background-color: #fff !important;
}
.el-menu-item.is-active:hover {
  background-color: #2c8cf0 !important;
  color: #fff !important;
}
</style>