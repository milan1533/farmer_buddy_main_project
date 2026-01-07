import React, { useState, useEffect } from 'react';

const languages = [
  { code: 'gu', label: 'Gujarati' },
  { code: 'hi', label: 'Hindi' },
  { code: 'en', label: 'English' },
  { code: 'ta', label: 'Tamil' },
  { code: 'te', label: 'Telugu' },
  { code: 'kn', label: 'Kannada' },
  { code: 'ml', label: 'Malayalam' },
];

function LanguageSwitcher() {
  const [selected, setSelected] = useState('en');

  useEffect(() => {
    // Try to infer from cookie
    const match = document.cookie.match(/(?:^|; )googtrans=([^;]+)/);
    if (match) {
      const code = match[1].split('/').pop();
      if (languages.some(l => l.code === code)) setSelected(code);
    }
  }, []);

  const applyGoogleTranslate = (lang) => {
    const cookieVal = `/auto/${lang}`;
    document.cookie = `googtrans=${cookieVal}; path=/;`;
    document.cookie = `googtrans=${cookieVal}; domain=${window.location.hostname}; path=/;`;

    // If the Google combo exists, change it and dispatch change
    const combo = document.querySelector('select.goog-te-combo');
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event('change'));
      return;
    }
    // Fallback: reload so the script picks up the cookie
    window.location.reload();
  };

  const onChange = (e) => {
    const lang = e.target.value;
    setSelected(lang);
    applyGoogleTranslate(lang);
  };

  return (
    <fieldset className="text-sm" aria-label="Choose language">
      <legend className="mb-2 font-medium">Choose language</legend>
      <ul className="space-y-1">
        {languages.map((lng) => (
          <li key={lng.code}>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="site-language"
                value={lng.code}
                checked={selected === lng.code}
                onChange={onChange}
              />
              <span>{lng.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

export default LanguageSwitcher;
