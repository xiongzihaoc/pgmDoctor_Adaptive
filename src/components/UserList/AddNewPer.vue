<template>
  <div class="AddConnect">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>新增个人</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="height:100%;overflow:hidden">
      <el-card style="height:85%;padding-top:8%;box-sizing:border-box;">
        <el-form :model="editAddForm" label-width="80px" :rules="Addrules" ref="addInfoRef">
          <li style="width:100%;display:flex;justify-content: center;">
            <el-form-item label="医生姓名" prop="docName" style="margin-right:5%">
              <el-input v-model="editAddForm.docName"></el-input>
            </el-form-item>
            <el-form-item label="出生日期" prop="birth" class="birth">
              <el-date-picker
                clear-icon="el-icon-date"
                v-model="editAddForm.birth"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </li>
          <li style="display:flex;justify-content: center;">
            <el-form-item label="姓名" prop="name" style="margin-right:5%">
              <el-input v-model="editAddForm.name"></el-input>
            </el-form-item>
            <el-form-item label="性  别" prop="sex">
              <el-select v-model="editAddForm.sex" placeholder="请选择性别">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
          </li>
          <li style="display:flex;justify-content: center;">
            <el-form-item label="年  龄" prop="age" style="margin-right:5%">
              <el-input v-model="editAddForm.age"></el-input>
            </el-form-item>
            <el-form-item label="职  业" prop="job">
              <el-select v-model="editAddForm.job" placeholder="请选择职业">
                <el-option
                  v-for="item in jobList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </li>
          <li style="display:flex;justify-content: center;">
            <el-form-item label="地  址" prop="address" style="margin-right:5%">
              <el-input v-model="editAddForm.address"></el-input>
            </el-form-item>
            <el-form-item label="教  育" prop="edu">
              <el-select v-model="editAddForm.edu" placeholder="请选择职业">
                <el-option
                  v-for="item in eduList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </li>
          <li style="display:flex;justify-content: center;">
            <el-form-item label="手  机" prop="phone" style="margin-right:5%">
              <el-input v-model="editAddForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="婚  姻" prop="marriage">
              <el-select v-model="editAddForm.marriage" placeholder="请选择">
                <el-option label="未婚" value="未婚"></el-option>
                <el-option label="已婚" value="已婚"></el-option>
              </el-select>
            </el-form-item>
          </li>
          <li style="display:flex;justify-content: center;">
            <el-form-item label="套  餐" style="margin-right:5%">
              <el-input
                v-model="strUserName"
                placeholder="请选择套餐"
                @focus="chooseCombo"
                suffix-icon="el-icon-caret-bottom"
              ></el-input>
              <ul class="taoCanList" style="wdith:100%" v-show="openOrcls">
                <li
                  v-for="(item,index) in taocanList"
                  :key="index"
                  @click="chooseCombo"
                >{{item.sheetName}}</li>
              </ul>
            </el-form-item>
            <!-- 占位隐藏布局 -->
            <el-form-item style="visibility:hidden">
              <el-select v-model="editAddForm.marriage" disabled></el-select>
            </el-form-item>
          </li>
          <li style="display:flex;justify-content: center;">
            <el-form-item>
              <el-button type="primary" @click.prevent.stop="enterSave">确定提交</el-button>
            </el-form-item>
          </li>
        </el-form>
      </el-card>
    </div>
    <el-dialog title="选择套餐" :visible.sync="dialogVisible" v-dialogDrag>
      <ul class="chooseTac">
        <li v-for="(item,index) in comboList" :key="index">
          <h3>{{item.type}}</h3>
          <el-checkbox-group v-model="checkList">
            <el-checkbox
              v-for="(subItem,i) in item.package"
              :key="i"
              :label="subItem"
            >{{subItem.name}}</el-checkbox>
          </el-checkbox-group>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleCancel">取 消</el-button>
        <el-button type="primary" @click="dialogVisibleEnter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    var checkMobile = (rule, value, cb) => {
      const regMoblie = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMoblie.test(value)) {
        return cb();
      }
      return cb(new Error("请输入合法的手机号"));
    };
    return {
      Addrules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        docName: [
          { required: true, message: "请输入医生姓名", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        birth: [{ required: true, message: "请输入出生日期", trigger: "blur" }],
        job: [{ required: true, message: "请选择职业", trigger: "blur" }],
        marriage: [
          { required: true, message: "请选择婚姻状况", trigger: "blur" }
        ],
        age: [{ required: true, message: "请输入年龄", trigger: "blur" }],
        edu: [{ required: true, message: "请选择教育程度", trigger: "blur" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }]
        // strUserName: [
        //   { required: true, message: "请选择套餐", trigger: "blur" }
        // ]
      },
      editAddForm: {
        docName: "熊紫豪",
        name: "",
        phone: 18682308445,
        sex: "女",
        birth: "2020-10-01",
        job: "前端",
        marriage: "已婚",
        age: "24",
        edu: "本科",
        address: "杭州西湖"
      },
      jobList: [
        { id: 1, name: "前端" },
        { id: 2, name: "测试" },
        { id: 3, name: "UI" }
      ],
      eduList: [
        { id: 1, name: "本科" },
        { id: 2, name: "大专" },
        { id: 3, name: "高中" },
        { id: 4, name: "初中" },
        { id: 5, name: "其他" }
      ],
      taocanList: [],
      dialogVisible: false,
      checked: false,
      comboList: [],
      checkList: [],
      uuid: "",
      strUserName: "",
      openOrcls: false
    };
  },
  created() {
    this.getInfoList();
  },
  methods: {
    async getInfoList() {
      const { data: res } = await this.$http.post("/office_package/load", {});
      this.comboList = res.rows;
    },
    // 保存信息
    async enterSave() {
      this.$refs.addInfoRef.validate(async valid => {
        if (!valid) return;
        if (!this.strUserName) return this.$message.error("请选择套餐");
        const { data: res } = await this.$http.post("checkList/add", {
          type: "个人",
          name: this.editAddForm.name,
          docName: this.editAddForm.docName,
          phone: this.editAddForm.phone,
          sex: this.editAddForm.sex,
          birth: this.timesChangeDate(this.editAddForm.birth),
          job: this.editAddForm.job,
          age: this.editAddForm.age,
          marriage: this.editAddForm.marriage,
          edu: this.editAddForm.edu,
          address: this.editAddForm.address,
          packageUuid: this.uuid
        });
        if (res.code != 200) return this.$message.error("添加失败");
        this.$message.success("添加成功");
        this.$router.push("/home/index");
      });
    },
    editDialogClosed() {},
    // 套餐input弹出框
    chooseCombo() {
      this.checkList = [];
      this.dialogVisible = true;
    },
    // 提交勾选
    async dialogVisibleEnter() {
      var arr = this.checkList;
      var str = "";
      var strName = "";
      for (var i = 0; i < arr.length; i++) {
        str += arr[i].uuid + ",";
        strName += arr[i].name + ",";
      }
      // 去除字符串最后一个逗号
      if (str.length > 0) {
        str = str.substr(0, str.length - 1);
      }
      if (strName.length > 0) {
        strName = strName.substr(0, strName.length - 1);
      }
      this.uuid = str;
      this.strUserName = strName;
      // 发送axios
      const { data: res } = await this.$http.post("/office_package/detail", {
        uuid: str
      });
      if (res.code != 200) return this.$message.error("操作失败");
      this.taocanList = res.rows;
      this.dialogVisible = false;
      this.openOrcls = true;
    },
    dialogVisibleCancel() {
      this.str = "";
      this.dialogVisible = false;
    },
    getItemInfo(info) {
      console.log(info);
    },
    // 转换时间格式
    timesChangeDate(times) {
      var date = new Date(times);
      var y = date.getFullYear();
      var mon = date.getMonth() + 1;
      var d = date.getDate();
      if (mon < 10) {
        mon = "0" + mon;
      }
      if (d < 10) {
        d = "0" + d;
      }
      return `${y}-${mon}-${d}`;
    }
  }
};
</script>
<style scoped>
.AddConnect {
  height: 100%;
}
.AddConnect .chooseTac li {
  border-bottom: 1px solid #e5e5e5;
}
.AddConnect .chooseTac li:nth-child(1) {
  border-top: 1px solid #e5e5e5;
}
.AddConnect .el-dialog__header {
  margin-bottom: 10px;
}
.AddConnect .el-dialog__body {
  font-size: 14px;
  padding: 0;
}
.chooseTac h3 {
  margin-bottom: 10px;
}
.taoCanList {
  border-radius: 5px;
}
.taoCanList li {
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  border-top: 0px;
  padding: 0 10px;
  overflow: hidden;
  cursor: pointer;
}
.el-card {
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
</style>