import mysql, { createPool } from 'mysql2/promise';
import { NextResponse } from 'next/server';
import { mysqlConnect } from '@/export/db';
import { SystemError } from '@/export/type';

export async function GET(req: Request) {
  const dbconnection = await mysql.createConnection(mysqlConnect);

  try {
    const query = 'SELECT * FROM metro';
    // 전체 목록을 다 가져오기
    const values: string[] = [];
    // SELECT * FROM metro WHERE []
    const [results] = await dbconnection.execute(query, values);
    dbconnection.end();
    return NextResponse.json({ results });
  } catch (error: unknown) {
    const err = error as SystemError;
    if (err.code === 'ENOENT') {
      console.log('Files not exists');
    }
    console.error('데이터베이스 접속에 실패했습니다', err);
    return NextResponse.json({ error: err.message });
  }
}
