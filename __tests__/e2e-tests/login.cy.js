describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('displays the login form with all elements', () => {
    cy.get('h1').should('contain', 'Sign In')
    cy.get('input[name="username"]').should('exist')
    cy.get('input[name="password"]').should('exist')
    cy.get('button[type="submit"]').should('contain', 'Sign In')
    cy.contains('Don\'t have an account?').should('exist')
    cy.contains('Register here').should('exist')
  })

  it('toggles password visibility', () => {
    cy.get('input[name="password"]').should('have.attr', 'type', 'password')
    cy.get('button[aria-label="toggle password visibility"]').click()
    cy.get('input[name="password"]').should('have.attr', 'type', 'text')
  })

  it('navigates to register page when clicking register link', () => {
    cy.contains('Register here').click()
    cy.url().should('include', '/register')
  })

  it('shows error message with invalid credentials', () => {
    cy.get('input[name="username"]').type('wronguser')
    cy.get('input[name="password"]').type('wrongpass')
    cy.get('button[type="submit"]').click()
    cy.get('.MuiAlert-root').should('be.visible')
  })

  it('successfully logs in with valid credentials', () => {
    // You'll need to mock this or use a test account
    cy.get('input[name="username"]').type('valcasara')
    cy.get('input[name="password"]').type('^AUtYihk1n7nw%*rEE')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })
})
