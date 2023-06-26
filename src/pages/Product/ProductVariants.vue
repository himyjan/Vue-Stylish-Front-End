<script setup lang='ts'>
import { ref } from 'vue';
import styled from '@magister_zito/vue3-styled-components';

import add from './add.png';
import minus from './minus.png';
import { store } from '../../store/store';

import type { Color, ProductDetailsData } from '../../types/productType';
import { CartItem } from '../../types/cartItemType';

const Option = styled.div`
  display: flex;
  align-items: center;
  margin-top: 30px;
`;

const OptionName = styled.div`
  line-height: 24px;
  font-size: 20px;
  letter-spacing: 4px;
  color: #3f3a3a;

  @media screen and (max-width: 1279px) {
    line-height: 17px;
    font-size: 14px;
    letter-spacing: 2.8px;

    ${(props) => props.hideOnMobile && 'display: none;'}
  }
`;

OptionName.props = {
  hideOnMobile: Boolean,
};

const Color = styled.div`
  width: 36px;
  height: 36px;
  padding: 6px;
  border: 6px solid white;
  box-shadow: 0px 0px 1px #bbbbbb;
  cursor: pointer;
  margin-left: 21px;
  background-color: ${(props) => props.colorCode};
  ${(props) => props.isSelected && 'outline: 1px solid #979797;'}

  & + & {
    margin-left: 15px;
  }
`;

Color.props = {
  isSelected: Boolean,
  colorCode: String,
}

const Size = styled.div`
  width: 34px;
  height: 34px;
  background-color: ${(props) => (props.isSelected ? 'black' : '#ececec')};
  color: ${(props) => (props.isSelected ? 'white' : '#3f3a3a')};
  border-radius: 50%;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 22px;
  cursor: ${(props) => (props.isDisabled ? 'not-allowed' : 'pointer')};
  ${(props) => props.isDisabled && 'opacity: 0.25;'}

  & + & {
    margin-left: 20px;
  }
`;

Size.props = {
  isSelected: Boolean,
  isDisabled: Boolean,
}

const QuantitySelector = styled.div`
  margin-left: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 160px;
  height: 44px;
  padding: 0 10px;
  border: 1px solid #979797;
  font-size: 20px;

  @media screen and (max-width: 1279px) {
    margin-left: 0;
    width: 100%;
    padding: 0 30px;
  }
`;

const Quantity = styled.div`
  color: #8b572a;
`;

const Button = styled.div`
  cursor: pointer;
  background-size: contain;
  width: 16px;
  height: 16px;
`;

const DecrementButton = styled(Button)`
  background-image: url(${minus});
`;

const IncrementButton = styled(Button)`
  background-image: url(${add});
`;

const AddToCart = styled.button`
  width: 100%;
  height: 60px;
  margin-top: 29px;
  border: solid 1px #979797;
  background-color: black;
  font-size: 20px;
  letter-spacing: 4px;
  color: white;
  cursor: pointer;

  @media screen and (max-width: 1279px) {
    height: 44px;
    margin-top: 10px;
    font-size: 16px;
    letter-spacing: 3.2px;
    color: white;
  }
`;

const props = defineProps<{ product: ProductDetailsData }>();
const product = props.product;

const selectedColorCode = ref(product.colors[0].code);
const selectedSize = ref();
const quantity = ref(1);

function getStock(colorCode: string, size: string) {
  // @ts-ignore
  return product.variants.find(
    (variant) => variant.color_code === colorCode && variant.size === size
  ).stock;
}

function addToCart() {
  if (!selectedSize.value) {
    window.alert('請選擇尺寸');
    return;
  }

  const newCartItems: CartItem[] = [
    ...store.cartItems,
    {
      color: product.colors.find((color: Color) => color.code === selectedColorCode.value),
      id: product.id,
      image: product.main_image,
      name: product.title,
      price: product.price,
      qty: quantity.value,
      size: selectedSize.value,
      stock: getStock(selectedColorCode.value, selectedSize.value),
    },
  ] as CartItem[];
  store.setCartItem(newCartItems);
  window.localStorage.setItem('cartItems', JSON.stringify(newCartItems));
  window.alert('已加入商品');
}
</script>

<template>
  <Option>
    <OptionName hideOnMobile>顏色｜</OptionName>
    <Color :isSelected="(color.code === selectedColorCode)" :colorCode="`#${color.code}`" @click="() => {
      selectedColorCode = color.code;
      selectedSize = null;
      quantity = 1;
    }" v-for="(color) in product.colors" :key="color.code" />
  </Option>
  <Option>
    <OptionName hideOnMobile>尺寸｜</OptionName>
    <Size :isSelected="size === selectedSize" :isDisabled="(getStock(selectedColorCode, size) === 0)" @click="() => {
      if (getStock(selectedColorCode, size) === 0) return;
      selectedSize = size;
      if (getStock(selectedColorCode, size) < quantity) quantity = 1;
    }" v-for="(size) in product.sizes" :key="size">
      {{ size }}
    </Size>
  </Option>
  <Option>
    <OptionName hideOnMobile>數量｜</OptionName>
    <QuantitySelector>
      <DecrementButton @click="() => {
        if (!selectedSize || quantity === 1) return;
        quantity = quantity - 1;
      }" />
      <Quantity>{{ quantity }}</Quantity>
      <IncrementButton @click="() => {
        if (!selectedSize || quantity === getStock(selectedColorCode, selectedSize)) return;
        quantity = quantity + 1;
      }" />
    </QuantitySelector>
  </Option>
  <AddToCart @click="addToCart">
    {{ selectedSize ? '加入購物車' : '請選擇尺寸' }}
  </AddToCart>
</template>
