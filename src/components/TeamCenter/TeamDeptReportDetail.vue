<template>
    <div style="height: 85%;">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home/teamCenter' }">团队中心</el-breadcrumb-item>
            <el-breadcrumb-item>检测人员</el-breadcrumb-item>
        </el-breadcrumb>
        <div style="height: 100%;">
            <el-card class="reportdeptInfoCard">
                <el-button
                    type="danger"
                    size="mini"
                    v-print="'#printdiv'"
                    style="float: right;">打印</el-button>
                <div id="printdiv">
                    <h4 style="text-align: center;">{{teamInfo.name}}的检测报告</h4>
                    <div> 
                        <span class="orangeYuan"></span>
                        <span class="perInfo">团队信息</span>
                    </div>
                    <div class="reportdeptInfoDiv">
                        <ul class="reportdeptInfoul">
                            <li>
                                <span class="title">名称：{{teamInfo.name}}</span>
                                <span class="title">账号：{{teamInfo.account}}</span>
                                <span class="title">联系人：{{teamInfo.leader}}</span>
                                <span class="title">联系电话：{{teamInfo.phone}}</span>
                            </li>
                            <li>
                                <span class="title" >创建时间：{{timesChangeDate(deptCheckInfo.createTime)}}</span>
                                <span class="title" >检测套餐：{{deptCheckInfo.packageName}}</span>
                                <span class="title" >已录入人数：{{deptCheckInfo.checkNumber}}</span>
                                <span class="title" >已检测人数：{{deptCheckInfo.recordNumber}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="teamReportDiv">
                        <div>
                            <span class="orangeYuan"></span>
                            <span class="perInfo">体检量表简介</span>
                        </div>
                        <div class="teamReportSheetDetail" v-for="(item,index) in deptReportInfo" :key="index">
                            <p class="teamReportSheetName">{{item.sheetName}}</p>
                            <p class="teamReportSheetDec">{{item.sheetInstruction}}</p>
                        </div>
                        <el-table 
                            style="margin-top:1%;">

                        </el-table>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>
<script>
    import { timesChangeDate } from "../../assets/js/util";
export default {
  data () {
    return {
        timesChangeDate,
        deptCode:'',
        teamInfo:'',
        deptCheckInfo:{},//检测信息
        deptReportInfo:[],
    };
  },
  created() {
    this.deptCode = this.$route.query.teamTypeCode;
    this.deptCheckInfo = JSON.parse(this.$route.query.packageInfo);
    console.log(this.deptCheckInfo);
    this.getTeamInfo();
  },
  methods:{
    async getTeamInfo(){//获取团队详情
          const {data:res} = await this.$http.post("teamList/dept/info",{
              code:this.deptCode
          });
          this.teamInfo = res.data;
          this.getDeptReport();
      },
    async getDeptReport(){
        const {data:res} = await this.$http.post("teamList/getTeamReport",{
            teamNo:this.deptCheckInfo.teamNo,
            teamDept:this.deptCode,
            countType:0
        });
        console.log(res);
        this.deptReportInfo = res.data;
        this.getStatisticalData();
    },
    getStatisticalData(statisticalData){
        var people = this.deptReportInfo[0].people;
        var table='<table>';
        table += '<tr><td></td>';
        for(var i=0;i<people.length;i++){
            table +='<td>'+people[i].title+'</td>';
        }
        table+='<td>总数</td></tr></table>';
        console.log(table);
        // var tableHeader = [];
        // var tableData=[];
        // var tableDataHeader = {
        //     lngTitle:'人数'
        // };
        // var tableHeadetFirst = {
        //     title:'',
        //     prop:'lngTitle'
        // };
        // tableHeader.push(tableHeadetFirst);
        // var sumPatient = 0;
        // for(var i=0;i<people.length;i++){
        //     var tableTitle={};
        //     tableTitle.title = people[i].title;
        //     if(people[i].title == '男'){
        //         tableTitle.prop = 'man'
        //     }else{
        //         tableTitle.prop = 'woman'
        //     }
            
        //     tableHeader.push(tableTitle);
        //     sumPatient =  people[i].count;
        // }
        // var tableHeadetEnd = {
        //     title:'总数',
        //     prop:'sum'
        // };
        // tableHeader.push(tableHeadetEnd);
        // console.log(tableHeader);
    }
  }
}
</script>
<style lang='less' scoped>
.teamReportDiv {
    border: 1px solid #f5f5f5;
    border-radius: 10px;
    margin-bottom: 20px;
    box-sizing: border-box;
    padding: 10px;
}
.reportdeptInfoul{
    margin: 20px 0;
    padding: 0 0 20px 0;
    box-sizing: border-box;
    background-color: #f9f9f9;
}
.reportdeptInfoDiv li{
  display: flex;
  font-size: 16px;
  color: #c1c2c9;
  padding: 1% 0 0 5%;
  box-sizing: border-box;
}
.reportdeptInfoDiv li .title {
  flex: 1;
}
.reportdeptInfoCard .orangeYuan {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ff9a00;
}
.reportdeptInfoCard .perInfo {
  font-weight: 700;
  padding-left: 5px;
  box-sizing: border-box;
}
.reportdeptInfoCard{
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
}
.teamReportSheetDetail{
    padding: 20px 10px 10px 20px;
    border-bottom: #e0d9d9 solid 1px;
}
.teamReportSheetDetail .teamReportSheetName{
    color: #FE9A00;
    font-size: 16px;
}
.teamReportSheetDetail .teamReportSheetDec{
    color: #444444;
    font-size: 15px;
    padding-top: 10px;
}
</style>