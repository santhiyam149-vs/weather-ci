import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';

describe('Weather Forecast Dashboard', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // TEST 1: SEARCH BOX
  test('renders the city input and search button, allowing user input', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByRole('textbox', { name: /search city/i });
    expect(input).toBeInTheDocument();
    expect(input).toBeVisible();

    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toBeInTheDocument();
    expect(searchButton).toBeVisible();

    await user.type(input, 'Tokyo');
    expect(input).toHaveValue('Tokyo');
  });

  // TEST 2: INVALID CITY
  test('displays an error message when searching for an invalid city', async () => {
    const user = userEvent.setup();

    // Mock geocoding API to return no matching results
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    });

    render(<App />);

    const input = screen.getByRole('textbox', { name: /search city/i });
    const searchButton = screen.getByRole('button', { name: /search/i });

    await user.type(input, 'NonExistentCityXYZ123');
    await user.click(searchButton);

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(/city not found\. please try another city\./i);
  });

  // TEST 3: TEMPERATURE DISPLAY
  test('displays correct city name, temperature, and weather details on successful search', async () => {
    const user = userEvent.setup();

    // Mock successful geocoding response
    const mockGeoData = {
      results: [
        {
          name: 'London',
          country: 'United Kingdom',
          latitude: 51.5074,
          longitude: -0.1278,
        },
      ],
    };

    // Mock successful weather API response
    const mockWeatherData = {
      current: {
        temperature_2m: 18.5,
        apparent_temperature: 17.2,
        relative_humidity_2m: 68,
        wind_speed_10m: 14.2,
        weather_code: 1, // 'Partly cloudy'
      },
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockGeoData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherData,
      });

    render(<App />);

    const input = screen.getByRole('textbox', { name: /search city/i });
    const searchButton = screen.getByRole('button', { name: /search/i });

    await user.type(input, 'London');
    await user.click(searchButton);

    // Verify city name and country heading
    const cityHeading = await screen.findByRole('heading', { level: 2 });
    expect(cityHeading).toHaveTextContent('London, United Kingdom');

    // Verify temperature
    expect(screen.getByText('18.5°C')).toBeInTheDocument();

    // Verify weather condition
    expect(screen.getByText('Partly cloudy')).toBeInTheDocument();

    // Verify additional weather details
    expect(screen.getByText('17.2°C')).toBeInTheDocument(); // feels like
    expect(screen.getByText('68%')).toBeInTheDocument(); // humidity
    expect(screen.getByText('14.2 km/h')).toBeInTheDocument(); // wind speed

    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  // ADDITIONAL TEST: EMPTY INPUT VALIDATION
  test('displays validation error when submitting with an empty city name', async () => {
    const user = userEvent.setup();
    render(<App />);

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent(/please enter a city name\./i);
  });

  // ADDITIONAL TEST: NETWORK ERROR HANDLING
  test('displays an error message when the geocoding service network request fails', async () => {
    const user = userEvent.setup();

    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(
      new Error('Unable to connect to the weather service.')
    );

    render(<App />);

    const input = screen.getByRole('textbox', { name: /search city/i });
    const searchButton = screen.getByRole('button', { name: /search/i });

    await user.type(input, 'Paris');
    await user.click(searchButton);

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent(/unable to connect to the weather service\./i);
  });
});
