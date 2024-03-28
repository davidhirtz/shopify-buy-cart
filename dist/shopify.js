// noinspection JSUnusedGlobalSymbols
// @ts-ignore
import Client from "shopify-buy/index.es.js";
export default class Shopify {
    constructor(config) {
        this.itemCount = 0;
        this.formatPrice = (price) => {
            return parseFloat(price.toString()).toLocaleString(this.language || undefined, { minimumFractionDigits: 2 });
        };
        const shopify = this;
        shopify.storageKey = 'shopifyCheckout';
        shopify.itemCount = 0;
        shopify.client = Client.buildClient(config);
        shopify.language = config.language || null;
        shopify.checkout = null;
        shopify.$cartCount = document.getElementById('cart-count');
        shopify.$cart = document.getElementById('cart');
        shopify.$items = document.getElementById('items');
        shopify.$subtotal = document.getElementById('subtotal');
        shopify.isLoadingClass = 'is-loading';
        shopify.isEmptyClass = 'is-empty';
        shopify.errorClass = 'cart-error';
        shopify.init();
    }
    init() {
        const shopify = this;
        if (localStorage.getItem(shopify.storageKey)) {
            shopify.client.checkout.fetch(localStorage.getItem(shopify.storageKey))
                .then((checkout) => shopify.initCheckout(checkout));
        }
        else {
            shopify.initCheckout();
        }
    }
    initCheckout(checkout) {
        this.updateCheckout(checkout);
    }
    updateCheckout(checkout) {
        const shopify = this;
        if (checkout && !checkout.completedAt) {
            shopify.checkout = checkout;
        }
        else {
            shopify.createCheckout();
        }
        shopify.updateItemCount();
        shopify.afterCheckoutUpdate();
    }
    createCheckout() {
        const shopify = this;
        shopify.client.checkout.create().then((checkout) => {
            localStorage.setItem(shopify.storageKey, checkout.id);
            shopify.checkout = checkout;
        });
    }
    updateItemCount() {
        const shopify = this;
        if (shopify.checkout) {
            const itemCount = shopify.checkout.lineItems.length;
            if (shopify.itemCount !== itemCount) {
                shopify.itemCount = itemCount;
                shopify.onItemCountChange();
            }
        }
    }
    afterCheckoutUpdate() {
        const shopify = this;
        shopify.$subtotal.innerHTML = shopify.checkout
            ? shopify.formatPrice(shopify.checkout.subtotalPrice.amount)
            : '';
        shopify.$cart.classList.remove(shopify.isLoadingClass);
    }
    onItemCountChange() {
        const shopify = this;
        const count = shopify.itemCount;
        shopify.$cart.classList[count > 0 ? 'remove' : 'add'](shopify.isEmptyClass);
        shopify.updateCartCount(count);
        shopify.render();
    }
    updateCartCount(count) {
        this.$cartCount.innerHTML = count.toString();
    }
    addLineItem(variantId, quantity = 1) {
        const shopify = this;
        shopify.$cart.classList.add(shopify.isLoadingClass);
        return shopify.client.checkout.addLineItems(shopify.checkout.id, [
            {
                variantId: btoa(`gid://shopify/ProductVariant/${variantId}`),
                quantity: quantity
            }
        ])
            .catch((error) => shopify.renderError(error))
            .then((checkout) => shopify.updateCheckout(checkout))
            .then(() => shopify.render());
    }
    updateLineItem(lineItemId, quantity) {
        const shopify = this;
        return shopify.client.checkout.updateLineItems(shopify.checkout.id, [
            {
                id: lineItemId,
                quantity: quantity
            }
        ])
            .catch((error) => shopify.renderError(error))
            .then((checkout) => shopify.updateCheckout(checkout));
    }
    removeLineItem(lineItemId) {
        const shopify = this;
        return shopify.client.checkout.removeLineItems(shopify.checkout.id, [lineItemId])
            .catch((error) => shopify.renderError(error))
            .then((checkout) => shopify.updateCheckout(checkout));
    }
    render() {
        const shopify = this;
        shopify.$items.innerHTML = '';
        for (let i = 0; i < shopify.checkout.lineItems.length; i++) {
            let item = shopify.checkout.lineItems[i];
            shopify.$items.innerHTML += shopify.renderItem(item);
        }
    }
    renderItem(item) {
        return this.renderItemTemplate({
            item: item,
        });
    }
    renderItemTemplate(params) {
        return new Function("return `" + this.itemTemplate + "`;").call(params);
    }
    renderError(error) {
        const shopify = this;
        const message = JSON.parse(error.message)[0].message || 'An unknown error occurred';
        shopify.$items.innerHTML = `<div class="${shopify.errorClass}">${message}</div>${shopify.$items.innerHTML}`;
    }
}
