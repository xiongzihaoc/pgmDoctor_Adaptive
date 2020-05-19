<template>
  <div style="height:100%">
    <keep-alive>
      <component :is="currentView" v-on:jumpOutOrIn="toggle($event)"></component>
    </keep-alive>
  </div>
</template>
<script>
import InConsultation from "./InConsultation";
import OutConsultation from "./OutConsultation";
export default {
  components: { InConsultation, OutConsultation },
  data() {
    return {
      currentView: "InConsultation"
    };
  },
  methods: {
    toggle(info) {
      if (info == "jumpOut") {
        this.currentView = "OutConsultation";
      } else {
        this.currentView = "InConsultation";
      }
    }
  }
};
</script>
<style scoped>
</style>