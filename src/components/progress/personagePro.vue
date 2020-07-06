<template>
  <div class="connect">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人进度</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="CardBox">
      <el-card class="cardLeft">
        <div class="searchBox">
          <el-button type="primary" size="small">个人进度</el-button>
          <el-button
            type="primary"
            plain
            size="small"
            @click.prevent.stop="TeamPro"
            >团队进度</el-button
          >
          <el-input
            size="small"
            class="searchInput"
            placeholder="请输入手机号/检测卡号/姓名"
            prefix-icon="el-icon-search"
            v-model="input"
            @input="searchin"
          ></el-input>
          <el-button
            type="primary"
            size="small"
            @click.prevent.stop="newAddPerson"
            style="margin-left:2%"
            >新增个人</el-button
          >
        </div>
        <!-- 调用公用表格组件 -->
        <ElTable
          :data="userList"
          :header="tableHeaderBig"
          style="margin-top:1%;"
        >
          <el-table-column
            align="center"
            slot="fixed"
            fixed="right"
            label="录入时间"
            prop="createTime"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.createTime }}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            slot="fixed"
            fixed="right"
            label="测试情况"
            prop="state"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.state == 3" style="color:#67C23A"
                >已检测</span
              >
              <span v-else style="color:#F56C6C">未检测</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            slot="fixed"
            fixed="right"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.state != 3"
                type="primary"
                size="mini"
                plain
                @click.prevent.stop="JumpEdit(scope.row)"
                >修改</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click.prevent.stop="JumpUserCenter(scope.row)"
                v-else
                >查看</el-button
              >
            </template>
          </el-table-column>
        </ElTable>
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChangev"
          :current-page="pageNum"
          :page-sizes="[10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-card>
      <!-- 右侧卡片 -->
      <CardR></CardR>
    </div>
  </div>
</template>
<script>
import ElTable from "../CommonModule/table";
import CardR from "./cardR";
export default {
  components: { ElTable, CardR },
  data() {
    return {
      tableHeaderBig: [
        { prop: "orderNo", label: "检测卡号" },
        { prop: "name", label: "姓名" },
        { prop: "phone", label: "手机号" },
      ],
      userList: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      input: "",
      screen: "",
    };
  },
  created() {
    this.getCardList();
  },
  methods: {
    // 获取检查单列表
    async getCardList() {
      const { data: res } = await this.$http.post("checkList/list", {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        params: { search: this.input },
      });
      console.log(res);
      this.userList = res.rows;
      this.total = res.total;
    },
    // 搜索
    searchin() {
      this.getCardList();
    },
    // 新增个人
    newAddPerson() {
      this.$router.push("/home/userCenter/addNewPer");
    },
    JumpUserCenter(info) {
      this.$router.push({
        path: "/home/examiningReport/examiningDetail",
        query: { orderNo: info.orderNo },
      });
    },
    // 跳转修改
    JumpEdit(info) {
      console.log(info);
      window.sessionStorage.setItem("editInfo", JSON.stringify(info));
      this.$router.push({
        path: "/home/userCenter/addNewPer",
        query: { mess: "修改" },
      });
    },
    TeamPro() {
      this.$emit("jumpTeam", "jumpTeam");
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getCardList();
    },
  },
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
  width: 100%;
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
  margin-left: 4%;
}
</style>
