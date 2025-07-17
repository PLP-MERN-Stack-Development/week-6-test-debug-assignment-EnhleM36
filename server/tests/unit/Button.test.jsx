import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../components/Button';

describe('Button Component', () => {
  const mockOnClick = jest.fn();
  const buttonText = 'Click Me';

  it('renders button with correct text', () => {
    render(<Button onClick={mockOnClick}>{buttonText}</Button>);
    expect(screen.getByText(buttonText)).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    render(<Button onClick={mockOnClick}>{buttonText}</Button>);
    fireEvent.click(screen.getByText(buttonText));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies disabled attribute when disabled prop is true', () => {
    render(
      <Button onClick={mockOnClick} disabled>
        {buttonText}
      </Button>
    );
    expect(screen.getByText(buttonText)).toBeDisabled();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-class';
    render(
      <Button onClick={mockOnClick} className={customClass}>
        {buttonText}
      </Button>
    );
    expect(screen.getByText(buttonText)).toHaveClass(customClass);
  });
});