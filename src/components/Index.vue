<template>
  <div style="height:100%">
    <!-- 动态切换组件 -->
    <keep-alive>
      <component :is="currentView" v-on:jumpTeam="toggle($event)"></component>
    </keep-alive>
  </div>
</template>
<script>
import perPro from "./progress/personagePro";
import TeamPro from "./progress/teamPro";
export default {
  components: { perPro, TeamPro },
  data() {
    return {
      currentView: "TeamPro"
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