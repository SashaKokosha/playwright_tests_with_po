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

    async getAllProducts() {
        const count = await this.inventoryItems.count();
        const products = [];

        for (let i = 0; i < count; i++) {
            products.push(this.inventoryItems.nth(i));
        }

        return products;
    }

    async selectRandomProducts(count) {
        const allProducts = await this.inventoryItems.all();
        const shuffled = allProducts.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, count);
    }

    async getProductDetails(product) {
        const name = await product.locator('.inventory_item_name').textContent();
        const description = await product.locator('.inventory_item_desc').textContent();
        const price = await product.locator('.inventory_item_price').textContent();
        
        return { name, description, price };
    }
}
