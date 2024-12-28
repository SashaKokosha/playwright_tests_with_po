import { BaseSwagLabPage } from './BaseSwagLab.page';

export class ShoppingCartPage extends BaseSwagLabPage {
    url = '/cart.html';

    cartItemSelector = '.cart_item';

    removeItemSelector = '[id^="remove"]';

    headerTitle = this.page.locator('.title');

    cartItems = this.page.locator(this.cartItemSelector);

    itemNames = this.page.locator('.inventory_item_name');
    itemDescriptions = this.page.locator('.inventory_item_desc');
    itemPrices = this.page.locator('.inventory_item_price'); 

    async getCartItemByName(name) {
        return this.page.locator(this.cartItemSelector, { hasText: name });
    }

    async removeCartItemByName(name) {
        const item = await this.getCartItemByName(name);
        return item.locator(this.removeItemSelector);
    }

    async removeCartItemById(id) {
        await this.cartItems.nth(id).locator(this.removeItemSelector).click();
    }

    async getCartDetails() {
        const itemNames = await this.itemNames.allTextContents();
        const itemDescriptions = await this.itemDescriptions.allTextContents();
        const itemPrices = await this.itemPrices.allTextContents();

        return itemNames.map((name, index) => ({
            name,
            description: itemDescriptions[index],
            price: itemPrices[index]
        }));
    }
}
