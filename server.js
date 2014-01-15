function processPost(request, origin, response, callback) {
    var queryData = "";
    if(typeof callback !== 'function') return null;

    if(request.method == 'POST') {
        request.on('data', function(data) {
            queryData += data;
            if(queryData.length > 1e6) {
                queryData = "";
                response.writeHead(413, {'Content-Type': 'text/plain'}).end();
                request.connection.destroy();
            }
            else
            {
                 response.writeHead(
                    200,
                    {
                        "access-control-allow-origin": origin,
                        "content-type": "text/plain",
                    }
                );
            }
        });

        request.on('end', function() {
            response.post = querystring.parse(queryData);
            callback();
        });

    } else {
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end();
    }
}


var dbHelper = require("./dbHelper");
dbHelper.connectToDb;
var parser = require("./parser.js");
var sys = require("sys"),  
my_http = require("http"); 
var url = require('url') ;
var querystring = require('querystring');


my_http.createServer(function(request,response){ 
    
    console.log("called to my server");
    
    var origin = (request.headers.origin || "*");
  console.log("origin is - " + origin);
         
  if(request.method == 'POST') 
  {
       processPost(request,origin, response, function() {
            console.log(response.post);
            console.log('got response');
            var queryData = response.post;
            console.log("query is - " + queryData.header);
            if (queryData.header !== undefined)
             {
                parser.parse("post", queryData, function(responseData){
                var responseDataStr = JSON.stringify(responseData);
                    response.writeHead(
                    200,
                    {
                        "access-control-allow-origin": origin,
                        "content-type": "text/plain",
                    }
                );
                response.write(responseDataStr);
                response.end();
                console.log("response sent from post" + " " + responseData.ok);
            });
            
             }
             else
             {
                  console.log("request undefined");
                   response.writeHead(
                    200,
                    {
                        "access-control-allow-origin": origin,
                        "content-type": "text/plain",
                    }
                );
                  response.write("request undefined");
                  response.end();
             }
                
            });
  }
  else
  {
       var queryData;
        queryData = url.parse(request.url, true).query;
        console.log("query is - " + queryData.header);
        if (queryData.header !== undefined)
        {
            parser.parse("get", queryData, function(responseData){
                var responseDataStr = JSON.stringify(responseData);
                    response.writeHead(
                    200,
                    {
                        "access-control-allow-origin": "*",
                        "content-type": "text/plain",
                    }
                );
                
                response.write(responseDataStr);
                response.end();
                console.log("response sent from get" + " " + responseData.ok);
            });
        }
        else
        {
            console.log("request undefined");
            response.write("request undefined");
            response.end();
        }
  }
}).listen(process.env.PORT);  















