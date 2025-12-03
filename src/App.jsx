import React, { useEffect, useRef, useState } from 'react';

// --- Icons ---
const Icons = {
  Menu: ({ size = 24, className = '' }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="4" y1="12" x2="20" y2="12"></line>
      <line x1="4" y1="6" x2="20" y2="6"></line>
      <line x1="4" y1="18" x2="20" y2="18"></line>
    </svg>
  ),
  X: ({ size = 24, className = '' }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  ChevronRight: ({ size = 24, className = '' }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  ),
  ArrowRight: ({ size = 24, className = '' }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  ),
  Play: ({ size = 24, className = '' }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      className={className}
    >
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  ),
};

const { Menu, X, ChevronRight, ArrowRight, Play } = Icons;

// --- Intersection Observer Hook for Scroll Animation ---
const useOnScreen = (options) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, options]);

  return [ref, visible];
};

const ScrollReveal = ({ children, delay = 0, className = '', ...props }) => {
  const [ref, visible] = useOnScreen({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
      style={{ transitionDelay: `${delay}ms`, transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      {...props}
    >
      {children}
    </div>
  );
};

// --- Components ---

const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
  const baseStyle = 'group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden transition-all duration-300 font-medium tracking-wide text-sm';
  const variants = {
    primary: 'bg-fomus-black text-white border border-fomus-black hover:shadow-xl',
    outline: 'bg-transparent text-fomus-black border border-fomus-black hover:text-white',
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      <span
        className={`absolute inset-0 w-full h-full bg-fomus-black transition-transform duration-300 ease-out transform ${
          variant === 'outline' ? 'scale-x-0 group-hover:scale-x-100 origin-left' : 'scale-x-100 group-hover:scale-x-105'
        }`}
      ></span>
      <span className="relative flex items-center gap-2 transition-colors duration-300">
        {children} <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </button>
  );
};

const SectionHeading = ({ en, jp, align = 'center' }) => (
  <ScrollReveal className={`mb-20 md:mb-32 flex flex-col ${align === 'center' ? 'items-center' : 'items-start'}`}>
    <h2 className="font-serif-en text-5xl md:text-7xl text-fomus-black mb-4 tracking-tight leading-none">
      <span className="block w-12 h-1 bg-fomus-gold mb-6 mx-auto md:mx-0"></span>
      {en}
    </h2>
    <span className="text-sm md:text-base text-fomus-gray tracking-[0.2em] uppercase font-medium">{jp}</span>
  </ScrollReveal>
);

const Nav = ({ activePage, setPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);
  const translateLoaded = useRef(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (translateLoaded.current) return;
    const init = () => {
      if (window.google && window.google.translate) {
        translateLoaded.current = true;
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'ja',
            includedLanguages: 'en,fr,ar',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          'google_translate_element',
        );
      }
    };
    window.initGoogleTranslate = init;
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=initGoogleTranslate';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      delete window.initGoogleTranslate;
    };
  }, []);

  const navItems = [
    { id: 'home', label: 'TOP' },
    { id: 'comic', label: 'Story-to-Comic' },
    { id: 'visual', label: 'Visual Branding' },
    { id: 'point', label: 'Point Program' },
    { id: 'kuku', label: 'KUKU Co-Creation' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div
            className={`text-2xl font-serif-en font-bold tracking-tighter cursor-pointer z-50 transition-colors duration-300 ${
              scrolled || activePage !== 'home' ? 'text-black' : 'text-white'
            }`}
            onClick={() => setPage('home')}
          >
            FOMUS Creative Studio
          </div>

          <div className="hidden md:flex space-x-10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`relative text-xs tracking-widest uppercase transition-colors duration-300 group ${
                  scrolled || activePage !== 'home'
                    ? activePage === item.id
                      ? 'text-black font-bold'
                      : 'text-gray-500 hover:text-black'
                    : activePage === item.id
                      ? 'text-white font-bold'
                      : 'text-white/70 hover:text-white'
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-2 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                    scrolled || activePage !== 'home' ? 'bg-black' : 'bg-white'
                  }`}
                ></span>
              </button>
            ))}
            <div className="relative">
              <button
                onClick={() => setShowTranslate((prev) => !prev)}
                className={`text-xs tracking-widest uppercase transition-colors duration-300 ${
                  scrolled || activePage !== 'home' ? 'text-gray-600 hover:text-black' : 'text-white/80 hover:text-white'
                }`}
              >
                Translate
              </button>
              <div
                className={`absolute right-0 mt-2 bg-white border border-gray-200 shadow-lg p-3 ${showTranslate ? 'block' : 'hidden'}`}
              >
                <div id="google_translate_element" className="text-xs"></div>
              </div>
            </div>
          </div>

          <div className="md:hidden z-50">
            <button onClick={() => setIsOpen(!isOpen)} className={`${scrolled || activePage !== 'home' || isOpen ? 'text-black' : 'text-white'}`}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-8 transition-all duration-500 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {navItems.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => {
              setPage(item.id);
              setIsOpen(false);
            }}
            className={`text-3xl font-serif-en text-black transition-all duration-500 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{ transitionDelay: `${idx * 100}ms` }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
};

// --- Page Sections ---

