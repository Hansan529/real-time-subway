interface ColorList {
  [key: string]: string;
}

class Metro {
  color(name: string, path: string, key: any) {
    const colorDynamic: ColorList = {
      '1호선': 'border-b-[#0033A0]',
      '2호선': 'border-b-[#00B140]',
      '3호선': 'border-b-[#FC4C02]',
      '4호선': 'border-b-[#30E6FF]',
      '5호선': 'border-b-[#A05EB5]',
      '6호선': 'border-b-[#C75D28]',
      '7호선': 'border-b-[#6D712E]',
      '8호선': 'border-b-[#E31C79]',
      '9호선': 'border-b-[#ACAA88]',
      우이신설선: 'border-b-[#C7D138]',
      경의중앙선: 'border-b-[#72C6A6]',
      경춘선: 'border-b-[#168C72]',
      수인분당선: 'border-b-[#F2A900]',
      서해선: 'border-b-[#84BD00]',
      공항철도: 'border-b-[#33BAFF]',
      신분당선: 'border-b-[#BA0C2F]',
      경강선: 'border-b-[#0066FF]',
      // 미지원
      신림선:
        'relative before:absolute before:w-full before:h-full before:top-0 before:left-0 before:block before:bg-gray-500/50 border-b-[#558BCF]',
    };
    return (
      <div
        key={key}
        className={`overflow-hidden shadow-xl p-5 rounded-xl border-b-[10px] ${colorDynamic[name]}`}
        style={{ backgroundSize: '100%, 50px' }}
      >
        <h2>{name}</h2>
        <span className="text-xs">{path}</span>
      </div>
    );
  }
}
const metroList = new Metro();

export default async function SubwaySelect() {
  const { results } = await fetch('http://localhost:3000/api/data', {
    cache: 'no-cache',
  }).then((res) => res.json());
  if (!results) {
    return <div>데이터베이스에 접속이 불가능한 상태입니다.</div>;
  }

  return (
    <article className="p-5">
      <div className="grid grid-cols-2 gap-5">
        {results.map((el: string[], index: number) => {
          return metroList.color(
            Object.values(el)[1],
            Object.values(el)[3],
            index
          );
        })}
      </div>
    </article>
  );
}
