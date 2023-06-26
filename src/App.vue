<script setup lang="ts">
import { injectGlobal } from '@magister_zito/vue3-styled-components';

import Footer from './components/Footer/Footer.vue';
import Header from './components/Header/Header.vue';
import { store } from './store/store';

injectGlobal`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Noto Sans TC', sans-serif;
  }

  #app {
    min-height: 100vh;
    padding: 140px 0 115px;
    position: relative;

    @media screen and (max-width: 1279px) {
      padding: 102px 0 208px;
    }
  }
`;
</script>

<template>
  <Header :cartItems="store.cartItems" />
  <router-view :key="$route.fullPath" />
  <Footer />
</template>

<style scoped></style>
