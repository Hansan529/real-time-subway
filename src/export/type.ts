export type SystemError = {
  code: string;
  message: string;
};

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
  /** 환승역 */
  INTERCHANGE: number;
}
