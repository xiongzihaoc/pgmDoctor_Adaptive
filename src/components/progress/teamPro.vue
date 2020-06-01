<template>
  <div class="connect">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>团队进度</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="CardBox">
      <el-card class="cardLeft">
        <div class="searchBox">
          <el-button type="primary" plain size="small" @click.prevent.stop="perPro">个人进度</el-button>
          <el-button type="primary" size="small">团队进度</el-button>
          <el-input
            size="small"
            class="searchInput"
            placeholder="请输入手机号/体检卡号/姓名"
            prefix-icon="el-icon-search"
            v-model="input"
            @input="searchin"
            style="display: none;"
          ></el-input>
          <el-button
            type="primary"
            size="small"
            @click.prevent.stop="newAddPerson"
            style="margin-left:2%;display: none;"
          >新增团队</el-button>
        </div>
        <!-- 调用公用表格组件 -->
        <ElTable :data="teamTypeList" :header="tableHeaderBig" style="margin-top:2%;" height="100">
          <el-table-column
            align="center"
            slot="fixed"
            fixed="right"
            label="状态"
            prop="state"
            :formatter="ifendcaseJck"
          ></el-table-column>
          <el-table-column align="center" slot="fixed" fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click.prevent.stop="JumpTeamCenter(scope.row)"
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
      <!-- 右侧卡片 -->
      <!-- <CardR></CardR> -->
    </div>
  </div>
</template>
<script>
import ElTable from "../CommonModule/table";
import CardR from "./cardR";
import { timesChangeDate } from "../../assets/js/util";
export default {
  components: { ElTable, CardR },
  data() {
    return {
      timesChangeDate,
      tableHeaderBig: [
        { prop: "teamNo", label: "检测编号" },
        { prop: "teamName", label: "团队名称" },
        { prop: "teamNumber", label: "限定人数" },
        { prop: "recordNumber", label: "已录人数" },
        { prop: "checkNumber", label: "检测人数" },
        {prop:"packageName",label:"检测套餐"}
      ],
      teamTypeList: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      input: "",
      screen: "",
      options: [
        { id: 1, label: "总次数", value: "1" },
        { id: 2, label: "个人次数", value: "2" },
        { id: 3, label: "团队次数", value: "3" }
      ]
    };
  },
  created() {
    this.getTeamCheckTypeList();
  },
  methods: {
    // 获取检查单列表
    async getTeamCheckTypeList() {
      const { data: res } = await this.$http.post("teamList/list", {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        params: {'type':'all'}
      });
      console.log(res);
      this.teamTypeList = res.rows;
      this.total = res.total;
    },
    searchin() {
      this.getCardList();
    },
    // 团队新增
    newAddPerson() {
      this.$router.push("/home/userCenter/addNewTeam");
    },
    JumpTeamCenter(info) {
      this.$router.push({path:'/home/teamCenter',query:{teamCode:info.teamDept,type:'index'}});
    },
    perPro() {
      this.$emit("jumpTeam", "jumpPer");
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
      if (val.state == "0") {
        return "未开始";
      } else if (val.state == "1") {
        return "已开始";
      }else{
        return "已结束";
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
.cardRight {
  float: right;
  width: 39%;
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
.title {
  box-sizing: border-box;
  display: -webkit-flex;
  display: flex;
  align-items: center;
}
.el-select {
  width: 26%;
  max-width: 100px;
  margin-left: 16%;
}
.dataStat {
  font-weight: 700;
  padding-left: 5px;
  box-sizing: border-box;
}
.payNum {
  margin-left: 5%;
}
</style>