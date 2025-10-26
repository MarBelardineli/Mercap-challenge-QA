/**
 * Checkout flow tests for Sause Demo
 * Author: Marianela Belardinelli
 *  
 * En este archivo se validan los distintos escenarios del flujo de checkout:
 * - Completar los campos y avanzar al paso dos
 * - Validar campos vacíos en el paso uno
 * - Completar el checkout exitosamente
 * - Volver al carrito desde el paso uno
 * - Volver al inventario desde el paso dos
 */
const userKeys = ['standard_user', 'problem_user', 'performance_glitch_user'];

  // Iteración sobre cada usuario para ejecutar los tests
  userKeys.forEach(userKey => {

    describe(`Tests de flujo de carrito de compras ejecutados como ${userKey}`, () => {

        //Se realiza login antes de cada test y se llega al paso uno de checkout
        beforeEach(() => {
        cy.fixture('users').then((users) => {
            cy.loginUI(users[userKey].username, users[userKey].password);
            cy.get('.shopping_cart_link').click();
            cy.get('.checkout_button').click();
            cy.url().should('include', '/checkout-step-one.html');
            });
        });

        afterEach(() => {
            cy.resetAppState();
        });
        
        // Completar los campos y avanzar al paso dos
        it('completes information fiels in step one and proceeds to step two', () => {
            cy.get('[data-test="firstName"]').type('Juan');
            cy.get('[data-test="lastName"]').type('Pérez');
            cy.get('[data-test="postalCode"]').type('12345');
            cy.get('.cart_button').click();
            cy.url().should('include', '/checkout-step-two.html');
        }); 

        //Checkout exitoso       
        it('completes checkout successfully', ()=>{
            cy.get('[data-test="firstName"]').type('Juan');
            cy.get('[data-test="lastName"]').type('Pérez');
            cy.get('[data-test="postalCode"]').type('12345');
            cy.get('.cart_button').click();
            cy.url().should('include', '/checkout-step-two.html');
            cy.get('.cart_button').click();
            cy.url().should('include','/checkout-complete')
        })

        // Validar campos vacíos en el paso uno
        const emptyFieldScenarios = [
            { firstName: '', lastName: 'Perez',zip: '1234', error: 'First Name is required' },
            { firstName: 'Juan', lastName: '',zip: '1234', error: 'Last Name is required' },
            { firstName: 'Juan', lastName: 'Perez',zip: '', error: 'Postal Code is required' },
        ];

        emptyFieldScenarios.forEach((scenario, index) => {
            it(`attempts to continue to step 2 with empty fields scenario ${index + 1}`, () => {
                if (scenario.firstName) cy.get('[data-test="firstName"]').type(scenario.firstName);
                if (scenario.lastName) cy.get('[data-test="lastName"]').type(scenario.lastName);
                if(scenario.zip) cy.get('[data-test="postalCode"]').type(scenario.zip)
                cy.get('.cart_button').click();
                cy.get('[data-test="error"]').should('contain', scenario.error);
            });
        });
        
        

        // Retornos desde los distintos pasos del checkout
        it('returns to cart when clicking cancel btn from step one', () =>{
            cy.get('.cart_cancel_link').click();
            cy.url().should('include', '/cart')
         })
        it('returns to inventory when clicking cancel btn from step two',()=>{
            cy.get('[data-test="firstName"]').type('Juan');
            cy.get('[data-test="lastName"]').type('Pérez');
            cy.get('[data-test="postalCode"]').type('12345');
            cy.get('.cart_button').click();
            cy.url().should('include', '/checkout-step-two.html');
            cy.get('.cart_cancel_link').click();
            cy.url().should('include','/inventory' )
        })
    });
})