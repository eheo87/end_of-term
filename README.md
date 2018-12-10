# end_of-term
2018250068허은 기말과제

Mysql에는 wiki라는 DataBase가 존재하고
category, writer, wiki라는 테이블이 존재합니다.
category에는 ID, CATEGORY_NAME,
writer에는 ID, NAME
wiki에는 ID, TITLE, CREATED, CATEGORY_ID, COUNT, WRITER_ID 칼럼이 존재합니다.



저는 학기중 배운 Mysql을 이용하여
중간고사 과제로 제출한 위키를 데이터베이스화 했습니다.
wiki 데이터베이스 안에
wiki에선 위키 게시글을 관리하는 테이블
writer는 작성자를 관리하는 테이블
category는 카테고리 관리 테이블로 3테이블이 구성돼 있습니다.

소스를 보면 배운 내용까지 잘 정리하면서 진행하였고


중간고사때 지적받았던 메뉴의 개수 문제를 카테고리 테이블을 이용하였고
좌측 메뉴를 카테고리 메뉴로 구성하고
카테고리를 클릭하면 카테고리 페이지가 나오고
위키 메뉴를 따로 만들어 복잡하지 않게 구현하였습니다.

테이블 3개를 조인 시켜서 writer 테이블 id와 
wiki 테이블의 writer id 칼럼을
연결 시켰고, 카테고리테이블의 id와 wiki의 카테고리id 컬럼을 연결시켜
상호 연결되어 잘 작동되는 것을 볼 수 있습니다.

카테고리 querydata.id와 위키 querydata를 서로 충돌하지 않게 하기위하여
위키를 클릭할때 url에 category/ 로 넘어오게하고 wiki querydata.id를 불러오게 하였습니다.


위키를 생성하는 페이지로 오면 작성자랑 카테고리 부분을 추가했고
정상적으로 작동하는 것을 볼 수 있습니다.
수정을 할때도 정상 작동하며, 수정전 카테고리가 자동으로 선택되고
삭제도 정상작동합니다.

그리고 조회 순위 페이지를 만들었는데 
테이블을 반복문으로 만들었고
wiki 테이블에서count 칼럼을 만들어
위키글을 클릭하면 자동으로 count 시키는 update문을 넣어 조회수를 구현하였습니다.

