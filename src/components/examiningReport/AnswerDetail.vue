<template>
  <div class="Ans">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home/examiningReport' }">检测报告</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/examiningReport' }">列表</el-breadcrumb-item>
      <el-breadcrumb-item
        :to="{ path: '/home/examiningReport/examiningDetail',query:{orderNo:this.Num} }"
      >报告详情</el-breadcrumb-item>
      <el-breadcrumb-item>答题详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="height:85%">
      <!-- 调用公用表格组件 -->
      <el-table
        :data="AnsList"
        tooltip-effect="dark"
        :header-cell-style="{background:'#5BAEFF',}"
        style="width: 100%"
      >
        <el-table-column align="left" prop="quesOrder" label="序号" ></el-table-column>
        <el-table-column align="left" prop="quesContent" label="题目" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-html="scope.row.quesContent"></div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="optContent" label="您的答案"></el-table-column>
      </el-table>
      <!-- 分页区域 -->
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
</template>
<script>
export default {
  data() {
    return {
      Uuid: "",
      Num: "",
      AnsList: [],
      pageSize: 10,
      pageNum: 1,
      total: 0
    };
  },
  created() {
    this.Num = this.$route.query.Number;
    this.Uuid = this.$route.query.ansUuid;
    this.getAnsList();
  },
  methods: {
    // 量表答案
    async getAnsList() {
      const { data: res } = await this.$http.post("checkList/getAnswerDetail", {
        ansUuid: this.Uuid,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      });
      if (res.code != 200) return this.$message.error("获取量表答案失败");
      this.AnsList = res.rows;
      this.total = res.total;
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getAnsList();
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getAnsList();
    }
  }
};
</script>
<style lang='less'>
.Ans {
  height: 100%;
}
.Ans .el-table thead {
  color: #fff;
}
</style>