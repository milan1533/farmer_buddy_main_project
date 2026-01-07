import React, { useEffect, useMemo, useState } from 'react';

const Weather = () => {
  const [coords, setCoords] = useState({ lat: null, lon: null });
  const [place, setPlace] = useState('');
  const [placeDetails, setPlaceDetails] = useState({ city: '', area: '', state: '', country: '' });
  const [days, setDays] = useState(7); // 7 or 14
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [current, setCurrent] = useState(null);
  const [daily, setDaily] = useState([]);
  const [hourly, setHourly] = useState({ time: [], temp: [], wind: [], rh: [], pop: [], code: [] });
  const [hourTab, setHourTab] = useState('temp'); // temp|wind|precip|humidity

  // Get user location
  useEffect(() => {
    if (!navigator?.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lon: longitude });
        // reverse geocode (Open-Meteo geocoding)
        try {
          const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=en`);
          const gj = await geo.json();
          const label = gj?.results?.[0];
          if (label) {
            const city = label.name || '';
            const area = label.admin2 || label.locality || label.timezone || '';
            const state = label.admin1 || '';
            const country = label.country || '';
            setPlace(`${city}, ${state || country}`);
            setPlaceDetails({ city, area, state, country });
          }
        } catch (e) {
          console.warn('Reverse geocoding failed', e);
        }
      },
      () => setError('Location permission denied. You can still view forecast after allowing location.'),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  const apiUrl = useMemo(() => {
    if (coords.lat == null || coords.lon == null) return null;
    const base = 'https://api.open-meteo.com/v1/forecast';
    const params = new URLSearchParams({
      latitude: String(coords.lat),
      longitude: String(coords.lon),
      current: 'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m',
      hourly: 'temperature_2m,precipitation_probability,relative_humidity_2m,wind_speed_10m,weather_code',
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max',
      timezone: 'auto',
      forecast_days: String(days),
    });
    return `${base}?${params.toString()}`;
  }, [coords, days]);

  // Fetch weather when coords/days change
  useEffect(() => {
    const run = async () => {
      if (!apiUrl) return;
      setLoading(true);
      setError('');
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Failed to fetch weather');
        const data = await res.json();
        setCurrent(data.current);
        const rows = (data.daily?.time || []).map((t, i) => ({
          date: t,
          tmax: data.daily.temperature_2m_max?.[i],
          tmin: data.daily.temperature_2m_min?.[i],
          rain: data.daily.precipitation_sum?.[i],
          windMax: data.daily.wind_speed_10m_max?.[i],
        }));
        setDaily(rows);
        // Hourly series (limit next 12 entries)
        const hTimes = data.hourly?.time || [];
        const startIdx = 0; // already from now in Open-Meteo response when using current time
        const slice = (arr) => (arr || []).slice(startIdx, startIdx + 12);
        setHourly({
          time: slice(hTimes),
          temp: slice(data.hourly?.temperature_2m),
          wind: slice(data.hourly?.wind_speed_10m),
          rh: slice(data.hourly?.relative_humidity_2m),
          pop: slice(data.hourly?.precipitation_probability),
          code: slice(data.hourly?.weather_code),
        });
      } catch (e) {
        setError(e.message || 'Could not load weather');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [apiUrl]);

  // helpers
  const formatHour = (iso) => new Date(iso).toLocaleTimeString([], { hour: 'numeric' });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <main className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-xl font-semibold tracking-wide">Weather.</div>
          <div className="flex-1 max-w-2xl mx-6 hidden md:flex items-center bg-white/10 backdrop-blur rounded-full border border-white/10">
            <input className="flex-1 bg-transparent px-5 py-3 text-sm placeholder-white/60 focus:outline-none" placeholder="Search area here..." />
            <button className="px-4 py-2 bg-white text-slate-900 rounded-full m-1 text-sm">Search</button>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-white/80 px-3 py-2 bg-white/10 rounded-full border border-white/10">
              {place ? `${placeDetails.city}${placeDetails.state ? ', ' + placeDetails.state : ''}` : (coords.lat ? `${coords.lat.toFixed(2)}, ${coords.lon.toFixed(2)}` : 'Detecting...')}
            </div>
            <div className="w-9 h-9 rounded-full bg-white/20" />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-400/30 text-red-200 text-sm">{error}</div>
        )}
        {loading && (
          <div className="mb-4 p-3 rounded-lg bg-white/10 border border-white/10 text-white/80 text-sm">Loading weather…</div>
        )}

        {/* Top: Today */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2 bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="text-teal-300 font-semibold">Today's Weather Forecast</div>
            <div className="text-sm text-white/70 mt-1">{new Date().toLocaleString()}</div>
            {placeDetails.city && (
              <div className="text-white/80 mt-2 text-sm">Location: {placeDetails.city}{placeDetails.area ? `, ${placeDetails.area}` : ''}{placeDetails.state ? `, ${placeDetails.state}` : ''}{placeDetails.country ? `, ${placeDetails.country}` : ''}</div>
            )}
            <div className="mt-6 flex items-start gap-8">
              <div>
                <div className="text-6xl font-bold">{current ? Math.round(current.temperature_2m) : '—'}<span className="text-3xl align-top">°C</span></div>
                <div className="text-white/70 mt-1">Feels {current ? Math.round(current.temperature_2m) : '—'}°C</div>
              </div>
              <div className="ml-auto flex items-center gap-4">
                <div className="text-5xl">🌧️</div>
                <div className="text-sm">
                  <div className="text-white/90 font-semibold">{current ? 'Thundershower' : '—'}</div>
                  <div className="text-white/70">Precipitation: {current ? (hourly.pop[0] ?? 0) : 0}%</div>
                  <div className="text-white/70">Humidity: {current ? current.relative_humidity_2m : '—'}%</div>
                  <div className="text-white/70">Wind: {current ? current.wind_speed_10m : '—'} km/h</div>
                </div>
              </div>
            </div>

            {/* Hourly timeline */}
            <div className="mt-6">
              <div className="flex items-center gap-4 text-sm">
                <button onClick={()=>setHourTab('temp')} className={`pb-2 ${hourTab==='temp' ? 'text-white border-b-2 border-teal-400' : 'text-white/60'}`}>Temperature</button>
                <button onClick={()=>setHourTab('wind')} className={`pb-2 ${hourTab==='wind' ? 'text-white border-b-2 border-teal-400' : 'text-white/60'}`}>Wind</button>
                <button onClick={()=>setHourTab('precip')} className={`pb-2 ${hourTab==='precip' ? 'text-white border-b-2 border-teal-400' : 'text-white/60'}`}>Precipitation</button>
                <button onClick={()=>setHourTab('humidity')} className={`pb-2 ${hourTab==='humidity' ? 'text-white border-b-2 border-teal-400' : 'text-white/60'}`}>Humidity</button>
              </div>
              <div className="mt-4 bg-white/5 rounded-2xl border border-white/10 p-4 overflow-x-auto">
                <div className="grid grid-cols-12 min-w-[720px] gap-4">
                  {hourly.time.map((t, i) => (
                    <div key={t} className="text-center">
                      <div className="text-xs text-white/70">{formatHour(t)}</div>
                      <div className="my-3 text-2xl">{hourly.code[i] === 0 ? '☀️' : '🌧️'}</div>
                      <div className="text-sm font-medium">
                        {hourTab==='temp' && `${Math.round(hourly.temp[i])}°`}
                        {hourTab==='wind' && `${Math.round(hourly.wind[i])} km/h`}
                        {hourTab==='precip' && `${hourly.pop[i] ?? 0}%`}
                        {hourTab==='humidity' && `${hourly.rh[i]}%`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right summary card */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="text-xl font-semibold mb-4">Overview</div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between"><span className="text-white/70">Precipitation</span><span>{current ? (hourly.pop[0] ?? 0) : 0}%</span></div>
              <div className="flex items-center justify-between"><span className="text-white/70">Humidity</span><span>{current ? current.relative_humidity_2m : '—'}%</span></div>
              <div className="flex items-center justify-between"><span className="text-white/70">Wind</span><span>{current ? current.wind_speed_10m : '—'} km/h</span></div>
              <div className="flex items-center justify-between"><span className="text-white/70">Rain today</span><span>{daily[0]?.rain ?? 0} mm</span></div>
            </div>
            <div className="mt-6">
              <label className="text-white/70 text-xs">Forecast range</label>
              <select className="mt-1 w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm" value={days} onChange={(e)=>setDays(Number(e.target.value))}>
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Weekly Forecast */}
        <div className="mt-10">
          <div className="text-lg font-semibold text-teal-300 mb-4">Weekly Forecast</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-4">
            {daily.map((d) => (
              <div key={d.date} className="bg-white/5 rounded-2xl border border-white/10 p-4">
                <div className="text-white/70 text-sm">{new Date(d.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="text-3xl">🌧️</div>
                  <div>
                    <div className="text-lg font-semibold">{Math.round(d.tmax)}° / {Math.round(d.tmin)}°</div>
                    <div className="text-xs text-white/70">Wind: {Math.round(d.windMax ?? 0)} km/h</div>
                    <div className="text-xs text-white/70">Rain: {d.rain ?? 0} mm</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Weather;





