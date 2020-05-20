<template>
  <div class="connect">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>预警</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card_box">
      <el-card>
        <div class="searchBox">
          <el-input
            size="medium"
            class="searchInput"
            placeholder="请输入手机号/姓名"
            prefix-icon="el-icon-search"
            v-model="input"
            @input="serchIn"
          ></el-input>
        </div>
        <!-- 调用公用表格组件 -->
        <ElTable :data="userList" :header="tableHeaderBig" style="margin-top:1%;">
          <el-table-column align="center" slot="fixed" fixed="right" label="录入时间" prop="createTime">
            <template slot-scope="scope">
              <div>{{timesChangeDate(scope.row.createTime)}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" slot="fixed" fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click.prevent.stop="JumpUserCenter(scope.row)"
              >查看</el-button>
            </template>
          </el-table-column>
        </ElTable>
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
import ElTable from "../CommonModule/table";
import { timesChangeDate } from "../../assets/js/util";
export default {
  components: { ElTable },
  data() {
    return {
      timesChangeDate,
      tableHeaderBig: [
        { prop: "orderNo", label: "检测卡号" },
        { prop: "name", label: "姓名" },
        { prop: "phone", label: "手机号" }
      ],
      userList: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      input: ""
    };
  },
  created() {
    this.getCardList();
  },
  methods: {
    // 获取检查单列表
    async getCardList() {
      const { data: res } = await this.$http.post("checkList/list", {
        isWarning: "Y",
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        name: this.input
      });
      this.userList = res.rows;
      this.total = res.total;
    },
    JumpUserCenter() {
      this.$router.push("userCenter");
    },
    // 搜索
    serchIn() {
      this.getCardList();
    },
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
<style scoped>
.connect {
  height: 100%;
}
.card_box {
  width: 100%;
  height: 85%;
  overflow: hidden;
}
.searchBox {
  display: -webkit-flex;
  display: flex;
}
.searchInput {
  width: 25%;
  max-width: 300px;
}
</style>