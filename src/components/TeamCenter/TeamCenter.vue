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
          :tree-props="{children: 'child', hasChildren: 'hasChildren'}"
          :header-cell-style="{background:'#f5f5f5'}"
          highlight-current-row
          row-key="code"
          ref="singleTable"
          @row-click="handdle"
          class="teamClass"
          @header-click="addInside($event)"
          style="width: 100%;margin-bottom: 20px;"
        >
          <el-table-column align="left" prop="name" label="名称" label-class-name="ccc"></el-table-column>
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
            @click.prevent.stop="newAddPerson"
            style="margin-left:2%"
          >新增用户</el-button>
          <el-button
            type="primary"
            size="small"
            @click.prevent.stop="newAddPerson"
            style="margin-left:2%"
          >Excel导入</el-button>
        </div>
        <!-- 调用公用表格组件 -->
        <EleTable
          :data="userList"
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
    <!-- 修改密码弹框 -->
    <el-dialog :title="infoTitle" :visible.sync="dialogVisible" v-dialogDrag>
      <el-form
        ref="loginFormRef"
        :model="editAddForm"
        label-width="80px"
        @closed="editDialogClosed"
      >
        <el-form-item label="上一级" v-show="this.infoTitle == '新增'">
          <el-input v-model="goback" disabled></el-input>
        </el-form-item>
        <el-form-item prop="name" label="名称">
          <el-input v-model="editAddForm.name"></el-input>
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
      userList: [],
      tableHeaderBig: [
        { prop: "name", label: "姓名" },
        { prop: "phone", label: "手机号" },
        { prop: "gender", label: "性别" },
        { prop: "job", label: "职业" },
        { prop: "marriage", label: "婚姻" }
      ],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      input: "",
      requestCode: 100,
      menuList: [],
      editAddForm: {
        name: "",
        parentCode: ""
      },
      infoTitle: "",
      editId: "",
      goback: "",
      dialogVisible: false
    };
  },
  created() {
    this.getCardList();
    this.getTeamDeptList();
  },
  methods: {
    // 获取列表
    async getCardList() {
      const { data: res } = await this.$http.post("doc/getPatients", {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        name: this.input,
        teamDept: this.requestCode
      });
      this.userList = res.rows;
      this.total = res.total;
    },
    // 获取左侧列表
    async getTeamDeptList() {
      const { data: res } = await this.$http.post("teamList/dept ", {});
      // console.log(res);
      this.menuList = res.data;
    },
    // 左侧修改
    iconEdit(val) {
      this.dialogVisible = true;
      this.editId = val.id;
      this.editAddForm = JSON.parse(JSON.stringify(val));
      this.infoTitle = "修改";
    },
    // 左侧新增
    iconAdd(val) {
      this.editAddForm = {};
      this.goback = val.name;
      this.editAddForm.parentCode = val.code;
      this.dialogVisible = true;
      this.infoTitle = "新增";
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
      let httpUrl = "";
      let parm = {};
      if (this.infoTitle == "修改") {
        httpUrl = "teamList/dept/update";
        parm = {
          id: this.editId,
          name: this.editAddForm.name
        };
      } else {
        httpUrl = "teamList/dept/add";
        parm = {
          name: this.editAddForm.name,
          parentCode: this.editAddForm.parentCode
        };
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
      this.getCardList();
    },
    zzz(val) {
      console.log(111);
    },
    addInside(info) {
      if (info.label == "名称") {
        return;
      } else {
        this.editAddForm = {};
        this.dialogVisible = true;
        this.infoTitle = "新增";
        this.goback = "最上级";
        this.editAddForm.parentCode = "0";
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