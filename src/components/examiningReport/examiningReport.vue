<template>
  <div class="connect">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>检测报告</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card_box">
      <el-card class="cardLeft">
        <div class="searchBox">
          <el-button  
          :plain="peopleButtonType"
          type="primary"
          size="mini"
          @click="peopleReport()">个人报告</el-button>
          <el-button  
          :plain="teamButtonType"
          type="primary"
          size="mini"
          style="margin-left: 20px;"
          @click="teamReport()">团队报告</el-button>
          <el-input
            size="small"
            class="searchInput"
            placeholder="请输入手机号/姓名"
            prefix-icon="el-icon-search"
            v-model="input"
            @input="serchIn"
          ></el-input>
        </div>
        <!-- 调用公用表格组件 -->
        <ElTable :data="reoprtList" :header="tableHeaderBig" style="margin-top:1%;">
          <el-table-column align="center" slot="fixed" fixed="right" label="录入时间" prop="createTime">
            <template slot-scope="scope">
              <div>{{timesChangeDate(scope.row.createTime)}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" slot="fixed" fixed="right" label="审核状态" prop="checkState">
            <template slot-scope="scope">
              <span v-if="scope.row.checkState== 0" style="color:#F56C6C">未审核</span>
              <span v-else-if="scope.row.checkState== 1" style="color:#67C23A">已审核</span>
              <span v-else style="color:#E6A23C">已打印</span>
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
import { timesChangeDate } from "../../assets/js/util";
import ElTable from "../CommonModule/table";
export default {
  components: { ElTable },
  data() {
    return {
      timesChangeDate,
      peopleButtonType:false,
      teamButtonType:true,
      reportType:0,//0个人报告 1：团队报告
      tableHeaderBig: [
        { prop: "orderNo", label: "检测卡号" },
        { prop: "name", label: "姓名" },
        { prop: "phone", label: "手机号" }
      ],
      reoprtList: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      input: ""
    };
  },
  created() {
    this.getReportList();
  },
  methods: {
    // 获取个人报告单列表
    async getReportList() {
      const { data: res } = await this.$http.post("checkList/list", {
        state: "3",
        source:this.reportType,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        name: this.input
      });
      this.reoprtList = res.rows;
      this.total = res.total;
      console.log(res);
    },
    JumpUserCenter(info) {
      this.$router.push({
        path: "/home/examiningReport/examiningDetail",
        query: { orderNo: info.orderNo }
      });
    },
    // 搜索
    serchIn() {
      this.getReportList();
    },
    // 检测卡类型状态码数字转中文
    ifendcaseJck(val) {
      if (val.checkState == "0") {
        return "未审核";
      } else if (val.checkState == "1") {
        return "已审核";
      } else if (val.checkState == "2") {
        return "已打印";
      }
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getReportList();
    },
    peopleReport(){
      this.reportType = 0;
      this.getReportList();
      this.peopleButtonType=false;
      this.teamButtonType=true;
    },
    teamReport(){
      this.reportType = 1;
      this.getReportList();
      this.peopleButtonType=true;
      this.teamButtonType=false;
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
  margin-left: 20px;
  width: 25%;
  max-width: 300px;
}
.cardLeft {
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
</style>