var db= require('./db');
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');


exports.home = function(request,response){
    db.query(`SELECT *from wiki`, function(_error, wikis){
        db.query(`SELECT *from category`, function(_error, category){
    
        
       var title = '환영합니다.';
       var description = '허은위키는 위키백과, 나무위키에서 파생된 자신만의 위키로 지식의 뿌리를 누구나 기여할 수 있는 위키입니다.<br> 모두가 함께 만들어가며 누구나 자유롭게 쓸 수 있는. 인터넷 백과사전입니다. 모두 자유 콘텐츠를 위한 것으로 일정한 요건을 갖추면 사용에 제약을 받지 않습니다.';
       var categorylist = template.categorylist(category);
       var list = template.list(wikis);
       var html = template.HTML(title, categorylist,list,
         `<h2>${title}</h2>${description}`,
         `
         <table border="0">
         <tr>
          <td>
            <a onclick="showHide('comment')" onfocus="this.blur()"><h4><u>위키 추가하기</u></h4></a>
            <div id="comment" style="display:none;">
              <a href="/create">위키 생성</a>
            </div>
          </td>
         </tr>
         </table>`);
       response.writeHead(200);
       response.end(html);
     })
      });
}
exports.page =function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT *FROM category`, function(error, categories){
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM category LEFT JOIN wiki ON wiki.category_id=category.ct_id WHERE category.ct_id=?`,[queryData.id], function(error2, category){
          if(error2){
            throw error2;
        }
        db.query(`Select *from wiki` , function (_error, wikis){
          if(_error){
            throw _error;
          }
          var category_name = category[0].name;
          var categorylist = template.categorylist(categories);
          var list = template.list(category);
          var html = template.HTML(category_name, categorylist, list, 
            `<div class="swiper-container">${list}</div><h2>${category_name}</h2>
            안녕하세요.<br>
            ${category[0].name} 카테고리입니다.
            
            `, `
            <table border="0">
            <tr>
             <td>
               <a onclick="showHide('comment')" onfocus="this.blur()"><h4><u>위키 추가하기</u></h4></a>
               <div id="comment" style="display:none;">
                 <a href="/create">위키 생성</a>
               </div>
             </td>
            </tr>
            </table>`);
            response.writeHead(200);
            response.end(html);
          })
        })
        });
          
}

exports.category = function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    if(queryData.id === 'NULL'){
        response.writeHead(302, {Location: `/?id=${qs.escape(result.insertId)}`});
        response.end();
      }else{
        db.query(`SELECT *FROM category`, function(error, categories){
          if(error){
            throw error;
          }
          db.query(`SELECT ct_id, name, wiki.id as 'w_id', title, description, created, writer_id, count, category_id, writer.id, w_name 
          FROM category left JOIN wiki ON wiki.category_id=category.ct_id left join writer ON wiki.writer_id = writer.id WHERE wiki.id =?`,[queryData.id], function(error2, category){
            if(error2){
              throw error2;
          }
          
            var title = category[0].title;
            var description = category[0].description;
            var created = category[0].created;
            var categorylist = template.categorylist(categories);
            var list = template.list(category);
            console.log(category[0].w_id);
            db.query(`UPDATE wiki set count=count+1 where wiki.id=?`, [queryData.id], function(_error, _result){

            
            var newstr = description.replace(/--/gi, '<hr>');
            var newstr2 =newstr.replace(/h~/gi, '<h2>');
            var newstr3= newstr2.replace(/~h/gi, '</h2>');
            var brstr = newstr3.replace(/(?:\r\n|\r|\n)/g, '<br />');
            var html = template.HTML(title, categorylist, list,
              `<ul class="w_ul"><li class="w_li"><a href="#" onClick="history.back();">되돌아가기</a></li></ul>
              <h2>${title}</h2>
              <p class="s1">${category[0].w_name} ${created}</p>
              ${brstr}
              `,
              `
              <table border="0">
              <tr>
              <td>
                <a onclick="showHide('comment')" onfocus="this.blur()"><h4><u>위키 추가하기</u></h4></a>
                <div id="comment" style="display:none;">
                  <a href="/create"><input type="button" value="생성"></a>
                  <a href="/update?id=${queryData.id}"><input type="button" value="수정"> </a>
                  <form action="delete_process" method="post">
                                <input type="hidden" name="id" value="${queryData.id}"> 
                                <input type="submit" value="위키삭제">
                </div>
              </td>
              </tr>
              </table>`);
              response.writeHead(200);
              response.end(html);
            })
          });
        })
      }
}

