import Client from "shopify-buy/index.es.js";
import * as ShopifyBuy from "shopify-buy";
export default class Shopify {
    $cart: HTMLElement;
    $cartCount: HTMLElement;
    $items: HTMLElement;
    $subtotal: HTMLElement;
    checkout: ShopifyBuy.Checkout;
    client: Client;
    errorClass: string;
    isEmptyClass: string;
    isLoadingClass: string;
    itemCount: number;
    itemTemplate: string;
    language: string;
    shopify: HTMLElement;
    storageKey: string;
    constructor(config: ShopifyBuy.Config);
    init(): void;
    initCheckout(checkout?: ShopifyBuy.Checkout): void;
    updateCheckout(checkout?: ShopifyBuy.Checkout): void;
    createCheckout(): void;
    updateItemCount(): void;
    afterCheckoutUpdate(): void;
    onItemCountChange(): void;
    updateCartCount(count: number): void;
    addLineItem(variantId: ShopifyBuy.ID, quantity?: number): any;
    updateLineItem(lineItemId: ShopifyBuy.ID, quantity: number): any;
    removeLineItem(lineItemId: ShopifyBuy.ID): any;
    render(): void;
    renderItem(item: ShopifyBuy.CheckoutLineItem): string;
    renderItemTemplate(params: object): any;
    renderError(error: Error): void;
    formatPrice: (price: number) => string;
}
//# sourceMappingURL=shopify.d.ts.map