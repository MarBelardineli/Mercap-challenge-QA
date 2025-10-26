/* 
Product flow tests- multi user
Autor: Marianela Belardinelli

En este archivo se valida el flujo principal de Productos, 
ejecutando los mismos escenarios bajo distintos usuarios

Se valida que los distintos usuarios puedan visusalizar, filtrar, ordenar
y manipular los productos. 
*/
describe('Product flow tests - multi user', () => {

  const userKeys = ['standard_user', 'problem_user', 'performance_glitch_user'];

  // Iteración sobre cada usuario para ejecutar los tests
  userKeys.forEach(userKey => {

    describe(`Tests ejecutados como ${userKey}`, () => {

        //Se realiza login antes de cada test y se visita la página de productos
        beforeEach(() => {
        cy.fixture('users').then((users) => {
            cy.loginUI(users[userKey].username, users[userKey].password);
        });
        });

        afterEach(() => {
            cy.resetAppState();
        });
       
        // Tests de carga de productos, visibilidad de elementos y tiempo de carga
        it('products load correctly within 2 seconds', () => {
           const startTime = Date.now();

            cy.get('.inventory_item').should('have.length.at.least', 1)
            .then(() => {
                const endTime = Date.now();
                const loadTime = endTime - startTime;
                expect(loadTime, `Product load time: ${loadTime}ms`).to.be.lessThan(2000);
            });
                });

        it('each product has name, img and price visibles', () => {
            cy.get('.inventory_item').each(($item) => {
            cy.wrap($item).find('.inventory_item_name').should('be.visible');
            cy.wrap($item).find('.inventory_item_img').should('be.visible');
            cy.wrap($item).find('.inventory_item_price').should('be.visible');
            });
        });

        // Tests de agregar y quitar productos del carrito
        it('add and remove product', () => {
            cy.get('.btn_inventory').first().click();
            cy.get('.shopping_cart_badge').should('contain', '1');
            cy.get('.btn_inventory').first().contains('REMOVE').click();
            cy.get('.shopping_cart_badge').should('not.exist');
        });

        it('should add and remove product from detail view', () => {
            cy.get('.inventory_item_name').first().click();
            cy.url().should('include', '/inventory-item.html');
            cy.get('.inventory_details_name').should('be.visible');
            cy.get('.inventory_details_price').should('be.visible');
            cy.get('.btn_inventory').click();
            cy.get('.shopping_cart_badge').should('contain', '1');
            cy.get('.btn_inventory').should('contain', 'REMOVE').click();
            cy.get('.shopping_cart_badge').should('not.exist');
            cy.get('.inventory_details_back_button').click({ force: true });
            cy.get('.product_label').should('be.visible');
        });

        it('cart icon updates when multiple products are added', () => {
            cy.get('.btn_inventory').eq(0).click();
            cy.get('.btn_inventory').eq(1).click();
            cy.get('.shopping_cart_badge').should('contain', '2');
        });

        //Tests de filtros
        it('filters exists', () => {
            cy.get('.product_sort_container')
            .should('be.visible')
            .children()
            .should('have.length', 4);
        });

        it('should sort products alphabetically A-Z', () => {
            cy.get('.product_sort_container').select('Name (A to Z)');
            cy.get('.inventory_item_name').then(($items) => {
            const names = [...$items].map(i => i.innerText.trim());
            const sorted = [...names].sort((a, b) => a.localeCompare(b));
            expect(names).to.deep.equal(sorted);
            });
        });

        it('should sort products alphabetically Z-A', () => {
            cy.get('.product_sort_container').select('Name (Z to A)');
            cy.get('.inventory_item_name').then(($items) => {
            const names = [...$items].map(i => i.innerText.trim());
            const sorted = [...names].sort((a, b) => b.localeCompare(a));
            expect(names).to.deep.equal(sorted);
            });
        });

        it('should sort products by price low to high', () => {
            cy.get('.product_sort_container').select('Price (low to high)');
            cy.get('.inventory_item_price').then(($prices) => {
            const prices = [...$prices].map(p => parseFloat(p.innerText.replace('$', '')));
            const sorted = [...prices].sort((a, b) => a - b);
            expect(prices).to.deep.equal(sorted);
            });
        });

        it('should sort products by price high to low', () => {
            cy.get('.product_sort_container').select('Price (high to low)');
            cy.get('.inventory_item_price').then(($prices) => {
            const prices = [...$prices].map(p => parseFloat(p.innerText.replace('$', '')));
            const sorted = [...prices].sort((a, b) => b - a);
            expect(prices).to.deep.equal(sorted);
        });
      });
    });
  });
});


