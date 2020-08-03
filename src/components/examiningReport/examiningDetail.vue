<template>
  <div style="height:100%;" class="reportContent">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home/examiningReport' }"
        >检测报告</el-breadcrumb-item
      >
      <el-breadcrumb-item :to="{ path: '/home/examiningReport' }"
        >列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>报告详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div
      style="width:100%;margin:0 auto;margin-top:30px;padding:0 3% 3% 3%;height:85%;overflow: auto;-webkit-overflow-scrolling: touch;box-sizing: border-box;"
    >
      <div style="float:right;">
        <el-button
          type="primary"
          size="mini"
          v-if="this.infoObj.checkState == 0"
          @click.prevent.stop="hasConfirm"
          >确认审核</el-button
        >
        <el-button
          type="danger"
          size="mini"
          v-else
          v-print="'#printDiv'"
          style="margin-bottom:5px"
          @click.prevent.stop="hiddenAnsDetail"
          >打印</el-button
        >
      </div>
      <div id="printDiv">
        <div class="titleFlex">
          <span class="orangeYuan"></span>
          <span class="dataStat">个人资料</span>
        </div>
        <!-- 个人信息部分 -->
        <el-card>
          <ul class="content personalInfo">
            <li class="testNum">
              <span>
                姓名:
                <i>{{ infoObj.name }}</i>
              </span>
              <span>
                手机:
                <i>{{ infoObj.phone }}</i>
              </span>
              <span>
                性别:
                <i>{{ infoObj.sex }}</i>
              </span>
              <span>
                年龄:
                <i>{{ infoObj.age }}</i>
              </span>
            </li>
            <li class="testNum">
              <span>
                婚姻状况:
                <i>{{ infoObj.marriage }}</i>
              </span>
              <span>
                文化程度:
                <i>{{ infoObj.edu }}</i>
              </span>
              <span>
                所属:
                <i v-text="this.infoObj.source == 0 ? '个人' : '团队'"></i>
              </span>
              <span>
                职业:
                <i>{{ infoObj.job }}</i>
              </span>
            </li>
            <!-- <li>
            <span>科室:</span>
          </li>-->
            <li class="testNum">
              <span>
                检测卡号:
                <i>{{ infoObj.orderNo }}</i>
              </span>
              <span>
                医生:
                <i>{{ infoObj.docName }}</i>
              </span>
              <span>
                报告时间:
                <i>{{ timesChangeDate(infoObj.checkTime) }}</i>
              </span>
              <span style="visibility: hidden;">
                检测时间:
                <i>{{ timesChangeDate(infoObj.checkTime) }}</i>
              </span>
            </li>
            <li>
              <span>
                套餐名称:
                <i>{{ str }}</i>
              </span>
            </li>
          </ul>
        </el-card>
        <div class="titleFlex" style="margin-top:1%;">
          <span class="orangeYuan"></span>
          <span class="dataStat" style="font-size:18px;">检测结果</span>
        </div>
        <!-- 量表信息部门 -->
        <ul class="reportInfo">
          <li>
            <el-card>
              <!-- 量表名称 查看答题详情按钮 -->
              <div class="reportList">
                <div class="reportNameCss">
                  <img src="../../assets/images/reportName.png" />
                  <span class="reportName">社会支持量表</span>
                  <span class="reportInstr"
                    >（由得里克博士于1988年研制，用于测定社会支持度的量表）</span
                  >
                </div>
                <el-button type="primary" size="mini">查看答题详情</el-button>
              </div>
              <!-- 总分 -->
              <div class="total">
                总得分：285
              </div>
              <!-- 量表 评语 -->
              <div class="mainContentBox">
                <div class="mainContentBox_left"></div>
                <div class="mainContentBox_right">
                  <div
                    style="display:flex;align-items:center;margin-bottom:5px;"
                  >
                    <img src="../../assets/images/pingyu.png" />
                    <span style="color:#FE9A00;margin-left:5px;font-weight:700">评语：</span>
                  </div>
                  <span style="font-weight:700;color: #1B2338;">
                    提示您状态一般，该测试结果表明您会不自觉的对自己身体上出现的一些小症状过度关注，时不时会感觉自己生病了，长期保持这样的状态对于身体健康的恢复也是非常不利的！我们将给到您一些能够缓解躯体化症状的方法，希望您能够采纳！如左图中，测试结果显示
                    : 854位健康;313 位亚健康，偶有轻微不适感 ;193 位有轻度症状，
                    身体感觉不太良好 ;54 位有中度症状，经常有较
                    为明显的躯体不适感 ;3 位有重度症状，有严重的 不健康感觉 。
                  </span>
                </div>
              </div>
            </el-card>
          </li>
          <li>
            <el-card>
              <!-- 量表名称 查看答题详情按钮 -->
              <div class="reportList">
                <div class="reportNameCss">
                  <img src="../../assets/images/reportName.png" />
                  <span class="reportName">焦虑自评问卷</span>
                  <span class="reportInstr"
                    >（注：由美国哥伦比亚大学Robert L.
                    Spitzer博士于2006年编制）</span
                  >
                </div>
                <el-button type="primary" size="mini">查看答题详情</el-button>
              </div>
              <!-- 总分 -->
              <div class="total">
                总得分：285
              </div>
              <!-- 量表 评语 -->
              <div class="mainContentBox">
                <div class="mainContentBox_left"></div>
                <div class="mainContentBox_right">
                  <div
                    style="display:flex;align-items:center;margin-bottom:5px;"
                  >
                    <img src="../../assets/images/pingyu.png" />
                    <span style="color:#FE9A00;margin-left:5px;font-weight:700">评语：</span>
                  </div>
                  <span style="font-weight:700;color: #1B2338;">
                    提示您状态一般，该测试结果表明您会不自觉的对自己身体上出现的一些小症状过度关注，时不时会感觉自己生病了，长期保持这样的状态对于身体健康的恢复也是非常不利的！我们将给到您一些能够缓解躯体化症状的方法，希望您能够采纳！如左图中，测试结果显示
                    : 854位健康;313 位亚健康，偶有轻微不适感 ;193 位有轻度症状，
                    身体感觉不太良好 ;54 位有中度症状，经常有较
                    为明显的躯体不适感 ;3 位有重度症状，有严重的 不健康感觉 。
                  </span>
                </div>
              </div>
            </el-card>
          </li>
        </ul>
      </div>
      <!-- 检测建议 -->
      <div class="titleFlex">
        <span class="orangeYuan"></span>
        <span class="dataStat">检测建议</span>
      </div>
      <ul class="testAdvice">
        <li>
          <el-card>
            <div class="reportNameCss">
              <img src="../../assets/images/jianyi.png" />
              <span class="testAdvice_title">饮食习惯</span>
            </div>
            <li class="testAdvice_content">
              为了不影响您在公共场合下的社交行为，建议您在夜间和出席公共社交场合前限制饮水，但每天水的摄入量不应该少于1500毫升。
            </li>
            <li class="testAdvice_content">
              为了不影响您在公共场合下的社交行为，建议您在夜间和出席公共社交场合前限制饮水，但每天水的摄入量不应该少于1500毫升。
            </li>
            <li class="testAdvice_content">
              为了不影响您在公共场合下的社交行为，建议您在夜间和出席公共社交场合前限制饮水，但每天水的摄入量不应该少于1500毫升。
            </li>
            <li class="testAdvice_content">
              为了不影响您在公共场合下的社交行为，建议您在夜间和出席公共社交场合前限制饮水，但每天水的摄入量不应该少于1500毫升。
            </li>
          </el-card>
        </li>
        <li>
          <el-card>
            <div class="reportNameCss">
              <img src="../../assets/images/jianyi.png" />
              <span class="testAdvice_title">饮食习惯</span>
            </div>
            <li class="testAdvice_content">
              为了不影响您在公共场合下的社交行为，建议您在夜间和出席公共社交场合前限制饮水，但每天水的摄入量不应该少于1500毫升。
            </li>
            <li class="testAdvice_content">
              为了不影响您在公共场合下的社交行为，建议您在夜间和出席公共社交场合前限制饮水，但每天水的摄入量不应该少于1500毫升。
            </li>
            <li class="testAdvice_content">
              为了不影响您在公共场合下的社交行为，建议您在夜间和出席公共社交场合前限制饮水，但每天水的摄入量不应该少于1500毫升。
            </li>
            <li class="testAdvice_content">
              为了不影响您在公共场合下的社交行为，建议您在夜间和出席公共社交场合前限制饮水，但每天水的摄入量不应该少于1500毫升。
            </li>
          </el-card>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { timesChangeDate } from "../../assets/js/util";
