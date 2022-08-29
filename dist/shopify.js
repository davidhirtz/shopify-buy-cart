// @ts-ignore
import Client from "shopify-buy/index.es.js";
export default class Shopify {
    constructor(config) {
        this.itemCount = 0;
        this.storageKey = 'shopifyCheckout';
        this.afterCartUpdate = () => {
        };
        this.onItemCountChange = () => {
        };
        this.formatPrice = (price) => {
            return parseFloat(price).toLocaleString(this.language || undefined, { minimumFractionDigits: 2 });
        };
        const shopify = this;
        shopify.storageKey = 'shopifyCheckout';
        shopify.itemCount = 0;
        shopify.client = Client.buildClient(config);
        shopify.language = config.language || null;
        shopify.cart = null;
        shopify.init();
    }
    init() {
        const cart = this;
        if (localStorage.getItem(cart.storageKey)) {
            cart.client.checkout.fetch(localStorage.getItem(cart.storageKey))
                .then(cart.updateCart);
        }
        else {
            cart.updateCart();
        }
    }
    updateCart(cart) {
        const shopify = this;
        if (cart) {
            shopify.cart = cart;
        }
        else {
            shopify.createCheckout();
        }
        shopify.updateItemCount();
        shopify.afterCartUpdate();
    }
    createCheckout() {
        const shopify = this;
        shopify.client.checkout.create().then(function (cart) {
            localStorage.setItem(shopify.storageKey, cart.id);
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
    addLineItem(variantId, quantity = 1) {
        const shopify = this;
        return shopify.client.checkout.addLineItems(shopify.cart.id, [
            {
                variantId: btoa(`gid://shopify/ProductVariant/${variantId}`),
                quantity: quantity
            }
        ]).then(shopify.updateCart);
    }
    updateLineItem(lineItemId, quantity) {
        const shopify = this;
        return shopify.client.checkout.updateLineItems(shopify.cart.id, [
            {
                id: lineItemId,
                quantity: quantity
            }
        ]).then(shopify.updateCart);
    }
    removeLineItem(lineItemId) {
        const shopify = this;
        return shopify.client.checkout.removeLineItems(shopify.cart.id, [lineItemId])
            .then(shopify.updateCart);
    }
}
