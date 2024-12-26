import { BaseSwagLabPage } from './BaseSwagLab.page';

export class InventoryPage extends BaseSwagLabPage {
    url = '/inventory.html';

    headerTitle = this.page.locator('.title');

    inventoryItems = this.page.locator('.inventory_item');

    addItemToCartButton = this.page.locator('[id^="add-to-cart"]');

    itemNames = this.page.locator('.inventory_item_name');

    prices = this.page.locator('.inventory_item_price');

    async sortBy(sortOption) {
        await this.page.locator('[data-test="product-sort-container"]').selectOption(sortOption);
    }

    async getItemNames() {
        return this.itemNames.allTextContents();
    }

    async getPrices() {
        return this.prices.allTextContents();
    }

    async addItemToCartById(id) {
        await this.addItemToCartButton.nth(id).click();
    }
}
