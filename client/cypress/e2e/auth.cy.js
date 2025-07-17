describe('Authentication Flows', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should register a new user', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 201,
      body: {
        token: 'fake-jwt-token',
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
        },
      },
    }).as('registerRequest');

    cy.get('[data-testid="register-link"]').click();
    cy.get('[data-testid="name-input"]').type('Test User');
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="submit-button"]').click();

    cy.wait('@registerRequest').then((interception) => {
      expect(interception.request.body).to.deep.equal({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    });

    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="welcome-message"]').should('contain', 'Welcome, Test User');
  });

  it('should login an existing user', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
        },
      },
    }).as('loginRequest');

    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="submit-button"]').click();

    cy.wait('@loginRequest').then((interception) => {
      expect(interception.request.body).to.deep.equal({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="welcome-message"]').should('contain', 'Welcome, Test User');
  });

  it('should show error for invalid login', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 400,
      body: {
        error: 'Invalid credentials',
      },
    }).as('loginRequest');

    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="submit-button"]').click();

    cy.wait('@loginRequest');
    cy.get('[data-testid="error-message"]').should('contain', 'Invalid credentials');
  });
});