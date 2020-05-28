<template>
    <div style="height: 100%;">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home/teamCenter' }">团队中心</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/home/teamCenter/teamCheckPackagesDetail',query:{teamCode:teamCode,teamCheckNum:teamCheckNum}}" >团队套餐</el-breadcrumb-item>
            <el-breadcrumb-item>打印套餐</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card style="height: 85%;overflow: auto;-webkit-overflow-scrolling: touch;position: relative;">
            <el-button
                type="danger"
                size="mini"
                v-print="'#printdiv'"
                style="position: absolute;top:30px;right:22px"
            >打印</el-button>
            <div style="height:100%" id="printdiv">
                <h4 style="text-align: center;">{{teamInfo.name}}的检测套餐</h4>
                <div style="display:flex;flex-direction: row;justify-content: space-between;">
                    <p style="font-weight: 600;">团队信息</p>
                </div>
                <ul class="teamDetail">
                    <li>
                        <span class="title">名称：{{teamInfo.name}}</span>
                        <span class="title">账号：{{teamInfo.account}}</span>
                        <span class="title">联系人：{{teamInfo.leader}}</span>
                        <span class="title">联系电话：{{teamInfo.phone}}</span>
                    </li>
                    <li>
                        <span class="title" >地址：{{teamInfo.pcd}}</span>
                    </li>
                </ul>
                <div class="singlePackage" v-for="(item,index) in teamCheckPackageList" :key="index" style="page-break-after:always">
                    <p class="packageName">{{item.packageName}}</p>
                    <p class="packageInfo">套餐量表</p>
                    <div>
                        <p class="packagesSheetName" v-for="(sheet,index) in item.sheetList" :key="index">{{sheet}}</p>
                    </div>
                    <p class="packageInfo">套餐二维码</p>
                    <div>
                        <vue-qr :text="item.QcodeUserInfoUrl" :size="300"></vue-qr>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>
<script>
export default {
  data () {
    return {
        QcodeUrl:'',
        teamCode:'',
        teamCheckNum:'',
        teamInfo:{},//团队详情
        teamCheckPackageList:[],//团队套餐详情
    };
  },
  created() {
    this.teamCode = this.$route.query.teamCode;
    this.teamCheckNum = this.$route.query.teamCheckNum;
    this.getTeamInfo();
  },
  methods:{
    async getTeamInfo(){//获取团队详情
        const {data:res} = await this.$http.post("teamList/dept/info",{
            code:this.teamCode
        });
        this.teamInfo = res.data;
        this.getTeamCheckPackages();
    },
    async getTeamCheckPackages(){//获取团队套餐二维码
        const {data:res} = await this.$http.post("teamList/list_detail",{
            teamNo:this.teamCheckNum
        });
        this.teamCheckPackageList = res.rows;
        if(this.teamCheckPackageList != null && this.teamCheckPackageList.length>0){
            for(var i=0;i<this.teamCheckPackageList.length;i++){
                var packageInfo=this.teamCheckPackageList[i];
                var sheetName = packageInfo.sheetNames;
                var QcodeUrl = this.$userUrlInfo+'?teamId='+this.teamInfo.id+'&deptCode='+this.teamInfo.code+'&teamPackageUuid='+packageInfo.teamPackageUuid+'&singleNum='+this.teamCheckNum;
                packageInfo.sheetList = sheetName.split(',');
                packageInfo.QcodeUserInfoUrl = QcodeUrl;
            }
        }
        console.log(this.teamCheckPackageList);
    },
    print(){
        console.log('111')
        console.log(this.$refs.printdiv);
        (this.$refs.printdiv).printArea();
        
    }
  }
}
</script>
<style lang='less' scoped>
.teamDetail {
    margin: 20px 0;
    padding: 0 0 20px 0;
    box-sizing: border-box;
    background-color: #f9f9f9;
}
.teamDetail li{
    display: flex;
    font-size: 16px;
    color: #c1c2c9;
    padding: 2% 0 0 5%;
    box-sizing: border-box;
}
.teamDetail li .title {
  flex: 1;
}
.singlePackage {
    border: 1px solid #f5f5f5;
    border-radius: 10px;
    margin-bottom: 20px;
    box-sizing: border-box;
    padding: 10px;
}
.packageName {
    text-align: center;
    font-weight: 700;
    padding: 10px 0;
    box-sizing: border-box;
}
.singlePackage .packageInfo{
    font-weight: 600;
    padding: 10px 0;
    box-sizing: border-box;
}
.singlePackage .packagesSheetName{
    padding-top: 5px;
    padding-left: 10px;
}
</style>