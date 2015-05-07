    var http = require('http'),
      fs = require('fs'),
      path = require('path'),
      mime = require('mime'),
      juke_server = require('./server/ServerNodeJS.js'),
      server = {},
      cache = {},
      options = {};

    options.port = 33333;
    options.isCacheEnabled = false;
    options.isDebugingMode = true;
    options.absolutePath = "public_html/";

    
    // http server creation
    server = http.createServer(function (request, response) {
      var filePath = false;

      if (request.url === '/') {
        filePath = '/index.html';
      } else {
        filePath = request.url;
      }

      var absPath = options.absolutePath + filePath;
      serveStatic(response, cache, absPath);
    });

    // http server
    server.listen(options.port, function () {
      reportStatus();
    });

    function reportStatus() {
      console.log("-------------- Server status: --------------");
      console.log("Status           : Started");
      console.log("Port             : " + options.port);
      console.log("Debuging Mode    : " + options.isDebugingMode);
      console.log("Is cache enabled : " + options.isCacheEnabled);
      console.log("Absolute path    : " + options.absolutePath);
      console.log("-------------- Server is up   --------------\n");
    }

    // juke server
    juke_server.listen(server);

    function serveStatic(response, cache, absPath) {

      if (options.isDebugingMode) {
        console.log("Requested page: " + absPath);
      }

      if (options.isCacheEnabled && cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
      } else {
        fs.exists(absPath, function (exists) {
          if (exists) {
            fs.readFile(absPath, function (err, data) {
              if (err) {
                if (options.isDebugingMode) {
                  console.log("The request " + absPath + " is not on the server");
                }
                send404(response);
              } else {
                if (options.isCacheEnabled) {
                  cache[absPath] = data;
                }
                sendFile(response, absPath, data);
              }
            });
          } else {
            send404(response);
          }
        });
      }
    }

    function send404(response) {
      response.writeHead(404, {
        'Content-Type': 'text/plain'
      });
      response.write("Error 404: I did not find that page");
      response.end();
    }

    function sendFile(response, filePath, fileContents) {
      response.writeHead(
      200, {
        "content-type": mime.lookup(path.basename(filePath))
      });
      response.end(fileContents);
    }