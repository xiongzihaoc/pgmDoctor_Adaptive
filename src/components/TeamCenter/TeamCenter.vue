<template>
  <div class="connectTeam">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>团队中心</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="CardBox">
      <!-- 左侧卡片 -->
      <el-card class="cardLeft">
        <el-table
          :data="menuList"
          :expand-row-keys="[currentTeamCode]"
          :tree-props="{children: 'child', hasChildren: 'hasChildren'}"
          :header-cell-style="{background:'#f5f5f5'}"
          highlight-current-row
          current-row-key="[currentTeamCode]"
          row-key="code"
          ref="singleTable"
          @row-click="handdle"
          @cell-click="cellClick"
          class="teamClass"
          @header-click="addInside($event)"
          style="width: 100%;margin-bottom: 20px;"
        >
          <el-table-column align="left" prop="name" label="团队列表" label-class-name="ccc"></el-table-column>
          <el-table-column
            align="center"
            width="100"
            label-class-name="zzz"
            label="+"
            style="font-size:30px"
          >
            <template slot-scope="scope">
              <i
                style="display:inline-block"
                class="el-icon-edit"
                @click.prevent.stop="iconEdit(scope.row)"
              ></i>
              <i
                v-if="scope.row.code.length !=9"
                style="display:inline-block;margin: 0 15px;"
                class="el-icon-circle-plus-outline"
                @click.prevent.stop="iconAdd(scope.row)"
              ></i>
              <i
                style="display:inline-block"
                class="el-icon-delete"
                @click.prevent.stop="iconDelete(scope.row)"
              ></i>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 右侧卡片 -->
      <el-card class="cardRight">
        <div class="searchBox">
          <!-- <el-input
            placeholder="请输入手机号/姓名"
            prefix-icon="el-icon-search"
            size="small"
            v-model="input"
            class="searchInput"
            @input="searchin"
          ></el-input>-->
          <span
            style="line-height: 50px;width: 45%;font-weight: 700;padding-left: 5px;box-sizing: border-box;"
          >{{currentTeamInfo.name}}</span>
          <div style="line-height: 50px;float: right;">
            <el-button
              type="primary"
              size="small"
              @click.prevent.stop="addCheckPackages"
              v-if="isTeamParent"
            >新增检测</el-button>
          </div>

          <!-- <el-button
            type="primary"
            size="small"
            @click.prevent.stop="newAddPerson"
            style="margin-left:2%"
          >Excel导入</el-button>-->
        </div>
        <div class="teamDetail">
          <li>
            <span class="title">{{teamTypeTitle}}：{{currentTeamInfo.name}}</span>
            <span class="title">{{teamTypeAccount}}：{{currentTeamInfo.account}}</span>
            <span class="title">联系人：{{currentTeamInfo.leader}}</span>
            <span class="title">联系电话：{{currentTeamInfo.phone}}</span>
          </li>
          <li>
            <span
              class="title"
              :style="{display:this.currentTeamInfo.pcd == null?'none':'block'}"
            >地址：{{currentTeamInfo.pcd}}</span>
            <span class="title">检测次数：{{total}}</span>
          </li>
        </div>
        <!-- 调用公用表格组件 -->
        <el-table
          :data="teamTypeList"
          style="margin-top:1%;"
          :header-cell-style="{ background:'#5BAEFF',height:'50px',color:'#fff'}"
        >
          <el-table-column align="center" prop="teamNo" label="检测编号" show-overflow-tooltip />
          <el-table-column v-if="isTeamParent" align="center" prop="teamNumber" label="限定人数" />
          <el-table-column align="center" prop="recordNumber" label="已录人数" />

          <el-table-column align="center" prop="checkNumber" label="检测人数" />
          <el-table-column align="center" prop="packageName" label="套餐" />
          <el-table-column align="center" label="状态" prop="state">
            <template slot-scope="scope">
              <div v-if="scope.row.state==0">未开始</div>
              <div v-else-if="scope.row.state==1">已开始</div>
              <div v-else>已结束</div>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column align="center" fixed="right" label="操作" width="249" v-if="isTeamParent">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click.prevent.stop="checkPatient(scope.row)">人员</el-button>
              <el-button
                type="primary"
                size="mini"
                @click.prevent.stop="teamPackages(scope.row)"
              >检测套餐</el-button>
              <el-button
                v-if="scope.row.state !=0"
                type="primary"
                size="mini"
                @click.prevent.stop="teamReport(scope.row)"
              >团队报告</el-button>
              <el-button
                v-if="scope.row.state ==0"
                type="danger"
                size="mini"
                @click.prevent.stop="updateCheck(scope.row)"
              >修改</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" fixed="right" label="操作" width="150" v-else>
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click.prevent.stop="checkPatient(scope.row)">人员</el-button>
              <el-button
                v-if="scope.row.state !=0"
                type="primary"
                size="mini"
                @click.prevent.stop="teamReport(scope.row)"
              >团队报告</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChangev"
          :current-page="pageNum"
          :page-sizes="[10, 20,50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-card>
    </div>
    <!-- 新增修改团队弹框-->
    <el-dialog :title="addTeamTile" :visible.sync="dialogVisible" v-dialogDrag>
      <el-form
        :model="teamFram"
        label-width="80px"
        @closed="editDialogClosed"
        ref="addTeamFormRef"
        :rules="addTeamFormRules"
      >
        <el-form-item prop="name" :label="teamTypeTitle">
          <el-input v-model="teamFram.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item prop="account" :label="teamTypeAccount">
          <el-input v-model="teamFram.account" placeholder="请输入账号"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="password" :label="teamTypePassword">
          <el-input v-model="teamFram.password" placeholder="请输入密码"></el-input>
        </el-form-item>-->

        <el-form-item prop="leader" label="联系人">
          <el-input v-model="teamFram.leader" placeholder="请输入联系人"></el-input>
        </el-form-item>

        <el-form-item prop="phone" label="联系电话">
          <el-input v-model="teamFram.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item prop="city" label="团队地址" v-if="addressShow">
          <el-cascader
            v-model="teamFram.city"
            :props="cityprops"
            :label="name"
            :value="name"
            :options="cityList"
          ></el-cascader>
        </el-form-item>

        <el-form-item prop="address" label="详细地址" v-if="addressShow">
          <el-input v-model="teamFram.address" placeholder="请输入地址"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="dialogVisibleEnter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import EleTable from "../CommonModule/table";
