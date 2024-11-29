import { expect } from '@playwright/test';
import { test } from '../fixtures/base';
import { LoginPage } from '../pages/Login.page';

test.describe('Saucedemo app basic tests', () => {
    test('should login successfully', async (
        /** @type {{ app: import('../pages/Application').Application }} */{ app, page },
    ) => {
        const login = new LoginPage(page);
        await login.navigate ();
        await app.login.navigate();
        await app.login.performLogin('standard_user', 'secret_sauce');

        await expect(app.inventory.headerTitle).toBeVisible();

        expect(await app.inventory.inventoryItems.count()).toBeGreaterThanOrEqual(1);
    });

    test('should add and remove product from the cart', async (
        /** @type {{ app: import('../pages/Application').Application }} */{ app },
    ) => {
        await app.login.navigate();
        await app.login.performLogin('standard_user', 'secret_sauce');
        await app.inventory.addItemToCartById(0);
        expect(await app.inventory.getNumberOfItemsInCart()).toBe('1');

        await app.inventory.shoppingCart.click();
        expect(await app.shoppingCart.cartItems.count()).toBeGreaterThanOrEqual(1);

        await app.shoppingCart.removeCartItemById(0);
        await expect(app.shoppingCart.cartItems).not.toBeAttached();
    });
});
