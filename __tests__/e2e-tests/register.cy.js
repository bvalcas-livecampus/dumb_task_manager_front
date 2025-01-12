describe('Registration Page', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should display registration form with all fields', () => {
    cy.get('#username').should('exist');
    cy.get('#email').should('exist');
    cy.get('#password').should('exist');
    cy.contains('button', 'Register').should('exist');
  });

  it('should show validation errors for empty required fields', () => {
    cy.contains('button', 'Register').click();
    cy.get('#username').should('have.attr', 'required');
    cy.get('#email').should('have.attr', 'required');
    cy.get('#password').should('have.attr', 'required');
  });

  it('should navigate to login page when clicking login link', () => {
    cy.contains('button', 'Login here').click();
    cy.url().should('include', '/login');
  });

  it('should handle successful registration', () => {
    const testUser = {
      username: `testuser${Date.now()}`,
      email: `testuser${Date.now()}@example.com`,
      password: 'testpassword123'
    };

    cy.intercept('POST', '/register', {
      statusCode: 200,
      body: { code: 200, message: 'Registration successful' }
    }).as('registerRequest');

    cy.get('#username').type(testUser.username);
    cy.get('#email').type(testUser.email);
    cy.get('#password').type(testUser.password);
    cy.contains('button', 'Register').click();

    cy.wait('@registerRequest');
    cy.contains('Registration successful').should('be.visible');
    cy.url().should('include', '/login', { timeout: 3000 });
  });

  it('should handle registration error', () => {
    cy.intercept('POST', '/register', {
      statusCode: 400,
      body: { code: 400, message: 'Username already exists' }
    }).as('registerError');

    cy.get('#username').type('existinguser');
    cy.get('#email').type('existing@example.com');
    cy.get('#password').type('password123');
    cy.contains('button', 'Register').click();

    cy.wait('@registerError');
    cy.contains('Username already exists').should('be.visible');
    cy.url().should('include', '/register');
  });
});
