import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

/**
 * Test that search UI renders.
 */
test('renders headline and search input', () => {
  render(<App />);
  expect(screen.getByText(/WeatherView/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/e.g., London or Japan/i)).toBeInTheDocument();
});

/**
 * Test that error is shown when submit with empty input.
 */
test('shows error if try to submit with empty input', () => {
  render(<App />);
  fireEvent.submit(screen.getByRole('button', { name: /get weather/i }).closest('form'));
  expect(screen.getByText(/please enter a city or country/i)).toBeInTheDocument();
});

/**
 * (Integration test for API is optional and environment-specific; omitted due to nature of live API requests)
 */
