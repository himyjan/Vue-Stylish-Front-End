import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Home from './pages/Home/Home.vue'
import Product from './pages/Product/Product.vue'
import Checkout from './pages/Checkout/Checkout.vue'
import ThankYou from './pages/ThankYou/ThankYou.vue'
import Profile from './pages/Profile/Profile.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/products/:id', component: Product, props: true },
  { path: '/checkout', component: Checkout },
  { path: '/thankyou', component: ThankYou },
  { path: '/profile', component: Profile },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).mount('#app')
