import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const btnClass = (lng) =>
    `px-3 py-1 rounded border ${current.startsWith(lng) ? 'bg-blue-600 text-white' : 'bg-white'}`;

  return (
    <div className="mt-4 flex justify-center gap-2">
      <button type="button" className={btnClass('en')} onClick={() => changeLanguage('en')}>English</button>
      <button type="button" className={btnClass('hi')} onClick={() => changeLanguage('hi')}>हिंदी</button>
      <button type="button" className={btnClass('gu')} onClick={() => changeLanguage('gu')}>ગુજરાતી</button>
    </div>
  );
}

export default LanguageSwitcher;
