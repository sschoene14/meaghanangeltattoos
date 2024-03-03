/* eslint-disable */ 
import {createRouter, createWebHashHistory} from 'vue-router';

const routes= [
	{
		path: '/',
        name:'landing',
		component: () => import('./pages/Landing.vue')
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('./pages/Login.vue')
	}
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
	scrollBehavior () {
        return { left: 0, top: 0 };
    }
});

export default router;