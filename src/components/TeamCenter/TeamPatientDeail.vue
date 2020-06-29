<template>
  <div style="height: 85%;">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home/teamCenter' }"
        >团队中心</el-breadcrumb-item
      >
      <el-breadcrumb-item>检测人员</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="height: 100%;">
      <el-card class="deptInfoCard">
        <div>
          <span class="orangeYuan"></span>
          <span class="perInfo">团队信息</span>
        </div>
        <div class="deptInfoDiv">
          <li>
            <span class="title">名称：{{ teamInfo.name }}</span>
            <span class="title">账号：{{ teamInfo.account }}</span>
            <span class="title">联系人：{{ teamInfo.leader }}</span>
            <span class="title">联系电话：{{ teamInfo.phone }}</span>
          </li>
          <li>
            <span class="title"
              >创建时间：{{ timesChangeDate(deptCheckInfo.createTime) }}</span
            >
            <span class="title">检测套餐：{{ deptCheckInfo.packageName }}</span>
            <span class="title">录入人数：{{ deptCheckInfo.checkNumber }}</span>
            <span class="title"
              >已检测人数：{{ deptCheckInfo.recordNumber }}</span
            >
          </li>
        </div>
      </el-card>
      <el-card class="deptPatientCard">
        <div>
          <el-button
            type="primary"
            @click="importPrient"
            v-if="fileData.teamDept.length == 3"
            >导入员工</el-button
          >
          <el-button type="primary" @click="exportPrient">导出员工</el-button>
        </div>
        <el-table
          id="exportTab"
          ref="exportTab"
          :data="patientList"
          style="margin-top:1%;"
          :header-cell-style="{
            background: '#5BAEFF',
            height: '50px',
            color: '#fff',
          }"
        >
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="orderNo"
            label="检测卡号"
          />
          <el-table-column align="center" prop="name" label="姓名" />
          <el-table-column
            align="center"
            prop="idCard"
            show-overflow-tooltip
            label="身份证"
          />
          <el-table-column align="center" prop="sex" label="性别" />
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="phone"
            label="手机"
          />
          <el-table-column
            align="center"
            prop="birth"
            show-overflow-tooltip
            label="生日"
          />
          <el-table-column align="center" prop="marriage" label="婚姻" />
          <el-table-column align="center" prop="edu" label="文化" />
          <el-table-column align="center" prop="job" label="职业" />
          <!-- <el-table-column
                  v-if="deptCode.length==3"
                  align="center"
                  prop="teamDept"
                  label="组织"/> -->
          <el-table-column
            v-if="deptCode.length == 3 || deptCode.length == 6"
            align="center"
            prop="teamDept"
            show-overflow-tooltip
            label="组织"
          />
          <!-- <el-table-column
                  align="center"
                  prop="teamNo"
                  label="检测套餐"/> -->
                <el-table-column
                  align="center"
                  prop="checkTime"
                  label="检测时间">
                    <template slot-scope="scope">
                      <div v-if="scope.row.checkTime == null"></div>
                      <div v-else>{{timesChangeDate(scope.row.checkTime)}}</div>
                    </template>
                  </el-table-column>
                <el-table-column
                  align="center"
                  prop="state"
                  label="结果">
                    <template slot-scope="scope">
                      <div v-if="scope.row.state==3">已检测</div>
                      <div v-else>未检测</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" fixed="right" label="操作">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.state==3"
                      type="primary"
                      size="mini"
                      @click.prevent.stop="checkPatientReport(scope.row)">报告</el-button>
                    <el-button v-else type="info"  size="mini" disabled>未检测</el-button>
                  </template>
                </el-table-column>
            </el-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChangev"
              :current-page="pageNum"
              :page-sizes="[10, 20,50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"></el-pagination>
          </el-card>
        </div>
        <el-dialog 
        title="导入人员信息"
        :visible.sync="dialogPrient"
        v-dialogDrag
        center>
        <div class="fileUpload">
          <a href="https://zykj-resource.oss-cn-hangzhou.aliyuncs.com/Patienttemplate/PhmTemplate.xls"><el-button size="small" type="success">下载模板</el-button></el-button></a>
          <el-upload
            style="margin-top: 20px;"
            class="upload-demo"
            ref="upload"
            action="http://192.168.0.117:8086/zhuoya-sheet/teamList/dept/import"
            :headers="config"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="upload_success"
            :on-error="upload_error"
            :multiple="false"
            :limit="1"
            :data="fileData"
            :file-list="fileList"
            :before-upload="fileUploadBefore">
          <div>
            上传文件
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
            <div slot="tip" class="el-upload__tip">
              只能上传Excel文件，且不超过5M
            </div>
          </div>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPrient = false">取 消</el-button>
        <el-button type="primary" @click="submitUpload">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
