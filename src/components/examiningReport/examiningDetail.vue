<template>
  <div style="height:100%">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home/examiningReport' }">检测报告</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/examiningReport' }">列表</el-breadcrumb-item>
      <el-breadcrumb-item>报告详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="card_top" style="height:85%;overflow: auto;-webkit-overflow-scrolling: touch;">
      <el-button
        type="danger"
        size="mini"
        v-show="print"
        v-print="'#printDiv'"
        style="position: absolute;top:58px;right:22px"
      >打印</el-button>
      <div style="display:flex;flex-direction: row;justify-content: space-between;margin-bottom:1%">
        <div class="titleFlex">
          <span class="orangeYuan"></span>
          <span class="dataStat">个人资料</span>
        </div>
        <el-button
          type="primary"
          size="mini"
          v-show="Confirm"
          v-cloak
          @click.prevent.stop="hasConfirm"
        >确认审核</el-button>
      </div>
      <ul
        class="content personalInfo"
        style="background:#f5f5f5;padding:1%;box-sizing:border-box;border-radius: 10px;"
      >
        <li>
          <span>
            姓名:
            <i>{{infoObj.name}}</i>
          </span>
          <span>
            手机:
            <i>{{infoObj.phone}}</i>
          </span>
          <span>
            性别:
            <i>{{infoObj.sex}}</i>
          </span>
          <span>
            年龄:
            <i>{{infoObj.age}}</i>
          </span>
        </li>
        <li>
          <span>
            婚姻状况:
            <i>{{infoObj.marriage}}</i>
          </span>
          <span>
            文化程度:
            <i>{{infoObj.edu}}</i>
          </span>
          <span>
            所属:
            <i v-text="infoObj.source==0?'个人':'团队'">{{}}</i>
          </span>
          <span>
            职业:
            <i>{{infoObj.job}}</i>
          </span>
        </li>
        <li>
          <span>科室:
            <i>心理科</i>
          </span>
        </li>
        <li>
          <span>
            检测卡号:
            <i>{{infoObj.orderNo}}</i>
          </span>
          <span>
            医生:
            <i>{{infoObj.createBy}}</i>
          </span>
        </li>
        <li>
          <span>
            检测时间:
            <i>{{timesChangeDate(infoObj.createTime)}}</i>
          </span>
          <span>
            报告时间:
            <i>{{timesChangeDate(infoObj.createTime)}}</i>
          </span>
        </li>
        <li>
          <span>
            套餐名称:
            <i>{{str}}</i>
          </span>
        </li>
      </ul>
      <div class="titleFlex" style="margin-top:1%;">
        <span class="orangeYuan"></span>
        <span class="dataStat">检测结果</span>
      </div>
      <ul>
        <li
          style="display:flex;padding:5px 0;border-bottom:1px solid #f3f3f3;"
          v-for="item in reportList"
          :key="item.id"
        >
          <div class="liLeft">
            <div class="wenjuanTitle" style="padding-left:30px;">
              <span>{{item.sheetName}}</span>
            </div>
            <div style="padding: 0 0 7px 25px;">
              <span class="score">总分：{{item.score}}</span>
              <span
                class="score"
                v-for="(subItem,i) in item.factor"
                :key="i"
              >{{subItem.name}}：{{subItem.score}}</span>
            </div>
            <!-- 检测评语 -->
            <div class="titleFlex">
              <span class="orangeYuan"></span>
              <span class="dataStat">检测评语</span>
            </div>
            <p v-html="item.comment" style="padding: 5px 0  0 30px;font-size:14px;"></p>
            <!-- 检测建议 -->
            <div class="adviceCard">
              <div class="titleFlex" style="margin:10px 0;">
                <span class="orangeYuan"></span>
                <span class="dataStat">检测建议</span>
              </div>
              <p v-html="item.suggestion" style="padding: 5px 0  0 30px;font-size:14px;"></p>
              <p></p>
            </div>
          </div>
          <div class="liRight">
            <el-button
              type="primary"
              size="mini"
              plain
              @click.prevent.stop="jumpAnsDet(item)"
              class="lookAns"
            >查看答题详情</el-button>
          </div>
        </li>
      </ul>
      <!-- 单个检测报告图表等 -->
      <!-- <p class="sheetName">{{item.sheetName}}</p> -->
      <!-- <div v-if="item.isZh !== 'Y'" style="width:60%;margin:0 auto;">
            <p class="title">检测结果统计图</p>

            <ve-histogram
              :data="chartData"
              :extend="extend"
              :settings="chartSettings"
              :legend-visible="false"
            ></ve-histogram>
      </div>-->
      <!-- <p class="TitleContent" v-html="item.comment"></p>
      <div v-if="item.isZh !== 'Y'" class="adviceCard">
        <p class="title">
          <span style="border-bottom:2px solid #000;">检测建议</span>
        </p>
        <p class="TitleContent" v-html="item.suggestion"></p>
      </div>-->

      <!-- 总建议 -->
      <div v-if="this.infoObj.isZh == 'Y'" class="adviceCard">
        <!-- <p class="title">
          <span style="border-bottom:2px solid #000;">检测建议</span>
        </p>
        <p class="title" v-html="this.advice"></p>-->
      </div>
    </el-card>
    <!-- <el-card
      class="card_bottom"
      style="height:52%;overflow: auto;-webkit-overflow-scrolling: touch;"
    >
     
    </el-card>-->
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
      Number: "",
      advice: "",
      infoObj: {},
      reportList: [],
      str: "",
      Arr: [],
      Confirm: false,
      print: false,
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
      console.log(res);

      if (res.code !== 200) {
        return this.$message("获取数据失败");
      } else {
      }

      // 个人资料数据
      this.advice = res.data.advice;
      this.infoObj = res.data.info;
      if (this.infoObj.checkState != 0) {
        this.print = true;
      } else {
        this.Confirm = true;
      }
      this.reportList = res.data.report;
      console.log(res.data);

      // 量表建议评语等数据
      var obj = {};
      this.reportList.forEach(item => {
        item.factor = eval(item.factor);
      });

      // 图表数据
      // console.log(this.reportList);
      // 循环添加量表名称
      var arr = res.data.report;
      var sheetNameList = "";
      for (var i = 0; i < arr.length; i++) {
        sheetNameList += arr[i].sheetName + ",";
      }
      // 去除字符串最后一个逗号
      sheetNameList = sheetNameList.substr(0, sheetNameList.length - 1);
      this.str = sheetNameList;
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
.sheetName {
  text-align: center;
  font-weight: 700;
  padding: 10px 0;
  box-sizing: border-box;
}
.score {
  display: inline-block;
  border-radius: 5px;
  color: #ff9a00;
  font-size: 12px;
  padding: 4px 10px;
  margin: 5px;
  border: 1px solid #ff9a00;
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
  margin-top: 10px;
  border: 1px dashed #409eff;
  padding: 10px;
  border-radius: 7px;
}
.dataStat {
  font-weight: 700;
  padding-left: 5px;
  box-sizing: border-box;
}
.titleFlex {
  box-sizing: border-box;
  display: -webkit-flex;
  display: flex;
  align-items: center;
}
.personalInfo li {
  margin: 1% 0;
  display: flex;
  color: #c1c2c9;
  font-size: 16px;
  font-weight: 400;
}
.personalInfo li span {
  flex: 1;
}
.personalInfo li i {
  color: #2c3e50;
  font-weight: 700;
  font-style: normal;
}
.liLeft {
  width: 80%;
  box-sizing: border-box;
}
.liRight {
  width: 20%;
}
.wenjuanTitle {
  box-sizing: border-box;
  font-weight: 700;
  padding: 5px 0;
}
.lookAns {
  display: inline-block;
  margin: 30px 0 0 50%;
  transform: translate(-50%);
}
</style>