<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
  </div>
</template>

<script>
export default {
    name: 'app'
};
</script>

<style lang="less">
#app {
        font-family: "Microsoft YaHei"; //, 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        padding-bottom: 60px;
    }
    .bili-header-m .bili-wrapper {
        width: 1040px !important;
    }
    .input-group {
        font: 12px "Helvetica Neue", Helvetica, Arial, "Microsoft Yahei";
    }
    @media only screen and (min-width: 90em) {
        .bili-header-m .bili-wrapper {
            width: 1250px !important;
        }
    }
</style>
