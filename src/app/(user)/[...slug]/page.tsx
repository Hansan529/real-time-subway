import NotFound from '@/components/NotFound';
import RealTimeSubway from '@/components/RealTimeSubway';
import { colorDynamic } from '@/components/subwayInfo';
import dynamic from 'next/dynamic';

export default function Page({ params }: { params: { slug: string } }) {
  const url = decodeURIComponent(params.slug).split(',');
  const existUrl = url[0];
  const exist = Object.keys(colorDynamic).find((el) => el === existUrl);
  if (!exist) return <NotFound />;
  return <RealTimeSubway props={url} />;
}
