'use client';

import { Station } from '@/app/api/line-info/route';
import { branchLine } from '@/export/branchLine';
import { SystemError } from '@/export/type';
import React, { useEffect, useState } from 'react';

// ^ 타입
export interface SubwayPosition {
  /** 데이터 건 수 */
  totalCount: number;
  /** 지하철호선ID 
  (1001:1호선, 1002:2호선, 1003:3호선, 1004:4호선, 1005:5호선 1006:6호선, 1007:7호선, 1008:8호선, 1009:9호선, 1063:경의중앙선, 1065:공항철도, 1067:경춘선, 1075:수인분당선 1077:신분당선, 1092:우이신설선, 1093:서해선) */
  subwayId: string;
  /** 지하철호선명 */
  subwayNm: string;
  /** 지하철역ID */
  statnId: string;
  /** 지하철역명 */
  statnNm: string;
  /** 열차번호 */
  trainNo: string;
  /** 최종수신날짜 */
  lastRecptnDt: string;
  /** 최종수신시간 */
  recptnDt: string;
  /** 상하행성구분 0:상행/내선, 1:하행/외선 */
  updnLine: string;
  /** 종착지하철역ID */
  statnTid: string;
  /**종착지하철역명 */
  statnTnm: string;
  /** 열차상태구분 0:진입 1:도착 2:출발 3:전역출발 */
  trainSttus: string;
  /** 급행여부 1:급행, 0:아님 */
  directAt: string;
  /** 막차여부 1:막차, 0:아님 */
  lstcarAt: string;
  message?: string;
}

interface ArrivalStatus {
  subwayId: string;
  updnLine: string;
  /** 도착지방면 (성수행(목적지역) - 구로디지털단지방면(다음역)) */
  trainLineNm: string;

  /** 이전지하철역ID */
  statnFid: string;
  /** 다음지하철역ID */
  statnTid: string;
  /** 지하철역ID */
  statnId: string;
  /** 지하철역명 */
  statnNm: string;
  /** 환승노선수 */
  trnsitCo: string;
  /** 도착예정열차순번
   * (상하행코드(1자리), 순번(첫번째, 두번째 열차 , 1자리), 첫번째 도착예정 정류장 - 현재 정류장(3자리), 목적지 정류장, 급행여부(1자리))*/
  ordkey: string;
  /** 연계호선ID
   * (1002, 1007 등 연계대상 호선 ID)
   */
  subwayList: string;
  /** 연계지하철역ID
   * (1002000233, 1007000000)
   */
  statnList: string;
  /** 열차종류 (급행,ITX) */
  btrainSttus: string;
  /** 열차도착예정시간 (단위:초)*/
  barvlDt: string;
  /** 열차번호 */
  btrainNo: string;
  /** 종착지하철역ID */
  bstatnId: string;
  /** 종착지하철역명 */
  bstatnNm: string;
  /** 열차도착정보를 생성한 시각 */
  recptnDt: string;
  /** 첫번째도착메세지 (도착, 출발 , 진입 등) */
  arvlMsg2: string;
  /** 두번째도착메세지
(종합운동장 도착, 12분 후 (광명사거리) 등) */
  arvlMsg3: string;
  /** 도착코드 (0:진입, 1:도착, 2:출발, 3:전역출발, 4:전역진입, 5:전역도착, 99:운행중) */
  arvlCd: string;
}

