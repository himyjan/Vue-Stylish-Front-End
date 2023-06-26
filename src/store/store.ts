
import { reactive } from 'vue';
import type { CartItem } from '../types/cartItemType';

export const store = reactive<{ cartItems: CartItem[], setCartItem(cartItems: CartItem[]): void }>({
  cartItems: JSON.parse(window.localStorage.getItem('cartItems') ?? '[]') ?? [],
  setCartItem(cartItems: CartItem[]) {
    this.cartItems = cartItems
  }
});