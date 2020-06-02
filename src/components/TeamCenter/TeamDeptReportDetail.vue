<template>
    <div style="height: 85%;">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home/teamCenter' }">团队中心</el-breadcrumb-item>
            <el-breadcrumb-item>检测人员</el-breadcrumb-item>
        </el-breadcrumb>
        <div style="height: 100%;">
            <el-card class="reportdeptInfoCard">
                <!-- v-print="'#printdiv'" -->
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
                            <span class="orangeYuan" style="margin-left:20px"></span>
                            <span class="perInfo">体检量表简介</span>
                        </div>
                        <div class="teamReportSheetDetail" v-for="(item,index) in deptReportInfo" :key="index">
                            <p class="teamReportSheetName">{{item.sheetName}}</p>
                            <p class="teamReportSheetDec">{{item.sheetInstruction}}</p>
                            <div style="padding-top: 20px;">
                                <span class="orangeYuan"></span>
                                <span class="perInfo">参试人员性别统计分布表</span>
                            </div>
                            
                                <el-table style="margin-top: 20px;" :data="item.checkPeopleSumData" border
                                :header-cell-style="{ background:'#f5f5f5',height:'50px',color:'#909399'}">
                                    <el-table-column align="center"
                                        prop="title"
                                        label=""></el-table-column>
                                    <el-table-column align="center"
                                        prop="man"
                                        label="男"></el-table-column>
                                    <el-table-column align="center"
                                        prop="women"
                                        label="女"></el-table-column>
                                        <el-table-column align="center"
                                        prop="sum"
                                        label="总体"></el-table-column>
                                </el-table>
                            <!-- </div> -->
                            <div style="padding-top: 20px;">
                                <span class="orangeYuan"></span>
                                <span class="perInfo">参试人员性别统计分布图</span>
                            </div>
                            <div style="padding-top: 20px;width: 100%;" id="peopleCheckNum">
                                <ve-pie :data="item.chartData" radius="100":settings="chartSettings"></ve-pie>
                            </div>
                            <div style="padding-top: 20px;">
                                <span class="orangeYuan"></span>
                                <span class="perInfo">参试人员体质统计表</span>
                            </div>
                            <el-table :data="item.factor" style="width: 100%;margin-top: 20px;">
                                <el-table-column align="center"
                                    prop="factor_name"
                                    label="体质">
                                </el-table-column>
                                <el-table-column align="center"
                                    label="总体">
                                    <el-table-column align="center"
                                        prop="sum"
                                        label="人数">
                                    </el-table-column>
                                    <el-table-column align="center"
                                        prop="sumPro"
                                        label="百分比">
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column align="center"
                                    label="女性">
                                    <el-table-column align="center"
                                        prop="women"
                                        label="人数">
                                    </el-table-column>
                                    <el-table-column align="center"
                                        prop="womenPro"
                                        label="百分比">
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column align="center"
                                    label="男性">
                                    <el-table-column align="center"
                                        prop="man"
                                        label="人数">
                                    </el-table-column>
                                    <el-table-column align="center"
                                        prop="manPro"
                                        label="百分比">
                                    </el-table-column>
                                </el-table-column>
                            </el-table>
                            <div style="margin-top: 20px;">
                                <span class="orangeYuan"></span>
                                <span class="perInfo">参试人员因子总体统计图</span>
                            </div>
                            <div style="padding-top: 20px;width: 100%;display: flex;">
                                <div style="width: 50%;">
                                    <ve-pie :data="item.factorSumPeopleChart" radius="100" :settings="chartSettings"></ve-pie>
                                </div>
                                <div style="width: 50%;padding: 150px 10% 0 10%;">
                                    <span style="font-size: 21px;color: #444444;">如左图中,{{item.factorSumPeopleChartInstructions}}</span>
                                </div>
                            </div>

                            <div style="padding-top: 20px;">
                                <span class="orangeYuan"></span>
                                <span class="perInfo">参试人员因子男性统计图</span>
                            </div>
                            <div style="padding-top: 20px;width: 100%;display: flex;">
                                <div style="width: 50%;">
                                    <ve-pie :data="item.factorManPeopleChart" radius="100" :settings="chartSettings"></ve-pie>
                                </div>
                                <div style="width: 50%;padding: 150px 10% 0 10%;">
                                    <span style="font-size: 21px;color: #444444;">如左图中,{{item.factorManPeopleChartInstructions}}</span>
                                </div>
                            </div>

                            <div style="padding-top: 20px;">
                                <span class="orangeYuan"></span>
                                <span class="perInfo">参试人员因子女性统计图</span>
                            </div>
                            <div style="padding-top: 20px;width: 100%;display: flex;">
                                <div style="width: 50%;">
                                    <ve-pie :data="item.factorWomenPeopleChart" radius="100" :settings="chartSettings"></ve-pie>
                                </div>
                                <div style="width: 50%;padding: 150px 10% 0 10%;">
                                    <span style="font-size: 21px;color: #444444;">如左图中,{{item.factorWomenPeopleChartInstructions}}</span>
                                </div>
                            </div>
                        </div>
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
    this.chartSettings = {
        center:[0,300],
        label:{
            fontSize:20,
            formatter:'{d}%'
        },
        labelLine:{
            length:5
        },
        itemStyle:{
            borderWidth:1
        }
      }
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
    getStatisticalData(){
        if(this.deptReportInfo != null &&this.deptReportInfo.length>0){
            for(var i=0;i<this.deptReportInfo.length;i++){
                var staticalData = this.deptReportInfo[i];

                var people = staticalData.people;
                var checkPeopleSumData=[];
                var checkPeopleSumDataInfo = {};
                checkPeopleSumDataInfo.title="人数";
                var manData = {};
                var women = {};
                var sexChartData ={};
                var columns = ['sex','count'];
                var chartData = [];
                for(var j=0;j<people.length;j++){
                    var chartDataInfo = {};
                    if(people[j].title=='男'){
                        manData = people[j];
                    }else{
                        women = people[j];
                    }
                    chartDataInfo.sex = people[j].title;
                    chartDataInfo.count = people[j].count;
                    chartData.push(chartDataInfo);
                }
                checkPeopleSumDataInfo.man = manData.count;
                checkPeopleSumDataInfo.women = women.count;
                checkPeopleSumDataInfo.sum = manData.sum;
                checkPeopleSumData.push(checkPeopleSumDataInfo);

                var checkPeopleProDataInfo = {};
                checkPeopleProDataInfo.title="百分比";
                checkPeopleProDataInfo.man = (manData.count/manData.sum*100)+"%";
                checkPeopleProDataInfo.women = (women.count/manData.sum*100)+"%"
                checkPeopleProDataInfo.sum = '100%';
                checkPeopleSumData.push(checkPeopleProDataInfo);
                staticalData.checkPeopleSumData=checkPeopleSumData;

                
                
                var factor = staticalData.factor;
                var factorSumPeopleChart = {};
                var factorSumPeopleChartColumns = ['factorName','count'];
                var factorSumPeopleChartRow = [];
                var factorSumPeopleChartInstructions='检测总人数为:'+manData.sum+"人,";

                var factorManPeopleChart = {};
                var factorManPeopleChartRow = [];
                var factorManPeopleChartInstructions="男性检测人数为:"+manData.count+"人,";

                var factorWomenPeopleChart = {};
                var factorWomenPeopleChartRow = [];
                var factorWomenPeopleChartInstructions="女性检测人数为:"+women.count+"人,";
                var factorSum = 0;
                var factorMan = 0;
                var factorWomen = 0;
                for(var j=0;j<factor.length;j++){
                    factorSum+=factor[j].sum;
                    factorMan+=factor[j].man;
                    factorWomen+=factor[j].women;
                }

                for(var j=0;j<factor.length;j++){
                    var factorSumPeopleChartRowInfo = {};
                    var factorManPeopleChartRowInfo = {};
                    var factorWomenPeopleChartRowInfo = {};
                    var factorInfo = factor[j];
                    if(j == factor.length-1){
                        factorSumPeopleChartInstructions+=factorInfo.sum+"位"+ factorInfo.factor_name+"。"
                        factorManPeopleChartInstructions+=factorInfo.man+"位"+ factorInfo.factor_name+"。"
                        factorWomenPeopleChartInstructions+=factorInfo.women+"位"+ factorInfo.factor_name+"。"
                    }else {
                        factorSumPeopleChartInstructions+=factorInfo.sum+"位"+ factorInfo.factor_name+","
                        factorManPeopleChartInstructions+=factorInfo.man+"位"+ factorInfo.factor_name+","
                        factorWomenPeopleChartInstructions+=factorInfo.women+"位"+ factorInfo.factor_name+","
                    }
                    
                    factorInfo.sumPro = (factorInfo.sum/factorSum*100).toFixed(2)+"%";
                    factorInfo.manPro = (factorInfo.man/factorMan*100).toFixed(2)+"%";
                    factorInfo.womenPro = (factorInfo.women/factorWomen*100).toFixed(2)+"%";
                    factorSumPeopleChartRowInfo.factorName = factorInfo.factor_name;
                    factorSumPeopleChartRowInfo.count = factorInfo.sum;
                    // factorSumPeopleChartRowInfo.pro= (factorInfo.sum/factorSum*100).toFixed(2)+"%";
                    factorSumPeopleChartRow.push(factorSumPeopleChartRowInfo);

                    factorManPeopleChartRowInfo.factorName = factorInfo.factor_name;
                    factorManPeopleChartRowInfo.count = factorInfo.man;
                    // factorManPeopleChartRowInfo.pro= (factorInfo.man/factorMan*100).toFixed(2)+"%";
                    factorManPeopleChartRow.push(factorManPeopleChartRowInfo);

                    factorWomenPeopleChartRowInfo.factorName = factorInfo.factor_name;
                    factorWomenPeopleChartRowInfo.count = factorInfo.women;
                    // factorWomenPeopleChartRowInfo.pro= (factorInfo.women/factorWomen*100).toFixed(2)+"%";
                    factorWomenPeopleChartRow.push(factorWomenPeopleChartRowInfo);
                }
                factorSumPeopleChart.columns = factorSumPeopleChartColumns;
                factorSumPeopleChart.rows = factorSumPeopleChartRow;
                staticalData.factorSumPeopleChart = factorSumPeopleChart;

                factorManPeopleChart.columns = factorSumPeopleChartColumns;
                factorManPeopleChart.rows = factorManPeopleChartRow;
                staticalData.factorManPeopleChart = factorManPeopleChart;


                factorWomenPeopleChart.columns = factorSumPeopleChartColumns;
                factorWomenPeopleChart.rows = factorWomenPeopleChartRow;
                staticalData.factorWomenPeopleChart = factorWomenPeopleChart;
                staticalData.factorSumPeopleChartInstructions = factorSumPeopleChartInstructions;
                staticalData.factorManPeopleChartInstructions = factorManPeopleChartInstructions;
                staticalData.factorWomenPeopleChartInstructions = factorWomenPeopleChartInstructions;

                // var table = '<table class="reportTable" border="1" style="width: 100%;text-align: center;border-collapse:collapse;"><tr style="background:#FAFAFA;color:#000000;font-weight:700"><td></td>';
                // var sumPeople = people[0].sum;
                // table+='<td border="1">'+people[j].title+'</td>';
                // table+='<td>总数</td></tr><tr><td>人数</td>';
                // for(var j=0;j<people.length;j++){
                //     table+='<td>'+people[j].count+'</td>';
                // }
                // table+='<td>'+sumPeople+'</td></tr><tr><td>百分比</td>';
                // for(var j=0;j<people.length;j++){
                //     table+='<td>'+people[j].count/sumPeople*100+'%</td>';
                // }
                // table+='<td>100%</td></tr></table>';
                // staticalData.tableStr = table;
                sexChartData.columns = columns;
                sexChartData.rows = chartData;
                staticalData.chartData = sexChartData;
            }
        }
        console.log(this.deptReportInfo);
       
        // var tableHeader = [];
        // var tableData=[];
        // var tab
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
.table{
    width: 100%;
    bottom: 1px;
}
.reportTable{
    border-right: 1px solid black;
    border-bottom: 1px solid black;
}
.reportTable td{
    border-left: 1px solid black;
    border-top: 1px solid black;
}
</style>