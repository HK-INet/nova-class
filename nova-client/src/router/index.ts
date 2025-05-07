import { createWebHistory, createRouter } from "vue-router";

const routers = [
    { path: '/', name: 'index', component: () => import('@/pages/Index.vue') },
    { path: '/home', name: 'home', component: () => import('@/pages/Home.vue') },
    { path: '/login', name: 'login', component: () => import('@/pages/Login.vue') },
]

export const router = createRouter({
    history: createWebHistory(),
    routes: routers,
});