<template>
  <div style="height:100%">
    <el-card class="cardRight">
      <div class="title">
        <span class="orangeYuan"></span>
        <span class="dataStat">数据统计</span>
        <el-select v-model="screen" placeholder="筛选" size="small">
          <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button type="primary" plain size="small" class="payNum">充值次数</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      screen: "",
      options: [
        { id: 1, label: "总次数", value: "1" },
        { id: 2, label: "个人次数", value: "2" },
        { id: 3, label: "团队次数", value: "3" }
      ]
    };
  },
  methods: {}
};
</script>
<style scoped>
.cardRight {
  float: right;
  width: 39%;
  height: 100%;
}
.orangeYuan {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ff9a00;
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