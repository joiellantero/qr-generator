const http = require('http');
const express = require('express');
const fs = require("fs")
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath = req.url;
  if (filePath === '/')
    filePath = '/index.html';

  filePath = __dirname+filePath;
  let extname = path.extname(filePath);
  let contentType = 'text/html';

  switch (extname) {
      case '.js':
          contentType = 'text/javascript';
          break;
      case '.css':
          contentType = 'text/css';
          break;
  }

  fs.exists(filePath, function(exists) {
      if (exists) {
          fs.readFile(filePath, function(error, content) {
              if (error) {
                  res.writeHead(500);
                  res.end();
              }
              else {                   
                  res.writeHead(200, { 'Content-Type': contentType });
                  res.end(content, 'utf-8');                  
              }
          });
      }
  })
})

const hostname = 'localhost';
const port = 3000;

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});