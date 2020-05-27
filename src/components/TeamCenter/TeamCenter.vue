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
          <el-input
            placeholder="请输入手机号/姓名"
            prefix-icon="el-icon-search"
            size="small"
            v-model="input"
            class="searchInput"
            @input="searchin"
          ></el-input>
          <el-button
            type="primary"
            size="small"
            @click.prevent.stop="addCheckPackages"
            style="margin-left:60%;"
          >新增检测</el-button>
        </div>
        <!-- 调用公用表格组件 -->
        <EleTable
          :data="teamTypeList"
          :header="tableHeaderBig"
          style="margin-top:1%;"
          show-header="false"
        >
          <!-- 操作 -->
          <el-table-column align="center" slot="fixed" fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click.prevent.stop="showEditdialog(scope.row)"
              >查看</el-button>
            </template>
          </el-table-column>
        </EleTable>
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
      <el-form ref="loginFormRef" :model="teamFram" label-width="80px" @closed="editDialogClosed">
        <el-form-item prop="name" :label="teamTypeTitle">
          <el-input v-model="teamFram.name"></el-input>
        </el-form-item>
        <el-form-item prop="account" :label="teamTypeAccount">
          <el-input v-model="teamFram.account"></el-input>
        </el-form-item>

        <el-form-item prop="contact" label="联系人">
          <el-input v-model="teamFram.leader"></el-input>
        </el-form-item>

        <el-form-item prop="mobile" label="联系电话">
          <el-input v-model="teamFram.phone"></el-input>
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
          <el-input v-model="teamFram.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible==false">取 消</el-button>
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
    return {
      name: "www",
      currentTeamCode: "",
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
      tableHeaderBig: [
        { prop: "teamNo", label: "检测编号" },
        { prop: "teamNumber", label: "限定人数" },
        { prop: "recordNumber", label: "已录人数" },
        { prop: "checkNumber", label: "已检测人数" },
        { prop: "packageName", label: "套餐名称" }
      ],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      input: "",
      requestCode: 100,
      menuList: [],
      teamFram: {
        name: "",
        account: "",
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
      editId: "",
      goback: "",
      dialogVisible: false,
      addTeamDialogType: 1
    };
  },
  created() {
    // this.getCardList();
    this.getTeamDeptList();
    this.getCity();
  },
  methods: {
    // 获取检测列表
    async getTeamCheckTypeList(teamDeptCode) {
      const { data: res } = await this.$http.post("teamList/list", {
        teamDept: teamDeptCode
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
        this.currentTeamCode = this.menuList[0].code;
        this.getTeamCheckTypeList(this.currentTeamCode);
      }
    },
    // 左侧修改
    iconEdit(val) {
      this.addTeamDialogType = 2;
      this.addTeamTile = "团体部门";
      this.teamTypeTitle = "团体名称";
      this.teamTypeAccount = "团体账号";
      if (val.code.length == 3) {
        this.addTeamTile = "修改团体";
        this.addressShow = true;
      } else if (val.code.length == 6) {
        this.addTeamTile = "修改部门";
        this.addressShow = false;
      } else if (val.code.length == 9) {
        this.addTeamTile = "修改小组";
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
    async dialogVisibleEnter() {
      console.log(this.teamFram);
      let httpUrl = "";
      let parm = {};
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
    },
    editDialogClosed() {
      this.dialogVisible = false;
    },
    handdle(val) {
      this.requestCode = val.code;
      this.getTeamCheckTypeList(val.code);
      if (val.code.length == 3) {
        this.currentTeamCode = val.code;
      }
      this.getCardList();
    },
    addInside(info) {
      if (info.label == "名称") {
        return;
      } else {
        this.teamFram = {};
        this.dialogVisible = true;
        this.addTeamDialogType = 1;
        this.addTeamTile = "团体部门";
        this.teamTypeTitle = "团体名称";
        this.teamTypeAccount = "团体账号";
        this.addressShow = true;
        this.goback = "最上级";
        this.teamFram.parentCode = "0";
      }
    },
    // 搜索
    searchin() {},
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getCardList();
    },
    //新增团队检测
    addCheckPackages() {
      this.$router.push({
        path: "/home/teamCenter/addTeamCheck",
        query: { teamCode: this.currentTeamCode }
      });
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
  display: -webkit-flex;
  display: flex;
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
</style>