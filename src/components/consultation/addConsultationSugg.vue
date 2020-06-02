<template>
  <div class="connectCenL">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home/consultation' }">会诊操作</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/consultation' }">院内会诊</el-breadcrumb-item>
      <el-breadcrumb-item>添加会诊意见</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="topCard">
      <div>
        <span class="orangeYuan"></span>
        <span class="perInfo">个人详情</span>
      </div>
      <li>
        <span class="titleCen">姓名：{{infomation.name}}</span>
        <span class="titleCen">手机：{{infomation.phone}}</span>
        <span class="titleCen">生日：{{infomation.birthday}}</span>
        <span class="titleCen">性别：{{infomation.gender}}</span>
      </li>
      <li>
        <span class="titleCen">文化程度：{{infomation.culture}}</span>
        <span class="titleCen">婚姻：{{infomation.marriage}}</span>
        <span class="titleCen">职业：{{infomation.job}}</span>
        <span class="titleCen" style="visibility: hidden;"></span>
      </li>
    </el-card>

    <el-card class="cardBox">
      <div class="buttonBox">
        <el-button type="primary" plain size="small" @click.prevent.stop="consultation">添加会诊意见</el-button>
        <el-button type="primary" plain size="small" @click.prevent.stop="Hisconsultation">历次会诊</el-button>
        <el-button type="primary" plain size="small" @click.prevent.stop="additionalTesting">追加检测</el-button>
        <el-button type="primary" plain size="small">历次检测对比</el-button>
        <el-button type="primary" plain size="small">其他检测</el-button>
      </div>
      <!-- 调用公用表格组件 -->
      <ElTable :data="userList" :header="tableHeaderBig" style="margin-top:1%;">
        <el-table-column align="center" slot="fixed" fixed="right" label="录入时间" prop="createTime">
          <template slot-scope="scope">
            <div>{{timesChangeDate(scope.row.createTime)}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" slot="fixed" fixed="right" label="测试情况" prop="state">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 3" style="color:#67C23A">已检测</span>
            <span v-else style="color:#F56C6C">未检测</span>
          </template>
        </el-table-column>
        <el-table-column align="center" slot="fixed" fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              type="info"
              plain
              size="mini"
              @click.prevent.stop="JumpUserCenter(scope.row)"
              v-if="scope.row.state!=3"
              disabled
            >查看</el-button>
            <el-button
              type="primary"
              size="mini"
              @click.prevent.stop="JumpUserCenter(scope.row)"
              v-else
            >查看</el-button>
          </template>
        </el-table-column>
      </ElTable>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChangev"
        :current-page="pageNum"
        :page-sizes="[10, 20,50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 会诊弹框 -->
    <el-dialog
      title="会诊记录"
      :visible.sync="dialogVisible"
      v-dialogDrag
      class="consultationDia"
      @closed="dialogVisibleCancel"
    >
      <el-form :modal="consultationForm" label-width="80px" ref="addInfoRef">
        <el-form-item label="会诊意见" prop="content">
          <el-input type="textarea" v-model="consultationForm.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="dialogVisibleEnter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ElTable from "../CommonModule/table";
import { timesChangeDate } from "../../assets/js/util";
export default {
  components: { ElTable },
  data() {
    return {
      timesChangeDate,
      tableHeaderBig: [
        { prop: "orderNo", label: "检测卡号" },
        { prop: "name", label: "姓名" },
        { prop: "phone", label: "手机号" }
      ],
      userList: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      infomation: {},
      docList: [],
      consultationForm: {
        content: ""
      },
      infoForm: {
        uuid: "",
        phone: "",
        conNo: ""
      },
      phoneKey: "",
      dialogVisible: false
    };
  },
  created() {
    this.infoForm.uuid = this.$route.query.id;
    this.infoForm.phone = this.$route.query.phone;
    this.infoForm.conNo = this.$route.query.conNo;
    this.getpatientInfo();
    this.getCardList();
  },
  methods: {
    // 获取检查单列表
    async getCardList() {
      const { data: res } = await this.$http.post("checkList/list", {
        phone: this.phoneKey,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        name: this.input
      });
      this.userList = res.rows;
      this.total = res.total;
    },
    // 获取患者个人信息
    async getpatientInfo() {
      const { data: res } = await this.$http.post("/doc/getPatientInfo", {
        uuid: this.infoForm.uuid
      });
      if (res.code !== 200) return this.$message.error("获取患者个人信息失败");
      this.infomation = res.data;
      this.phoneKey = res.data.phone;
    },
    // 获取医生列表
    async getDocList() {
      const { data: res } = await this.$http.post("doc/getDoctor", {});
      if (res.code !== 200) return this.$message.error("获取医生列表失败");
      this.docList = res.rows;
    },
    JumpUserCenter(info) {
      this.$router.push({
        path: "/home/examiningReport/examiningDetail",
        query: { orderNo: info.orderNo }
      });
    },
    // 会诊
    consultation() {
      this.dialogVisible = true;
      this.getDocList();
    },
    // 历次会诊
    Hisconsultation() {
      this.$router.push({
        path: "/home/consultationList",
        query: { mesType: "consult-in", id: this.infomation.uuid }
      });
    },
    async dialogVisibleEnter() {
      if (this.consultationForm.content == "") {
        return this.$message.error("内容不能为空");
      } else {
        const { data: res } = await this.$http.post("consult/record/add", {
          conResult: this.consultationForm.content,
          conNo: this.infoForm.conNo
        });
        if (res.code != 200) return this.$message.error("操作失败");
        this.$message.success("操作成功");
        this.dialogVisible = false;
      }
    },
    dialogVisibleCancel() {
      this.consultationForm = {};
    },
    // 追加检测
    additionalTesting() {
      this.$router.push({
        path: "/home/userCenter/AdditionalTest",
        query: { info: JSON.stringify(this.infomation) }
      });
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getCardList();
    }
  }
};
</script>
<style scoped>
.connectCenL {
  height: 100%;
}
.connectCenL .searchBox {
  display: -webkit-flex;
  display: flex;
}
.connectCenL .searchInput {
  width: 25%;
  max-width: 300px;
}
.connectCenL .cardBox {
  height: 65%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.connectCenL .topCard {
  height: 19%;
  margin-bottom: 1%;
}
.connectCenL .topCard li {
  display: flex;
  font-size: 16px;
  color: #c1c2c9;
  padding: 2% 0 0 5%;
  box-sizing: border-box;
}
.connectCenL .topCard li .titleCen {
  flex: 1;
}
.topCard .orangeYuan {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ff9a00;
}
.topCard .perInfo {
  font-weight: 700;
  padding-left: 5px;
  box-sizing: border-box;
}
</style>