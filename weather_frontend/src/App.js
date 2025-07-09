import React, { useState, useEffect } from 'react';
import './App.css';

// PUBLIC_INTERFACE
/**
 * Main Weather App using weatherapi.com for live weather data.
 * Allows input of city or country, displays current temperature in Celsius,
 * loading status, error feedback, and follows a modern/light design.
 */
function App() {
  // Theme toggle, defaults to 'light'
  const [theme, setTheme] = useState('light');
  // User input state
  const [query, setQuery] = useState('');
  // Weather data state
  const [temperature, setTemperature] = useState(null);
  // Show loading indicator during API call
  const [loading, setLoading] = useState(false);
  // Error feedback state
  const [error, setError] = useState(null);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  /**
   * Toggles the app's color theme between light and dark.
   */
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // PUBLIC_INTERFACE
  /**
   * Handles user input in the search field.
   */
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  // PUBLIC_INTERFACE
  /**
   * Fetches weather data from weatherapi.com for the supplied location.
   * @param {string} location - City or country entered by user.
   */
  const fetchWeather = async (location) => {
    setLoading(true);
    setError(null);
    setTemperature(null);
    // API details
    const API_KEY = '03378a93aa0f42a1bc962751250907';
    const endpoint = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(location)}&aqi=no`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        if (response.status === 400 || response.status === 404) {
          setError('Location not found. Please try another city or country.');
        } else {
          setError('Error fetching weather. Please try again later.');
        }
        setLoading(false);
        setTemperature(null);
        return;
      }
      const data = await response.json();
      if (data.error && data.error.message) {
        setError(data.error.message);
        setTemperature(null);
      } else if (data && data.current && typeof data.current.temp_c === 'number') {
        setTemperature({
          temp_c: data.current.temp_c,
          location: data.location.name,
          country: data.location.country,
        });
        setError(null);
      } else {
        setError('Unexpected response from weather service.');
        setTemperature(null);
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      setTemperature(null);
    }
    setLoading(false);
  };

  // PUBLIC_INTERFACE
  /**
   * Handles submit action from form (either button click or enter).
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a city or country.');
      setTemperature(null);
      return;
    }
    fetchWeather(query.trim());
  };

  return (
    <div className="App">
      <header className="App-header" style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <main style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
          <h1 style={{
            color: 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '2.4rem',
            marginBottom: '0.5em',
            marginTop: '0'
          }}>
            WeatherView
          </h1>
          <span style={{
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            marginBottom: '1.6rem',
            fontWeight: 400,
            letterSpacing: '0.01em'
          }}>
            Enter a city or country to view the current temperature.
          </span>
          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 340}}>
            <input
              type="text"
              placeholder="e.g., London or Japan"
              value={query}
              onChange={handleInputChange}
              style={{
                padding: '0.85em 1em',
                borderRadius: '10px',
                border: `1px solid var(--border-color)`,
                fontSize: '1rem',
                outline: 'none',
                width: '100%',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                marginBottom: '1em',
                transition: 'border-color .2s'
              }}
              aria-label="City or country"
              autoFocus
              disabled={loading}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.8em',
                borderRadius: '10px',
                border: 'none',
                background: 'var(--button-bg)',
                color: 'var(--button-text)',
                fontSize: '1em',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
              }}
              disabled={loading}
            >
              {loading ? 'Fetching...' : 'Get Weather'}
            </button>
          </form>
          <div style={{marginTop: '2em', minHeight: '60px', width: '100%', textAlign: 'center'}}>
            {loading && (
              <span style={{
                color: 'var(--text-secondary)',
                fontWeight: 500,
                fontSize: '1.08em'
              }}>
                Loading current weather...
              </span>
            )}
            {error && !loading && (
              <span style={{
                color: '#ff7043',
                fontWeight: 500,
                fontSize: '1.08em'
              }}>{error}</span>
            )}
            {!loading && temperature && (
              <div>
                <span style={{
                  display: 'block',
                  color: 'var(--text-primary)',
                  fontSize: '2.2rem',
                  fontWeight: 700,
                }}>
                  {temperature.temp_c}°C
                </span>
                <span style={{
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                  fontSize: '1.1em'
                }}>
                  {temperature.location}, {temperature.country}
                </span>
              </div>
            )}
          </div>
        </main>
        <footer style={{ position: 'absolute', bottom: '35px', left: 0, width: '100%', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
          Powered by <a href="https://www.weatherapi.com/" style={{color:'var(--text-secondary)', textDecoration:'none'}} rel="noopener noreferrer" target="_blank">WeatherAPI.com</a>
        </footer>
      </header>
    </div>
  );
}

export default App;
