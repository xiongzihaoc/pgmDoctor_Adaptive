<template>
  <div style="height:100%">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>会诊意见</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="height:85%;padding-left:30px;box-sizing:border-box;">
      <div class="btnBox">
        <el-button
          :plain="Inside"
          type="primary"
          size="small"
          @click.prevent.stop="consulationInBtn"
        >院内会诊</el-button>
        <el-button
          type="primary"
          :plain="Outside"
          size="small"
          @click.prevent.stop="consulationOutBtn"
        >院外会诊</el-button>
      </div>
      <ul>
        <li v-for="(item,index) in userList" :key="index" style="margin-bottom:20px">
          <div style="margin-bottom:10px">
            <span class="orangeYuan"></span>
            <span class="dataStat">{{item.title}}</span>
          </div>
          <div
            style="border-left:4px solid orange;padding-left:20px;box-sizing:border-box;margin-left:3px"
          >
            <el-card
              style="width:55%;max-width:600px;margin-bottom:10px"
              v-for="(subItem,i) in item.record"
              :key="i"
            >
              <p style="margin-bottom:10px">会诊医生：{{subItem.conDoctor}}</p>
              <p style="margin-bottom:10px">会诊时间：{{timesChangeDate(subItem.conTime)}}</p>
              <p style="margin-bottom:10px">会诊建议：{{subItem.conResult}}</p>
            </el-card>
          </div>
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
      Inside: false,
      Outside: true,
      type: "consult-in",
      uuid: ""
    };
  },
  created() {
    this.type = this.$route.query.mesType;
    this.uuid = this.$route.query.id;
    if (this.type == "consult-out") {
      this.Inside = true;
      this.Outside = false;
    } else if (this.type == "consult-in") {
      this.Inside = false;
      this.Outside = true;
    }
    console.log(this.uuid);
    
    this.getHisConList();
  },
  methods: {
    async getHisConList() {
      const { data: res } = await this.$http.post("consult/record/list", {
        type: this.type,
        patient_uuid: this.uuid
      });
      console.log(res);
      
      if (res.code != 200) return this.$message.error("获取会诊意见失败");
      this.userList = res.data;
    },
    // 院内会诊按钮
    consulationInBtn() {
      this.type = "consult-in";
      this.Inside = false;
      this.Outside = true;
      this.getHisConList();
    },
    // 院外会诊按钮
    consulationOutBtn() {
      this.type = "consult-out";
      this.Inside = true;
      this.Outside = false;
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