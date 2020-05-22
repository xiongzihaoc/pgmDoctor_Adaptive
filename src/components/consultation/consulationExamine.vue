<template>
  <div class="connectCenL">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home/consultation' }">会诊操作</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/consultation' }">院内会诊</el-breadcrumb-item>
      <el-breadcrumb-item>会诊内容</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="topCard">
      <div>
        <span class="orangeYuan"></span>
        <span class="perInfo">个人详情</span>
      </div>
      <li>
        <span class="titleCen">姓名：{{infomation.name}}</span>
        <span class="titleCen">手机：{{infomation.phone}}</span>
        <span class="titleCen">生日：{{infomation.birthday}}</span>
        <span class="titleCen">性别：{{infomation.gender}}</span>
      </li>
      <li>
        <span class="titleCen">文化程度：{{infomation.culture}}</span>
        <span class="titleCen">婚姻：{{infomation.marriage}}</span>
        <span class="titleCen">职业：{{infomation.job}}</span>
        <span class="titleCen" style="visibility: hidden;"></span>
      </li>
    </el-card>

    <el-card class="cardBox">
      <!-- 调用公用表格组件 -->
      <ElTable :data="sysMess" :header="tableHeaderBig" style="margin-top:1%;"></ElTable>
    </el-card>
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
          { prop: "conDoctor", label: "会诊医生" },
          { prop: "content", label: "会诊内容" },
          ],
      userList: [],
      infomation: {},
      docList: [],
      consultationForm: {
        type: "",
        conDoctor: [],
        content: ""
      },
      infoForm: {
        uuid: "",
        phone: ""
      },
      phoneKey: "",
      sysMess: [],
      dialogVisible: false
    };
  },
  created() {
    this.sysMess.push(JSON.parse(window.sessionStorage.getItem("ConMess")));
    this.infoForm.uuid = this.$route.query.id;
    this.infoForm.phone = this.$route.query.phone;
    this.getpatientInfo();
    this.getCardList();
  },
  methods: {
    // 获取患者个人信息
    async getpatientInfo() {
      const { data: res } = await this.$http.post("/doc/getPatientInfo", {
        uuid: this.infoForm.uuid
      });
      if (res.code !== 200) return this.$message.error("获取患者个人信息失败");
      this.infomation = res.data;
      this.phoneKey = res.data.phone;
    },
    // 获取患者检查单列表
    async getCardList() {
      const { data: res } = await this.$http.post("checkList/list", {
        phone: this.phoneKey
      });
      console.log(res);

      this.userList = res.rows;
      this.total = res.total;
    },
    JumpUserCenter(info) {
      this.$router.push({
        path: "/home/examiningReport/examiningDetail",
        query: { orderNo: info.orderNo }
      });
    }
  }
};
</script>
<style scoped>
.connectCenL {
  height: 100%;
}
.connectCenL .searchBox {
  display: -webkit-flex;
  display: flex;
}
.connectCenL .searchInput {
  width: 25%;
  max-width: 300px;
}
.connectCenL .cardBox {
  height: 65%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.connectCenL .topCard {
  height: 19%;
  margin-bottom: 1%;
}
.connectCenL .topCard li {
  display: flex;
  font-size: 16px;
  color: #c1c2c9;
  padding: 2% 0 0 5%;
  box-sizing: border-box;
}
.connectCenL .topCard li .titleCen {
  flex: 1;
}
.topCard .orangeYuan {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ff9a00;
}
.topCard .perInfo {
  font-weight: 700;
  padding-left: 5px;
  box-sizing: border-box;
}
</style>