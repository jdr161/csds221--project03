import { render, screen } from '@testing-library/react';
import HomePage from './pages/Homepage';

test('renders Homepage text', () => {
  render(<HomePage />);
  const textElement = screen.getByText(/This is the Homepage/i);
  expect(textElement).toBeInTheDocument();
});
