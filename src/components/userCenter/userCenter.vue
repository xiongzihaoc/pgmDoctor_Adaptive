<template>
  <div style="height:100%">
    <!-- 动态切换组件 -->
    <!-- <keep-alive> -->
      <component :is="currentView" v-on:jumpTeam="toggle($event)"></component>
    <!-- </keep-alive> -->
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