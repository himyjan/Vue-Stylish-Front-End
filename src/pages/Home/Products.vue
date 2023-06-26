<script setup lang='ts'>
import { ref, watchEffect } from 'vue';
import { useUrlSearchParams } from '@vueuse/core';
import styled from '@magister_zito/vue3-styled-components';

import api from '../../utils/api';

import type { ProductDetailsData, ProductsSearch } from '../../types/productType';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 70px 0 46px;
  display: flex;
  flex-wrap: wrap;

  @media screen and (max-width: 1279px) {
    padding: 15px 21px 6px;
  }
`;

const Product = styled.a`
  width: calc((100% - 120px) / 3);
  margin: 0 20px 50px;
  flex-shrink: 0;
  text-decoration: none;

  @media screen and (max-width: 1279px) {
    width: calc((100% - 12px) / 2);
    margin: 0 3px 24px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  vertical-align: middle;
`;

const ProductColors = styled.div`
  margin-top: 20px;
  display: flex;

  @media screen and (max-width: 1279px) {
    margin-top: 8px;
  }
`;

const ProductColor = styled.div`
  width: 24px;
  height: 24px;
  box-shadow: 0px 0px 1px #bbbbbb;
  background-color: ${(props) => props.colorCode};

  @media screen and (max-width: 1279px) {
    width: 12px;
    height: 12px;
  }

  & + & {
    margin-left: 10px;

    @media screen and (max-width: 1279px) {
      margin-left: 6px;
    }
  }
`;

ProductColor.props = {
  colorCode: String,
};

const ProductTitle = styled.div`
  margin-top: 20px;
  font-size: 20px;
  letter-spacing: 4px;
  color: #3f3a3a;
  line-height: 24px;

  @media screen and (max-width: 1279px) {
    margin-top: 10px;
    font-size: 12px;
    letter-spacing: 2.4px;
    line-height: 14px;
  }
`;

const ProductPrice = styled.div`
  margin-top: 10px;
  font-size: 20px;
  letter-spacing: 4px;
  color: #3f3a3a;
  line-height: 24px;

  @media screen and (max-width: 1279px) {
    margin-top: 8px;
    font-size: 12px;
    letter-spacing: 2.4px;
    line-height: 14px;
  }
`;

// const Loading = styled(Circle)`
//   margin: 0 auto;
// `;

const products = ref<ProductDetailsData[]>([]);
const isLoading = ref(false);
const params = useUrlSearchParams('history')
const keyword = params.keyword;
const category = params.category ?? 'all';

watchEffect(() => {
  let nextPaging: number | undefined = 0;
  let isFetching = false;

  async function fetchProducts() {
    isFetching = true;
    isLoading.value = true;
    const response: ProductsSearch = keyword != undefined
      ? await api.searchProducts(keyword as string, nextPaging!)
      : await api.getProducts(category as string, nextPaging!);
    if (nextPaging === 0) {
      products.value = response.data;
    } else {
      products.value = [...products.value, ...response.data];
    }
    nextPaging = response.next_paging;
    isFetching = false;
    isLoading.value = false;
  }

  async function scrollHandler() {
    if (window.innerHeight + window.scrollY + 0.5 >= document.body.offsetHeight) {
      if (nextPaging === undefined) return;
      if (isFetching) return;

      fetchProducts();
    }
  }

  fetchProducts();

  window.addEventListener('scroll', scrollHandler);

  return () => {
    window.removeEventListener('scroll', scrollHandler);
  };
});
</script>

<template>
  <Wrapper>
    <Product :key="id" @click="$router.push(`/products/${id}`)"
      v-for="({ id, main_image, colors, title, price }) in products">
      <ProductImage :src="main_image" />
      <ProductColors>
        <ProductColor :colorCode="`#${code}`" :key="code" v-for="({ code }) in colors" />
      </ProductColors>
      <ProductTitle>{{ title }}</ProductTitle>
      <ProductPrice>TWD.{{ price }}</ProductPrice>
    </Product>
    <!-- <Loading type="spinningBubbles" color="#313538" v-if="isLoading" /> -->
  </Wrapper>
</template>

<style scoped></style>
