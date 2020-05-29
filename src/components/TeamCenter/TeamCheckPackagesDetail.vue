<template>
    <div style="height: 100%;">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home/teamCenter' }">团队中心</el-breadcrumb-item>
            <el-breadcrumb-item>团队套餐</el-breadcrumb-item>
        </el-breadcrumb>
        <div style="height:100%;overflow:hidden">
            <el-card class="teamInfoCard">
                <div>
                    <span class="orangeYuan"></span>
                    <span class="perInfo">团队详情</span>
                </div>
                <div class="teamDetail">
                    <li>
                      <span class="title">名称：{{teamInfo.name}}</span>
                      <span class="title">账号：{{teamInfo.account}}</span>
                      <span class="title">联系人：{{teamInfo.leader}}</span>
                    </li>
                    <div>
                        <li>
                            <span class="title">联系电话：{{teamInfo.phone}}</span>
                            <span class="title" >地址：{{teamInfo.pcd}}</span>
                            <span class="title" style="visibility: hidden;"></span>
                        </li>
                        <el-button type="primary" size="mini" style="float: right;" @click.prevent.stop="printTeamPackage">打印套餐</el-button>
                    </div>
                </div>
            </el-card>
            <el-card class="teamPackagesCard">
                <el-table
                    :data="teamCheckPackageList"
                    style="margin-top:1%;"
                    :header-cell-style="{background:'#5BAEFF',height:'50px',color:'#fff'}">
                    <el-table-column
                        width="200"
                        align="center"
                        prop="packageName"
                        label="套餐名称"/>
                    <el-table-column
                        align="center"
                        prop="sheetNames"
                        label="套餐量表"/>
                    <el-table-column align="center" scope="" fixed="right" label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button
                                type="primary"
                                size="mini"
                                @click.prevent.stop="checkPackageQCode(scope.row)">套餐二维码</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                
            </el-card>
        </div>
        <el-dialog
            title="套餐二维码"
            :visible.sync="packageQCodeDialogShow"
            center>
            <div style="text-align: center;">
                <vue-qr :text="QcodeUrl" :size="300"></vue-qr>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="packageQCodeDialogShow = false">取 消</el-button>
                <el-button type="primary" @click="packageQCodeDialogShow = false">确 定</el-button>
            </span>
        </el-dialog>
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
            packageQCodeDialogShow:false,//是否显示套餐二维码Dialog
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
        },
        checkPackageQCode(packageInfo){//显示套餐二维码
            this.QcodeUrl='';
            this.QcodeUrl = this.$userUrlInfo+'?teamId='+this.teamInfo.id+'&deptCode='+this.teamInfo.code+'&teamPackageUuid='+packageInfo.teamPackageUuid+'&singleNum='+this.teamCheckNum;
            this.packageQCodeDialogShow = true;
        },
        printTeamPackage(){//打印团队套餐
            this.$router.push({path:'/home/teamCenter/teamPackagesPrint',query:{teamId:this.teamInfo.id,teamCode:this.teamCode,teamCheckNum:this.teamCheckNum}});
        }
    }
}
</script>
<style lang='less' scoped>
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
.teamInfoCard .orangeYuan {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ff9a00;
}
.teamInfoCard .perInfo {
  font-weight: 700;
  padding-left: 5px;
  box-sizing: border-box;
}
.teamInfoCard {
  height: 21%;
  margin-bottom: 1%;
}
.teamPackagesCard{
    height: 63%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
}
</style>