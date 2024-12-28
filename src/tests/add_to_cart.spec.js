import { test } from '../fixtures/base';
import { InventoryPage } from '../pages/Inventory.page';
import { ShoppingCartPage } from '../pages/ShoppingCart.page';
import { expect } from '@playwright/test';

test('Add random products to cart and verify details', async ({ app, page }) => {
    const inventoryPage = new InventoryPage(page);
    const shoppingCartPage = new ShoppingCartPage(page);

    await app.login.navigate();
    await app.login.performLogin('standard_user', 'secret_sauce');
    await inventoryPage.navigate();

    const products = await inventoryPage.getAllProducts();
    const randomProducts = await inventoryPage.selectRandomProducts(3);

    console.log('Randomly selected products:', randomProducts);

    const inventoryDetails = [];

    for (const product of randomProducts) {
        const productDetails = await inventoryPage.getProductDetails(product);
        console.log('Product details to add to cart:', productDetails);
        inventoryDetails.push(productDetails);

        const productIndex = products.indexOf(product);
        await inventoryPage.addItemToCartById(productIndex);
    }

    await app.shoppingCart.navigate();
    const cartDetails = await shoppingCartPage.getCartDetails();

    console.log('Cart details:', cartDetails);

    const formatProductDetails = (details) => {
        return {
            name: details.name.trim(),
            description: (details.description || '').trim(),
            price: details.price.trim(),
        };
    };

    const formattedInventoryDetails = inventoryDetails.map(formatProductDetails);
    const formattedCartDetails = cartDetails.map(formatProductDetails);

    formattedInventoryDetails.sort((a, b) => a.name.localeCompare(b.name));
    formattedCartDetails.sort((a, b) => a.name.localeCompare(b.name));

    console.log('Sorted inventory details:', formattedInventoryDetails);
    console.log('Sorted cart details:', formattedCartDetails);

    expect(formattedCartDetails).toEqual(formattedInventoryDetails);
});