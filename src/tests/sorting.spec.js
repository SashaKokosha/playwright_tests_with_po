import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Login.page';
import { InventoryPage } from '../pages/Inventory.page';
import { ShoppingCartPage } from '../pages/ShoppingCart.page';

test('Perform and verify sorting on the Inventory page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // Логін
    await page.goto('https://www.saucedemo.com/');
    await loginPage.performLogin('standard_user', 'secret_sauce');

    // Перевірка, що ми на сторінці Inventory
    expect(await inventoryPage.headerTitle.textContent()).toBe('Products');

    // Виконати сортування (наприклад, за ціною)
    const sortDropdown = page.locator('.product_sort_container');
    await sortDropdown.selectOption('lohi'); // сортування за ціною (low to high)

    // Отримати всі ціни після сортування
    const prices = await page.locator('.inventory_item_price').allTextContents();
    const sortedPrices = [...prices].sort((a, b) => parseFloat(a) - parseFloat(b));

    // Перевірка: ціни мають бути відсортовані
    expect(prices).toEqual(sortedPrices);
});
