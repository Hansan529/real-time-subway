import NotFound from '@/components/NotFound';
import RealTimeSubway from '@/components/RealTimeSubway';
import { colorDynamic } from '@/components/subwayInfo';
import dynamic from 'next/dynamic';

export default function Page({ params }: { params: { slug: string } }) {
  const url = decodeURIComponent(params.slug);
  const exist = Object.keys(colorDynamic).find((el) => el === url);
  if (!exist) return <NotFound />;
  return <RealTimeSubway props={url} />;
}
