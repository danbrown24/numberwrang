import React from 'react';
import { screen } from '@testing-library/react';
import Header from './Header';
import { render } from '../testUtils';

test('renders header', () => {
  render(<Header />);
  const linkElement = screen.getByText(/num/i);
  expect(linkElement).toBeInTheDocument();
});
