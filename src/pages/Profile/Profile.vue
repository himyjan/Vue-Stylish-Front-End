<script setup lang='ts'>
import { ref, watchEffect } from 'vue';
import styled from '@magister_zito/vue3-styled-components';

import api from '../../utils/api';
import getJwtToken from '../../utils/getJwtToken';

import type { profile } from '../../types/profileType';

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

const Photo = styled.img`
  margin-top: 24px;
`;

const Content = styled.div`
  margin-top: 24px;
`;

const LogoutButton = styled.button`
  margin-top: 24px;
`;

const profile = ref<profile>();
watchEffect(() => {
  async () => {
    let jwtToken = window.localStorage.getItem('jwtToken');

    if (!jwtToken) {
      try {
        jwtToken = await getJwtToken();
      } catch (e: unknown) {
        if (e instanceof Error) {
          window.alert(e.message);
        } else {
          window.alert('An unknown error occurred');
        }
        return;
      }
    }
    window.localStorage.setItem('jwtToken', jwtToken!);

    const { data } = await api.getProfile(jwtToken!);
    profile.value = data;
  }
});

const removeJwtToken = () => {
  window.localStorage.removeItem('jwtToken');
};
</script>

<template>
  <Wrapper>
    <Title>會員基本資訊</Title>
    <template v-if="profile">
      <Photo :src="profile.picture" />
      <Content>{{ profile.name }}</Content>
      <Content>{{ profile.email }}</Content>
      <LogoutButton @click="() => removeJwtToken">
        登出
      </LogoutButton>
    </template>
  </Wrapper>
</template>
