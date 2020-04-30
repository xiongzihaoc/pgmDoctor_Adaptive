<template>
  <div class="connect">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="CardBox">
      <el-card class="cardLeft">
        <div class="searchBox">
          <el-button type="primary" plain size="small" style="margin-left:3%">个人进度</el-button>
          <el-button type="primary" plain size="small">团队进度</el-button>
          <el-input
            size="small"
            class="searchInput"
            placeholder="请输入手机号/体检卡号/姓名"
            prefix-icon="el-icon-search"
            v-model="input"
            @input="searchin"
          ></el-input>
        </div>
        <!-- 调用公用表格组件 -->
        <ElTable :data="userList" :header="tableHeaderBig" style="margin-top:2%;" height="100">
          <el-table-column align="center" slot="fixed" fixed="right" label="录入时间" prop="createTime">
            <template slot-scope="scope">
              <div>{{timesChangeDate(scope.row.createTime)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            slot="fixed"
            fixed="right"
            label="测试情况"
            prop="state"
            :formatter="ifendcaseJck"
          ></el-table-column>
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
      <el-card class="cardRight">222</el-card>
    </div>
  </div>
</template>
<script>
import ElTable from "./CommonModule/table.vue";
export default {
  components: { ElTable },
  data() {
    return {
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
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        name: this.input
      });
      this.userList = res.rows;
      this.total = res.total;
    },
    searchin() {
      this.getCardList();
    },
    JumpUserCenter() {
      this.$router.push("userCenter");
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getCardList();
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
    },
    // 检测卡类型状态码数字转中文
    ifendcaseJck(val) {
      if (val.state == "1") {
        return "已检测";
      } else if (val.state == "2") {
        return "未检测";
      }
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
  height: 86%;
  margin-top: 2%;
  overflow: hidden;
}
.cardLeft {
  float: left;
  width: 60%;
  overflow: auto;
  height: 100%;
}
.cardRight {
  float: right;
  width: 39%;
  height: 100%;
}
.searchBox {
  display: flex;
}
.searchInput {
  width: 35%;
  margin-left: 4%;
}

</style>