export default {
  components: { EleTable },
  data() {
    var checkMobile = (rule, value, cb) => {
      const regMoblie = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMoblie.test(value)) {
        return cb();
      }
      return cb(new Error("请输入合法的手机号"));
    };
    return {
      isTeamParent: true,
      currentTeamInfo: {}, //当前点击的团队/部门/小组数据
      name: "www",
      currentTeamCode: "",
      currentTeamTypeCode: "",
      cityprops: {
        children: "child",
        label: "name",
        value: "name",
        checkStrictly: true
      },
      cityList: [],
      options: [],
      teamTypeList: [],
      addressShow: true,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      requestCode: 100,
      menuList: [],
      teamFram: {
        name: "",
        account: "",
        // password:'',
        leader: "",
        phone: "",
        pcd: "",
        city: [],
        address: "",
        parentCode: ""
      },
      addTeamTile: "新增团队",
      teamTypeTitle: "团队名称",
      teamTypeAccount: "团队账号",
      teamTypePassword: "团队密码",
      editId: "",
      dialogVisible: false,
      addTeamDialogType: 1,
      addTeamFormRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        // password:[
        //       { required: true, message: '请输入密码', trigger: 'blur' },
        //   ],
        leader: [
          { required: true, message: "请输入名联系人", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入联系人电话", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    // this.getCardList();
    this.getTeamDeptList();
    this.getCity();
  },
  methods: {
    // 获取检测列表
    async getTeamCheckTypeList() {
      const { data: res } = await this.$http.post("teamList/list", {
        teamDept: this.currentTeamTypeCode
      });
      this.teamTypeList = res.rows;
      this.total = res.total;
    },
    async getCity() {
      //获取省市区地址
      const { data: res } = await this.$http.get(
        this.$ajax + "dict/getRegionTree",
        {}
      );
      console.log(res);
      this.cityList = res.data;
      console.log(this.cityList);
      // this.menuList = res.data;
    },
    async getTeamDeptList() {
      // 获取左侧列表
      const { data: res } = await this.$http.post("teamList/dept ", {});

      this.menuList = res.data;
      if (this.menuList != null && this.menuList.length > 0) {
        this.currentTeamInfo = this.menuList[0];
        this.currentTeamCode = this.currentTeamInfo.code;
        this.currentTeamTypeCode = this.currentTeamCode;
        console.log(this.currentTeamInfo);
        this.getTeamCheckTypeList();
      }
    },
    // 左侧修改
    iconEdit(val) {
      this.addTeamDialogType = 2;
      this.addTeamTile = "团体部门";
      this.teamTypeTitle = "团体名称";
      this.teamTypeAccount = "团体账号";
      this.teamTypePassword = "团体密码";
      if (val.code.length == 3) {
        this.addTeamTile = "修改团体";
        this.teamTypeTitle = "团体名称";
        this.teamTypeAccount = "团体账号";
        this.teamTypePassword = "团体密码";
        this.addressShow = true;
      } else if (val.code.length == 6) {
        this.addTeamTile = "修改部门";
        this.teamTypeTitle = "部门名称";
        this.teamTypeAccount = "部门账号";
        this.teamTypePassword = "部门密码";
        this.addressShow = false;
      } else if (val.code.length == 9) {
        this.addTeamTile = "修改小组";
        this.teamTypeTitle = "小组名称";
        this.teamTypeAccount = "小组账号";
        this.teamTypePassword = "部门密码";
        this.addressShow = false;
      }
      this.dialogVisible = true;
      this.editId = val.id;
      this.teamFram = JSON.parse(JSON.stringify(val));
      if (this.teamFram.pcd != null && this.teamFram.pcd != "") {
        this.teamFram.city = this.teamFram.pcd.split("-");
      }
      console.log(this.teamFram);
      this.infoTitle = "修改";
    },
    // 左侧新增
    iconAdd(val) {
      this.addTeamTile = "团体部门";
      this.teamTypeTitle = "团体名称";
      this.teamTypeAccount = "团体账号";
      this.addressShow = true;
      console.log(val);
      if (val.code.length == 3) {
        this.addTeamTile = "新增部门";
        this.teamTypeTitle = "部门名称";
        this.teamTypeAccount = "部门账号";
        this.addressShow = false;
      } else if (val.code.length == 6) {
        this.addTeamTile = "新增小组";
        this.teamTypeTitle = "小组名称";
        this.teamTypeAccount = "小组账号";
        this.addressShow = false;
      }
      this.addTeamDialogType = 1;
      this.teamFram = {};
      this.teamFram.parentCode = val.code;
      this.dialogVisible = true;
    },
    // 左侧删除
    async iconDelete(val) {
      const confirmResult = await this.$confirm(
        "你确定要执行此操作, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => console.log(err));
      if (confirmResult != "confirm") {
        return this.$message.info("取消删除");
      }
      const { data: res } = await this.$http.post("teamList/dept/del", {
        id: val.id
      });
      if (res.code != 200) return this.$message.error(res.data);
      this.$message.success("删除成功");
      this.getTeamDeptList();
    },
    // 左侧增改弹框
    dialogVisibleEnter() {
      let httpUrl = "";
      let parm = {};
      console.log(this.teamFram);
      this.$refs.addTeamFormRef.validate(async valid => {
        if (valid) {
          if (this.addTeamDialogType == 2) {
            httpUrl = "teamList/dept/update";
            if (this.addressShow) {
              parm = {
                id: this.editId,
                account: this.teamFram.account,
                name: this.teamFram.name,
                leader: this.teamFram.leader,
                phone: this.teamFram.phone,
                address: this.teamFram.address,
                pcd: this.teamFram.city.join("-")
              };
            } else {
              parm = {
                id: this.editId,
                account: this.teamFram.account,
                name: this.teamFram.name,
                leader: this.teamFram.leader,
                phone: this.teamFram.phone
              };
            }
          } else {
            httpUrl = "teamList/dept/add";
            if (this.addressShow) {
              parm = {
                account: this.teamFram.account,
                name: this.teamFram.name,
                leader: this.teamFram.leader,
                phone: this.teamFram.phone,
                address: this.teamFram.address,
                pcd: this.teamFram.city.join("-"),
                parentCode: this.teamFram.parentCode
              };
            } else {
              parm = {
                account: this.teamFram.account,
                name: this.teamFram.name,
                leader: this.teamFram.leader,
                phone: this.teamFram.phone,
                parentCode: this.teamFram.parentCode
              };
            }
          }
          const { data: res } = await this.$http.post(httpUrl, parm);
          if (res.code != 200) return this.$message.error("操作失败");
          this.$message.success("操作成功");
          this.getTeamDeptList();
          this.dialogVisible = false;
        }
      });
    },
    editDialogClosed() {
      this.dialogVisible = false;
    },
    cellClick(val, column, cell, event) {},
    handdle(val, column, event) {
      if (val.code.length == 3) {
        //团队
        this.teamTypeTitle = "团队名称";
        this.teamTypeAccount = "团队账号";
        this.teamTypePassword = "团体密码";
      } else if (val.code.length == 6) {
        //部门
        this.teamTypeTitle = "部门名称";
        this.teamTypeAccount = "部门账号";
        this.teamTypePassword = "部门密码";
      } else if (val.code.length == 9) {
        //小组
        this.teamTypeTitle = "小组名称";
        this.teamTypeAccount = "小组账号";
        this.teamTypePassword = "部门密码";
      }
      this.currentTeamInfo = val;
      this.requestCode = val.code;
      this.currentTeamTypeCode = val.code;
      this.getTeamCheckTypeList();
      if (val.code.length == 3) {
        this.isTeamParent = true;
        this.currentTeamCode = val.code;
      } else {
        this.isTeamParent = false;
      }
      // this.getCardList();
    },
    addInside(info) {
      if (info.label == "团队列表") {
        return;
      } else {
        this.teamFram = {};
        this.dialogVisible = true;
        this.addTeamDialogType = 1;
        this.addTeamTile = "团体部门";
        this.teamTypeTitle = "团体名称";
        this.teamTypeAccount = "团体账号";
        this.teamTypePassword = "团体密码";
        this.addressShow = true;
        this.teamFram.parentCode = "0";
      }
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getTeamCheckTypeList();
    },
    //新增团队检测
    addCheckPackages() {
      this.$router.push({
        path: "/home/teamCenter/addTeamCheck",
        query: { teamCode: this.currentTeamCode }
      });
    },
    checkPatient(row) {
      //查看检测人员
      console.log(row);
    },
    teamPackages(row) {
      //查看检测套餐
      this.$router.push({
        path: "/home/teamCenter/teamCheckPackagesDetail",
        query: { teamCode: this.currentTeamCode, teamCheckNum: row.teamNo }
      });
    },
    teamReport() {
      //查看检测报告
    },
    updateCheck() {
      //修改检测套餐
    }
  },
  watch: {
    menuList: function() {
      this.$nextTick(function() {
        this.$refs.singleTable.setCurrentRow(this.menuList[0]);
      });
    }
  }
};
</script>
<style>
.connectTeam {
  height: 100%;
}
.connectTeam .CardBox {
  width: 100%;
  height: 85%;
  overflow: hidden;
}
.connectTeam .cardLeft {
  float: left;
  width: 32%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  height: 100%;
}
.connectTeam .searchBox {
  height: 50px;
  border-bottom: #cec7c7 solid 1px;
}
.connectTeam .searchInput {
  width: 45%;
  max-width: 300px;
}
.connectTeam .cardRight {
  float: right;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  width: 67%;
  height: 100%;
}
.connectTeam .ccc {
  padding-left: 15px !important;
}
.connectTeam .zzz {
  cursor: pointer;
  font-size: 30px !important;
}
.teamDetail li {
  display: flex;
  font-size: 16px;
  color: #c1c2c9;
  padding: 2% 0 0 5%;
  box-sizing: border-box;
}
.teamDetail li .title {
  flex: 1;
}
</style>