import Link from 'next/link';

export default function NotFound() {
  return (
    <article className="flex flex-col justify-center items-center w-full h-screen">
      <h2 className="text-2xl">찾을 수 없는 페이지입니다</h2>
      <p className="text-sky-500">
        <Link href="/">메인 홈페이지로 이동 &rarr;</Link>
      </p>
    </article>
  );
}
