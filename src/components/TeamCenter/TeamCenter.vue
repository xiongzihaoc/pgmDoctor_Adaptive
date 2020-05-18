<template>
  <div class="connect">
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
          row-key="code"
          ref="singleTable"
          @row-contextmenu="handdle"
          style="width: 100%;margin-bottom: 20px;"
        >
          <el-table-column align="left" prop="name" label="名称" label-class-name="ccc"></el-table-column>
        </el-table>
      </el-card>
      <!-- 右侧卡片 -->
      <el-card class="cardRight">
        <div class="searchBox">
          <el-input
            placeholder="请输入手机号/姓名"
            prefix-icon="el-icon-search"
            size="medium"
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
        </div>
        <!-- 调用公用表格组件 -->
        <EleTable :data="userList" :header="tableHeaderBig" style="margin-top:1%;">
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

      menuList: []
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
        name: this.input
      });
      //   console.log(res);

      this.userList = res.rows;
      this.total = res.total;
    },
    // 获取左侧列表
    async getTeamDeptList() {
      const { data: res } = await this.$http.post("teamList/dept ", {});
      console.log(res);
      this.menuList = res.data;
    },
    handdle(val) {
      console.log(val);
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
<style scoped>
.connect {
  height: 100%;
}
.CardBox {
  width: 100%;
  height: 85%;
  overflow: hidden;
}
.cardLeft {
  float: left;
  width: 29%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  height: 100%;
}
.searchBox {
  display: -webkit-flex;
  display: flex;
}
.searchInput {
  width: 45%;
  max-width: 300px;
}
.cardRight {
  float: right;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  width: 70%;
  height: 100%;
}

</style>