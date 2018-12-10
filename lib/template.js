module.exports = {
  HTML:function(title, categorylist,list, body, control){
    return `
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml" lang="ko" xml:lang="ko">
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="imagetoolbar" content="no" />
    <meta name="copyright" content="" />
    <meta name="language" content="ko" />
    <title>허은위키 - ${title}</title>
    
    
    <!-- 댓글 더 보기 -->
    <script>
    function showHide(id) {
    var obj = document.getElementById(id);
    if (obj.style.display == 'none')
      obj.style.display = 'block';
    else
      obj.style.display = 'none';
    }
    
    
    </script>
    <style tyle="text/css">


    
.w_ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
      overflow: hidden;
      border: 1px solid #e7e7e7;
      background-color: #f3f3f3;
  }
  
.w_li {
      float: left;
  }
  
.w_li a {
      display: block;
      color: #666;
      text-align: center;
      padding: 14px 16px;
      text-decoration: none;
  }
  
.w_li a:hover:not(.active) {
      background-color: #ddd;
  }
  
.w_li a.active {
      color: white;
      background-color: #4CAF50;
  }


 .rank {
    border-top: 1px solid black;
    border-collapse: collapse;
    text-align: center; 
  }
  .rank-h {
    background-color: gainsboro;
    border-bottom: 1px solid black;
    padding: 0.2em;
}

.rank {
    background-color: white;
}

.end{
  border-bottom: 1px solid black;
}

    .ct_ul {
    background-color: #A6A6A6;
    width: 150px;
    list-style-type: none;
    margin: 0;
    padding: 0;
    border: solid 1px black;
    }
    .ct_li { border-bottom: solid 1px black; }
    .ct_li:last-child { border-bottom: none; }
    .ct_li a {
    display: block;
    color: white;
    padding: 8px;
    text-align: center;
    text-decoration: none;
    font-weight: bold;
    }
    .ct_li a.current {
    background-color: #FF6347;
    color: white;
    }
    .ct_li a:hover:not(.current) {
    background-color: #D5D5D5;
    color: #000000;
    }
    #shadow_03 { text-shadow: 2px 2px 5px; }
    
    nav, section {
        float: left;
        position:center;
    }
    section {
        width: 90%;
    }
    article {
        width: 90%;
        margin: 55px;
    }
    
    div#wapper {
        width: 100%;
        text-align: left;
        min-height: 300px;
        margin: 0 auto;
    }
    
    p{

    }
    .s1 { text-shadow: 2px 2px 2px gray; }
    </style>
    </head>
    <body bgcolor="#F3F3F3">
    <h1 id="shadow_03"><center>허은위키<img src="https://kr.seaicons.com/wp-content/uploads/2016/03/Help-Support-icon.png" width="1%" title="이 사이트는 위키 작성시 태그 명령어가 존재합니다.
    구분선을 넣어 범주를 만들 때 구분선은 ex)-- 로 표현하며,
    범주의 제목을 작성 시 ex)h~제목~h를 통하여 범주 제목을 작성할 수 있습니다.
    위키는 자유롭게 생성/수정 가능하며 누구나 기여할 수 있습니다." />
    </center></h1>
    <div id="wapper">
    <ul class="ct_ul"><li class="ct_li"><a href="/">Home</a></li></ul>
    <ul class="ct_ul"><li class="ct_li"><a href="/rank">조회 순위</a></li></ul>
    <nav>
    ${categorylist}
    </nav>
    <section>
    <article>
    ${body}
    ${control}
    </article>
    </section>
    
    </div>
     </body>
     </html>
     `;
  },list:function(wikis){
    var list = '<ul class="w_ul">';
    var i = 0;
    while(i < wikis.length){
      list = list + `<li class="w_li"><a href="/category/?id=${wikis[i].id}">${wikis[i].title}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },categorylist:function(category){
    var list = '<ul class="ct_ul">';
    var i = 0;
    while(i < category.length){
      list = list + `<li class="ct_li"><a href="/?id=${category[i].ct_id}">${category[i].name}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },categorySelect:function(categories, category_id){
    var tag = '';
    var i = 0;
    while(i < categories.length){
      var selected = '';
      if(categories[i].ct_id === category_id) {
        selected = ' selected';
      }
      tag += `<option value="${categories[i].ct_id}"${selected}>${categories[i].name}</option>`;
      i++;
    }
    return `
      <select name="category">
        ${tag}
      </select>
    `
  }, ranklist:function(wikis, categories){
    var td='';
    
      for(var i=0;i<wikis.length;i++){
        for(var j=0;j<categories.length;j++){
          if(categories[j].ct_id === wikis[i].category_id){
            category_td = `<td>${categories[j].name}</td>`;
          }
        }
        
        if(i+1 == wikis.length){
          td += `<tr>
          <td class="end">${i+1}</td>
          ${category_td}
          <td class="end"><a href="category/?id=${wikis[i].id}">${wikis[i].title}</a></td>
          <td class="end">${wikis[i].count}</td>
          
          </tr>`
        }
        else{
          td += `<tr>
          <td>${i+1}</td>
          ${category_td}
          <td><a href="category/?id=${wikis[i].id}">${wikis[i].title}</a></td>
          <td>${wikis[i].count}</td>
          
          </tr>`;
        }
      }
    return `
    <table class="rank" align="center">
          <tr>
             <th class="rank-h">순위</th>
             <th class="rank-h">카테고리</th>
             <th width="80%" class="rank-h">제목</th>
             <th class="rank-h">조회수</th>
           </tr>
           ${td}
     </table>
     `
  }
}