import { NextRequest, NextResponse } from 'next/server';
import type { SystemError } from '@/export/type';
import mysql from 'mysql2/promise';
import { mysqlConnect } from '@/export/db';

export interface Station {
  /** 역 코드 */
  STATION_CD: string;
  /** 역명 */
  STATION_NM: string;
  /** 영문 역명 */
  STATION_NM_ENG: string;
  /** 호선 */
  LINE_NUM: string;
  /** 외부 코드 */
  FR_CODE: string;
  /** 중문 역명 */
  STATION_NM_CHN: string;
  /** 일문 역명 */
  STATION_NM_JPN: string;
}

export async function GET(req: NextRequest) {
  let line: string = req.nextUrl.searchParams.get('line')?.trim() as string;
  switch (line) {
    case '우이신설선':
      line = '우이신설경전철';
      break;
    case '경의중앙선':
      line = '경의선';
      break;
    default:
      break;
  }
  try {
    /** 역 정보 데이터 요청 (1일) */
    const { SearchSTNBySubwayLineInfo: res } = await fetch(
      `${process.env.SEOUL_METRO_LINE_INFO_API}${line}`,
      {
        next: { revalidate: 86400 },
      }
    ).then((res) => res.json());
    const values: string[] = [];

    /** 데이터베이스 접속 */
    const dbconnection: any = await mysql.createConnection(mysqlConnect);
    /** 지하철 노선에 맞게 역 개수 확인 */
    const [queryResults] = await dbconnection.execute(
      `SELECT LIST_TOTAL_COUNT FROM line_info WHERE LINE_NUM = "${line}" LIMIT 1`,
      []
    );

    /** 역 정보가 일치하지 않을 경우 추가 */
    // if (Object.values(queryResults[0])[0] !== res.list_total_count) {
    /** 이미 있는 역들은 total_count가 업데이트되고, 없는 역은 추가한다 */
    res.row.map(async (data: Station) => {
      /** 첫번째 문자열을 숫자로 변경이 가능한지, 가능하면 TRUE, 불가능하면 FALSE */
      const numberChk = !isNaN(Number(data.LINE_NUM.charAt(0)));

      let lineNum = data.LINE_NUM;

      /** 만약 숫자일 경우, 맨 앞 숫자 제거 (0 제거하기 위한 수식) */
      if (numberChk) lineNum = data.LINE_NUM.slice(1);

      await dbconnection.execute(`INSERT INTO line_info(LIST_TOTAL_COUNT, STATION_CD, STATION_NM, STATION_NM_ENG, LINE_NUM, FR_CODE, STATION_NM_CHN, STATION_NM_JPN)
      VALUES(${res.list_total_count}, "${data.STATION_CD}", "${data.STATION_NM}", "${data.STATION_NM_ENG}", "${lineNum}", "${data.FR_CODE}", "${data.STATION_NM_CHN}", "${data.STATION_NM_JPN}") ON DUPLICATE KEY UPDATE LIST_TOTAL_COUNT = ${res.list_total_count}`);
    });
    // }
    /** 업데이트한 목록을 검색 */
    const query = `SELECT * FROM line_info WHERE line_num = "${line}"`;
    const [results] = await dbconnection.execute(query, values);
    dbconnection.end();
    return NextResponse.json(results);
  } catch (error) {
    const err = error as SystemError;
    console.log('데이터 요청에 실패했습니다.', error);
    return NextResponse.json({ message: '데이터 요청에 실패했습니다.' });
  }
}
