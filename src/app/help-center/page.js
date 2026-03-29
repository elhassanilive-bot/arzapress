import HelpCenterPageView from '@/components/HelpCenterPageView';

export const metadata = {
  title: 'مركز المساعدة | ويزازو',
  description: 'ابحث في مركز مساعدة ويزازو عن إجابات حول الحسابات، النشر، التصنيفات، المساهمين، والدعم الفني.',
  alternates: { canonical: '/help-center' },
};

export default function HelpCenterPage() {
  return <HelpCenterPageView />;
}
