import { expect } from '@playwright/test';
import { test } from '../fixtures/base';
import { LoginPage } from '../pages/Login.page';
import { InventoryPage } from '../pages/Inventory.page';
import { ShoppingCartPage } from '../pages/ShoppingCart.page';
import { CheckoutPage } from '../pages/Checkout.page';

test.describe('Checkout Process', () => {
    test('should add multiple random products, checkout, and verify details', async (
        /** @type {{ app: import('../pages/Application').Application }} */{ app, page },
    ) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);
        const shoppingCartPage = new ShoppingCartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await loginPage.navigate();
        await app.login.performLogin('standard_user', 'secret_sauce');
        await expect(inventoryPage.headerTitle).toBeVisible();

        const randomProducts = await inventoryPage.selectRandomProducts(3);
        const selectedProductDetails = [];
        for (let i = 0; i < randomProducts.length; i++) {
            const productDetails = await inventoryPage.getProductDetails(randomProducts[i]);
            selectedProductDetails.push(productDetails);
            await inventoryPage.addItemToCartById(i);
        }

        await shoppingCartPage.navigate();

        await shoppingCartPage.page.locator('[data-test="checkout"]')?.click();

        await checkoutPage.fillCheckoutForm('John', 'Doe', '12345');
        await checkoutPage.continueButton.click();

        const checkoutProductDetails = await checkoutPage.getCheckoutProductsDetails();
        selectedProductDetails.forEach((product, index) => {
            expect(checkoutProductDetails[index]).toBe({
                name: product.name,
                description: product.description,
                price: product.price,
            });
        });

        const totalPrice = await checkoutPage.getTotalPrice();
        const calculatedTotal = selectedProductDetails.reduce((sum, product) => {
            return sum + parseFloat(product.price.replace('$', ''));
        }, 0);

        expect(parseFloat(totalPrice.replace('$', ''))).toBeCloseTo(calculatedTotal, 2);
    });
});
