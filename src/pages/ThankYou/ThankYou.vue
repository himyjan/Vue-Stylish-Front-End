<script setup lang='ts'>
import { useRouter } from 'vue-router';
import { useUrlSearchParams } from '@vueuse/core';
import styled from '@magister_zito/vue3-styled-components';

import type { state } from '../../types/stateType';

const Wrapper = styled.div`
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Title = styled.div`
  padding-bottom: 16px;
  border-bottom: 1px solid #979797;
  font-size: 24px;
  font-weight: bold;
`;

const Content = styled.div`
  margin-top: 24px;
`;

const BackButton = styled.button`
  margin-top: 24px;
`;

const params = useUrlSearchParams('history')
const state = params.category;
const router = useRouter();

if (!state) router.push('/');
</script>

<template>
  <Wrapper>
    <Title>感謝您的購買，我們會盡快將商品送達！</Title>
    <Content>請記住以下訂單編號，以便查詢</Content>
    <Content>{(state as state).orderNumber}</Content>
    <BackButton @click="() => $router.push('/')">繼續購物</BackButton>
  </Wrapper>
</template>

<style scoped></style>
