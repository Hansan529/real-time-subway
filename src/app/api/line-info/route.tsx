import { NextRequest, NextResponse } from 'next/server';
import type { SystemError } from '@/export/type';
import mysql from 'mysql2/promise';
import { mysqlConnect } from '@/export/db';

interface Station {
  STATION_CD: string;
  STATION_NM: string;
  STATION_NM_ENG: string;
  LINE_NUM: string;
  FR_CODE: string;
  STATION_NM_CHN: string;
  STATION_NM_JPN: string;
}

export async function GET(req: NextRequest) {
  const line: string = req.nextUrl.searchParams.get('line')?.trim() as string;
  const dbconnection: any = await mysql.createConnection(mysqlConnect);
  try {
    /** 역 정보 데이터 요청 (1일) */
    const { SearchSTNBySubwayLineInfo: res } = await fetch(
      `${process.env.SEOUL_METRO_LINE_INFO_API}${line}`,
      {
        next: { revalidate: 86400 },
      }
    ).then((res) => res.json());
    const values: string[] = [];

    /** 이미 있는 역들은 total_count가 업데이트되고, 없는 역은 추가한다 */
    res.row.map(async (data: Station) => {
      /** 첫번째 문자열을 숫자로 변경이 가능한지, 가능하면 TRUE, 불가능하면 FALSE */
      const numberChk = !isNaN(Number(data.LINE_NUM.charAt(0)));

      let lineNum = data.LINE_NUM;

      /** 만약 숫자일 경우, 맨 앞 숫자 제거 (0 제거하기 위한 수식) */
      if (numberChk) lineNum = data.LINE_NUM.slice(1);

      await dbconnection.execute(`INSERT INTO line_info(total_count, station_cd, station_nm, station_nm_eng, line_num, fr_code, station_nm_chn, station_nm_jpn)
      VALUES(${res.list_total_count}, "${data.STATION_CD}", "${data.STATION_NM}", "${data.STATION_NM_ENG}", "${lineNum}", "${data.FR_CODE}", "${data.STATION_NM_CHN}", "${data.STATION_NM_JPN}") ON DUPLICATE KEY UPDATE total_count = ${res.list_total_count}`);
    });

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
