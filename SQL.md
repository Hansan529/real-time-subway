```sql
CREATE TABLE metro(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    hex CHAR(7) NOT NULL,
    path VARCHAR(100) NOT NULL,
)
```

```sql
INSERT INTO metro(name, hex, path) VALUES('1호선', '#0033A0', '소요산 - 인천/신창');
INSERT INTO metro(name, hex, path) VALUES('2호선', '#00B140', '시청 - 시청');
INSERT INTO metro(name, hex, path) VALUES('3호선', '#FC4C02', '대화 - 오금');
INSERT INTO metro(name, hex, path) VALUES('4호선', '#30E6FF', '진접 - 오이도');
INSERT INTO metro(name, hex, path) VALUES('5호선', '#A05EB5', '방화 - 하남검단산/마천');
INSERT INTO metro(name, hex, path) VALUES('6호선', '#C75D28', '응암 - 신내');
INSERT INTO metro(name, hex, path) VALUES('7호선', '#6D712E', '장암 - 석남');
INSERT INTO metro(name, hex, path) VALUES('8호선', '#E31C79', '암사 - 모란');
INSERT INTO metro(name, hex, path) VALUES('9호선', '#ACAA88', '중앙보훈병원 - 개화');
INSERT INTO metro(name, hex, path) VALUES('우이신설선', '#C7D138', '북한산우이 - 신설동');
INSERT INTO metro(name, hex, path) VALUES('경의중앙선', '#72C6A6', '문산 - 지평');
INSERT INTO metro(name, hex, path) VALUES('경춘선', '#168C72', '청량리 - 춘천');
INSERT INTO metro(name, hex, path) VALUES('수인분당선', '#F2A900', '청량리 - 인천');
INSERT INTO metro(name, hex, path) VALUES('서해선', '#84BD00', '일산 - 원시');
INSERT INTO metro(name, hex, path) VALUES('공항철도', '#33BAFF', '서울역 - 인천공항2터미널');
INSERT INTO metro(name, hex, path) VALUES('신분당선', '#BA0C2F', '신사 - 광교');
INSERT INTO metro(name, hex, path) VALUES('경강선', '#0066FF', '여주 - 판교');
INSERT INTO metro(name, hex, path) VALUES('신림선', '#558BCF', '지원하지 않음');
```