import React from 'react';
import { screen } from '@testing-library/react';
import App from './App';
import { render } from './testUtils';

test('renders app', () => {
  render(<App />);
  const linkElement = screen.getByTestId(/app-main/i);
  expect(linkElement).toBeInTheDocument();
});
