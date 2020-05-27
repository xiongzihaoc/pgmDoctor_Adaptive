<template>
  <div style="height:100%">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home/examiningReport' }">检测报告</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/examiningReport' }">列表</el-breadcrumb-item>
      <el-breadcrumb-item>报告详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card
      v-loading="fullscreenLoading"
      style="height:85%;overflow: auto;-webkit-overflow-scrolling: touch;position: relative;"
    >
      <el-button
        type="danger"
        size="mini"
        v-if="this.infoObj.checkState != 0"
        v-print="'#printDiv'"
        style="position: absolute;top:58px;right:22px"
      >打印</el-button>
      <div style="height:100%" id="printDiv">
        <h4>{{infoObj.name}}的检测报告</h4>
        <div class="personalInformation">
          <div style="display:flex;flex-direction: row;justify-content: space-between;">
            <p class="title">
              <span style="border-bottom:2px solid #000;">基本信息</span>
            </p>
            <el-button
              type="primary"
              size="mini"
              v-if="this.infoObj.checkState == 0"
              v-cloak
              @click.prevent.stop="hasConfirm"
            >确认审核</el-button>
          </div>
          <ul class="content">
            <li>
              <span style="flex:1">姓名: {{infoObj.name}}</span>
              <span style="flex:1">手机: {{infoObj.phone}}</span>
              <span style="flex:1">性别: {{infoObj.sex}}</span>
              <span style="flex:1">年龄: {{infoObj.age}}</span>
            </li>
            <li>
              <span style="flex:1">婚姻状况: {{infoObj.marriage}}</span>
              <span style="flex:1">文化程度: {{infoObj.edu}}</span>
              <span style="flex:1">所属:</span>
              <span style="flex:1">职业: {{infoObj.job}}</span>
            </li>
            <li>
              <span style="flex:1">科室:</span>
            </li>
            <li class="testContent">
              <span style="flex:1">检测卡号: {{infoObj.orderNo}}</span>
              <span style="flex:1">医生: {{infoObj.createBy}}</span>
            </li>
            <li>
              <span style="flex:1">检测时间: {{timesChangeDate(infoObj.createTime)}}</span>
              <span style="flex:1">报告时间: {{timesChangeDate(infoObj.createTime)}}</span>
            </li>
            <li>
              <span style="flex:1">套餐名称: {{str}}</span>
            </li>
          </ul>
        </div>
        <!-- 单个检测报告图表等 -->
        <div class="singleSheet" v-for="(item,index) in reportList" :key="index">
          <p class="sheetName">{{item.sheetName}}</p>
          <div v-if="item.isZh !== 'Y'" style="width:60%;margin:0 auto;">
            <p class="title">检测结果统计图</p>

            <ve-histogram
              :data="chartData"
              :extend="extend"
              :settings="chartSettings"
              :legend-visible="false"
            ></ve-histogram>
          </div>

          <div style="text-align:center;overflow:hidden">
            <span class="score">总分：{{item.score}}</span>
            <span
              class="score"
              v-for="(subItem,i) in item.factor"
              :key="i"
            >{{subItem.name}}：{{subItem.score}}</span>
          </div>
          <p class="title" style="padding-top:60px">
            <span style="border-bottom:2px solid #000;">答题记录</span>
          </p>
          <div class="answer">
            <el-button type="primary" @click.prevent.stop="jumpAnsDet(item)">答题详情</el-button>
          </div>
          <p class="title" style="padding-top:60px">
            <span style="border-bottom:2px solid #000;">检测评语</span>
          </p>
          <p class="TitleContent" v-html="item.comment"></p>
          <div v-if="item.isZh !== 'Y'" class="adviceCard">
            <p class="title">
              <span style="border-bottom:2px solid #000;">检测建议</span>
            </p>
            <p class="TitleContent" v-html="item.suggestion"></p>
          </div>
        </div>
        <!-- 总建议 -->
        <div v-if="this.infoObj.isZh == 'Y'" class="adviceCard">
          <p class="title">
            <span style="border-bottom:2px solid #000;">检测建议</span>
          </p>
          <p class="title" v-html="this.advice"></p>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { timesChangeDate } from "../../assets/js/util";
export default {
  data() {
    this.chartSettings = {
      labelMap: {
        type: "因子类型",
        def: "得分"
      }
    };
    this.extend = {
      series: {
        label: {
          show: true,
          position: "top",
          color: "#1378B5",
          fontSize: "22"
        },
        barWidth: 30 //柱图宽度
      },
      color: ["#1378B5"],
      tooltip: {
        trigger: "axis",
        showDelay: 0, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow" // 默认为直线，可选为：'line' | 'shadow',
        }
      }
    };
    return {
      timesChangeDate,
      fullscreenLoading: true,
      Number: "",
      advice: "",
      infoObj: {},
      reportList: [],
      str: "",
      Arr: [],
      chartData: {
        columns: ["type", "def"],
        rows: [
          { type: 11, def: 22 },
          { type: 12, def: 23 },
          { type: 13, def: 24 }
        ]
      }
    };
  },
  created() {
    this.Number = this.$route.query.orderNo;
    this.getDetaiList();
  },
  mounted() {
    this.getDetaiList();
  },
  methods: {
    async getDetaiList() {
      const { data: res } = await this.$http.post("checkList/getReport", {
        orderNo: this.Number
      });
      if (res.code !== 200) {
        return this.$message("获取数据失败");
      } else {
        this.fullscreenLoading = false;
      }

      // 个人资料数据
      this.advice = res.data.advice;
      this.infoObj = res.data.info;
      this.reportList = res.data.report;
      // 量表建议评语等数据
      var obj = {};
      this.reportList.forEach(item => {
        item.factor = eval(item.factor);
      });

      // 图表数据
      console.log(this.reportList);

      // 循环添加量表名称
      var arr = res.data.report;
      for (var i = 0; i < arr.length; i++) {
        this.str += arr[i].sheetName + " , ";
      }
    },
    // 确认审核
    async hasConfirm() {
      const { data: res } = await this.$http.post("checkList/update", {
        checkState: "1"
      });
      console.log(res);
    },
    jumpAnsDet(info) {
      this.$router.push({
        path: "AnsDetail",
        query: { ansUuid: info.ansUuid, Number: this.Number }
      });
    }
  }
};
</script>
<style lang='less'>
[v-cloak] {
  display: none;
}
li {
  list-style: none;
}
h4 {
  text-align: center;
  padding-bottom: 20px;
}
.title {
  font-weight: 700;
}
.personalInformation .content {
  margin: 20px 0;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f9f9f9;
}
.personalInformation li {
  padding: 5px 0;
  display: flex;
}
.testContent {
  margin-top: 20px;
}
.sheetName {
  text-align: center;
  font-weight: 700;
  padding: 10px 0;
  box-sizing: border-box;
}
.singleSheet {
  border: 1px solid #f5f5f5;
  border-bottom: none;
  border-radius: 10px;
  margin-bottom: 20px;
  box-sizing: border-box;
  padding: 10px;
}
.score {
  display: inline-block;
  padding: 4px 10px;
  margin: 10px;
  border: 1px solid #158db2;
}
.answer {
  text-align: center;
}
.TitleContent {
  padding: 10px 0;
}
.buttonBox {
  display: flex;
}
.adviceCard .content {
  box-sizing: border-box;
  border: 1px dashed #409eff;
  padding: 10px;
  border-radius: 7px;
}
</style>