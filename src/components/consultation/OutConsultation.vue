
<template>
  <div class="connect">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>会诊操作</el-breadcrumb-item>
      <el-breadcrumb-item style="font-weight:700;">院外会诊</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card_box">
      <el-card>
        <div class="searchBox">
          <el-button type="primary" plain size="small" @click.prevent.stop="newAddPerson">院内会诊</el-button>
          <el-button type="primary" size="small" style="margin-right:2%;">院外会诊</el-button>
          <el-input
            placeholder="请输入手机号/姓名"
            prefix-icon="el-icon-search"
            size="small"
            v-model="input"
            class="searchInput"
            @input="searchin"
          ></el-input>
        </div>
        <!-- 调用公用表格组件 -->
        <EleTable :data="userList" :header="tableHeaderBig" style="margin-top:1%;">
          <!-- 操作 -->
          <el-table-column align="center" slot="fixed" fixed="right" label="操作" width="180">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click.prevent.stop="showEditdialog(scope.row)"
              >查看</el-button>
              <el-dropdown style="margin-left:10px;">
                <el-button type="primary" size="mini">
                  <span v-if="scope.row.isDisagree == 'Y'">同意</span>
                  <span v-if="scope.row.isDisagree == 'N'">拒绝</span>
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="consent(scope.row)">同意</el-dropdown-item>
                  <el-dropdown-item @click.native="reject(scope.row)">拒绝</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </EleTable>
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
    </div>
  </div>
</template>
<script>
import EleTable from "../CommonModule/table";
export default {
  components: { EleTable },
  data() {
    return {
      userList: [],
      tableHeaderBig: [
        { prop: "srcHospital", label: "来源医院" },
        { prop: "srcDept", label: "来源科室" },
        { prop: "srcDoctor", label: "来源医生" },
        { prop: "createTime", label: "创建时间" },
        { prop: "state", label: "状态" }
      ],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      input: ""
    };
  },
  created() {
    this.getCardList();
  },
  methods: {
    // 获取列表
    async getCardList() {
      const { data: res } = await this.$http.post("consult/push/list", {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        name: this.input,
        type: "consult-out"
      });
      this.userList = res.rows;
      this.total = res.total;
    },
    // 同意
    async consent(info) {
      const { data: res } = await this.$http.post("consult/push/update", {
        id: info.id,
        isDisagree: "Y"
      });
      if (res.code != 200) return this.$message.error("操作失败");
      this.$message.success("操作成功");
      this.getCardList();
    },
    // 拒绝
    async reject(info) {
      const { data: res } = await this.$http.post("consult/push/update", {
        id: info.id,
        isDisagree: "N"
      });
      if (res.code != 200) return this.$message.error("操作失败");
      this.$message.success("操作成功");
      this.getCardList();
    },
    // 查看跳转
    showEditdialog(info) {
      window.sessionStorage.setItem("peoDetail", JSON.stringify(info));
      this.$router.push({
        path: "/home/userCenter/userDetails"
      });
    },
    newAddPerson() {
      this.$emit("jumpOutOrIn", "jumpIn");
    },
    editDialogClosed() {},
    // 搜索
    searchin() {
      this.getCardList();
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
    },
    handleCurrentChangev(newPage) {
      this.pageNum = newPage;
      this.getCardList();
    },
    // 检测卡类型状态码数字转中文
    ifendcaseJck(val) {
      if (val.state == "1") {
        return "正在作答";
      } else if (val.state == "2") {
        return "作答完成";
      } else if (val.state == "0") {
        return "未作答";
      }
    }
  }
};
</script>
<style  scoped>
.connect {
  height: 100%;
}
.card_box {
  width: 100%;
  height: 85%;
  overflow: hidden;
}
.el-card {
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.searchBox {
  display: -webkit-flex;
  display: flex;
}
.searchInput {
  width: 25%;
  max-width: 300px;
}
</style>

