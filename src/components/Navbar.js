'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';

const sectionLinks = [
  {
    href: '/',
    label: 'الرئيسية',
    active: true,
    summary: 'أبرز الأخبار والعناوين الرئيسية والتحليلات السريعة.',
    groups: [
      { title: 'محتوى رئيسي', items: ['آخر الأخبار', 'الأكثر قراءة', 'اختيارات المحرر', 'التقارير الخاصة'] },
      { title: 'تصفح سريع', items: ['العاجل', 'مقالات اليوم', 'ملفات مميزة', 'أخبار الساعة'] },
    ],
  },
  {
    href: '/?category=أخبار',
    label: 'أخبار',
    summary: 'تغطيات يومية، عناوين عاجلة، وملخصات سريعة للأحداث.',
    groups: [
      { title: 'نشرات', items: ['أخبار عاجلة', 'آخر المستجدات', 'ملخص اليوم', 'تقارير خاصة'] },
      { title: 'فئات', items: ['سياسة', 'اقتصاد', 'مجتمع', 'متابعات'] },
    ],
  },
  {
    href: '/?category=رمضانيات',
    label: 'رمضانيات',
    summary: 'موضوعات رمضانية متنوعة تشمل البرامج والوصفات والأجواء.',
    groups: [
      { title: 'أقسام', items: ['برامج رمضان', 'وصفات', 'أجواء الشهر', 'ليالي رمضانية'] },
      { title: 'محتوى مميز', items: ['سحور', 'إفطار', 'نصائح', 'اختيارات اليوم'] },
    ],
  },
  {
    href: '/?category=شرق أوسط',
    label: 'شرق أوسط',
    summary: 'ملفات المنطقة، المتابعات السياسية، وتطورات الميدان.',
    groups: [
      { title: 'متابعات', items: ['الخليج', 'بلاد الشام', 'شمال أفريقيا', 'تقارير ميدانية'] },
      { title: 'زاوية تحليل', items: ['ملفات خاصة', 'خلفيات', 'خرائط', 'قراءة الحدث'] },
    ],
  },
  {
    href: '/?category=عالم',
    label: 'عالم',
    summary: 'أحداث العالم، السياسة الدولية، والتقارير العابرة للحدود.',
    groups: [
      { title: 'مناطق', items: ['أوروبا', 'أمريكا', 'آسيا', 'أفريقيا'] },
      { title: 'صيغ المحتوى', items: ['عاجل', 'تحليل', 'تقارير', 'ملفات مطولة'] },
    ],
  },
  {
    href: '/?category=رياضة',
    label: 'رياضة',
    summary: 'نتائج ومتابعات ومواعيد وأخبار البطولات والأندية.',
    groups: [
      { title: 'بطولات', items: ['كرة القدم', 'كرة السلة', 'التنس', 'رياضات قتالية'] },
      { title: 'محتوى', items: ['نتائج', 'جدول مباريات', 'انتقالات', 'تحليلات'] },
    ],
  },
  {
    href: '/?category=الذكاء الاصطناعي',
    label: 'الذكاء الاصطناعي',
    summary: 'أدوات الذكاء الاصطناعي، الأخبار التقنية، والشرحات العملية.',
    groups: [
      { title: 'أدوات', items: ['نماذج لغوية', 'توليد الصور', 'الأتمتة', 'مساعدات برمجية'] },
      { title: 'محتوى', items: ['شروحات', 'مقارنات', 'اتجاهات السوق', 'أخبار الشركات'] },
    ],
  },
  {
    href: '/?category=منوعات',
    label: 'منوعات',
    summary: 'قصص خفيفة ومحتوى متنوع وموضوعات ترند.',
    groups: [
      { title: 'أفكار', items: ['ترند', 'قصص', 'غرائب', 'حول العالم'] },
      { title: 'اختيارات', items: ['صور اليوم', 'أشياء لافتة', 'مقتطفات', 'قراءات سريعة'] },
    ],
  },
  {
    href: '/?category=فيديو',
    label: 'فيديو',
    summary: 'مقاطع مختارة، لقطات سريعة، وتغطيات مرئية.',
    groups: [
      { title: 'أنماط', items: ['تقارير مصورة', 'مختارات', 'شروحات', 'لقطات عاجلة'] },
      { title: 'مشاهدة', items: ['الأحدث', 'الأكثر مشاهدة', 'قصير', 'مقاطع طويلة'] },
    ],
  },
];

const MEGA_MENU_MAX_WIDTH = 704;
const VIEWPORT_PADDING = 16;

