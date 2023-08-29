'use client';

import { Station } from '@/app/api/line-info/route';
import { useEffect, useState } from 'react';

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
  const [cal, setCal] = useState(true);
  const [arrival, setArrival] = useState<ArrivalStatus[]>([]);

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

  useEffect(() => {
    getLineInfo();
    getPosition();
  }, []);

  /** 특정 역에서 열차 도착 정보 */
  const ArrivalInformation = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/train-arrival?station=${e.currentTarget.value}`,
      { cache: 'no-cache', next: { revalidate: 15 } }
    ).then((res) => res.json());
    // setArrival(data);
    const upLine = data.filter(
      (sel: ArrivalStatus) =>
        sel.updnLine === '상행' && sel.subwayId === pos[0].subwayId
    );
    const downLine = data.filter(
      (sel: ArrivalStatus) =>
        sel.updnLine === '하행' && sel.subwayId === pos[0].subwayId
    );
    console.log('test', upLine);
    setArrival([upLine.flat(), downLine.flat()]);
  };

  /** 역 정보 */
  const stationInfo = station?.map((station, key) => {
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
      <div
        className={`${station.STATION_NM} text-center flex items-center gap-5 justify-end min-h-[100px]`}
        key={key}
      >
        <div className="flex justify-between w-full">
          <div className="order-1 flex-1">
            {downLine ? (
              <>
                <p>{downLine.statnTnm}</p>
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
                    <p>{downDirect.statnTnm}</p>
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
                    <p>{upDirect.statnTnm}</p>
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
                <p>{upLine.statnTnm}</p>
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
        {/* 특정 역 선택 */}
        {/* {arrival ? (
          <div>
            <p>{arrival.map((station, index) => station.barvlDt)}</p>
          </div>
        ) : null} */}
      </div>
    );
  });

  return (
    <article className="divide-y-2 [&>div]:p-3">
      {loading ? null : (
        <>
          {stationInfo}
          {pos[0].message ? (
            <div className="fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 border-none">
              {pos[0].message}
            </div>
          ) : null}
          {arrival.length !== 0 ? (
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span></span>
              {arrival[0].map((item, key) => (
                <p key={key}>
                  {Math.floor(item.barvlDt / 60) > 0
                    ? Math.floor(item.barvlDt / 60) + '분'
                    : ''}{' '}
                  {item.barvlDt % 60}초
                </p>
              ))}
            </div>
          ) : null}
        </>
      )}
    </article>
  );
}
