import { createWebHistory, createRouter } from "vue-router";

const routers = [
    { path: '/', name: '', component: () => import('@/pages/Home.vue') },
    { path: '/login', name: 'home', component: () => import('@/pages/Login.vue') },
]

export const router = createRouter({
    history: createWebHistory(),
    routes: routers,
});