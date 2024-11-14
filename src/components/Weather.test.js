import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Weather from './Weather';

// Mock the fetch function to avoid hitting the real API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        main: {
          humidity: 70,
          temp: 298.15,
        },
        wind: {
          speed: 5,
        },
        weather: [
          {
            icon: '01d',
            description: 'clear sky',
          },
        ],
        name: 'Lagos',
      }),
  })
);

describe('Weather Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders the weather data when the API call is successful', async () => {
    render(<Weather />);

    // Check loading state first
    expect(screen.getByText(/loading weather data/i)).toBeInTheDocument();

    // Wait for the weather data to be displayed
    await waitFor(() => screen.getByText(/Lagos/i)); // Location name
    expect(screen.getByText(/Lagos/i)).toBeInTheDocument();
    expect(screen.getByText(/25°C/i)).toBeInTheDocument(); // Temp in °C
    expect(screen.getByText(/70%/i)).toBeInTheDocument(); // Humidity
    expect(screen.getByText(/5 m\/s/i)).toBeInTheDocument(); // Wind speed
    expect(screen.getByAltText(/clear sky/i)).toBeInTheDocument(); // Weather icon
  });

  it('shows an error message when the API fails', async () => {
    
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'City not found' }),
      })
    );

    render(<Weather />);

    await waitFor(() => screen.getByText(/loading weather data/i)); 

    
    expect(screen.getByText(/City not found/i)).toBeInTheDocument();
  });

  it('calls search function when user clicks on search icon', async () => {
    render(<Weather />);

    
    const inputElement = screen.getByPlaceholderText(/search/i);
    const searchIcon = screen.getByAltText(/search icon/i); 

    
    fireEvent.change(inputElement, { target: { value: 'New York' } });

    
    fireEvent.click(searchIcon);

    
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('q=New York')
    );
  });

  it('shows an alert if no city is entered', () => {
   
    window.alert = jest.fn();

    render(<Weather />);

   
    const searchIcon = screen.getByAltText(/search icon/i);
    fireEvent.click(searchIcon);

    
    expect(window.alert).toHaveBeenCalledWith('Enter City Name');
  });
});
