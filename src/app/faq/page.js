import HelpCenterPageView from '@/components/HelpCenterPageView';

export const metadata = {
  title: 'مركز المساعدة | ويزازو',
  description: 'صفحة الأسئلة الشائعة في ويزازو وتضم إجابات عملية حول النشر والحسابات والمشكلات الشائعة.',
  alternates: { canonical: '/faq' },
};

export default function FaqPage() {
  return <HelpCenterPageView />;
}
