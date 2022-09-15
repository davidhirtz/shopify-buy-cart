// noinspection JSUnusedGlobalSymbols
// @ts-ignore
import Client from "shopify-buy/index.es.js";
export default class Shopify {
    constructor(config) {
        this.itemCount = 0;
        this.afterCartUpdate = () => {
            const shopify = this;
            shopify.$subtotal.innerHTML = shopify.formatPrice(shopify.cart.subtotalPrice);
            shopify.$cart.classList.remove(shopify.cartIsLoadingClass);
        };
        this.onItemCountChange = () => {
            const shopify = this;
            const count = shopify.itemCount;
            shopify.$cart.classList[count > 0 ? 'remove' : 'add'](shopify.cartIsEmptyClass);
            shopify.$cartCount.innerHTML = count.toString();
            shopify.render();
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
        shopify.$cartCount = document.getElementById('cart-count');
        shopify.$cart = document.getElementById('cart');
        shopify.$items = document.getElementById('items');
        shopify.$subtotal = document.getElementById('subtotal');
        shopify.cartIsLoadingClass = 'is-loading';
        shopify.cartIsEmptyClass = 'is-empty';
        shopify.init();
    }
    init() {
        const shopify = this;
        if (localStorage.getItem(shopify.storageKey)) {
            shopify.client.checkout.fetch(localStorage.getItem(shopify.storageKey))
                .then((cart) => shopify.updateCart(cart));
        }
        else {
            shopify.updateCart();
        }
    }
    updateCart(cart) {
        const shopify = this;
        if (cart && !cart.completedAt) {
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
        shopify.$cart.classList.add(shopify.cartIsLoadingClass);
        return shopify.client.checkout.addLineItems(shopify.cart.id, [
            {
                variantId: btoa(`gid://shopify/ProductVariant/${variantId}`),
                quantity: quantity
            }
        ])
            .then((cart) => shopify.updateCart(cart))
            .then(() => shopify.render());
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
    render() {
        const shopify = this;
        shopify.$items.innerHTML = '';
        for (let i = 0; i < shopify.cart.lineItems.length; i++) {
            let item = shopify.cart.lineItems[i];
            shopify.$items.innerHTML += shopify.renderItem(item);
        }
    }
    renderItem(item) {
        return '';
    }
}
