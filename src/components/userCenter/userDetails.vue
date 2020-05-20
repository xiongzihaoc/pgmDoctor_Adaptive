<template>
  <div class="connectCenL">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home/userCenter' }">用户中心</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/userCenter' }">个人列表</el-breadcrumb-item>
      <el-breadcrumb-item>检测报告</el-breadcrumb-item>
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
        <span class="titleCen">性别：{{infomation.sex}}</span>
      </li>
      <li>
        <span class="titleCen">文化程度：{{infomation.edu}}</span>
        <span class="titleCen">婚姻：{{infomation.marriage}}</span>
        <span class="titleCen">职业：{{infomation.job}}</span>
        <span class="titleCen" style="visibility: hidden;"></span>
      </li>
    </el-card>
    <el-card class="cardBox">
      <div class="buttonBox">
        <el-button type="primary" plain size="small" @click.prevent.stop="consultation">会诊</el-button>
        <el-button type="primary" plain size="small" @click.prevent.stop="Hisconsultation">历次会诊</el-button>
        <el-button type="primary" plain size="small">追加检测</el-button>
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
              type="danger"
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
        <el-form-item label="会诊类型" prop="type">
          <el-select v-model="consultationForm.type" style="width:80%">
            <el-option value="consult-in" label="院内会诊"></el-option>
            <el-option value="consult-out" label="院外会诊"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会诊医生" prop="conDoctor">
          <el-select
            filterable
            multiple
            v-model="consultationForm.conDoctor"
            placeholder="请选择医生"
            style="width:80%"
          >
            <el-option v-for="item in docList" :key="item.id" :label="item.name" :value="item.uuid">
              <div style="display:flex;">
                <span style="flex: 1;font-weight:700;">{{ item.name }}</span>
                <span style="flex: 1;text-align:center">{{ item.hospital }}</span>
                <span style="flex: 1;text-align:center">{{ item.office }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会诊内容" prop="content">
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
        type: "",
        conDoctor: [],
        content: ""
      },

      dialogVisible: false
    };
  },
  created() {
    this.infomation = JSON.parse(window.sessionStorage.getItem("peoDetail"));
    this.getCardList();
    this.getDocList();
  },
  methods: {
    // 获取检查单列表
    async getCardList() {
      const { data: res } = await this.$http.post("checkList/list", {
        phone: this.infomation.phone,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        name: this.input
      });
      this.userList = res.rows;
      this.total = res.total;
    },
    // 获取医生列表
    async getDocList() {
      const { data: res } = await this.$http.post("doc/getDoctor", {});
      console.log(res);

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
    },
    // 历次会诊
    Hisconsultation() {
      console.log(this.infomation.uuid);

      this.$router.push({
        path: "/home/consultationList",
        query: { mesType: "consult-out", id: this.infomation.uuid }
      });
    },
    async dialogVisibleEnter() {
      if (
        this.consultationForm.content == "" ||
        this.consultationForm.conDoctor == [] ||
        this.type == ""
      ) {
        return this.$message.error("内容不能为空");
      } else {
        const { data: res } = await this.$http.post("consult/add", {
          patientUuid: this.infomation.uuid,
          content: this.consultationForm.content,
          conDoctor: this.consultationForm.conDoctor.toString(),
          type: this.consultationForm.type
        });
        if (res.code != 200) return this.$message.error("操作失败");
        this.$message.success("操作成功");
        this.dialogVisible = false;
      }
    },
    dialogVisibleCancel() {
      this.consultationForm = {};
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