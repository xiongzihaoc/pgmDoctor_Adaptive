// 打印页面
<template>
  <div class="box">
    <el-button
      v-print="'#printDiv'"
      type="primary"
      plain
      class="btnPrint"
      size="mini"
      >打印</el-button
    >
    <div id="printDiv">
      <!-- 套餐名称 -->
      <div class="tacName">中医体质辨识表</div>
      <!-- 基本信息 -->
      <div class="moduleName">
        <span>基本信息</span>
      </div>
      <div class="information">
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
      </div>
      <!-- 检测结果 -->
      <div class="moduleName">
        <span>检测结果</span>
      </div>
      <div class="info_sheetRes_box">
        <ul>
          <li>
            <div class="sheetRes_box">
              <span class="sheetRes_Index">量表1：</span>
              <span class="sheetRes_Name">《社会支持量表》</span>
            </div>
            <div class="sheetRes_box">
              <span class="printScore">主观支持：56</span>
              <span class="printScore">客观支持：56</span>
            </div>
            <div class="sheetRes_box comment">
              <span class="comment_title">评语：</span>
              <span class="comment_main">你的主观支持度较低</span>
            </div>
          </li>
        </ul>
      </div>
      <!-- 检测建议 -->
      <div class="moduleName">
        <span>检测建议</span>
      </div>
    </div>
  </div>
</template>
<script>
import { timesChangeDate } from "../../assets/js/util";
export default {
  data() {
    return {
      timesChangeDate,
      Num: "",
      advice: "",
      infoObj: {},
      reportList: [],
      isZhNoList: [],
      isZhYesList: [],
      str: "",
      Arr: [],
    };
  },
  created() {
    this.Num = this.$route.query.Number;
    this.getDetaiList();
  },
  methods: {
    async getDetaiList() {
      const { data: res } = await this.$http.post("checkList/getReport", {
        orderNo: this.Num,
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
  },
};
</script>
<style scoped>
.box {
  position: relative;
  color: #000;
}
.tacName {
  margin: 20px 0;
  text-align: center;
  color: #000;
  font-size: 20px;
  font-weight: 700;
}
.moduleName {
  margin: 20px 0;
  font-size: 18px;
  font-weight: 700;
}
.information .content {
  box-sizing: border-box;
  padding: 0 10px;
  border-radius: 7px;
}
.personalInfo li {
  margin: 1% 0;
  display: flex;
  color: #444444;
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
  color: #333333;
  font-weight: 700;
  font-style: normal;
}
.testNum span:nth-child(1) {
  flex: 1.4;
}
.info_sheetRes_box {
  padding: 0 10px;
}
.info_sheetRes_box .sheetRes_box {
  margin: 0.5% 0;
}
.sheetRes_Index,
.sheetRes_Name {
  font-weight: 700;
}
.printScore {
  margin-right: 10px;
  font-size: 14px;
  color: #666;
}
.comment_title {
  font-weight: 700;
}
.comment_main {
  color: #666666;
  text-decoration: underline;
}
.btnPrint {
  position: absolute;
  top: 30px;
  right: 30px;
}
</style>
