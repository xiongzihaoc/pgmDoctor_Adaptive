<template>
  <div>
    <div class="content" v-html="mess" >
      
    </div>
    
  </div>
</template>
<script>
export default {
  data() {
    return {
      mess: `<div class="content_box"><h5 class="title" style="white-space: normal; box-sizing: border-box; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); font-family: &quot;Microsoft YaHei&quot;; line-height: 1.1; color: rgb(50, 50, 50); margin: 0px; font-size: 16px; padding: 0px;">
    &nbsp; 一、应对饮食问题
</h5>
<div class="content" style="white-space: normal; box-sizing: border-box; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); border: 1px dashed rgb(0, 122, 255); padding: 10px; border-radius: 5px; margin-top: 20px; color: rgb(50, 50, 50); font-family: &quot;Microsoft YaHei&quot;; font-size: 15px;">
&nbsp;&nbsp;&nbsp;&nbsp;<img class="checkimg" src="http://zykj-resource.oss-cn-hangzhou.aliyuncs.com/image/20190723/0rO0ZSsR.png" style="box-sizing: border-box; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); border: none; vertical-align: top; width: 10px; height: 10px; margin-top: 5px; margin-right: 5px;"/>家长应该鼓励孩子养成良好的坐姿。如果您的孩子不喜欢和别人坐得很近，您可以允许孩子有自己的空间。<br/>&nbsp;&nbsp;&nbsp;&nbsp;<img class="checkimg" src="http://zykj-resource.oss-cn-hangzhou.aliyuncs.com/image/20190723/0rO0ZSsR.png" style="box-sizing: border-box; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); border: none; vertical-align: top; width: 10px; height: 10px; margin-top: 5px; margin-right: 5px;"/>鲜亮的颜色往往会吸引孩子的注意力，所有您可以给孩子选择颜色鲜亮的桌垫，并且允许他（她）在吃饭的时候使用。<br/>&nbsp;&nbsp;&nbsp;&nbsp;<img class="checkimg" src="http://zykj-resource.oss-cn-hangzhou.aliyuncs.com/image/20190723/0rO0ZSsR.png" style="box-sizing: border-box; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); border: none; vertical-align: top; width: 10px; height: 10px; margin-top: 5px; margin-right: 5px;"/>当孩子拒绝吃饭或者不愿意坐下吃饭时，您不要有激烈的反应，不断示范正确的做法给孩子看。当他（她）照做的时候马上予以奖励。<br/>&nbsp;&nbsp;&nbsp;&nbsp;<img class="checkimg" src="http://zykj-resource.oss-cn-hangzhou.aliyuncs.com/image/20190723/0rO0ZSsR.png" style="box-sizing: border-box; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); border: none; vertical-align: top; width: 10px; height: 10px; margin-top: 5px; margin-right: 5px;"/>循序渐进地让孩子尝试少量的新食物。<br/>&nbsp;&nbsp;&nbsp;&nbsp;<img class="checkimg" src="http://zykj-resource.oss-cn-hangzhou.aliyuncs.com/image/20190723/0rO0ZSsR.png" style="box-sizing: border-box; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); border: none; vertical-align: top; width: 10px; height: 10px; margin-top: 5px; margin-right: 5px;"/>用讲故事和图片来帮助孩子建立起用餐具吃饭的概念，即使孩子有时不注意听，您也要继续讲下去。<br/>&nbsp;&nbsp;&nbsp;&nbsp;<img class="checkimg" src="http://zykj-resource.oss-cn-hangzhou.aliyuncs.com/image/20190723/0rO0ZSsR.png" style="box-sizing: border-box; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); border: none; vertical-align: top; width: 10px; height: 10px; margin-top: 5px; margin-right: 5px;"/>一般有孤独症的孩子不喜欢吃包馅的东西，因此最好不要把食物混合起来烧，应该分开放在每个盘子里。
</div></div>`,
    };
  },
  methods: {
    delete_box() {
      console.log(333);
      this.$nextTick(() => {
        console.log(444);
        // var ccc =  document.getElementsByClassName('content_box')
      });
    },
  },
  mounted() {
    // this.$nextTick(() => {
    //   console.log(555);
      
    //   // document.getElementsByClassName('content_box').on('keyup')
    // });
  },
  watch:{

  },
};
</script>
<style scoped></style>
