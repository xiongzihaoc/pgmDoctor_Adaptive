
<template>
  <div class="connect">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>用户中心</el-breadcrumb-item>
      <el-breadcrumb-item style="font-weight:700;">个人列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card_box">
      <el-card>
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
          >新增个人</el-button>
        </div>
        <!-- 调用公用表格组件 -->
        <EleTable :data="userList" :header="tableHeaderBig" style="margin-top:1%;">
          <!-- 出生日期 -->
          <el-table-column align="center" slot="fixed" fixed="right" label="出生日期" prop="birthday">
            <template slot-scope="scope">
              <div>{{timesChangeDate(scope.row.birthday)}}</div>
            </template>
          </el-table-column>
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
import { timesChangeDate } from "../../assets/js/util";
export default {
  components: { EleTable },
  data() {
    return {
      timesChangeDate,
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
      input: ""
    };
  },
  created() {
    this.getCardList();
  },
  methods: {
    // 获取列表
    async getCardList() {
      const { data: res } = await this.$http.post("doc/getPatients", {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        name: this.input
      });
      console.log(res);

      this.userList = res.rows;
      this.total = res.total;
    },
    // 查看跳转
    showEditdialog(info) {
      console.log(info);
      this.$router.push({
        path: "/home/userCenter/userDetails",
        query: { id: info.uuid, phone: info.phone }
      });
    },
    editDialogClosed() {},
    // 搜索
    searchin() {
      this.getCardList();
    },
    // 跳转团队列表
    jumpTeam() {
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
    // 检测卡类型状态码数字转中文
    ifendcaseJck(val) {
      if (val.state == "1") {
        return "正在作答";
      } else if (val.state == "2") {
        return "作答完成";
      } else if (val.state == "0") {
        return "未作答";
      }
    },
    newAddPerson(){
      this.$router.push("/home/userCenter/addNewPer");
    }
  }
};
</script>
<style  scoped>
.connect {
  height: 100%;
}
.card_box {
  width: 100%;
  height: 85%;
  overflow: hidden;
}
.el-card {
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
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