export default {
  data() {
    this.chartSettings = {
      labelMap: {
        type: "因子类型",
        def: "得分",
      },
    };
    this.extend = {
      series: {
        label: {
          show: true,
          position: "top",
          color: "#1378B5",
          fontSize: "22",
        },
        barWidth: 30, //柱图宽度
      },
      color: ["#1378B5"],
      tooltip: {
        trigger: "axis",
        showDelay: 0, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow", // 默认为直线，可选为：'line' | 'shadow',
        },
      },
    };
    return {
      timesChangeDate,
      Number: "",
      advice: "",
      infoObj: {},
      reportList: [],
      isZhNoList: [],
      isZhYesList: [],
      str: "",
      Arr: [],
      lookAnsBtn: true,
      chartData: {
        columns: ["type", "def"],
        rows: [
          { type: 11, def: 22 },
          { type: 12, def: 23 },
          { type: 13, def: 24 },
        ],
      },
    };
  },
  created() {
    this.Number = this.$route.query.orderNo;
    this.getDetaiList();
  },
  methods: {
    async getDetaiList() {
      const { data: res } = await this.$http.post("checkList/getReport", {
        orderNo: this.Number,
      });
      console.log(res);
      if (res.code !== 200) {
        return this.$message("获取数据失败");
      } else {
      }
      // 个人资料数据
      this.advice = res.data.advice;
      this.infoObj = res.data.info;
      this.reportList = res.data.report;
      console.log(this.reportList);

      // 量表建议评语等数据
      var obj = {};
      this.reportList.forEach((item) => {
        item.factor = eval(item.factor);
        if (item.isZh == "N") {
          this.isZhNoList.push(item);
        } else {
          this.isZhYesList.push(item);
        }
      });
      console.log(this.isZhNoList);
      console.log(this.isZhYesList);

      // 未整合量表 isZh == N

      // 整合量表 isZh == Y

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
        id: this.infoObj.id,
        checkState: "2",
      });
      this.getDetaiList();
      console.log(res);
    },
    jumpAnsDet(info) {
      this.$router.push({
        path: "AnsDetail",
        query: { ansUuid: info.ansUuid, Number: this.Number },
      });
    },
    // 点击打印隐藏查看答题详情按钮
    hiddenAnsDetail() {
      // this.lookAnsBtn = false;
      // this.getDetaiList();
    },
  },
};
</script>
<style lang="less" scope>
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
  color: #1b2338;
  font-family: PingFang SC !important;
  font-weight: 700;
  font-size: 18px;
  line-height: normal;
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