exports.rank = function(request, response){
    db.query(`SELECT *from wiki order by count desc`, function(error, wikis){
        db.query(`SELECT *FROM category`, function(error, categories){
        var categorylist = template.categorylist(categories);
        var list = '';
        var title = '조회수 순위';
        var html = template.HTML(title, categorylist, list,
          `
          ${template.ranklist(wikis, categories)}
          `, 
          '');
          response.writeHead(200);
          response.end(html);
      })
    })
}

exports.create = function(request, response){
    db.query(`SELECT *FROM category`, function(error, categories){
        db.query(`SELECT * FROM wiki left JOIN category ON wiki.category_id=category.ct_id left join writer ON wiki.writer_id = writer.id`, function(_error, wikis){
          db.query('SELECT * FROM writer', function(_error2, _writers){
            var title = 'CREATE';
            var categorylist = template.categorylist(categories);
            var list = template.list(wikis);
            var html = template.HTML(title, categorylist, list,
              `
            <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="제목" width="500px"></p>
                <p>
                <input type="text" name="writer" placeholder="작성자" width="500px">
                </p>
                <p>
                    ${template.categorySelect(categories)}
                  </p>
                <p>
                  <textarea name="description" placeholder="본문" cols="100" rows="30"></textarea>
                </p>
                <p>
                  <input type="submit" value="발행">
                </p>
              </form>
            `, '');
            response.writeHead(200);
            response.end(html);
          });
        });
      })
}

exports.create_process = function(request, response){
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var name = post.writer;
          
          db.query('SELECT * FROM writer', function(_error2, writers){
             for(var i=0;i<writers.length;i++){
              if (writers[i].name === name){
                db.query(`
                INSERT INTO wiki (title, description, created, writer_id, category_id) 
                  VALUES(?, ?, NOW(), ?, ?)`,
                [post.title, post.description, writers[i].id, post.category], 
                function(error, result){
                  if(error){
                    throw error;
                  }
                  response.writeHead(302, {Location: `/?id=${qs.escape(result.insertId)}`});
                  response.end();
                });
                break;
              } else{ 
                var num = writers.length;
                  db.query(`
                    INSERT INTO writer (w_name) 
                    VALUES(?)`,
                  [post.writer], 
                  function(error, _result){
                  if(error){
                    throw error;
                  }
                  db.query(`
                  INSERT INTO wiki (title, description, created, writer_id, category_id) 
                    VALUES(?, ?, NOW(), ?, ?)`,
                  [post.title, post.description, ++num, post.category], 
                  function(error, result){
                    if(error){
                      throw error;
                    }
                    response.writeHead(302, {Location: `category/?id=${qs.escape(result.insertId)}`});
                    response.end();
                    });
                    
                 });
                 break;
               }
            }
         });
      });
}

exports.update = function(request, response)
{
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT *FROM category`, function(error, categories){
        db.query('SELECT * FROM wiki', function(error, wikis){
          if(error){
            throw error;
          }
          db.query(`SELECT * FROM wiki WHERE id=?`,[queryData.id], function(error2, wiki){
            if(error2){
              throw error2;
            }
            db.query('SELECT * FROM writer', function(_error2, _writers){
            var categorylist = template.categorylist(categories);
            var list = template.list(wikis);
            var writer_name ='';
            var i=0;
            while(i < _writers.length) {
              if(wiki[0].writer_id == _writers[i].id){
                writer_name = _writers[i].w_name;
              }
              i++;
            }
            var html = template.HTML(wiki[0].title, categorylist, list,
              `
              <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${wiki[0].id}">
              <input type="hidden" name="writer_id" value="${wiki[0].writer_id}">
              <p><input type="text" name="title" placeholder="제목" value="${wiki[0].title}"></p>
              <p>
              <input type="text" name="writer" placeholder="작성자" value="${writer_name}" width="500px">
              </p>
              <p>
                    ${template.categorySelect(categories, wiki[0].category_id)}
                  </p>
              <p>
                <textarea name="description" placeholder="본문" cols="100" rows="30">${wiki[0].description}</textarea>
              </p>
              <p>
                <input type="submit" value="발행">
              </p>
            </form>
            `, ``
          );
            response.writeHead(200);
            response.end(html);
            });
          });
        });
      })

}

exports.update_process = function(request, response){
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query('UPDATE writer SET name=? where id=?', [post.writer, post.writer_id], 
          function(_error2, _result2){
            db.query('UPDATE wiki SET title=?, description=?, writer_id=?, category_id =? WHERE id=?', 
            [post.title, post.description, post.writer_id, post.category, post.id], function(_error, _result){
              response.writeHead(302, {Location: `category/?id=${post.id}`});
              response.end();
            })
        });
      });
}

exports.delete_process = function(request, response){
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query('DELETE FROM wiki WHERE id = ?', [post.id], function(error, _result){
            if(error){
              throw error;
            }
            response.writeHead(302, {Location: `/`});
            response.end();
          });
        });
}