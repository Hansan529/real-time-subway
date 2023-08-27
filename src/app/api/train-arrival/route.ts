import { SystemError } from '@/export/type';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('station');
  try {
    const { errorMessage, realtimeArrivalList } = await fetch(
      `${process.env.SEOUL_METRO_STATION_ARRIVAL}/${query}`
    ).then((res) => res.json());
    // * 에러 상태 체크
    switch (errorMessage.code) {
      case 'INFO-000':
        break;
      case 'ERROR-300':
        return NextResponse.json(
          { message: '필수 값이 누락되어 있습니다.' },
          { status: 400 }
        );
      case 'INFO-100':
        return NextResponse.json({
          message:
            'API 인증키가 유효하지 않습니다. 요청 횟수를 초과했는지 확인하세요.',
        });
      case 'ERROR-500':
        return NextResponse.json(
          {
            message:
              '서버 오류입니다. 지속적인 경우 서울 열린 데이터 광장으로 문의하세요.',
          },
          { status: 500 }
        );
      case 'ERROR-600':
        return NextResponse.json(
          {
            message:
              '데이터베이스 연결 오류입니다. 지속적인 경우 서울 열린 데이터 광장으로 문의하세요.',
          },
          { status: 500 }
        );
      case 'ERROR-601':
        return NextResponse.json(
          {
            message:
              'SQL 문장 오류입니다. 지속적인 경우 서울 열린 데이터 광장으로 문의하세요.',
          },
          { status: 500 }
        );
      default:
        return NextResponse.json(
          { message: '존재하지 않는 사항입니다' },
          { status: 404 }
        );
    }
    return NextResponse.json(realtimeArrivalList);
  } catch (error) {
    const err = error as SystemError;
    console.log('API 요청에 실패했습니다.', err);
    return NextResponse.json(
      { message: '데이터 요청에 실패했습니다.' },
      { status: 400 }
    );
  }
}
