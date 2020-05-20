<template>
  <div style="height:100%">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>会诊意见</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="height:85%">
      <div class="btnBox">
        <el-button type="primary" plain size="small" @click.prevent.stop="consulationInBtn">院内会诊</el-button>
        <el-button type="primary" plain size="small" @click.prevent.stop="consulationOutBtn">院外会诊</el-button>
      </div>
      <ul>
        <li v-for="(item,index) in userList" :key="index">
          <div class="title">
            <span class="orangeYuan"></span>
            <span class="dataStat">{{item.title}}</span>
          </div>
          <el-card style="width:35%;max-width:300px;" v-for="(subItem,i) in item.record" :key="i">
            <p>会诊医生：{{subItem.conDoctor}}</p>
            <p>会诊时间：{{timesChangeDate(subItem.conTime)}}</p>
            <p>会诊建议：{{subItem.conResult}}</p>
          </el-card>
        </li>
      </ul>
    </el-card>
  </div>
</template>
<script>
import { timesChangeDate } from "../../assets/js/util";
export default {
  data() {
    return {
      timesChangeDate,
      information: {},
      userList: [],
      type: "consult-in"
    };
  },
  created() {
    this.information = window.sessionStorage.getItem("peoDetail");
    this.getHisConList();
  },
  methods: {
    async getHisConList() {
      const { data: res } = await this.$http.post("consult/record/list", {
        type: this.type
      });
      console.log(res);

      if (res.code != 200) return this.$message.error("获取会诊意见失败");
      this.userList = res.data;
    },
    // 院内会诊按钮
    consulationInBtn() {
      this.type = "consult-in";
      this.getHisConList();
    },
    // 院外会诊按钮
    consulationOutBtn() {
      this.type = "consult-out";
      this.getHisConList();
    }
  }
};
</script>
<style scoped>
.btnBox {
  display: flex;
  margin-bottom: 20px;
}
.dataStat {
  margin-left: 10px;
}
</style>