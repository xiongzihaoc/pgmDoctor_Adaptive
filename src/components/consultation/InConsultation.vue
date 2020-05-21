
<template>
  <div class="connect">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>会诊操作</el-breadcrumb-item>
      <el-breadcrumb-item style="font-weight:700;">院内会诊</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card_box">
      <el-card>
        <div class="searchBox">
          <el-button type="primary" size="small">院内会诊</el-button>
          <el-button
            type="primary"
            size="small"
            plain
            @click.prevent.stop="newAddPerson"
            style="margin-right:2%;"
          >院外会诊</el-button>
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
          <el-table-column align="center" slot="fixed" fixed="right" prop="state" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.state == 0">未确认</span>
              <span v-else-if="scope.row.state == 1" style="color:#67C23A;">已同意</span>
              <span v-else-if="scope.row.state == 2" style="color:#F56C6C;">已拒绝</span>
              <span v-else-if="scope.row.state == 3" style="color:orange;">进行中</span>
              <span v-else style="color:#ccc;">已结束</span>
            </template>
          </el-table-column>
          <el-table-column align="center" slot="fixed" fixed="right" label="操作" width="220">
            <template slot-scope="scope">
              <!-- 开始会诊 -->
              <el-button
                v-if="scope.row.state == 1"
                type="primary"
                size="mini"
                @click.prevent.stop="showEditdialog(scope.row)"
                style="width:80px"
              >开始会诊</el-button>
              <!-- 禁止查看 -->
              <el-button
                v-else-if="scope.row.state == 2 || scope.row.state == 4"
                type="info"
                size="mini"
                plain
                disabled
                @click.prevent.stop="showEditdialog(scope.row)"
                style="width:80px"
              >查看</el-button>
              <!-- 查看 -->
              <el-button
                v-else
                type="primary"
                size="mini"
                @click.prevent.stop="showEditdialog(scope.row)"
                style="width:80px"
              >查看</el-button>
              <!-- 是否同意 -->
              <el-dropdown style="margin-left:10px;">
                <el-button type="info" size="mini" v-if="scope.row.state !=='0'" disabled plain>
                  <span>是否同意</span>
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <!-- 禁止选择是否同意 -->
                <el-button type="primary" size="mini" v-else>
                  <span>是否同意</span>
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
        { prop: "srcDept", label: "来源科室" },
        { prop: "srcDoctor", label: "来源医生" },
        { prop: "createTime", label: "创建时间" }
      ],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      input: "",
      isdisabled: false
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
        type: "consult-in"
      });
      console.log(res);

      this.userList = res.rows;
      this.total = res.total;
    },
    // 同意
    async consent(info) {
      const { data: res } = await this.$http.post("consult/push/update", {
        id: info.id,
        isDisagree: "Y",
        state: 1
      });
      if (res.code != 200) return this.$message.error("操作失败");
      this.$message.success("操作成功");
      this.getCardList();
    },
    // 拒绝
    async reject(info) {
      const { data: res } = await this.$http.post("consult/push/update", {
        id: info.id,
        isDisagree: "N",
        state: 2
      });
      if (res.code != 200) return this.$message.error("操作失败");
      this.$message.success("操作成功");
      this.getCardList();
    },
    // 查看跳转
    showEditdialog(info) {
      console.log(info);

      window.sessionStorage.setItem("peoDetail", JSON.stringify(info));
      this.$router.push({
        path: "/home/userCenter/userDetails"
      });
    },

    newAddPerson() {
      this.$emit("jumpOutOrIn", "jumpOut");
    },
    editDialogClosed() {},
    // 搜索
    searchin() {
      this.getCardList();
    },
    // 跳转团队列表
    jumpTeam() {
      this.$emit("jumpTeam", "jumpTeam");
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
<style  scoped>
.connect {
  height: 100%;
}
.card_box {
  width: 100%;
  height: 85%;
  overflow: hidden;
}
/* .el-card {
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
} */
.searchBox {
  display: -webkit-flex;
  display: flex;
}
.searchInput {
  width: 25%;
  max-width: 300px;
}
</style>

