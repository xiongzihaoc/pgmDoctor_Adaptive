<template>
  <div style="height:100%">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>用户中心</el-breadcrumb-item>
      <el-breadcrumb-item style="font-weight:700;">个人列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 动态切换组件 -->
    <component :is="currentView" v-on:jumpTeam="toggle($event)"></component>
  </div>
</template>
<script>
import perList from "../UserList/personageList";
import TeamList from "../UserList/teamList";
export default {
  components: { perList, TeamList },
  data() {
    return {
      currentView: "perList"
    };
  },
  methods: {
    toggle(info) {
      if (info == "jumpTeam") {
        this.currentView = "TeamList";
      } else {
        this.currentView = "perList";
      }
    }
  }
};
</script>
<style scoped>
</style>