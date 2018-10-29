// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import '@/assets/style/simple-grid-modify.css';
import '../static/font/iconfont.css';
import '@/assets/style/color.less';
import '@/assets/style/reset.less';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import VueApollo from 'vue-apollo';
Vue.config.productionTip = false;

/* eslint-disable no-new */

const httpLink = new HttpLink({
    // 你需要在这里使用绝对路径
    uri: 'http://localhost:4000/graphql',
});

// 创建 apollo 客户端
const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    connectToDevTools: true,
});

const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
});

// Install the vue plugin
Vue.use(VueApollo);

new Vue({
    el: '#app',
    router,
    apolloProvider,
    template: '<App/>',
    components: { App }
});
