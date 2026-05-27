import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders release link', () => {
  render(<App />);
  const linkElement = screen.getByText(/vREPLACE_WITH_RELEASE/i);
  expect(linkElement).toBeInTheDocument();
});
