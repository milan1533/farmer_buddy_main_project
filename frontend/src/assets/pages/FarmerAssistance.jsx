import React from 'react';
import { FiExternalLink } from 'react-icons/fi';

function FarmerAssistance() {
  const governmentLink = 'https://ikhedut.gujarat.gov.in/site/'; // TODO: Replace with your assistance link
  const placeholderImage = 'https://ikhedut.gujarat.gov.in/site/assets/Logo_ikhedut_new-D82OfzAo.png'; // TODO: Replace with your photo URL
  const seedItems = [
    {
      id: 1,
      role: 'farmer',
      title: 'ટ્રેક્ટર સહાય યોજના',
      subtitle: 'યાંત્રિકીકરણ સહાય',
      description: 'ટ્રેક્ટર ખરીદી માટે સબસીડી ઉપલબ્ધ છે. શરતો અને સમયમર્યાદા માટે લિંક જુઓ.',
      img: 'https://images.unsplash.com/photo-1592973539941-1422f9c8bd2b?q=80&auto=format&fit=crop',
      link: 'https://ikhedut.gujarat.gov.in/iKhedutPublicScheme/',
    },
    {
      id: 2,
      role: 'consumer',
      title: 'ઓર્ગેનિક પ્રોડક્ટ્સ',
      subtitle: 'સ્થાનિક બજાર',
      description: 'જિલ્લા સ્તરે પ્રમાણિત ઓર્ગેનિક ઉત્પાદનો ખરીદો. ઉપલબ્ધતા અને ભાવ માટે લિંક ખોલો.',
      img: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&auto=format&fit=crop',
      link: 'https://ikhedut.gujarat.gov.in/site/',
    },
    {
      id: 3,
      role: 'farmer',
      title: 'ડ્રિપ સિંચાઈ સહાય',
      subtitle: 'પાણી બચાવો',
      description: 'માઈક્રો ઇરિગેશન માટે સહાય. એપ્લાય કરવા માટે વિગતવાર માર્ગદર્શિકા લિંક પર.',
      img: 'https://images.unsplash.com/photo-1582918368367-8381f792f423?q=80&auto=format&fit=crop',
      link: 'https://ikhedut.gujarat.gov.in/iKhedutPublicScheme/',
    },
  ];

  const [audience, setAudience] = React.useState('all');
  const [items] = React.useState(seedItems);

  const filtered = items.filter((i) => (audience === 'all' ? true : i.role === audience));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <main className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        {/* Hero */}
        <section className="text-center mb-6 sm:mb-8 animate-fade-in-up">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-purple-700 dark:text-purple-300 tracking-tight">
            આઈ ખેડૂત પોર્ટલની નવી યોજનાઓ
          </h1>
        </section>

        {/* Audience filter */}
        <div className="max-w-4xl mx-auto mb-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setAudience('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium border ${
              audience === 'all'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700'
            }`}
          >
            બધા
          </button>
          <button
            onClick={() => setAudience('farmer')}
            className={`px-4 py-2 rounded-md text-sm font-medium border ${
              audience === 'farmer'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700'
            }`}
          >
            ખેડૂત
          </button>
          <button
            onClick={() => setAudience('consumer')}
            className={`px-4 py-2 rounded-md text-sm font-medium border ${
              audience === 'consumer'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700'
            }`}
          >
            ગ્રાહક
          </button>
        </div>

        {/* Themed Cards */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filtered.map((it) => (
            <div
              key={it.id}
              className="rounded-2xl shadow-md bg-gradient-to-r from-yellow-100 to-yellow-300 p-4">
              <div className="flex gap-4 items-start">
                <img
                  src={it.img}
                  alt={it.title}
                  className="w-16 h-16 rounded-md object-cover bg-white border border-yellow-200"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{it.title}</h3>
                  <p className="text-sm text-gray-700">{it.subtitle}</p>
                  <p className="mt-1 text-sm text-gray-800">{it.description}</p>
                  <div className="mt-3">
                    <a
                      href={it.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm"
                    >
                      લિંક ખોલો
                      <FiExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <span className="ml-2 shrink-0 px-2 py-1 text-xs rounded bg-white/60 text-gray-800 border border-yellow-200">
                  {it.role === 'farmer' ? 'ખેડૂત' : 'ગ્રાહક'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Banner Image */}
        <section className="mt-8 flex justify-center">
          <img
            src={placeholderImage}
            alt="Farmer Assistance"
            className="w-56 sm:w-96 h-28 sm:h-48 object-contain rounded-xl shadow mx-auto"
          />
        </section>

        {/* Government Assistance Link */}
        <section className="mt-6 text-center">
          <a
            href={governmentLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-bold text-lg sm:text-2xl"
          >
            વધુ માહિતી માટે અહીં ક્લિક કરો
            <FiExternalLink className="w-5 h-5" />
          </a>
          <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            https://ikhedut.gujarat.gov.in/iKhedutPublicScheme/
          </p>
        </section>
      </main>
    </div>
  );
}

export default FarmerAssistance;
