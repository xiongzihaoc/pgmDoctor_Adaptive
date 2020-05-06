<template>
  <div style="height:100%">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 动态切换组件 -->
    <component :is="currentView" v-on:jumpTeam="toggle($event)"></component>
  </div>
</template>
<script>
import perPro from "./progress/personagePro";
import TeamPro from "./progress/teamPro";
export default {
  components: { perPro, TeamPro },
  data() {
    return {
      currentView: "perPro"
    };
  },
  methods: {
    toggle(info) {
      if (info == "jumpTeam") {
        this.currentView = "TeamPro";
      } else {
        this.currentView = "perPro";
      }
    }
  }
};
</script>
<style scoped>
</style>