export default function Navbar() {
  const [activeMega, setActiveMega] = useState(null);
  const [megaStyle, setMegaStyle] = useState({ left: VIEWPORT_PADDING, top: 110, width: MEGA_MENU_MAX_WIDTH });
  const [authUser, setAuthUser] = useState(null);
  const navRef = useRef(null);
  const triggerRefs = useRef({});
  const closeTimerRef = useRef(null);

  const activeMegaLink = useMemo(
    () => sectionLinks.find((link) => link.label === activeMega) || null,
    [activeMega]
  );

  function updateMegaPosition(label) {
    if (typeof window === 'undefined') return;

    const trigger = triggerRefs.current[label];
    const nav = navRef.current;
    if (!trigger || !nav) return;

    const triggerRect = trigger.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const width = Math.min(MEGA_MENU_MAX_WIDTH, Math.max(320, viewportWidth - VIEWPORT_PADDING * 2));
    const preferredLeft = triggerRect.right - width;
    const maxLeft = Math.max(VIEWPORT_PADDING, viewportWidth - width - VIEWPORT_PADDING);
    const left = Math.min(Math.max(preferredLeft, VIEWPORT_PADDING), maxLeft);

    setMegaStyle({
      left,
      top: navRect.bottom + 10,
      width,
    });
  }

  function clearCloseTimer() {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function scheduleMegaClose() {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setActiveMega(null);
      closeTimerRef.current = null;
    }, 90);
  }

  function openMega(label) {
    clearCloseTimer();
    setActiveMega(label);
    updateMegaPosition(label);
  }

  useEffect(() => {
    if (!activeMega) return undefined;

    function handleResize() {
      updateMegaPosition(activeMega);
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [activeMega]);

  useEffect(() => {
    return () => {
      clearCloseTimer();
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function bindAuth() {
      if (!isSupabaseConfigured()) return undefined;

      const supabase = await getSupabaseClient();
      if (!supabase || !mounted) return undefined;

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (mounted) {
        setAuthUser(session?.user || null);
      }

      const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        if (mounted) {
          setAuthUser(nextSession?.user || null);
        }
      });

      return () => data.subscription.unsubscribe();
    }

    const cleanupPromise = bindAuth();

    return () => {
      mounted = false;
      Promise.resolve(cleanupPromise).then((cleanup) => cleanup && cleanup());
    };
  }, []);

  return (
    <nav ref={navRef} className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur">
      <div className="bg-[#fbfbfb]" onMouseEnter={clearCloseTimer} onMouseLeave={scheduleMegaClose}>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-x-auto">
            <div className="flex min-w-max items-center justify-between gap-4 px-3 py-3 sm:px-0">
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href="/contributors"
                  className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-extrabold text-slate-800 transition hover:border-red-200 hover:text-red-700"
                >
                  المساهمون
                </Link>
                {authUser ? (
                  <Link
                    href="/account"
                    className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-extrabold text-slate-800 transition hover:border-red-200 hover:text-red-700"
                  >
                    حسابي
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/auth"
                      className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-extrabold text-slate-800 transition hover:border-red-200 hover:text-red-700"
                    >
                      تسجيل الدخول
                    </Link>
                    <Link
                      href="/auth?mode=signup"
                      className="inline-flex items-center rounded-full bg-red-700 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-red-800"
                    >
                      إنشاء حساب
                    </Link>
                  </>
                )}
              </div>

              {sectionLinks.map((link) => (
                <SectionLink
                  key={link.label}
                  link={link}
                  setTriggerRef={(node) => {
                    triggerRefs.current[link.label] = node;
                  }}
                  onOpen={() => openMega(link.label)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {activeMegaLink ? (
        <div
          className="fixed z-[80] hidden md:block"
          style={{
            left: `${megaStyle.left}px`,
            top: `${megaStyle.top}px`,
            width: `${megaStyle.width}px`,
          }}
          onMouseLeave={scheduleMegaClose}
          onMouseEnter={() => openMega(activeMegaLink.label)}
        >
          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_35px_90px_-35px_rgba(15,23,42,0.35)]">
            <div className="grid grid-cols-[1.1fr_0.9fr]">
              <div className="grid gap-4 p-5 text-right sm:grid-cols-2">
                {activeMegaLink.groups.map((group) => (
                  <div key={`${activeMegaLink.label}-${group.title}`} className="rounded-2xl border border-slate-200 bg-white p-4 text-right">
                    <div className="text-sm font-black text-slate-950">{group.title}</div>
                    <div className="mt-4 space-y-2">
                      {group.items.map((item) => (
                        <Link
                          key={`${group.title}-${item}`}
                          href={activeMegaLink.href}
                          className="flex items-center justify-between rounded-xl px-2 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-red-700"
                        >
                          <span>{item}</span>
                          <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-r border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#fff_100%)] p-6 text-right">
                <div className="text-xs font-extrabold tracking-[0.18em] text-red-700">ARZAPRESS</div>
                <h3 className="mt-3 text-2xl font-black text-slate-950">{activeMegaLink.label}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{activeMegaLink.summary}</p>
                <Link
                  href={activeMegaLink.href}
                  className="mt-5 inline-flex items-center rounded-full bg-red-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-800"
                >
                  عرض القسم
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}

function SectionLink({ link, setTriggerRef, onOpen }) {
  return (
    <div className="shrink-0">
      <Link
        ref={setTriggerRef}
        href={link.href}
        onMouseEnter={link.groups ? onOpen : undefined}
        onFocus={link.groups ? onOpen : undefined}
        className={[
          'inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-1.5 text-base font-extrabold text-slate-800 transition hover:text-red-700',
          link.active ? 'text-slate-950' : '',
        ].join(' ')}
      >
        <span>{link.label}</span>
        <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 text-slate-500 transition hover:text-red-700" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
        </svg>
      </Link>
    </div>
  );
}
