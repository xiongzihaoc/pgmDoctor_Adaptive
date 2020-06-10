<template>
  <div class="addTeamCheck" style="height:85%">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home/teamCenter' }"
        >团队中心</el-breadcrumb-item
      >
      <el-breadcrumb-item>新增检测</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="height:100%;overflow:hidden">
      <el-card style="height:100%;padding-top:8%;box-sizing:border-box;">
        <el-form
          :model="addTeamCheckFrom"
          label-width="80px"
          ref="addTeamCheckFromRef"
          :rules="addTeamCheckFromRules"
        >
          <el-form-item
            label="检测编号"
            prop="teamNo"
            style="width: 50%;margin-left: 25%;"
          >
            <el-input
              v-model="addTeamCheckFrom.teamNo"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="检测人数"
            prop="teamNumber"
            style="width: 50%;margin-left: 25%;"
          >
            <el-input
              v-model="addTeamCheckFrom.teamNumber"
              oninput="if(value.length>11)value=value.slice(0,11)"
              type="number"
              placeholder="请输入检测人数"
            ></el-input>
          </el-form-item>
        </el-form>
        <div style="width: 50%;display: flex;margin-left: 25%;">
          <label class="label_check">检测套餐</label>
          <div
            style="height: 52px;position: relative; margin-right: 10px;"
            v-for="(item, index) in addTeamCheckFrom.paramList"
            :key="index"
          >
            <span
              @click="editorPackages(index)"
              style="line-height: 52px;background: #409EFF;padding: 5px 10px;border-radius: 5px;color: white;"
              >{{ item.packageName }}</span
            >

            <i
              class="el-icon-error"
              style="font-size: 20px;position: absolute;right: -5px;top: 5px;"
              @click="removePackages(index)"
            ></i>
          </div>
          <div
            style="width: 50px;height: 50px;border: #ccc dashed 1px;text-align: center;"
            @click="addCheckPackage()"
          >
            <i
              class="el-icon-plus"
              style="font-size: 20px;color:#ccc;margin-top: 50%;transform: translateY(-50%);"
            ></i>
          </div>
        </div>
        <div style="width: 100%;text-align: center;margin-top: 50px;">
          <el-button type="primary" @click.prevent.stop="saveTeamCheck()"
            >确定提交</el-button
          >
        </div>
      </el-card>
    </div>
    <!--新增套餐弹框-->
    <el-dialog
      title="新增套餐"
      :visible.sync="addCheckDilogShow"
      width="60%"
      v-dialogDrag
    >
      <el-form
        ref="addCheckPackagesFromRef"
        :model="checkPackageFrom"
        :rules="addCheckPackagesRuleFrom"
        label-width="80px"
      >
        <el-form-item prop="packageName" label="套餐名称" style="width: 70%;">
          <el-input
            v-model="checkPackageFrom.packageName"
            placeholder="请输入套餐名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="packageNames" label="选择套餐" style="width: 70%;">
          <el-input
            v-model="checkPackageFrom.packageNames"
            @focus="selectCheckPackage"
            placeholder="请选择套餐"
          ></el-input>
          <ul
            style="width: 100%; border: #dcdfe6 solid 1px;border-top:none;border-radius: 5px;"
            v-if="packagesList.length > 0"
          >
            <li
              style="margin-left: 10px;"
              v-for="(item, index) in packagesList"
              :key="index"
            >
              {{ item.sheetName }}
            </li>
          </ul>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCheckDilogShow = false">取 消</el-button>
        <el-button type="primary" @click="saveCheckPackage()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择量表"
      :visible.sync="selectedPackagesDialogShow"
      v-dialogDrag
    >
      <ul class="sheetPackage">
        <li v-for="(item, index) in sheetList" :key="index">
          <h3>{{ item.type }}</h3>
          <el-checkbox-group v-model="checkList" style="margin-top: 10px;">
            <el-checkbox
              v-for="(subItem, i) in item.package"
              :key="i"
              :label="subItem"
              >{{ subItem.name }}</el-checkbox
            >
          </el-checkbox-group>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetPackages()">重置</el-button>
        <el-button type="primary" @click="addPackageSheet">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      addOrUpdateType: 1, //1:添加 2:修改
      packageInfoUpdateType: 1, //1添加 2：修改
      packageInfoUpdateIndex: 0, //当前修改的套餐下标
      teamCode: "", //团队Code
      checkList: [],
      sheetList: [],
      packagesList: [],
      checkPackageFrom: {
        packageName: "",
        packageNames: "",
        packageUuids: "",
        package: [],
      },
      addCheckDilogShow: false, //新增套餐Dialog
      selectedPackagesDialogShow: false, //选择量表套餐Dialog
      addTeamCheckFrom: {
        id: "",
        teamNo: "",
        teamNumber: "",
        paramList: [],
      },
      addCheckPackagesRuleFrom: {
        packageName: [
          { required: true, message: "请输入套餐名称", trigger: "blur" },
        ],
      },
      addTeamCheckFromRules: {
        teamNo: [
          { required: true, message: "请输入检测编号", trigger: "blur" },
        ],
        teamNumber: [
          { required: true, message: "请输入检测人数", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    var type = this.$route.query.type;
    this.teamCode = this.$route.query.teamCode;
    this.addOrUpdateType = this.$route.query.type;
    if (this.addOrUpdateType == 2) {
      this.addTeamCheckFrom = JSON.parse(this.$route.query.packageInfo);
      if (this.addTeamCheckFrom != null) {
        var paramList = this.addTeamCheckFrom.paramList;
        if (paramList != null && paramList.length > 0) {
          paramList.forEach((ele) => {
            var packages = ele.package;
            var names = "",
              uuids = "";
            if (packages != null && packages.length > 0) {
              packages.forEach((e) => {
                names += e.name + ",";
                uuids += e.uuid + ",";
              });
            }
            if (names.length > 0) {
              names = names.substr(0, names.length - 1);
            }
            if (uuids.length > 0) {
              uuids = uuids.substr(0, uuids.length - 1);
            }
            ele.packageNames = names;
            ele.packageUuids = uuids;
          });
        }
      }
      console.log(this.addTeamCheckFrom);
    } else {
      this.addOrUpdateType = 1;
      this.getTeamCheckCode();
    }
    this.getSheetList();
    console.log(this.addOrUpdateType);
  },
  methods: {
    async getTeamCheckCode() {
      const { data: res } = await this.$http.post("/common/getCardNo", {});
      if (res == null && res.code != 200)
        return this.$message.error("检测编号获取失败,请点击重试");
      console.log(res);
      this.addTeamCheckFrom.teamNo = res.data;
    },
    addCheckPackage() {
      this.checkPackageFrom = {};
      this.addCheckDilogShow = true;
      this.packagesList = [];
    },
    selectCheckPackage() {
      this.checkList = [];
      this.selectedPackagesDialogShow = true;
    },
    async saveCheckPackage(formName) {
      this.$refs.addCheckPackagesFromRef.validate((valid) => {
        if (valid) {
          if (
            this.checkPackageFrom.packageNames == "" ||
            this.checkPackageFrom.packageNames == null
          ) {
            return this.$message.error("请选择套餐");
          }
          if (this.packageInfoUpdateType == 2) {
            this.addTeamCheckFrom.paramList.forEach((element, index) => {
              if (index == this.packageInfoUpdateIndex) {
                element = this.checkPackageFrom;
              }
            });
            this.packageInfoUpdateType = 1;
            this.packageInfoUpdateIndex = 0;
          } else {
            this.addTeamCheckFrom.paramList.push(this.checkPackageFrom);
          }
          this.addCheckDilogShow = false;
        }
      });
    },
    saveTeamCheck() {
      //新增团队检测
      this.$refs.addTeamCheckFromRef.validate(async (valid) => {
        if (valid) {
          if (
            this.addTeamCheckFrom.paramList == null ||
            this.addTeamCheckFrom.paramList.length == 0
          ) {
            return this.$message.error("请添加检测套餐");
          }
          var params = {};
          var url = "teamList/add";
          console.log(this.addOrUpdateType);
          if (this.addOrUpdateType == 1) {
            url = "teamList/add";
          } else {
            url = "teamList/update";
          }
          if (this.addOrUpdateType == 1) {
            params = {
              teamNo: this.addTeamCheckFrom.teamNo,
              teamNumber: this.addTeamCheckFrom.teamNumber,
              teamDept: this.teamCode,
              paramList: this.addTeamCheckFrom.paramList,
            };
          } else {
            params = {
              id: this.addTeamCheckFrom.id,
              teamNo: this.addTeamCheckFrom.teamNo,
              teamNumber: this.addTeamCheckFrom.teamNumber,
              teamDept: this.teamCode,
              paramList: this.addTeamCheckFrom.paramList,
            };
          }
          const { data: res } = await this.$http.post(url, params);
          if (res == null || res.code != 200) {
            if (this.addOrUpdateType == 1) {
              return this.$message.error("添加检测失败，请重试");
            } else {
              return this.$message.error("修改检测失败，请重试");
            }
          }
          this.addTeamCheckFrom = {};
          this.$router.push({ path: "/home/teamCenter" });
          console.log(res);
        }
      });
    },
    async getSheetList() {
      //获取量表列表
      const { data: res } = await this.$http.post("/office_package/load", {});
      if (res == null && res.code != 200)
        return this.$message.error("量表列表获取失败");
      this.sheetList = res.rows;
      console.log(this.sheetList);
    },
    async addPackageSheet() {
      //添加检测量表
      if (this.checkList == null || this.checkList.length == 0) {
        return this.$message.error("请选择套餐");
      }
      var packageIds = "";
      var packagesName = "";
      if (this.checkList != null && this.checkList.length > 0) {
        var packagesList = [];
        for (var i = 0; i < this.checkList.length; i++) {
          var packages = {};
          packageIds += this.checkList[i].uuid + ",";
          packagesName += this.checkList[i].name + ",";
          packages.name = this.checkList[i].name;
          packages.uuid = this.checkList[i].uuid;
          packagesList.push(packages);
        }
        this.checkPackageFrom.package = packagesList;
        console.log(this.checkPackageFrom);
      }

      // 去除字符串最后一个逗号
      if (packageIds.length > 0) {
        packageIds = packageIds.substr(0, packageIds.length - 1);
      }
      if (packagesName.length > 0) {
        packagesName = packagesName.substr(0, packagesName.length - 1);
      }
      this.checkPackageFrom.packageUuids = packageIds;
      this.checkPackageFrom.packageNames = packagesName;
      // 发送axios
      const { data: res } = await this.$http.post("/office_package/detail", {
        uuid: packageIds,
      });
      if (res.code != 200) return this.$message.error("操作失败");
      this.packagesList = res.rows;
      this.selectedPackagesDialogShow = false;
      console.log(res);
    },
    resetPackages() {
      //重置
      this.checkList = [];
    },
    async removePackages(index) {
      //删除套餐
      const confirmResult = await this.$confirm("是否删除套餐?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => console.log(err));
      if (confirmResult != "confirm") {
        return this.$message.info("取消删除");
      }
      this.addTeamCheckFrom.paramList.splice(index, 1);
    },
    editorPackages(index) {
      //编辑套餐
      this.packageInfoUpdateIndex = index;
      this.packageInfoUpdateType = 2;
      this.checkPackageFrom = this.addTeamCheckFrom.paramList[index];
      this.addCheckDilogShow = true;
    },
  },
};
</script>
<style lang="less" scoped>
.box-card {
  width: 100%;
  height: 100%;
}
.el-card {
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.label_check {
  width: 80px;
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 52px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
}
.addTeamCheck .sheetPackage li {
  padding: 1%;
  border-bottom: 1px solid #e5e5e5;
}
.addTeamCheck .sheetPackage li:nth-child(1) {
  border-top: 1px solid #e5e5e5;
}
.addTeamCheck .el-dialog__header {
  margin-bottom: 10px;
}
.addTeamCheck .el-dialog__body {
  font-size: 14px;
  padding: 0;
}
.sheetPackage h3 {
  margin-bottom: 10px;
}
.addTeamCheck .el-dialog {
  width: 60%;
  max-width: 700px;
}
</style>