//导出Excel
import export_table_to_excel from "../../vendor/Export2Excel.js";
import { timesChangeDate } from "../../assets/js/util";
export default {
  data() {
    return {
      config: {},
      fileData: {},
      fileList: [],
      dialogPrient: false,
      timesChangeDate,
      deptCode: "",
      teamInfo: "",
      deptCheckInfo: {}, //检测信息
      patientList: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
    };
  },
  created() {
    this.config.Authorization = window.sessionStorage.getItem("token");
    this.deptCode = this.$route.query.teamTypeCode;
    this.deptCheckInfo = JSON.parse(this.$route.query.packageInfo);
    this.fileData.teamDept = this.deptCode;
    this.fileData.teamNo = this.deptCheckInfo.teamNo;
    this.getTeamInfo();
  },
  methods: {
    submitUpload() {
      this.dialogPrient = false;
      this.getTeamInfo();
      // this.$refs.upload.submit();
    },
    fileUploadBefore(file) {
      const extension = file.name.split(".")[1] === "xls";
      const extension2 = file.name.split(".")[1] === "xlsx";
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!extension && !extension2) {
        this.$message.warning("上传模板只能是 xls、xlsx格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.warning("上传模板大小不能超过 5MB!");
        return false;
      }
      return; // 返回false不会自动上传
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    upload_success(response) {
      console.log(response);
      if(response.code == 200){
        this.$message.success('文件上传成功');
        return;
      }else if(response.code == 300){
        this.fileList = [];
        var error = response.data.error;
        var errorData = "";
        if (error != null && error.length > 0) {
          error.forEach((element) => {
            errorData += element + "<br>";
          });
        }
        this.$alert(errorData, '错误信息', {
          dangerouslyUseHTMLString: true
        });
      }else {
        this.fileList = [];
        this.$message.success('文件上传失败');
      }
    },
    upload_error(err) {
      console.log(err);
    },
    //导入人员信息
    importPrient() {
      this.dialogPrient = true;
    },
    //导出员工信息
    exportPrient() {
      require.ensure([], () => {
        const {
          export_json_to_excel,
        } = require("../../vendor/Export2Excel.js");
        const tHeader = [
          "检测卡号",
          "身份证",
          "性别",
          "手机",
          "生日",
          "婚姻",
          "文化",
          "职业",
          "组织",
          "检测时间",
          "结果",
        ];
        const filterVal = [
          "orderNo",
          "idCard",
          "sex",
          "phone",
          "birth",
          "marriage",
          "edu",
          "job",
          "teamDept",
          "checkTime",
          "state",
        ];
        const list = this.patientList;
        const data = this.formatJson(filterVal, list);
        // console.log(data);
        export_json_to_excel(tHeader, data, "员工信息");
      });
    },
    formatJson(filterVal, jsonData) {
      // 　var datas  = jsonData.map(v => filterVal.map(j =>  v[j]));
      var data = []; //= jsonData.map(v => filterVal.map(j => v[j]));
      jsonData.forEach((element) => {
        var prient = [];
        filterVal.forEach((e) => {
          if (e == "state") {
            if (element[e] == 3) {
              prient.push("已检测");
            } else {
              prient.push("未检测");
            }
          } else if (e == "checkTime") {
            prient.push(this.timesChangeDate(element[e]));
          } else {
            prient.push(element[e]);
          }
        });
        data.push(prient);
      });
      return data;
    },
    async getTeamInfo() {
      //获取团队详情
      const { data: res } = await this.$http.post("teamList/dept/info", {
        code: this.deptCode,
      });
      this.teamInfo = res.data;
      this.getDeptPatient();
    },
    async getDeptPatient() {
      const { data: res } = await this.$http.post("teamList/getTeamMember", {
        teamNo: this.deptCheckInfo.teamNo,
        teamDept: this.deptCode,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
      });
      console.log(res);
      this.patientList = res.rows;
      this.total = res.total;
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getDeptPatient();
    },
    checkPatientReport(info) {
      this.$router.push({
        path: "/home/examiningReport/examiningDetail",
        query: { orderNo: info.orderNo },
      });
    },
  },
};
</script>
<style lang="less">
.deptInfoCard {
  height: 26%;
  margin-bottom: 1%;
}
.deptInfoDiv li {
  display: flex;
  font-size: 16px;
  color: #c1c2c9;
  padding: 1% 0 1% 5%;
  box-sizing: border-box;
}
.deptInfoDiv li .title {
  flex: 1;
}
.deptInfoCard .orangeYuan {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ff9a00;
}
.deptInfoCard .perInfo {
  font-weight: 700;
  padding-left: 5px;
  box-sizing: border-box;
}
.deptPatientCard {
  height: 73%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.fileUpload .el-icon-close:before {
  color: #ec0909;
}
</style>
