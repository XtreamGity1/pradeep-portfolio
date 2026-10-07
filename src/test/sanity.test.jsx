import { render, screen } from '@testing-library/react';
import Aurora from '../components/Aurora/Aurora';

test('test environment mocks WebGL components', () => {
  render(<Aurora />);
  expect(screen.getByTestId('aurora')).toBeInTheDocument();
});
