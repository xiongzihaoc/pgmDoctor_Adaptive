<template>
  <div style="height:100%">
    <!-- 动态切换组件 -->
    <keep-alive>
      <component :is="currentView" v-on:jumpTeam="toggle($event)"></component>
    </keep-alive>
  </div>
</template>
<script>
import perList from "../UserList/personageList";
import TeamList from "../UserList/teamList";
import AddNewPer from "../UserList/AddNewPer";
import AddNewTeam from "../UserList/AddNewTeam";
export default {
  components: { perList, TeamList, AddNewPer, AddNewTeam },
  data() {
    return {
      currentView: "perList"
    };
  },
  methods: {
    toggle(info) {
      if (info == "jumpTeam") {
        this.currentView = "TeamList";
      } else if (info == "jumpAddPer") {
        this.currentView = "AddNewPer";
      } else if (info == "jumpAddTeam") {
        this.currentView = "AddNewTeam";
      } else {
        this.currentView = "perList";
      }
    }
  }
};
</script>
<style scoped>
</style>