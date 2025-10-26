const userKeys = ['standard_user', 'problem_user', 'performance_glitch_user'];

  // Iteración sobre cada usuario para ejecutar los tests
  userKeys.forEach(userKey => {

    describe(`Tests de flujo de carrito de compras ejecutados como ${userKey}`, () => {

        //Se realiza login antes de cada test 
        beforeEach(() => {
        cy.fixture('users').then((users) => {
            cy.loginUI(users[userKey].username, users[userKey].password);
            });
        });
        
        //se comprueban funcionalidades del manu lateral
        it('returns to products page from All items button in menu', () => {
            cy.get('.shopping_cart_link').click();
            cy.url().should('include', '/cart.html');
            cy.get('.bm-burger-button').click();
            cy.get('#inventory_sidebar_link').click();
            cy.url().should('include', '/inventory.html');
        });

        it('redirects to About page from menu', () => {
            cy.get('.bm-burger-button').click();
            // solo verificamos el href, no visitamos el sitio externo
            cy.get('#about_sidebar_link').invoke('attr', 'href').should('include', 'saucelabs.com');
        });


        it('logs out succesfully', () =>{
            cy.get('.bm-burger-button').click();
            cy.get('#logout_sidebar_link').click();
            cy.url().should('include', '/');
            cy.get('#login-button').should('be.visible');
        })

        it('reset app state button should reset cart', () => {

            cy.get('.btn_inventory').first().click();
            cy.get('.shopping_cart_badge').should('contain', '1');
            
            cy.get('.bm-burger-button').click();
            cy.get('#reset_sidebar_link').click();

            cy.get('.shopping_cart_link').click({ force: true});
            cy.get('.cart_item').should('have.length', 0);
            });

        it('closes the menu when clicking the close button', () => {
            cy.get('.bm-burger-button').click();
            cy.contains('button', 'Close Menu').click();
            cy.get('#inventory_sidebar_link').should('not.be.visible'); 
        });

    });
})