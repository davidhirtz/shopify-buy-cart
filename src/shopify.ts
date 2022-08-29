// noinspection JSUnusedGlobalSymbols
// @ts-ignore
import Client from "shopify-buy/index.es.js";

export default class Shopify {
    cart: ShopifyBuy.Cart;
    client: ShopifyBuy.Client;
    itemCount: number = 0;
    language: string;
    storageKey: string = 'shopifyCheckout';

    constructor(config: ShopifyBuy.Config) {
        const shopify = this;

        shopify.storageKey = 'shopifyCheckout';
        shopify.itemCount = 0;

        shopify.client = Client.buildClient(config);
        shopify.language = config.language || null;
        shopify.cart = null;

        shopify.init();
    }

    init() {
        const shopify = this;

        if (localStorage.getItem(shopify.storageKey)) {
            shopify.client.checkout.fetch(localStorage.getItem(shopify.storageKey))
                .then((cart) => shopify.updateCart(cart));
        } else {
            shopify.updateCart();
        }
    }

    updateCart(cart?) {
        const shopify = this;

        if (cart) {
            shopify.cart = cart;
        } else {
            shopify.createCheckout();
        }

        shopify.updateItemCount();
        shopify.afterCartUpdate();
    }

    createCheckout() {
        const shopify = this;

        shopify.client.checkout.create().then(function (cart) {
            localStorage.setItem(shopify.storageKey, cart.id as string);
            shopify.cart = cart;
        });
    }

    updateItemCount() {
        const shopify = this;

        if (shopify.cart) {
            const itemCount = shopify.cart.lineItems.length;

            if (shopify.itemCount !== itemCount) {
                shopify.itemCount = itemCount;
                shopify.onItemCountChange();
            }
        }
    }

    afterCartUpdate = () => {
    }

    onItemCountChange = () => {
    }

    addLineItem(variantId, quantity = 1) {
        const shopify = this;

        return shopify.client.checkout.addLineItems(shopify.cart.id, [
            {
                variantId: btoa(`gid://shopify/ProductVariant/${variantId}`),
                quantity: quantity
            }
        ]).then((cart) => shopify.updateCart(cart));
    }

    updateLineItem(lineItemId, quantity) {
        const shopify = this;

        return shopify.client.checkout.updateLineItems(shopify.cart.id, [
            {
                id: lineItemId,
                quantity: quantity
            }
        ]).then((cart) => shopify.updateCart(cart));
    }

    removeLineItem(lineItemId) {
        const shopify = this;

        return shopify.client.checkout.removeLineItems(shopify.cart.id, [lineItemId])
            .then((cart) => shopify.updateCart(cart));
    }

    formatPrice = (price) => {
        return parseFloat(price).toLocaleString(this.language || undefined, {minimumFractionDigits: 2})
    }
}