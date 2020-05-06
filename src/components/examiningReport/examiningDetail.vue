<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h4>{{infoObj.name}}的检测报告</h4>
      <div class="personalInformation">
        <p class="title">基本信息</p>
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
      <div class="singleSheet" v-for="(item,index) in Arr" :key="index">
        <p class="sheetName">{{item.sheetName}}</p>
        <p class="title">检测结果统计图</p>
        <div style="width:60%;margin:0 auto;">
          <ve-histogram :data="chartData" :extend="extend" :legend-visible="false"></ve-histogram>
        </div>
        <div style="text-align:center;overflow:hidden">
          <span class="score" v-for="(subItem,i) in item.factor" :key="i">{{ subItem.name}}</span>
        </div>
        <p class="title" style="padding-top:60px">答题记录</p>
        <div class="answer">
          <el-button type="primary" @click.prevent.stop="jumpAnsDet(item)">答题详情</el-button>
        </div>
        <p class="title" style="padding-top:60px">检测评语</p>
        <p class="TitleContent">{{item.comment}}</p>
        <p class="title">检测建议</p>
        <p class="TitleContent" v-html="item.suggestion"></p>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
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
      Number: "",
      infoObj: {},
      reportList: [],
      factorList: [],
      str: "",
      Arr: [],
      chartData: {
        columns: ["因子类型", "得分"],
        rows: [
          { 因子类型: "平和质(A型)", 得分: 1093 },
          { 因子类型: "气虚质(B型)", 得分: 3230 },
          { 因子类型: "阳虚质(C型)", 得分: 2623 },
          { 因子类型: "阴虚质(D型)", 得分: 1423 },
          { 因子类型: "痰湿型(E型)", 得分: 3492 },
          { 因子类型: "湿热型(F型)", 得分: 4293 }
        ]
      }
    };
  },
  created() {
    this.Number = this.$route.query.orderNo;
    this.getDetaiList();
  },
  methods: {
    async getDetaiList() {
      const { data: res } = await this.$http.post("checkList/getReport", {
        orderNo: this.Number
      });
      console.log(res);

      this.infoObj = res.data.info;
      this.reportList = res.data.report;
      var obj = {};
      this.reportList.forEach(item => {
        obj = {
          ansUuid: item.ansUuid,
          factor: eval(item.factor),
          sheetName: item.sheetName,
          comment: item.comment,
          suggestion: item.suggestion
        };
        this.Arr.push(obj);
      });
      // 循环添加量表名称
      var arr = res.data.report;
      for (var i = 0; i < arr.length; i++) {
        this.str += arr[i].sheetName + " , ";
      }
    },
    jumpAnsDet(info) {
      this.$router.push({
        path: "AnsDetail",
        query: { ansUuid: info.ansUuid }
      });
    },
    // 转换时间格式
    timesChangeDate(times) {
      var date = new Date(times);
      var y = date.getFullYear();
      var mon = date.getMonth() + 1;
      var d = date.getDate();
      if (mon < 10) {
        mon = "0" + mon;
      }
      if (d < 10) {
        d = "0" + d;
      }
      return `${y}-${mon}-${d}`;
    }
  }
};
</script>
<style lang='less'>
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
  display: -webkit-flex;
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
</style>