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
      <!-- <div>
        <ve-ring
          :data="chartData"
          :settings="chartSettings"
          :legend-visible="false"
          :title="{text: '检测卡次数统计', left: 'center', top: 'top'}"
        ></ve-ring>
      </div>
      <div style="display:flex">
        <div style="flex:1">
          <ve-ring
            :data="chartData"
            :settings="chartSettings"
            :legend-visible="false"
            :title="{text: '检测卡次数统计', left: 'center', top: 'top'}"
          ></ve-ring>
        </div>
        <div style="flex:1">
          <ve-ring
            :data="chartData"
            :settings="chartSettings"
            :legend-visible="false"
            :title="{text: '检测卡次数统计', left: 'center', top: 'top'}"
          ></ve-ring>
        </div>
      </div> -->
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    // this.chartSettings = {
    //   radius: [30, 80],
    //   offsetY: 120
    // };
    return {
      // chartData: {
      //   columns: ["已使用次数", "未使用次数", "总次数"],
      //   rows: [
      //     { 已使用次数: 100, 未使用次数: 200, 总次数: 300 },
      //     { 已用次数: 200, 未使用次数: 100, 总次数: 400 },
      //     { 已使用次数: 150, 未使用次数: 150, 总次数: 500 }
      //   ]
      // },
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