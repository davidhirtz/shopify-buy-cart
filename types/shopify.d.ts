/// <reference types="shopify-buy" />
import Client, { Cart } from "shopify-buy/index.es.js";
export default class Shopify {
    cart: Cart;
    client: Client;
    itemCount: number;
    language: string;
    storageKey: string;
    $cartCount: HTMLElement;
    shopify: HTMLElement;
    $items: HTMLElement;
    cartIsLoadingClass: string;
    cartIsEmptyClass: string;
    errorClass: string;
    $subtotal: HTMLElement;
    $cart: HTMLElement;
    constructor(config: ShopifyBuy.Config);
    init(): void;
    updateCart(cart?: any): void;
    createCheckout(): void;
    updateItemCount(): void;
    afterCartUpdate: () => void;
    onItemCountChange: () => void;
    addLineItem(variantId: any, quantity?: number): any;
    updateLineItem(lineItemId: any, quantity: any): any;
    removeLineItem(lineItemId: any): any;
    render(): void;
    renderItem(item: any): string;
    renderError(error: Error): void;
    formatPrice: (price: any) => string;
}
