'use client';

import { useEffect, useState } from 'react';

export default function RealTimeSubway({ props }) {
  const [pos, setPos] = useState();
  const getPosition = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/position?line=${props}`,
      {
        next: { revalidate: 10 },
      }
    ).then((res) => res.json());
    console.log('res: ', res);
    if (res.message) {
    }
  };
  useEffect(() => {
    getPosition();
  }, []);
  return <div></div>;
}