.testNum span:nth-child(1) {
  flex: 1.4;
}
.personalInfo li i {
  color: #2c3e50;
  font-weight: 700;
  font-style: normal;
}
.reportInfo li {
  margin-bottom: 20px;
}
.reportList {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.reportNameCss {
  display: flex;
  align-items: center;
}
.reportContent img {
  width: 32px;
  height: 32px;
}
.reportName {
  font-size: 22px;
  color: #2c8cf0;
  margin-left: 5px;
}
.reportInstr {
  font-size: 16px;
  color: #b4b5bf;
}
.total {
  color: #fe9a00;
  font-size: 16px;
  font-weight: 700;
  padding: 10px 3px;
}
.mainContentBox {
  display: flex;
}
.mainContentBox_left {
  flex: 1;
}
.mainContentBox_right {
  flex: 1;
  padding: 15px;
  background: #fff9eb;
  border-radius: 10px;
}
.testAdvice .testAdvice_title {
  font-size: 22px;
  color: #fe9a00;
  margin-left: 5px;
}

.testAdvice_content {
  padding: 15px;
  box-sizing: border-box;
  margin-top: 10px;
  background: #fff9eb;
  border-radius: 10px;
  color: #1b2338;
  font-weight: 700;
}
.reportContent .el-card.is-always-shadow,
.el-card.is-hover-shadow:focus,
.el-card.is-hover-shadow:hover {
  border-radius: 15px;
  margin: 10px 0;
}
</style>
