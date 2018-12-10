var http = require('http');
var url = require('url');
var wikis= require('./lib/wikis');


var app = http.createServer(function(request,response){
      var _url = request.url;
      var queryData = url.parse(_url, true).query;
      var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        wikis.home(request,response);
      }else{
        wikis.page(request, response);
      }
    }else if(pathname === '/category/'){
      wikis.category(request, response);
    }else if(pathname === '/rank'){
      wikis.rank(request, response);
    }else if(pathname === '/create'){
      wikis.create(request, response);
    } else if(pathname === '/create_process'){
      wikis.create_process(request, response);
    } else if(pathname === '/update'){
      wikis.update(request, response);
    } else if(pathname === '/update_process'){
      wikis.update_process(request, response);
    } else if(pathname === '/category/delete_process'){
      wikis.delete_process(request, response);
    } else {
        response.writeHead(404);
        response.end('Not found');
    } 
});
app.listen(3000, function(){
  console.log('Server On!');
});
