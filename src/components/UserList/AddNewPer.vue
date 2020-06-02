<template>
  <div class="AddConnect">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>增改个人</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="height:100%;overflow:hidden">
      <el-card style="height:85%;padding-top:8%;box-sizing:border-box;">
        <el-form
          :model="editAddForm"
          label-width="80px"
          :rules="Addrules"
          ref="addInfoRef"
          :inline="true"
          label-position="right"
        >
          <!-- 体卡类型  出生日期 -->
          <li style="width:100%;display:flex;justify-content: center;">
            <el-form-item label="体卡类型" prop="orderType" style="margin-right:5%">
              <el-select v-model="editAddForm.orderType" placeholder="请选择体卡类型" style="width:202px">
                <el-option label="虚拟卡" value="虚拟卡"></el-option>
                <el-option label="实体卡" value="实体卡"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="出生日期" prop="birthday" class="birth">
              <el-date-picker
                style="width:202px"
                v-model="editAddForm.birthday"
                :editable="false"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </li>
          <!-- 姓名  手机 -->
          <li style="width:100%;display:flex;justify-content: center;">
            <el-form-item label="姓  名" prop="name" style="margin-right:5%">
              <el-input v-model="editAddForm.name"></el-input>
            </el-form-item>
            <el-form-item label="手  机" prop="phone">
              <el-input v-model="editAddForm.phone"></el-input>
            </el-form-item>
          </li>
          <!-- 科室  性别 -->
          <li style="width:100%;display:flex;justify-content: center;">
            <!-- 医院 部门 -->
            <el-form-item label="科  室" prop="dept" style="margin-right:5%">
              <el-cascader
                :disabled="IsDeptDisabled"
                v-model="editAddForm.dept"
                :options="deptList"
                @change="handleChange"
                :props="addNewProps"
                :show-all-levels="false"
                style="width:202px"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="性  别" prop="gender">
              <el-select v-model="editAddForm.gender" placeholder="请选择性别" style="width:202px">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
          </li>
          <!-- 医生  职业 -->
          <li style="width:100%;display:flex;justify-content: center;">
            <el-form-item label="医  生" prop="docName" style="margin-right:5%">
              <el-select
                filterable
                v-model="editAddForm.docName"
                placeholder="请选择医生"
                style="width:202px"
                :disabled="IsDocDisabled"
                @focus="handleDocFoucs"
                @change="getT"
              >
                <el-option v-for="item in docList" :key="item.id" :label="item.name" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="职  业" prop="job">
              <el-select v-model="editAddForm.job" placeholder="请选择职业" style="width:202px">
                <el-option
                  v-for="item in jobList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </li>
          <!-- 教育  婚姻 -->
          <li style="display:flex;justify-content: center;">
            <el-form-item label="教  育" prop="edu" style="margin-right:5%">
              <el-select
                filterable
                v-model="editAddForm.edu"
                placeholder="请选择学历"
                style="width:202px"
              >
                <el-option
                  v-for="item in eduList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="婚  姻" prop="marriage">
              <el-select v-model="editAddForm.marriage" placeholder="请选择" style="width:202px">
                <el-option label="未婚" value="未婚"></el-option>
                <el-option label="已婚" value="已婚"></el-option>
                <el-option label="离异" value="离异 "></el-option>
                <el-option label="丧偶" value="丧偶"></el-option>
              </el-select>
            </el-form-item>
          </li>
          <li style="display:flex;justify-content: center;">
            <el-form-item label="套  餐" style="margin-right:5%" prop="strUserName">
              <el-input
                v-model="strUserName"
                placeholder="请选择套餐"
                @focus="chooseCombo"
                suffix-icon="el-icon-caret-bottom"
                readonly
              ></el-input>
              <ul class="taoCanList" style="wdith:100%" v-show="openOrcls">
                <li
                  v-for="(item,index) in taocanList"
                  :key="index"
                  @click="chooseCombo"
                >{{item.sheetName}}</li>
              </ul>
            </el-form-item>
            <el-form-item label="测  试" prop="marriage" style="visibility: hidden;">
              <el-select v-model="editAddForm.marriage" placeholder="请选择" style="width:202px">
                <el-option label="未婚" value="未婚"></el-option>
                <el-option label="已婚" value="已婚"></el-option>
              </el-select>
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
    <!-- 弹框 -->
    <el-dialog
      title="选择套餐"
      :visible.sync="dialogVisible"
      v-dialogDrag
      @closed="dialogVisibleCancel"
    >
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
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="dialogVisibleEnter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { timesChangeDate } from "../../assets/js/util";
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
      timesChangeDate,
      Addrules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        orderType: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        dept: [{ required: true, message: "请选择科室", trigger: "blur" }],
        docName: [
          { required: true, message: "请输入医生姓名", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ],
        gender: [{ required: true, message: "请选择性别", trigger: "blur" }],
        birthday: [{ required: true, message: "请输入出生日期" }],
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
        docName: "",
        orderType: "虚拟卡",
        name: "",
        phone: "",
        gender: "",
        birthday: "",
        job: "",
        edu: "",
        marriage: "",
        dept: "",
        uuid: ""
      },
      jobList: [
        { id: 1, name: "国家公务员" },
        { id: 2, name: "专业技术人员" },
        { id: 3, name: "职员" },
        { id: 4, name: "企业管理人员" },
        { id: 5, name: "工人" },
        { id: 6, name: "农民" },
        { id: 7, name: "学生" },
        { id: 8, name: "现役军人" },
        { id: 9, name: "自由职业者" },
        { id: 10, name: "个体经营者" },
        { id: 11, name: "无业人员" },
        { id: 12, name: "退(离)休人员" },
        { id: 13, name: "其他" }
      ],
      eduList: [
        { id: 1, name: "博士" },
        { id: 2, name: "硕士" },
        { id: 3, name: "本科" },
        { id: 4, name: "大专" },
        { id: 5, name: "中专和中技" },
        { id: 6, name: "技工学校" },
        { id: 7, name: "高中" },
        { id: 8, name: "初中" },
        { id: 9, name: "小学" },
        { id: 10, name: "文盲与半文盲" }
      ],
      taocanList: [],
      dialogVisible: false,
      checked: false,
      comboList: [],
      checkList: [],
      docList: [],
      uuid: "",
      strUserName: "",
      openOrcls: false,
      judge: {},
      deptList: [],
      IsDeptDisabled: false,
      IsDocDisabled: false,
      selectDeptNum: "",
      addNewProps: {
        children: "child",
        label: "deptName",
        value: "code",
        checkStrictly: true
      }
    };
  },
  created() {
    if (this.$route.query.mess == "修改") {
      this.editAddForm = JSON.parse(window.sessionStorage.getItem("editInfo"));
      this.editAddForm.gender = JSON.parse(
        window.sessionStorage.getItem("editInfo")
      ).sex;
      this.editAddForm.birthday = JSON.parse(
        window.sessionStorage.getItem("editInfo")
      ).birth;
    }
    this.getInfoList();
    this.getDeptList();
    this.judge = JSON.parse(window.localStorage.getItem("mess"));
    this.Judgerole();
  },
  methods: {
    // 获取个人信息
    async getInfoList() {
      const { data: res } = await this.$http.post("/office_package/load", {});
      this.comboList = res.rows;
    },
    // 获取医生列表
    async getDocList() {
      var DeptStr = "";
      if (this.selectDeptNum == "") {
        DeptStr = this.judge.dcDept;
      } else {
        DeptStr = this.selectDeptNum;
      }
      const { data: res } = await this.$http.post("doc/list", {
        dcDept: DeptStr
      });
      if (res.code !== 200) return this.$message.error("获取医生列表失败");
      console.log(res);
      this.docList = res.rows;
    },
    // 获取部门列表
    async getDeptList() {
      const { data: res } = await this.$http.post(this.$ajax + "dept/list", {
        code: this.judge.dcDept
      });
      if (res.code !== 200) return this.$message.error("获取医生列表失败");
      console.log(res);
      this.deptList = res.data;
    },
    // 判断accountType 登录角色
    Judgerole() {
      if (this.judge.accountType == 0) {
        this.editAddForm.docName = this.judge.name;
        this.editAddForm.uuid = this.judge.uuid;
        this.IsDocDisabled = true;
        this.IsDeptDisabled = true;
        this.editAddForm.dept = this.judge.dcDept;
      } else if (this.judge.accountType == 1) {
        this.editAddForm.dept = this.judge.dcDept;
        this.IsDeptDisabled = true;
      } else if (this.judge.accountType == 2) {
        this.editAddForm.dept = this.judge.dcDept;
      } else {
      }
    },
    // 点击医生下拉选加载医生数据
    handleDocFoucs() {
      this.getDocList();
    },
    handleChange(val) {
      var valLength = val.length;
      this.selectDeptNum = val[valLength - 1];
      console.log(this.selectDeptNum);
      this.editAddForm.dept = this.selectDeptNum;
    },
    // 保存信息
    enterSave() {
      this.$refs.addInfoRef.validate(async valid => {
        if (!valid) return;
        if (!this.strUserName) return this.$message.error("请选择套餐");
        const { data: res } = await this.$http.post("checkList/add", {
          source: "0",
          name: this.editAddForm.name,
          docName: this.editAddForm.docName,
          docUuid: this.editAddForm.uuid,
          phone: this.editAddForm.phone,
          sex: this.editAddForm.gender,
          birth: this.timesChangeDate(this.editAddForm.birthday),
          job: this.editAddForm.job,
          marriage: this.editAddForm.marriage,
          orderType: this.editAddForm.orderType,
          orderDept: this.editAddForm.dept,
          packageUuid: this.uuid
        });
        if (res.code != 200) return this.$message.error("添加失败");
        this.$message.success("添加成功");
        this.$router.push("/home/index");
      });
    },
    getT(val) {
      this.editAddForm.docName = val.name;
      this.editAddForm.uuid = val.uuid;
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
    }
  }
};
</script>
<style>
.AddConnect {
  height: 100%;
}
.AddConnect .chooseTac li {
  padding: 1%;
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
.AddConnect .el-dialog {
  width: 60%;
  max-width: 700px;
}
</style>