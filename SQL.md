```sql
CREATE TABLE metro(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    hex CHAR(7) NOT NULL,
    path VARCHAR(100) NOT NULL,
    direct boolean NOT NULL DEFAULT 0
);
```

```sql
INSERT INTO metro(name, hex, path, direct) VALUES('1호선', '#0033A0', '소요산 - 인천/신창', 1);
INSERT INTO metro(name, hex, path, direct) VALUES('2호선', '#00B140', '시청 - 시청', 0);
INSERT INTO metro(name, hex, path, direct) VALUES('3호선', '#FC4C02', '대화 - 오금', 0);
INSERT INTO metro(name, hex, path, direct) VALUES('4호선', '#30E6FF', '진접 - 오이도', 0);
INSERT INTO metro(name, hex, path, direct) VALUES('5호선', '#A05EB5', '방화 - 하남검단산/마천', 0);
INSERT INTO metro(name, hex, path, direct) VALUES('6호선', '#C75D28', '응암 - 신내', 0);
INSERT INTO metro(name, hex, path, direct) VALUES('7호선', '#6D712E', '장암 - 석남', 0);
INSERT INTO metro(name, hex, path, direct) VALUES('8호선', '#E31C79', '암사 - 모란', 0);
INSERT INTO metro(name, hex, path, direct) VALUES('9호선', '#ACAA88', '중앙보훈병원 - 개화', 1);
INSERT INTO metro(name, hex, path, direct) VALUES('우이신설선', '#C7D138', '북한산우이 - 신설동', 0);
INSERT INTO metro(name, hex, path, direct) VALUES('경의중앙선', '#72C6A6', '문산 - 지평', 0);
INSERT INTO metro(name, hex, path, direct) VALUES('경춘선', '#168C72', '청량리 - 춘천', 0);
INSERT INTO metro(name, hex, path, direct) VALUES('수인분당선', '#F2A900', '청량리 - 인천', 0);
INSERT INTO metro(name, hex, path, direct) VALUES('서해선', '#84BD00', '일산 - 원시', 0);
INSERT INTO metro(name, hex, path, direct) VALUES('공항철도', '#33BAFF', '서울역 - 인천공항2터미널', 1);
INSERT INTO metro(name, hex, path, direct) VALUES('신분당선', '#BA0C2F', '신사 - 광교', 0);
INSERT INTO metro(name, hex, path, direct) VALUES('경강선', '#0066FF', '여주 - 판교', 0);
INSERT INTO metro(name, hex, path, direct) VALUES('신림선', '#558BCF', '지원하지 않음', 0);
```

```sql
CREATE TABLE line_2호선(
    TOTAL_COUNT int not null,
    STATION_CD varchar(10) not null,
    STATION_NM varchar(100) not null,
    STATION_NM_ENG varchar(100) not null,
    LINE_NUM varchar(50) not null,
    FR_CODE varchar(20) not null UNIQUE KEY,
    STATION_NM_CHN varchar(100) not null,
    STATION_NM_JPN varchar(100) not null,
    STATION_ORDER INT not null DEFAULT 1
);
```

```sql
UPDATE line_6호선 SET STATION_ORDER = 1 WHERE STATION_NM = "역촌";
UPDATE line_6호선 SET STATION_ORDER = 2 WHERE STATION_NM = "불광";
UPDATE line_6호선 SET STATION_ORDER = 3 WHERE STATION_NM = "독바위";
UPDATE line_6호선 SET STATION_ORDER = 4 WHERE STATION_NM = "연신내";
UPDATE line_6호선 SET STATION_ORDER = 5 WHERE STATION_NM = "구산";
UPDATE line_6호선 SET STATION_ORDER = 6 WHERE STATION_NM = "응암";
```