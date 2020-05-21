<template>
  <div style="height:100%">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>消息提示</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="height:85%;padding: 0 30px;box-sizing:border-box;">
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
        <li
          v-for="(item,index) in userList"
          :key="index"
          class="conslolutionMess"
          style="padding: 10px 0;box-sizing:border-box;border-bottom:1px dashed #ccc;"
        >
          <div style="margin-bottom:5px">
            <span class="orangeYuanMess" v-if="item.state == 1" style="background:#ccc;"></span>
            <span class="orangeYuanMess" v-else-if="item.state == 0" style="background:#ff9a00;"></span>
            <span class="dataStat">会诊消息</span>
          </div>

          <div style="padding-left:20px;box-sizing:border-box;margin-left:3px">
            {{item.mesContent}}
            <!-- 鼠标小手 -->
            <img class="mouseHand" src="../../assets/images/mouseHand.png" />
            <router-link
              style="vertical-align: middle;;"
              :to="{ name: 'consultationList',query:{mesType:item.params.mesType,id:item.params.patientUuid}}"
            >
              <span @click="viewDetails(item)">查看详情</span>
            </router-link>
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
    // 点击查看详情跳转改变状态
    async viewDetails(item) {
      if (item.state == 0) {
        const { data: res } = await this.$http.post("consult/message/update", {
          id: item.id,
          state: 1
        });
      }
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
  font-weight: 700;
  color: #000;
}
a {
  color: #2f8df0;
  font-weight: normal;
}
.orangeYuanMess {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.conslolutionMess:nth-child(1) {
  border-top: 1px dashed #ccc;
}
.mouseHand {
  vertical-align: bottom;
  margin: 0 5px;
  box-sizing: border-box;
  transform: rotate(90deg);
}
</style>