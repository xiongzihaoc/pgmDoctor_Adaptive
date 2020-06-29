<template>
  <div class="ConnectHo">
    <div class="asdie">
      <img :src="this.hosMess.hospitalLogo" alt class="logoImg" />
      <h3>{{ hosMess.hospital }}</h3>
      <el-menu
        background-color="#fff"
        text-color="#BFCBD9"
        active-text-color="#fff"
        :unique-opened="true"
        router
        :default-active="routerPath"
        ref="menuRef"
      >
        <!-- 一级菜单 -->
        <el-menu-item
          :index="'/' + item.path"
          v-for="item in menuList"
          :key="item.id"
        >
          <template slot="title">
            <i :class="item.icon" height="24px"></i>
            <span>{{ item.name }}</span>
          </template>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="rightBox">
      <div class="header">
        <div class="loginDiv">
          <span class="userName">
            您好
            <a href="javascript:;">{{ hosMess.name }}</a>
            欢迎来到PHM检测中心后台！
          </span>
          <span
            class="editPass"
            @click.prevent.stop="editPassword"
            style="color: red;"
            >修改密码</span
          >
          |
          <span class="loginOut" @click="loginOut" style="color: royalblue;"
            >退出登录</span
          >
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
    <!-- 修改密码弹框 -->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      @closed="editDialogClosed"
      v-dialogDrag
    >
      <el-form
        ref="loginFormRef"
        :model="editAddForm"
        label-width="80px"
        :rules="loginRules"
      >
        <el-form-item label="账号" prop="userName">
          <el-input v-model="this.hosMess.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="原密码" prop="srcPwd">
          <el-input
            :key="passwordType"
            :type="passwordType"
            v-model="editAddForm.srcPwd"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input
            :key="passwordType"
            :type="passwordType"
            v-model="editAddForm.password"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisibleEnter">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 
    <el-dialog title="退出登录" :visible.sync="logoutDialog" v-dialogDrag center>
      <div>是否退出登录</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="logoutDialog=false">取 消</el-button>
        <el-button type="primary" @click="logoutDialogEnter">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      hosMess: {},
      logoutDialog: false,
      menuList: [
        {
          icon: "iconfont icon-shouye",
          name: "首   页",
          path: "home/index",
          id: "1",
        },
        {
          icon: "iconfont icon-yonhu",
          name: "个人中心",
          path: "home/userCenter",
          id: "2",
        },
        {
          icon: "iconfont icon-hexintuandui",
          name: "团体中心",
          path: "home/teamCenter",
          id: "8",
        },
        {
          icon: "iconfont icon-liangbiao",
          name: "他评量表",
          path: "home/HisScale",
          id: "3",
        },
        {
          icon: "iconfont icon-baogao-copy",
          name: "检测报告",
          path: "home/examiningReport",
          id: "4",
        },
        {
          icon: "iconfont icon-yujing",
          name: "预警提醒",
          path: "home/warning",
          id: "5",
        },
        {
          icon: "iconfont icon-huizhen",
          name: "会诊操作",
          path: "home/consultation",
          id: "6",
        },
        {
          icon: "iconfont icon-icon-",
          name: "数据统计",
          path: "home/dataStatistics",
          id: "7",
        },
      ],
      passwordType: "password",
      loginRules: {
        password: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            min: 5,
            max: 16,
            message: "长度在 5 到 16 个字符",
            trigger: "blur",
          },
        ],
        srcPwd: [
          { required: true, message: "请输入原密码", trigger: "blur" },
          {
            min: 5,
            max: 16,
            message: "长度在 5 到 16 个字符",
            trigger: "blur",
          },
        ],
      },
      editAddForm: {
        userName: "",
        srcPwd: "",
        password: "",
      },
      dialogVisible: false,
      activePath: "/home/index",
    };
  },
  created() {
    this.hosMess = JSON.parse(window.localStorage.getItem("mess"));
    // console.log(this.hosMess);
  },
  methods: {
    // 退出
    async loginOut() {
      this.logoutDialog = true;
      const confirmResult = await this.$confirm("你确定退出吗", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => console.log(err));
      if (confirmResult != "confirm") {
        return
      }
      const { data: res } = await this.$http.post("doc/loginOut", {});
      if (res.code != 200) return this.$message.error("退出失败");
      window.sessionStorage.clear();
      window.localStorage.clear();
      this.$router.push("/");
    },
    async logoutDialogEnter() {},
    jumpconsulation() {
      this.$router.push("/home/consultationMessage");
    },
    // 修改密码
    editPassword() {
      this.dialogVisible = true;
    },
    dialogVisibleEnter() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("doc/updPwd", {
          userName: this.hosMess.userName,
          srcPwd: this.$md5(this.editAddForm.srcPwd),
          password: this.$md5(this.editAddForm.password),
        });
        if (res.code != 200) return this.$message.error(res.data);
        this.$message.success(res.msg);
        this.dialogVisible = false;
        window.sessionStorage.clear();
        this.$router.push("/login");
      });
    },
    editDialogClosed() {
      this.editAddForm = {};
    },
  },
  computed: {
    routerPath: function() {
      return this.$route.meta.guidePath
        ? this.$route.meta.jumpPath
        : this.$route.path;
    },
  },
};
</script>
<style>
html,
body {
  height: 100%;
}
.ConnectHo {
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
.asdie h3 {
  font-weight: 700;
  font-size: 20px;
  text-align: center;
}
.userName a {
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
.ConnectHo .el-dialog {
  width: 60%;
  max-width: 700px;
}
</style>
