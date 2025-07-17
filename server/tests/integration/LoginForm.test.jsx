import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import LoginForm from '../../components/LoginForm';
import { AuthProvider } from '../../context/AuthContext';

const server = setupServer(
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { email, password } = req.body;
    if (email === 'test@example.com' && password === 'password123') {
      return res(
        ctx.json({
          token: 'fake-jwt-token',
          user: { id: '1', name: 'Test User', email: 'test@example.com' },
        })
      );
    }
    return res(ctx.status(400), ctx.json({ error: 'Invalid credentials' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('LoginForm Integration Test', () => {
  it('should successfully login with valid credentials', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    userEvent.type(screen.getByLabelText(/password/i), 'password123');
    userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();
    });
  });

  it('should show error message with invalid credentials', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');
    userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});