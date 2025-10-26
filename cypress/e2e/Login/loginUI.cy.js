/**
 * Login flow tests for SauceDemo
 * Author: Marianela Belardinelli
 * 
 * En este archivo se validan los distintos escenarios del login:
 *  - Logins exitosos con diferentes usuarios válidos
 *  - Intento con usuario bloqueado
 *  - Campos vacíos y validaciones de error
 *  - Usuario inexistente
 * 
 */

describe('Login flow using UI', () => {
    let users;

    //Se cargan datos de usuario una vez antes de los tests
    before(() => {
        cy.fixture('users').then((data) => {
            users = data;
        });
    });
    //Se visita la página de login antes de cada test
    beforeEach(() => {
        cy.visit('/');
    });

    afterEach(() => {
        cy.resetAppState();
    });

   
    // Tests de logins exitosos con diferentes usuarios válidos

    //Se crean constantes para identificar los test por usuario
    const successfulUsers = [
        'standard_user',
        'problem_user',
        'performance_glitch_user'
    ];

    successfulUsers.forEach((userKey) => {
        it(`successful login with ${userKey}`, () => {
            const user = users[userKey];
            cy.loginUI(user.username, user.password);
            cy.get('#shopping_cart_container').should('be.visible');
        });
    });

    //Se valida tiempo de carga de login exitoso
    successfulUsers.forEach((userKey) => {
        it.only(`login is loaded correctly in less than 2 seconds for ${userKey}`, () => {
        const user = users[userKey];

        cy.then(() => {
            const startTime = Date.now();

            cy.loginUI(user.username, user.password);

            cy.get('#shopping_cart_container').should('be.visible');

            cy.then(() => {
            const loadTime = Date.now() - startTime;
            expect(loadTime, `Load time: ${loadTime}ms`).to.be.lessThan(2000);
            });
        });  
    });
    // Test de intento de login con usuario bloqueado
    it('login attempt with locked out user', () => {
        const user = users.locked_out_user;
        cy.loginUI(user.username, user.password);
        cy.get('[data-test="error"]').should('contain','locked out');
    });

    // Tests de intentos de login con campos vacíos
    const emptyFieldScenarios = [
        { user: '', pass: '', error: 'Username is required' },
        { user: 'user', pass: '', error: 'Password is required' },
        { user: '', pass: '1234', error: 'Username is required' }
    ];

    emptyFieldScenarios.forEach((scenario, index) => {
        it(`login attempt with empty fields scenario ${index + 1}`, () => {
            if (scenario.user) cy.get('[data-test="username"]').type(scenario.user);
            if (scenario.pass) cy.get('[data-test="password"]').type(scenario.pass);
            cy.get('#login-button').click();
            cy.get('[data-test="error"]').should('contain', scenario.error);
        });
    });

    // Test de intento de login con usuario inexistente
    it('login attempt with invalid user', () => {
        cy.loginUI('invalid_user', users.standard_user.password);
        cy.get('[data-test="error"]').should('be.visible');
    });
})
});