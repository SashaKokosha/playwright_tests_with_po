import { BaseSwagLabPage } from './BaseSwagLab.page';

export class CheckoutPage extends BaseSwagLabPage {
    url = '/checkout-step-one.html';

    firstNameInput = this.page.locator('[data-test="firstName"]');
    lastNameInput = this.page.locator('[data-test="lastName"]');
    zipCodeInput = this.page.locator('[data-test="postalCode"]');
    continueButton = this.page.locator('[data-test="continue"]');
    
    checkoutItemNames = this.page.locator('.cart_item .inventory_item_name');
    checkoutItemDescriptions = this.page.locator('.cart_item .inventory_item_desc');
    checkoutItemPrices = this.page.locator('.cart_item .inventory_item_price');

    totalPrice = this.page.locator('.summary_total_label');

    async fillCheckoutForm(firstName, lastName, zipCode) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.zipCodeInput.fill(zipCode);
    }

    async getCheckoutProductsDetails() {
        const names = await this.checkoutItemNames.allTextContents();
        const descriptions = await this.checkoutItemDescriptions.allTextContents();
        const prices = await this.checkoutItemPrices.allTextContents();

        return names.map((name, index) => ({
            name,
            description: descriptions[index],
            price: prices[index]
        }));
    }

    async getTotalPrice() {
        return await this.totalPrice.textContent();
    }
}