export default function RealTimeSubway({ props }: { props: string[] }) {
  const [pos, setPos] = useState<SubwayPosition[]>([]);
  const [station, setStation] = useState<Station[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [arrival, setArrival] = useState([[]]);
  const [selectStation, setSelectStation] = useState<string>();

  const getLineInfo = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/line-info?line=${props[0]}`
    ).then((res) => res.json());
    setStation(res);
  };

  const getPosition = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/position?line=${props[0]}`,
      {
        next: { revalidate: 10 },
      }
    ).then((res) => res.json());
    setPos(res);
    setLoading(false);
  };

  /** 열차 상태 */
  const subwayStatus = (num: string) => {
    switch (Number(num)) {
      case 0:
        return '진입';
      case 1:
        return '도착';
      case 2:
        return '출발';
      default:
        return '운행';
    }
  };

  /** 구간별로 나누어져있는 호선들의 방향을 나누기 위해 사용하는 함수 */
  const dynamicLine = (stationItem: Station) => {
    for (const branch of branchLine) {
      const [key, ...value] = branch;
      const line = key.line;

      // 라인이 일치하는지 체크
      if (stationItem.LINE_NUM === line) {
        for (const obj of value) {
          const [startStation, endStation] = Object.entries(obj)[0];

          if (stationItem.STATION_NM === startStation)
            return ['text-sky-500', `${startStation} - ${endStation}`];
        }
      }
    }
    return '';
  };

  useEffect(() => {
    getLineInfo();
    getPosition();
  }, []);

  /** 특정 역에서 열차 도착 정보 */
  const ArrivalInformation = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    /** 서울시 지하철 실시간 도착정보 API의 요청 역이 다름으로 인해서
     * 일부 역 요청코드의 변경으로 인해 이와 같은 코드 수정 작업이 사용되었음
     */
    let station = e.currentTarget.value;
    switch (station) {
      case '서울역':
        station = '서울';
        break;
      case '응암':
        station = '응암순환(상선)';
        break;
      case '공릉':
        station = '공릉(서울산업대입구)';
        break;
      case '남한산성입구':
        station = '남한산성입구(성남법원, 검찰청)';
        break;
      case '대모산입구':
        station = '대모산';
        break;
      case '천호':
        station = '천호(풍납토성)';
        break;
      case '몽촌토성':
        station = '몽촌토성(평화의문)';
        break;
      default:
        break;
    }
    setSelectStation(station);
    const limit = 2;
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/train-arrival?station=${station}`,
      { cache: 'no-cache', next: { revalidate: 15 } }
    ).then((res) => res.json());

    /** 순서 추출 */
    function sortNumber(num: string) {
      /** 전역 도착일 경우 최우선 순으로 하도록 설정 */
      if (num === '전역 도착' || num.match('진입')) return 0;
      else if (num === undefined || null) return;
      /** [number] 추출하기 위한 정규 표현식 */
      const match = /\[(\d+)\]/g;
      const result = match.exec(num) as RegExpExecArray;
      /** result가 있을 경우 숫자로 변환 */
      return result ? parseInt(result[1]) : 0;
    }

    /** 상행, 하행 도착 열차 Limit 개수만큼 */
    const upLine = data.filter(
      (sel: ArrivalStatus) =>
        (sel.updnLine === '상행' || sel.updnLine === '내선') &&
        sel.subwayId === pos[0].subwayId
    );

    const orderUpLine = upLine
      .map((el: ArrivalStatus) => {
        return {
          ...el,
          order: sortNumber(el.arvlMsg2),
        };
      })
      .sort((a: { order: number }, b: { order: number }) => a.order - b.order)
      .slice(0, limit);

    const downLine = data.filter(
      (sel: ArrivalStatus) =>
        (sel.updnLine === '하행' || sel.updnLine === '외선') &&
        sel.subwayId === pos[0].subwayId
    );

    const orderDownLine = downLine
      .map((el: ArrivalStatus) => {
        return {
          ...el,
          order: sortNumber(el.arvlMsg2),
        };
      })
      .sort((a: { order: number }, b: { order: number }) => a.order - b.order)
      .slice(0, limit);

    setArrival([orderUpLine, orderDownLine]);
  };

  /** 역 정보 */
  const stationInfo = station?.map((station, key) => {
    /** 실시간 지하철 위치를 확인할 수 없는 경우 */
    if (pos.length === 0) {
      return (
        <div key={key}>
          {dynamicLine(station) !== '' ? (
            <div className={`${dynamicLine(station)[0]}`}>
              {dynamicLine(station)[1]}
            </div>
          ) : null}
          <div
            id={`${station.STATION_NM}`}
            className={`text-center flex items-center gap-5 justify-end min-h-[100px]`}
          >
            <div className="flex justify-between w-full">
              <div className="order-1 flex-1"></div>
              <div className="order-2 flex-1"></div>
              <div className="order-3 flex-1"></div>
              <div className="order-4 flex-1"></div>
            </div>
          </div>
          <div className="order-last min-w-[130px]">
            <button value={station.STATION_NM}>{station.STATION_NM}</button>
          </div>
        </div>
      );
    }
    /** 역 이름과 일치하는 열차 위치 상태 */
    const stationTrain: SubwayPosition[] = pos.filter(
      (item) => item.statnNm === station.STATION_NM
    );

    /** 상행선 함수 */
    const upLine = stationTrain.find(
      (el) => el.updnLine === '0' && el.directAt === '0'
    );
    /** 상행선 급행 함수 */
    const upDirect = stationTrain.find(
      (el) => el.updnLine === '0' && el.directAt === '1'
    );
    /** 하행선 함수 */
    const downLine = stationTrain.find(
      (el) => el.updnLine === '1' && el.directAt === '0'
    );
    /** 하행선 급행 함수 */
    const downDirect = stationTrain.find(
      (el) => el.updnLine === '1' && el.directAt === '1'
    );

    return (
      <div key={key}>
        {dynamicLine(station) !== '' ? (
          <div className={`${dynamicLine(station)[0]}`}>
            {dynamicLine(station)[1]}
          </div>
        ) : null}
        <div
          id={`${station.STATION_NM}`}
          className={`text-center flex items-center gap-5 justify-end min-h-[100px]`}
        >
          <div className="flex justify-between w-full">
            <div className="order-1 flex-1">
              {downLine ? (
                <>
                  <p>
                    {downLine?.subwayNm !== '서해선'
                      ? downLine.statnTnm
                      : '원시'}
                  </p>
                  <p>{downLine.trainNo}</p>
                  <p>{subwayStatus(downLine.trainSttus)}</p>
                  {downLine.lstcarAt === '1' ? <p>막차</p> : null}
                </>
              ) : null}
            </div>
            {/** 급행 열차 */}
            {props.length > 1 ? (
              <>
                <div className="order-2 flex-1">
                  {downDirect ? (
                    <>
                      <p>
                        {downDirect?.subwayNm !== '서해선'
                          ? downDirect.statnTnm
                          : '원시'}
                      </p>
                      <p>{downDirect.trainNo}</p>
                      <p>{subwayStatus(downDirect.trainSttus)}</p>
                      <p>급행</p>
                      {downDirect.lstcarAt === '1' ? <p>막차</p> : null}
                    </>
                  ) : null}
                </div>
                <div className="order-3 flex-1">
                  {upDirect ? (
                    <>
                      <p>
                        {upDirect?.subwayNm !== '서해선'
                          ? upDirect.statnTnm
                          : '대곡'}
                      </p>
                      <p>{upDirect.trainNo}</p>
                      <p>{subwayStatus(upDirect.trainSttus)}</p>
                      <p>급행</p>
                      {upDirect.lstcarAt === '1' ? <p>막차</p> : null}
                    </>
                  ) : null}
                </div>
              </>
            ) : null}
            <div className="order-4 flex-1">
              {upLine ? (
                <>
                  <p>
                    {upLine?.subwayNm !== '서해선' ? upLine.statnTnm : '일산'}
                  </p>
                  <p>{upLine.trainNo}</p>
                  <p>{subwayStatus(upLine.trainSttus)}</p>
                  {upLine.lstcarAt === '1' ? <p>막차</p> : null}
                </>
              ) : null}
            </div>
          </div>
          <div className="order-last min-w-[130px]">
            <button onClick={ArrivalInformation} value={station.STATION_NM}>
              {station.STATION_NM}
            </button>
          </div>
        </div>
      </div>
    );
  });

  return (
    <article className="divide-y-2 [&>div]:p-3">
      {loading ? null : (
        <>
          {stationInfo}
          {arrival.length !== 0 ? (
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white">
              <span>{selectStation}</span>
              <div className="flex gap-10 mb-10">
                {arrival[0] ? (
                  arrival[0].map((item: ArrivalStatus, key: number) => (
                    <div key={key}>
                      <p>{item.updnLine}</p>
                      {/* 열차 위치 */}
                      <p>{item.arvlMsg3}</p>
                      {/* n번째 역 */}
                      <p>{item.arvlMsg2}</p>
                      {/* 차량 번호 */}
                      <p>{item.btrainNo}</p>
                      {/* 차량 도착 예정 시간 */}
                      <p>{item.barvlDt}s</p>
                      {Math.floor(Number(item.barvlDt) / 60) > 0 ? (
                        <>
                          <span>
                            {Math.floor(Number(item.barvlDt) / 60)}분{' '}
                            {Number(item.barvlDt) % 60}
                          </span>
                          <span>초</span>
                        </>
                      ) : null}
                      <p>{item.btrainSttus}</p>
                    </div>
                  ))
                ) : (
                  <div>상행 도착 정보가 없습니다.</div>
                )}
              </div>
              <div className="flex gap-10">
                {arrival[1] ? (
                  arrival[1].map((item: ArrivalStatus, key: number) => (
                    <div key={key}>
                      <p>{item.updnLine}</p>
                      {/* 열차 위치 */}
                      <p>{item.arvlMsg3}</p>
                      {/* n번째 역 */}
                      <p>{item.arvlMsg2}</p>
                      {/* 차량 번호 */}
                      <p>{item.btrainNo}</p>
                      {/* 차량 도착 예정 시간 */}
                      <p>{item.barvlDt}s</p>
                      {Math.floor(Number(item.barvlDt) / 60) > 0 ? (
                        <>
                          <span>
                            {Math.floor(Number(item.barvlDt) / 60)}분{' '}
                            {Number(item.barvlDt) % 60}
                          </span>
                          <span>초</span>
                        </>
                      ) : null}
                      <p>{item.btrainSttus}</p>
                    </div>
                  ))
                ) : (
                  <div>하행 도착 정보가 없습니다.</div>
                )}
              </div>
            </div>
          ) : null}
        </>
      )}
    </article>
  );
}