const HomePage = ({ setPage }) => (
  <div className="animate-fade-in-up">
    <header className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-fomus-black text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center animate-ken-burns opacity-60"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-fomus-black via-fomus-black/40 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/80"></div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
        <div className="reveal-mask mb-6">
          <p className="font-serif-en text-xl md:text-3xl tracking-widest text-fomus-gold italic animate-reveal-text">Brand the Future with Story & Design.</p>
        </div>

        <div className="reveal-mask mb-12">
          <h1 className="text-5xl md:text-8xl font-bold leading-none tracking-tight animate-reveal-text" style={{ animationDelay: '0.2s' }}>
            物語から、<br />
            ブランドを届ける。
          </h1>
        </div>

        <div className="space-y-6 text-sm md:text-lg leading-relaxed text-white font-light tracking-wide mb-16 max-w-2xl animate-fade-in-up opacity-0" style={{ animationDelay: '0.6s' }}>
          <p>
            FOMUS Creative Studio は、<br className="hidden md:block" />
            ストーリー、デザイン、映像、そして世界観を統合し、<br className="hidden md:block" />
            “深く届くブランド”を届けるクリエイティブスタジオです。
          </p>
          <p className="text-white/80 text-sm">
            日本・アイルランド・ドバイなど世界を歩き、<br className="hidden md:block" />
            工芸・アート・物語制作を横断してきたFOMUSだからこそ、<br className="hidden md:block" />
            静かで力強いクリエイティブを提供できます。
          </p>
        </div>

        <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.8s' }}>
          <button
            onClick={() => setPage('contact')}
            className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-full border border-white/30 text-white transition-all hover:border-white hover:bg-white/10"
          >
            <span className="relative flex items-center gap-4">
              <span className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center transition-transform group-hover:scale-110">
                <ArrowRight size={16} />
              </span>
              <span className="tracking-widest text-sm">まずは、あなたの物語を聞かせてください</span>
            </span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50">
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
      </div>
    </header>

    <section className="py-32 bg-white relative">
      <div className="container mx-auto px-6">
        <SectionHeading en="Our Divisions" jp="3つの事業領域" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <ScrollReveal delay={0}>
            <div className="group cursor-pointer" onClick={() => setPage('comic')}>
              <div className="aspect-[3/4] md:aspect-[4/5] overflow-hidden relative mb-6">
                <div className="absolute inset-0 bg-gray-200"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614726365345-03d3c631a31c?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center img-interactive"></div>

                <div className="absolute inset-0 p-8 flex flex-col justify-between bg-gradient-to-b from-transparent to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="text-right">
                    <span className="inline-block w-12 h-12 rounded-full border border-white/50 text-white flex items-center justify-center transform rotate-45 group-hover:rotate-0 transition-transform duration-500">
                      <ArrowRight size={20} />
                    </span>
                  </div>
                  <p className="text-white text-sm font-medium">View Details</p>
                </div>

                <div
                  className="absolute -top-4 -left-4 font-serif-en text-6xl md:text-8xl text-transparent stroke-text opacity-20 group-hover:opacity-100 group-hover:text-fomus-black transition-all duration-500 select-none"
                  style={{ WebkitTextStroke: '1px #000' }}
                >
                  01
                </div>
              </div>

              <div className="relative z-10 pl-4 border-l-2 border-transparent group-hover:border-fomus-gold transition-colors duration-300">
                <h3 className="font-serif-en text-3xl mb-2 group-hover:text-fomus-gold transition-colors">Story-to-Comic Studio</h3>
                <p className="font-bold mb-3 text-lg leading-tight">
                  どんな物語でも、
                  <br />
                  漫画にする。
                </p>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">人生、小説、企業の歩み…。ストーリーがあるものすべてを可視化。独自のAI×編集プロセス。</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200} className="md:mt-16">
            <div className="group cursor-pointer" onClick={() => setPage('visual')}>
              <div className="aspect-[3/4] md:aspect-[4/5] overflow-hidden relative mb-6">
                <div className="absolute inset-0 bg-gray-200"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center img-interactive"></div>

                <div className="absolute inset-0 p-8 flex flex-col justify-between bg-gradient-to-b from-transparent to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="text-right">
                    <span className="inline-block w-12 h-12 rounded-full border border-white/50 text-white flex items-center justify-center transform rotate-45 group-hover:rotate-0 transition-transform duration-500">
                      <ArrowRight size={20} />
                    </span>
                  </div>
                  <p className="text-white text-sm font-medium">View Details</p>
                </div>

                <div
                  className="absolute -top-4 -left-4 font-serif-en text-6xl md:text-8xl text-transparent stroke-text opacity-20 group-hover:opacity-100 group-hover:text-fomus-black transition-all duration-500 select-none"
                  style={{ WebkitTextStroke: '1px #000' }}
                >
                  02
                </div>
              </div>

              <div className="relative z-10 pl-4 border-l-2 border-transparent group-hover:border-fomus-gold transition-colors duration-300">
                <h3 className="font-serif-en text-3xl mb-2 group-hover:text-fomus-gold transition-colors">Visual Branding Studio</h3>
                <p className="font-bold mb-3 text-lg leading-tight">
                  映像 × Web × デザイン。
                  <br />
                  世界観まで統合。
                </p>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">単品で終わらず「世界観」として統合する制作ライン。美意識×ストーリーを軸にデザイン。</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400} className="md:mt-32">
            <div className="group cursor-pointer" onClick={() => setPage('kuku')}>
              <div className="aspect-[3/4] md:aspect-[4/5] overflow-hidden relative mb-6">
                <div className="absolute inset-0 bg-gray-200"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center img-interactive"></div>

                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-bold tracking-widest border border-black z-20">LICENCE FREE</div>

                <div className="absolute inset-0 p-8 flex flex-col justify-between bg-gradient-to-b from-transparent to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="text-right">
                    <span className="inline-block w-12 h-12 rounded-full border border-white/50 text-white flex items-center justify-center transform rotate-45 group-hover:rotate-0 transition-transform duration-500">
                      <ArrowRight size={20} />
                    </span>
                  </div>
                  <p className="text-white text-sm font-medium">View Details</p>
                </div>

                <div
                  className="absolute -top-4 -left-4 font-serif-en text-6xl md:text-8xl text-transparent stroke-text opacity-20 group-hover:opacity-100 group-hover:text-fomus-black transition-all duration-500 select-none"
                  style={{ WebkitTextStroke: '1px #000' }}
                >
                  03
                </div>
              </div>

              <div className="relative z-10 pl-4 border-l-2 border-transparent group-hover:border-fomus-gold transition-colors duration-300">
                <h3 className="font-serif-en text-3xl mb-2 group-hover:text-fomus-gold transition-colors">KUKU Co-Creation</h3>
                <p className="font-bold mb-3 text-lg leading-tight">
                  IPライセンス料 0円。
                  <br />
                  物語をプロモーションに活用。
                </p>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                  KUKUは、FOMUSが展開する“拡張し続けるオープンIP”。
                  ライセンス料0円で、企業・自治体のPRや観光映像に自由に活用できます。
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>

    <section className="py-32 bg-fomus-light overflow-hidden">
      <div className="container mx-auto px-6 relative">
        <SectionHeading en="Why FOMUS" jp="FOMUSが選ばれる理由" />

        <div className="max-w-4xl mx-auto mb-20 text-center relative z-10">
          <p className="text-xl md:text-2xl font-serif-en italic text-gray-400 mb-4">"Structure of Strength"</p>
          <p className="text-lg text-gray-800 font-medium">
            他のクリエイティブスタジオとは根本から違う
            <br />
            “構造的な強み”があります。
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto space-y-24">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block"></div>

          {[
            {
              title: '世界を歩いた“物語抽出力”',
              desc: '工芸、文化、海外生活、旅、写真、アート。多様な背景を持つFOMUSだからこそ、“物語の本質”を深く理解し、表現に落とし込めます。',
            },
            {
              title: 'AI × クリエイティブディレクション',
              desc: 'AIは「効率化」ではなく「表現拡張」として活用。通常の制作会社が数週間〜数ヶ月かかる内容を、より短い期間で、美しく仕上げます。',
            },
            {
              title: '単発制作ではなく“世界観”で統合',
              desc: '映像、漫画、Web、資料をバラバラに作るのではなく、“ひとつの物語” を軸に統合して設計します。他社には出せない“統一された世界観”が宿ります。',
            },
            {
              title: 'KUKUという“完成した世界観”を無料活用',
              desc: 'IP開発コスト（数百万〜数千万）が丸ごと不要。既に存在するKUKUのキャラ・物語・音楽・デザインをそのまま活用できるのは、FOMUSだけの強みです。',
            },
          ].map((item, idx) => (
            <ScrollReveal key={idx} className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className="w-full md:w-1/2 flex justify-center md:justify-end relative h-32 md:h-auto items-center overflow-hidden">
                <span className="font-serif-en text-[120px] md:text-[200px] leading-none text-gray-200 absolute md:static z-0">{`0${idx + 1}`}</span>
                <div className={`absolute top-1/2 ${idx % 2 === 1 ? 'right-0 md:left-0' : 'left-0 md:right-0'} w-12 h-px bg-fomus-black hidden md:block`}></div>
              </div>

              <div className="w-full md:w-1/2 relative z-10 bg-white/50 backdrop-blur-sm p-6 md:p-8 rounded-sm border-l-4 border-fomus-gold shadow-sm">
                <h3 className="text-xl md:text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}

          <ScrollReveal className="relative flex flex-col items-center text-center mt-20">
            <div className="font-serif-en text-[100px] text-gray-100 leading-none mb-4">05</div>
            <h3 className="text-xl font-bold mb-4">海外発信に強い唯一のスタジオ</h3>
            <p className="text-gray-600 leading-relaxed max-w-2xl">
              アイルランド、ドバイ、ジョージア、日本。世界複数拠点での事業経験があるため、“海外向けに刺さる”デザイン・映像・物語を理解しています。
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>

    <section className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <SectionHeading en="Works" jp="制作事例" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:h-[500px] auto-rows-fr">
          <div className="col-span-2 row-span-2 relative overflow-hidden group cursor-pointer bg-black">
            <div className="absolute inset-0 bg-gray-800 transition-transform duration-700 group-hover:scale-105 opacity-60"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-all group-hover:bg-white group-hover:text-black group-hover:scale-110">
                <Play size={24} className="fill-current" />
              </div>
            </div>
            <div className="absolute bottom-6 left-6 text-white">
              <p className="font-serif-en text-sm text-gray-300">Branding Movie</p>
              <p className="font-bold text-lg">Corporate Identity</p>
            </div>
          </div>

          <div className="relative overflow-hidden group cursor-pointer bg-gray-100">
            <div className="absolute inset-0 bg-gray-200 transition-transform duration-700 group-hover:scale-110"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 text-white">
              <p className="font-serif-en italic">Comic LP</p>
            </div>
          </div>

          <div className="relative overflow-hidden group cursor-pointer bg-gray-100">
            <div className="absolute inset-0 bg-gray-300 transition-transform duration-700 group-hover:scale-110"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 text-white">
              <p className="font-serif-en italic">Web Design</p>
            </div>
          </div>

          <div className="col-span-2 relative overflow-hidden group cursor-pointer bg-fomus-black">
            <div className="absolute inset-0 bg-gray-900 transition-transform duration-700 group-hover:scale-105"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <p className="font-serif-en text-sm text-gray-300">KUKU Project</p>
              <p className="font-bold text-lg">Collaboration</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-6 text-right tracking-wider">※ 実際の事例は順次追加します。</p>
      </div>
    </section>

    <section className="py-32 bg-white border-t border-gray-100">
      <div className="container mx-auto px-6">
        <SectionHeading en="About FOMUS" jp="スタジオについて" align="left" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          <ScrollReveal className="md:col-span-1">
            <div className="w-40 h-40 bg-gray-200 grayscale hover:grayscale-0 transition-all duration-500 hover:scale-105"></div>
          </ScrollReveal>
          <ScrollReveal delay={100} className="md:col-span-2">
            <p className="text-xs text-fomus-gold mb-4 uppercase tracking-wide font-bold">FOMUS Founder / Creative Director</p>
            <h3 className="font-serif-en text-3xl mb-4">Masu (Keisuke Masuo)</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              日本の伝統工芸“枡”の世界展開、物語IP「KUKU」の制作、映像・漫画・世界観制作を横断するクリエイター。
              <br />
              世界を旅しながら、人・文化・風景から抽出した“物語”をクリエイティブとして形にすることを得意とする。
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>

    <section className="py-28 bg-fomus-light border-t border-gray-100">
      <div className="container mx-auto px-6">
        <SectionHeading en="FOMUS Point Program" jp="ポイントプログラム" align="left" />
        <ScrollReveal
          onClick={() => setPage('point')}
          className="bg-white p-12 flex flex-col md:flex-row md:items-center gap-10 border border-gray-100 hover:border-fomus-gold transition-colors duration-300 shadow-sm cursor-pointer"
        >
          <div className="flex-1">
            <h3 className="font-serif-en text-3xl mb-4">Earn Points per Project</h3>
            <p className="text-sm text-gray-600 mb-4">
              制作依頼ごとにFOMUSポイントを付与。
              <br />
              ポイントはFOMUSのプロダクト・イベント・プロジェクトで利用可能です。
            </p>
          </div>
          <div className="w-16 h-16 rounded-full border border-fomus-black flex items-center justify-center bg-white">
            <span className="text-xl font-serif-en font-bold">P</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  </div>
);

const LPLayout = ({ title, sub, intro, what, why, process, contactMsg, chips = [], heroImage, accentGradient, gallery = [], setPage }) => {
  const gradient = accentGradient || 'from-fomus-gold/60 via-white/10 to-fomus-black/60';

  return (
    <div className="animate-fade-in-up bg-white min-h-screen">
      <div className="relative pt-40 pb-24 overflow-hidden text-white">
        <div
          className="absolute inset-0 bg-cover bg-center brightness-75"
          style={{
            backgroundImage:
              heroImage ||
              "url('https://images.unsplash.com/photo-1525182008055-f88b95ff7980?q=80&w=2070&auto=format&fit=crop')",
          }}
        ></div>
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}></div>
        <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[28rem] h-[28rem] bg-black/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <button onClick={() => setPage('home')} className="mb-12 flex items-center text-sm text-white/70 hover:text-white transition-colors group">
            <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span> Back to TOP
          </button>

          <div className="mb-10 space-y-6">
            {chips.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {chips.map((chip) => (
                  <span key={chip} className="px-3 py-1 border border-white/20 bg-white/10 backdrop-blur-sm text-xs uppercase tracking-[0.2em] rounded-full">
                    {chip}
                  </span>
                ))}
              </div>
            )}
            <h1 className="font-serif-en text-5xl md:text-7xl mb-4 tracking-tight leading-tight text-white">{title}</h1>
            <p className="text-xl md:text-3xl font-light text-white/90 leading-snug whitespace-pre-line">{sub}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-5xl pt-24 pb-20">
        <ScrollReveal className="mb-32 grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-3">
            <span className="text-xs font-bold tracking-widest uppercase border-b-2 border-fomus-black pb-2 block w-fit">Introduction</span>
          </div>
          <div className="md:col-span-9 text-lg md:text-xl leading-loose font-light whitespace-pre-line text-gray-800 border-l border-gray-200 pl-8">
            {intro}
          </div>
        </ScrollReveal>

        <ScrollReveal className="mb-32 bg-gradient-to-br from-fomus-black via-[#0f0d0b] to-fomus-black text-white p-12 md:p-20 relative overflow-hidden rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
            <div className="md:col-span-3">
              <span className="text-xs font-bold tracking-widest uppercase border-b border-white/30 pb-2 block w-fit text-white/70">What We Create</span>
            </div>
            <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-12">
              {what.map((item, idx) => (
                <div key={idx} className="group">
                  <h4 className="font-serif-en text-2xl mb-3 text-fomus-gold">{item.title}</h4>
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line group-hover:text-white transition-colors">{item.desc}</p>
                  {item.image && (
                    <div
                      className="mt-4 h-36 rounded-sm overflow-hidden bg-cover bg-center border border-white/10"
                      style={{ backgroundImage: `url('${item.image}')` }}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {gallery.length > 0 && (
          <ScrollReveal className="mb-32">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-bold tracking-widest uppercase text-fomus-gold">Mood Board</span>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map((item, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-md group bg-gray-200"
                  style={{ backgroundImage: `url('${item.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <p className="absolute bottom-2 left-2 right-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.caption}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}

        <div className="mb-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-3">
              <span className="text-xs font-bold tracking-widest uppercase border-b-2 border-fomus-black pb-2 block w-fit">Why FOMUS</span>
            </div>
            <div className="md:col-span-9 space-y-20">
              {why.map((item, idx) => (
                <ScrollReveal key={idx} className="group flex gap-8">
                  <span className="font-serif-en text-6xl text-gray-200 group-hover:text-fomus-gold transition-colors duration-300 -mt-4">0{idx + 1}</span>
                  <div>
                    <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{item.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-3">
              <span className="text-xs font-bold tracking-widest uppercase border-b-2 border-fomus-black pb-2 block w-fit">Process</span>
            </div>
            <div className="md:col-span-9 flex flex-wrap gap-4 items-center text-sm">
              {process.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="bg-white border border-gray-200 px-8 py-4 min-w-[140px] text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 font-medium">
                    {step}
                  </div>
                  {idx < process.length - 1 && (
                    <span className="text-gray-300">
                      <ArrowRight size={16} />
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center pt-24 border-t border-gray-100">
          <p className="font-serif-en text-3xl md:text-4xl mb-12 whitespace-pre-line leading-tight">{contactMsg}</p>
          <Button onClick={() => setPage('contact')}>お問い合わせ</Button>
        </div>
      </div>
    </div>
  );
};

// --- Data for LPs ---

const comicData = {
  title: 'Story-to-Comic Studio',
  sub: 'どんな物語でも、漫画にする。',
  heroImage: "url('https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=2000&auto=format&fit=crop')",
  accentGradient: 'from-purple-800/80 via-fomus-black/60 to-fomus-black/90',
  chips: ['Comic', 'Story Design', 'AI × Edit'],
  intro: `FOMUS Story-to-Comic Studio は、
人生・企業・ブランド・研究・自治体・海外PRなど、
“物語を必要としているすべて”を漫画として可視化する専門部門です。

独自のヒアリング × AI生成 × 編集プロセスにより、
短期間で高品質な「読まれるストーリー」を提供します。`,
  what: [
    { title: 'Personal / Life Comic', desc: '人生・キャリア・家族・海外生活の漫画化。', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop' },
    { title: 'Novel / Content Comic', desc: '小説・作品・IPを漫画として再構築。', image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=600&auto=format&fit=crop' },
    { title: 'Corporate Comic', desc: '代表物語、創業ストーリー、採用漫画、事業説明。', image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=600&auto=format&fit=crop' },
    { title: 'Global Comic', desc: '英語版ブランドコミック、展示会用ストーリー。', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=600&auto=format&fit=crop' },
    { title: 'Education Comic', desc: '研究・研修・講義内容を“わかりやすい物語”に。', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop' },
    { title: 'Gift Comic', desc: '結婚・誕生日・家族など、大切な人へのストーリープレゼント。', image: 'https://images.unsplash.com/photo-1441123694162-e54a981ceba3?q=80&w=600&auto=format&fit=crop' },
  ],
  why: [
    { title: '世界を歩いてきた“物語抽出力”', desc: '文化・人・旅・工芸を通じて多様な価値観と接してきた経験が、\n深いヒアリングを可能にします。' },
    { title: 'AI × クリエイティブディレクションの高速制作', desc: 'AIを「表現拡張」のために活用し、短納期で美しい表現へ。' },
    { title: '世界観の統合', desc: '漫画単体ではなく、映像・Web・デザインへ“繋がる物語”を設計できます。\nFOMUSだけの総合力です。' },
  ],
  process: ['お問い合わせ', 'ヒアリング(60分)', '構成案作成', 'AI生成 × 編集', '納品'],
  contactMsg: 'あなたの物語を、伝わる漫画に。',
  gallery: [
    { image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop', caption: 'Character roughs & emotion boards' },
    { image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop', caption: 'Story layouts & pacing' },
    { image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop', caption: 'Color script & atmosphere' },
    { image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=800&auto=format&fit=crop', caption: 'Panel design & typography' },
  ],
};

const visualData = {
  title: 'Visual Branding Studio',
  sub: '映像 × Web × デザイン。\n世界観ごと、つくる。',
  heroImage: "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop')",
  accentGradient: 'from-blue-800/80 via-fomus-black/60 to-fomus-black/90',
  chips: ['Film', 'Web', 'Design'],
  intro: `Visual Branding Studio は、
映像・Web・LP・デザイン・資料・写真といった
ブランドの“視覚的なすべて”を一気通貫で制作する部門です。

単なる制作ではなく、
物語と美意識を軸に“世界観としてブランドを設計”します。`,
  what: [
    { title: 'Film / Video', desc: 'ブランドムービー／MV／SNS動画／展示映像／AIアニメーション。', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=600&auto=format&fit=crop' },
    { title: 'Web / LP', desc: '公式サイト・LP・ポートフォリオ・サービスサイト。', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600&auto=format&fit=crop' },
    { title: 'Design / Graphic', desc: 'パンフレット、会社案内、名刺、広告、資料、パッケージ。', image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=600&auto=format&fit=crop' },
    { title: 'Photography', desc: '商品、人物、企業、アート撮影。', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=600&auto=format&fit=crop' },
  ],
  why: [
    { title: '世界観でまとめる統合力', desc: '映像・Web・デザインを“ひとつの物語”として組み立てます。' },
    { title: 'AI × クリエイティブの高速制作', desc: '従来の制作フローでは実現しづらい速度と品質を両立。' },
    { title: '海外感性 × 日本文化のバランス', desc: 'あなたのプロジェクトに“深みのある表現”を提供します。' },
  ],
  process: ['ご相談', '目的・世界観ヒアリング', '企画・構成', '制作', '納品'],
  contactMsg: '映像・Web・デザインまで、\nブランドを“ひとつの世界観”で。',
  gallery: [
    { image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop', caption: 'Digital canvases & UI flows' },
    { image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop', caption: 'Lighting studies for film' },
    { image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=800&auto=format&fit=crop', caption: 'Set design & styling' },
    { image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=800&auto=format&fit=crop', caption: 'Brand typography in motion' },
  ],
};

const pointData = {
  title: 'FOMUS Point Program',
  sub: 'クリエイティブを、ポイントで循環させるメンバーシップ',
  intro: `FOMUS Point Programは、プロジェクトのご依頼ごとにポイントが貯まる
スタジオ独自のメンバーシップ制度です。

付与されたポイントは、次回の制作費に充当するだけでなく、
オリジナルプロダクト、限定イベント、コラボ企画枠など
“次の表現”へ循環させるために使えます。`,
  what: [
    { title: 'Next Project Credit', desc: '貯まったポイントを次回の映像・Web・漫画・資料制作費に充当。継続パートナーほどお得に。' },
    { title: 'Limited Drops', desc: 'KUKUグッズ、工芸セレクト、アートピースなど“ものづくり”の限定アイテムと交換可能。' },
    { title: 'Event & Preview', desc: 'シークレット試写会／展示／交流会への優先招待。未公開プロジェクトのプレビュー枠も用意。' },
    { title: 'Gift / Donation', desc: 'ポイントをギフトとして贈る、または文化・芸術支援への寄付に振り替え可能。' },
  ],
  why: [
    { title: 'パートナーシップ重視', desc: '単発で終わらず、長期で世界観を育てたい。リピートを前提に、継続しやすい仕組みを用意。' },
    { title: '表現の循環', desc: '制作で生まれた価値を、次の表現へ回す。文化と経済を往復させる小さなエコシステム。' },
    { title: 'クリエイティブの透明性', desc: 'ポイント還元の使い道が明確。制作費→ポイント→新しい表現、という流れを見える化。' },
  ],
  process: ['プロジェクト完了', 'ポイント付与', '次回以降で利用・交換'],
  contactMsg: 'まずは最初の制作から、ポイント付与をスタートしましょう。',
  customTitles: {
    what: 'Membership Benefits',
    why: 'Program Concept',
    process: 'How it Works',
  },
};

const KukuPage = ({ setPage }) => {
  const featureList = [
    {
      title: '拡張し続けるストーリー体系',
      desc:
        'KUKUは「固定化された完結世界」ではなく、プロジェクトごとに新しい解釈や表現が自然に広がるよう“拡張性”を持たせて設計。',
      examples: [
        '自治体の森＝KUKU世界の「樹木の里」と接続',
        '観光ルート＝キャラの冒険ルート化',
        '商品の誕生背景＝KUKUの精霊文化と融合',
        '子ども向け教育＝物語キャラの案内役化',
      ],
    },
    {
      title: '完全オープンIP（ライセンス料 0円）',
      desc: '商用利用・動画利用・イベント利用、すべて無料。制限は最小限。ブランド使用・自治体PR・国際展示会にも活用可能。',
      examples: [],
    },
  ];

  const useCases = [
    { title: '観光プロモーション', desc: '動画 / 漫画 / プロモーションストーリー（例：KUKUのキャラが街を旅する観光動画）' },
    { title: '自治体・地域創生', desc: '文化財や名所の「物語化」（例：“桝形商店街 × KUKU”のまち歩き動画）' },
    { title: '教育・学習教材', desc: 'SDGs、環境教育、歴史教材をKUKUで再構築' },
    { title: '企業ブランドPR', desc: '製品・事業の誕生ストーリーをキャラと共に表現／展示会ブース映像／LP／短編アニメ' },
    { title: '商品・コラボ', desc: 'コーヒー、雑貨、文具、クラフト、アパレル（ロイヤリティ0）' },
    { title: '海外向け発信', desc: '英語圏／中東／アジア向けPRに相性抜群（非日本的ファンタジー × 日本的情緒のハイブリッド世界観）' },
  ];

  const valuePoints = [
    { title: '一気通貫：KUKUの世界で全部作れる', desc: '漫画、MV、観光映像、LP、キャラクターボイス、音楽…すべてFOMUS Studio内で制作。世界観を統一。' },
    { title: '圧倒的スピード：AI × クリエイティブディレクション', desc: '従来3〜6ヶ月かかる企画もKUKUなら数週間で実装可能。' },
    { title: '世界基準のビジュアル', desc: 'アニメ・ゲーム文脈とも違う“和 × 新世界観”が海外イベントで刺さる。' },
    { title: 'ロイヤリティが発生しない', desc: 'キャラクター使用料ゼロ。予算制約のある自治体・中小企業でも導入しやすい。' },
    { title: 'まっすーが全ディレクション', desc: 'IP・映像・工芸を展開するFOMUS代表まっすーが企画段階から直でディレクション。安心感と精度を担保。' },
  ];

  const packages = [
    { title: 'A. KUKU Sightseeing Movie', desc: '街歩き・観光・イベントの物語動画（例：商店街×KUKU／国際PR向け）' },
    { title: 'B. KUKU Brand Story', desc: '企業・商品・サービスのストーリー動画／漫画' },
    { title: 'C. KUKU Education Pack', desc: '教育・教材用のストーリーコンテンツ' },
    { title: 'D. KUKU Collaboration Goods', desc: 'コラボ商品・ギフトパッケージ向けデザイン' },
    { title: 'E. KUKU Exhibition Pack', desc: '国際展示会向け映像・LP・アニメーション' },
  ];

  const flow = ['打合せ', '企画ストーリー化', '絵コンテ・設定統合', 'AI生成＋クリエイティブ調整', '映像／漫画／LP制作', '納品・活用支援'];

  const faq = [
    { q: '自治体予算内で可能？', a: '可能です。ロイヤリティ0なので企画費に集中できます。' },
    { q: '映像と漫画とLPをまとめて依頼可能？', a: 'はい。世界観統一で制作できます。' },
    { q: '展示会やSNS用に短尺動画も作れる？', a: '可能です。（9:16, 16:9 どちらも対応）' },
  ];

  const highlights = ['KUKU＝拡張可能オープンIP', '企業にとってリスクゼロ', '制作スピードが圧倒的', '世界観をFOMUSが担保', '観光／自治体／企業／教育すべて対応可能'];

  return (
    <div className="animate-fade-in-up bg-white min-h-screen">
      <div className="relative pt-40 pb-32 bg-gradient-to-br from-fomus-black via-[#1d1a16] to-fomus-black overflow-hidden text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=2000&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-fomus-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(197,160,89,0.15),transparent_25%)]"></div>

        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <button onClick={() => setPage('home')} className="mb-12 flex items-center text-sm text-white/60 hover:text-white transition-colors group">
            <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span> Back to TOP
          </button>

          <div className="mb-12 space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 border border-white/10 bg-white/5 backdrop-blur-md text-xs tracking-[0.2em] uppercase rounded-full">
              <span className="w-2 h-2 bg-fomus-gold rounded-full animate-pulse"></span>
              KUKU Creative Partnerships
            </div>
            <h1 className="font-serif-en text-5xl md:text-7xl mb-4 tracking-tight leading-tight text-white">
              オープンIP「KUKU」を、
              <br />
              あなたのプロジェクトの物語に
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-5xl pt-16 pb-20">
        <ScrollReveal className="mb-16 bg-white border border-gray-100 shadow-sm p-8 md:p-10 rounded-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-emerald-200/60 to-transparent blur-3xl pointer-events-none"></div>
          <div className="space-y-4 relative z-10">
            <h3 className="font-serif-en text-2xl text-fomus-black">KUKU = 拡張し続けるオープンIP</h3>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              KUKUは、FOMUSが世界へ展開する “拡張し続けるオープンIP”。ストーリー・キャラクター・音楽・美術設定など、あらゆる表現が自由に拡張・再構築できる物語世界です。
              <br />
              ライセンス料は0円。追加契約なしで、企業・自治体のPR、観光、イベント、商品コラボに誰でも活用できます。
              <br />
              FOMUS Creative Studioは、このKUKU世界の表現・制作・ストーリーデザインを担い、企業・自治体のプロジェクトを“物語として立ち上げるチーム”です。
            </p>
          </div>
        </ScrollReveal>

        <div className="mb-20 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5">
            <span className="text-xs font-bold tracking-widest uppercase border-b-2 border-fomus-black pb-2 block w-fit">HERO</span>
            <h2 className="font-serif-en text-4xl md:text-5xl mt-6 mb-6 leading-tight">KUKU × Creative Studio</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              — 物語が動けば、人が動く。ブランドも、地域も、事業も。
              <br />
              KUKUは“拡張し続ける物語世界”。あなたのプロジェクトを、KUKUのキャラクターたちと共に、世界へ響く物語へと再構築します。
              <br />
              ライセンス料 0円。動画・漫画・キャンペーン・キャラクター活用まで一気通貫。
            </p>
            <Button onClick={() => setPage('contact')}>KUKU × Creative Studio に相談する</Button>
          </div>
          <div className="md:col-span-7">
            <div className="bg-gradient-to-br from-emerald-700 via-fomus-black to-emerald-900 text-white p-8 md:p-12 rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.25)] space-y-4 border border-white/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.08),transparent_35%)] pointer-events-none"></div>
              <p className="font-serif-en text-2xl">— オープンIP「KUKU」を、あなたのプロジェクトの物語に —</p>
              <p className="text-sm text-gray-200 leading-relaxed">
                世界観・キャラクター・音楽・美術設定まで揃った“拡張可能なIP”を、追加契約なしで活用できます。観光動画、自治体PR、展示会、ブランドストーリー、商品コラボまで一気通貫。
              </p>
              <div
                className="mt-6 h-40 md:h-48 rounded-sm overflow-hidden bg-cover bg-center border border-white/10"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop')" }}
              ></div>
            </div>
          </div>
        </div>

        <ScrollReveal className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-bold tracking-widest uppercase text-fomus-gold">01｜KUKUとは？（再構築版）</span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          <p className="text-lg text-gray-800 font-medium mb-6">KUKUは、FOMUSが長年描き続けてきた「自然・心・再生」をテーマにした物語世界。特徴は2つ：</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {featureList.map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{item.desc}</p>
                {item.examples.length > 0 && (
                  <ul className="space-y-2 text-sm text-gray-600">
                    {item.examples.map((ex, exIdx) => (
                      <li key={exIdx}>・{ex}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-bold tracking-widest uppercase text-fomus-gold">02｜活用できる領域（実例ベース）</span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCases.map((item, idx) => (
              <div
                key={idx}
                className="group relative border border-gray-200 p-6 bg-white overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-15 bg-gradient-to-br from-fomus-gold via-fomus-black to-transparent transition-opacity duration-300 pointer-events-none"></div>
                <p className="text-sm text-gray-400 mb-2">Case 0{idx + 1}</p>
                <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-bold tracking-widest uppercase text-fomus-gold">03｜FOMUS Creative Studioがつくる価値</span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          <div className="space-y-8">
            {valuePoints.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="text-fomus-gold font-serif-en text-3xl">0{idx + 1}</div>
                <div>
                  <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-bold tracking-widest uppercase text-fomus-gold">04｜制作パッケージ</span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map((item, idx) => (
              <div key={idx} className="border border-gray-200 p-6 bg-white flex flex-col gap-2">
                <h4 className="text-lg font-bold">{item.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">※ 価格はすべて見積もり式。プロジェクト規模に合わせて柔軟にカスタムします。</p>
        </ScrollReveal>

        <ScrollReveal className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-bold tracking-widest uppercase text-fomus-gold">05｜制作フロー</span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          <div className="flex flex-wrap gap-4 items-center text-sm">
            {flow.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="bg-white border border-gray-200 px-8 py-4 min-w-[140px] text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 font-medium">
                  {step}
                </div>
                {idx < flow.length - 1 && <span className="text-gray-300"><ArrowRight size={16} /></span>}
              </React.Fragment>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-bold tracking-widest uppercase text-fomus-gold">06｜FAQ</span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          <div className="space-y-6">
            {faq.map((item, idx) => (
              <div key={idx} className="border-b border-gray-200 pb-4">
                <p className="text-sm font-bold text-fomus-black mb-2">Q. {item.q}</p>
                <p className="text-sm text-gray-600 leading-relaxed">A. {item.a}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal className="mb-20">
          <div className="bg-fomus-black text-white p-10 md:p-12 rounded-sm shadow-sm space-y-4">
            <h3 className="font-serif-en text-3xl">あなたの地域・ブランド・事業を “国境を越える物語”へ。</h3>
            <p className="text-sm text-gray-200 leading-relaxed">KUKU＝拡張可能オープンIP。ロイヤリティ0で、制作スピードと世界観の統一をFOMUSが担保します。</p>
            <div className="flex flex-wrap gap-3 text-xs text-gray-300">
              {highlights.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 border border-white/20 rounded-full">{tag}</span>
              ))}
            </div>
            <div>
              <Button variant="outline" className="mt-4 bg-transparent text-white border-white hover:bg-white hover:text-black" onClick={() => setPage('contact')}>
                KUKU × Creative Studio に相談する
              </Button>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal className="mb-24">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-bold tracking-widest uppercase text-fomus-gold">Visual Highlights</span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop', cap: 'Cinematic frames' },
              { img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop', cap: 'Worldbuilding art' },
              { img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop', cap: 'Color & mood' },
              { img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800&auto=format&fit=crop', cap: 'Character in world' },
            ].map((item, idx) => (
              <div key={idx} className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-md group bg-gray-200">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${item.img}')` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <p className="absolute bottom-2 left-2 right-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.cap}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

const ContactPage = ({ setPage }) => (
  <div className="animate-fade-in-up pt-40 pb-20 bg-white min-h-screen">
    <div className="container mx-auto px-6 max-w-2xl relative">
      <button onClick={() => setPage('home')} className="mb-12 flex items-center text-sm text-gray-400 hover:text-black transition-colors group">
        <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span> Back to TOP
      </button>

      <div className="text-center mb-16">
        <h1 className="font-serif-en text-6xl mb-6 tracking-tight">Contact</h1>
        <p className="text-gray-600 font-medium">
          制作のご相談・お見積もりはお気軽に。
          <br />
          企画段階からのご相談も歓迎しています。
        </p>
      </div>

      <form
        className="space-y-12 bg-white relative z-10"
        action="mailto:fomus.official@gmail.com"
        method="POST"
        encType="text/plain"
      >
        <div className="group">
          <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-gray-400 group-focus-within:text-fomus-gold transition-colors">Name / Company</label>
          <input
            type="text"
            className="w-full border-b border-gray-200 py-3 text-lg focus:outline-none focus:border-black transition-all bg-transparent group-hover:border-gray-400"
            placeholder="お名前 または 貴社名"
          />
        </div>
        <div className="group">
          <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-gray-400 group-focus-within:text-fomus-gold transition-colors">Email</label>
          <input
            type="email"
            className="w-full border-b border-gray-200 py-3 text-lg focus:outline-none focus:border-black transition-all bg-transparent group-hover:border-gray-400"
            placeholder="email@example.com"
          />
        </div>
        <div className="group">
          <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-gray-400 group-focus-within:text-fomus-gold transition-colors">Message</label>
          <textarea
            rows="4"
            className="w-full border-b border-gray-200 py-3 text-lg focus:outline-none focus:border-black transition-all bg-transparent resize-none group-hover:border-gray-400"
            placeholder="ご相談内容をご記入ください"
          ></textarea>
        </div>
        <div className="text-center pt-8">
          <Button className="w-full md:w-auto min-w-[200px]" type="submit">Send Message</Button>
        </div>
      </form>
    </div>
  </div>
);

// --- Main App ---

const App = () => {
  const [page, setPage] = useState('home');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <div className="antialiased text-fomus-black">
      <Nav activePage={page} setPage={setPage} />

      <main>
        {page === 'home' && <HomePage setPage={setPage} />}
        {page === 'comic' && <LPLayout {...comicData} setPage={setPage} />}
        {page === 'visual' && <LPLayout {...visualData} setPage={setPage} />}
        {page === 'point' && <LPLayout {...pointData} setPage={setPage} />}
        {page === 'kuku' && <KukuPage setPage={setPage} />}
        {page === 'contact' && <ContactPage setPage={setPage} />}
      </main>

      <footer className="bg-fomus-black text-white py-20 border-t border-gray-900">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <div className="font-serif-en text-4xl font-bold tracking-tighter mb-4">FOMUS</div>
            <p className="text-gray-500 text-sm">Brand the Future with Story & Design.</p>
          </div>
          <div className="text-right">
            <div className="flex gap-6 mb-4 justify-end text-gray-400">
              <span className="hover:text-white cursor-pointer">Twitter</span>
              <span className="hover:text-white cursor-pointer">Instagram</span>
              <span className="hover:text-white cursor-pointer">Note</span>
            </div>
            <div className="text-xs text-gray-600 tracking-widest uppercase">© FOMUS Creative Studio. All Rights Reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
