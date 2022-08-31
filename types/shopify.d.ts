/// <reference types="shopify-buy" />
export default class Shopify {
    cart: ShopifyBuy.Cart;
    client: ShopifyBuy.Client;
    itemCount: number;
    language: string;
    storageKey: string;
    $cartCount: HTMLElement;
    shopify: HTMLElement;
    $items: HTMLElement;
    cartIsLoadingClass: string;
    cartIsEmptyClass: string;
    $subtotal: HTMLElement;
    $cart: HTMLElement;
    constructor(config: ShopifyBuy.Config);
    init(): void;
    updateCart(cart?: any): void;
    createCheckout(): void;
    updateItemCount(): void;
    afterCartUpdate: () => void;
    onItemCountChange: () => void;
    addLineItem(variantId: any, quantity?: number): Promise<void>;
    updateLineItem(lineItemId: any, quantity: any): Promise<void>;
    removeLineItem(lineItemId: any): Promise<void>;
    render(): void;
    renderItem(item: any): string;
    formatPrice: (price: any) => string;
}
