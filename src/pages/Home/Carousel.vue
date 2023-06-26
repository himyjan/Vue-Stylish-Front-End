<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import styled from '@magister_zito/vue3-styled-components';

import api from '../../utils/api';

import type { CarouselDetails } from '../../types/marketingType';

const Wrapper = styled.div`
  height: 500px;
  position: relative;

  @media screen and (max-width: 1279px) {
    height: 185px;
  }
`;


const Campaign = styled.a`
  width: 100%;
  height: 100%;
  position: absolute;
  background-size: cover;
  background-position: center;
  background-image: url(${(props) => props.backgroundImageUrl});
  opacity: ${(props) => (props.isActive ? 1 : 0)};
  ${(props) => props.isActive && 'z-index: 1;'}
  transition: opacity 1s;
  text-decoration: none;
  color: #070707;
`;

Campaign.props = {
  backgroundImageUrl: String,
  isActive: Boolean,
};

const Story = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 166px;
  padding-left: 47px;
  font-weight: 100;

  @media screen and (max-width: 1279px) {
    padding-top: 30px;
    padding-left: 23px;
  }
`;

const StoryContent = styled.div`
  font-size: 30px;
  white-space: pre;
  line-height: 57px;

  @media screen and (max-width: 1279px) {
    font-size: 15px;
    line-height: 28px;
  }
`;

const StoryTitle = styled.div`
  font-size: 20px;
  line-height: 64px;
  @media screen and (max-width: 1279px) {
    font-size: 10px;
    line-height: 32px;
  }
`;

const Dots = styled.div`
  position: absolute;
  bottom: 34px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  z-index: 2;

  @media screen and (max-width: 1279px) {
    bottom: 18px;
  }
`;


const Dot = styled.div`
  width: 10px;
  height: 10px;
  background-color: ${(props) => (props.isActive ? '#8b572a' : 'white')};
  border-radius: 50%;
  cursor: pointer;
  margin-left: 22px;

  @media screen and (max-width: 1279px) {
    width: 4px;
    height: 4px;
    background-color: ${(props) => (props.isActive ? '#8b572a' : 'white')};
    margin-left: 8.8px;
  }
`;

Dot.props = {
  isActive: Boolean,
};

const campaigns = ref<CarouselDetails[]>([]);
const activeCampaignIndex = ref<number>(0);
const intervalRef = ref<number>();

watchEffect(async () => {
  const { data } = await api.getCampaigns();
  campaigns.value = data;
  intervalRef.value = window.setInterval(() => {
    activeCampaignIndex.value = activeCampaignIndex.value === data.length - 1 ? 0 : activeCampaignIndex.value + 1
  }, 5000);
})

const clickDot = (index: number, intervalRef: number | undefined, activeCampaignIndex: number, campaigns: string | any[]) => {
  activeCampaignIndex = index;
  window.clearInterval(intervalRef);
  intervalRef = window.setInterval(() => {
    activeCampaignIndex =
      activeCampaignIndex === campaigns.length - 1 ? 0 : activeCampaignIndex + 1
  }, 5000);
}
</script>

<template>
  <Wrapper>
    <Campaign :isActive="index === activeCampaignIndex" :backgroundImageUrl="picture" :key="index"
      @click="$router.push(`/products/${product_id}`)" v-for="({ picture, product_id, story }, index) in campaigns">
      <Story>
        <StoryContent>
          {{ story.split('\r\n').slice(0, 3).join('\r\n') }}
        </StoryContent>
        <StoryTitle>{{ story.split('\r\n')[3] }}</StoryTitle>
      </Story>
    </Campaign>
    <Dots>
      <Dot :isActive="(index === activeCampaignIndex)" :key="index" @click="() => clickDot"
        v-for="(_, index) in campaigns" />
    </Dots>
  </Wrapper>
</template>

<style scoped></style>
