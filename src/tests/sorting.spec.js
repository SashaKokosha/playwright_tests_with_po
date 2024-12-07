import { test, expect } from '../fixtures/base';
import { InventoryPage } from '../pages/Inventory.page';

const sortBy = async (sortOption, page) => {
    const sortContainer = page.locator('[data-test="product-sort-container"]');
    await sortContainer.selectOption(sortOption);
};

test.describe('Inventory sorting', () => {
    const sortingOptions = [
        { value: 'az', description: 'Sort by name: A to Z' },
        { value: 'za', description: 'Sort by name: Z to A' },
        { value: 'lohi', description: 'Sort by price: low to high' },
        { value: 'hilo', description: 'Sort by price: high to low' },
    ];

    for (const { value, description } of sortingOptions) {
        test(description, async ({ app, page }) => {
            const inventoryPage = new InventoryPage(page);

            await app.login.navigate();
            await app.login.performLogin('standard_user', 'secret_sauce');

            await inventoryPage.sortBy(value);

            if (value === 'az' || value === 'za') {
                const itemNames = await inventoryPage.getItemNames();
                const isSorted =
                    value === 'az'
                        ? itemNames.every((name, i) => i === 0 || name.localeCompare(itemNames[i - 1]) >= 0)
                        : itemNames.every((name, i) => i === 0 || name.localeCompare(itemNames[i - 1]) <= 0);
                expect(isSorted).toBeTruthy();
            } else {
                // Validate price sorting
                const prices = await inventoryPage.getPrices();
                const numericPrices = prices.map(price => parseFloat(price.replace('$', '')));
                const isSorted =
                    value === 'lohi'
                        ? numericPrices.every((price, i) => i === 0 || price >= numericPrices[i - 1])
                        : numericPrices.every((price, i) => i === 0 || price <= numericPrices[i - 1]);
                expect(isSorted).toBeTruthy();
            }
        });
    }
});
