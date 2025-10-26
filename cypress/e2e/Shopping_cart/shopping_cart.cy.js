/**
 * Shopping Cart Flow Tests for Sauce Demo
 * Author: Marianela Belardinelli
 * 
 * En este archivo se validan los distintos escenarios del flujo del carrito de compras:
 * - Acceso al carrito y verificación de que esté vacío por defecto
 * - Agregado y visualización de productos en el carrito
 * - Eliminación de productos del carrito
 * - Retorno a la página de productos desde el carrito
 * - Redirección al checkout desde el carrito
 * - Restricción de acceso al checkout con el carrito vacío
 */
const userKeys = ['standard_user', 'problem_user', 'performance_glitch_user'];

  // Iteración sobre cada usuario para ejecutar los tests
  userKeys.forEach(userKey => {

    describe(`Tests de flujo de carrito de compras ejecutados como ${userKey}`, () => {

        //Se realiza login antes de cada test y se visita la página de productos
        beforeEach(() => {
        cy.fixture('users').then((users) => {
            cy.loginUI(users[userKey].username, users[userKey].password);
        });
        });
        
        afterEach(() => {
            cy.resetAppState();
        });
        
        // Tests de comportamiento del carrito vacío
        it('shopping cart can be accessed and is empty by default', () => {
            cy.get('.shopping_cart_link').click();
            cy.url().should('include', '/cart.html');
            cy.get('.cart_item').should('have.length', 0);

        })

        it('does not allow checkout with empty cart', () => {
            cy.get('.shopping_cart_link').click();
            cy.url().should('include', '/cart.html');
            cy.get('.checkout_button').click();
            cy.url().should('include', '/cart.html');
        }); 

       
        //Tests de agregar, visualizar y eliminar productos del carrito
        it('items added to the cart are displayed in the cart', () => {
            cy.get('.btn_inventory').first().click();
            cy.get('.shopping_cart_link').click();
            cy.url().should('include', '/cart.html');
            cy.get('.cart_item').should('have.length', 1);
        });

        it ('remove items from the cart', () => {
            cy.get('.btn_inventory').first().click();
            cy.get('.shopping_cart_link').click();
            cy.url().should('include', '/cart.html');
            cy.get('.cart_item').should('have.length', 1);
            cy.get('.cart_button').click();
            cy.get('.cart_item').should('have.length', 0);
        });

        // Retornos y redirecciones desde el carrito
        it ('returns to products page from cart', () => {
            cy.get('.shopping_cart_link').click();
            cy.url().should('include', '/cart.html');
            cy.get('.continue-shopping').click();
            cy.url().should('include', '/inventory.html');
        })

        it('redirects to checkout page', () => {
            cy.get('.btn_inventory').first().click();
            cy.get('.shopping_cart_link').click();
            cy.url().should('include', '/cart.html');
            cy.get('.checkout_button').click();
            cy.url().should('include', '/checkout-step-one.html');
        }); 

        
    });
});