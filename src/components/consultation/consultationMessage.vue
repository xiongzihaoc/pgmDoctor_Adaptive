<template>
  <div style="height:100%">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>消息提示</el-breadcrumb-item>
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
            <span class="dataStat">会诊消息</span>
          </div>

          <div style="padding-left:20px;box-sizing:border-box;margin-left:3px">
            {{item.mesContent}}
            <router-link
              :to="{ name: 'consultationList',query:{mesType:item.params.mesType,id:item.params.patientUuid}}"
            >点击查看详情</router-link>
          </div>
        </li>
      </ul>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      Inside: false,
      Outside: true,
      type: "consult-in",
      userList: []
    };
  },
  created() {
    this.getMessConList();
  },
  methods: {
    async getMessConList() {
      const { data: res } = await this.$http.post("consult/message", {
        type: this.type
      });
      if (res.code != 200) return this.$message.error("获取会诊消息失败");
      this.userList = res.data;
      this.userList.forEach(item => {
        item.params = JSON.parse(item.params);
      });
    },
    // 院内
    consulationInBtn() {
      this.type = "consult-in";
      this.getMessConList();
      this.Inside = false;
      this.Outside = true;
    },
    // 院外
    consulationOutBtn() {
      this.type = "consult-out";
      this.getMessConList();
      this.Inside = true;
      this.Outside = false;
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