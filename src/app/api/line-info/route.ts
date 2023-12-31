import { NextRequest, NextResponse } from 'next/server';
import type { Station, SystemError } from '@/export/type';
import mysql from 'mysql2/promise';
import { mysqlConnect } from '@/export/db';

export async function GET(req: NextRequest) {
  let line: string = req.nextUrl.searchParams.get('line')?.trim() as string;
  const originalLineName = line.slice();
  switch (line) {
    case '우이신설선':
      line = '우이신설경전철';
      break;
    case '경의중앙선':
      line = '경의선';
      break;
    case '2호선':
      line = '02호선';
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
    /** 02호선 -> 2호선 변경 작업 */
    if (line.charAt(0) === '0') line = line.slice(1);
    /** 지하철 노선에 맞게 역 개수 확인 */
    const [queryResults] = await dbconnection.execute(
      `SELECT TOTAL_COUNT FROM line_${line} LIMIT 1`,
      []
    );
    /** 역 정보가 일치하지 않을 경우 추가 */
    // if (Object.values(queryResults[0])[0] !== res.list_total_count) {
    /** 이미 있는 역들은 total_count가 업데이트되고, 없는 역은 추가한다 */
    res.row.map(async (data: Station) => {
      /** res에서 받은 01, 02호선 첫번째 문자열을 숫자로 변경이 가능한지, 가능하면 TRUE, 불가능하면 FALSE */
      const numberChk = !isNaN(Number(data.LINE_NUM.charAt(0)));

      let lineNum = data.LINE_NUM;

      /** 만약 숫자일 경우, 맨 앞 숫자 제거 (0 제거하기 위한 수식) */
      if (numberChk) lineNum = data.LINE_NUM.slice(1);

      /** 열차가 통근열차밖에 없는 경우 제거 */
      if (data.STATION_NM === '광명' || data.STATION_NM === '서동탄') return;

      await dbconnection.execute(`INSERT INTO line_${lineNum}(TOTAL_COUNT, STATION_CD, STATION_NM, STATION_NM_ENG, LINE_NUM, FR_CODE, STATION_NM_CHN, STATION_NM_JPN, STATION_ORDER)
      SELECT ${res.list_total_count}, "${data.STATION_CD}", "${data.STATION_NM}", "${data.STATION_NM_ENG}", "${lineNum}", "${data.FR_CODE}", "${data.STATION_NM_CHN}", "${data.STATION_NM_JPN}", IFNULL(MAX(STATION_ORDER), 0) + 1 FROM line_${lineNum} ON DUPLICATE KEY UPDATE TOTAL_COUNT = ${res.list_total_count}`);
    });
    // }
    /** 업데이트한 목록을 검색 */
    const query = `SELECT * FROM line_${line} WHERE line_num = "${line}" ORDER BY STATION_ORDER ASC`;
    const [results] = await dbconnection.execute(query, values);
    dbconnection.end();
    return NextResponse.json(results);
  } catch (error) {
    const err = error as SystemError;
    console.log('데이터 요청에 실패했습니다.', error);
    return NextResponse.json({ message: '데이터 요청에 실패했습니다.' });
  }
}
