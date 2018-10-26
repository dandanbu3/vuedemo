import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Song from '@/components/Song';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/hello',
            name: 'HelloWorld',
            component: HelloWorld
        },
        {
            path: '/song',
            name: 'Song',
            component: Song
        }
    ]
});
