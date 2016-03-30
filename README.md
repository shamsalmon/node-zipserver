# node-zipserver

I wrote this so I could share music with my family easily. Needs npm to install archiver socket.io express http and fs

Install nodejs with your respective distro.
npm install express http socket.io archiver

Install nginx or apache then either place the files in the html folder in your www folder for each or create a symbolic link to where the html files are located.

Modify server.js to the base path of files you want to serve.
Modify client.js to the ip:port your server.js is listening on. These have to be on the same domain because of same-origin policies. There are tricks to make it on the same port with the same server as nginx/apache by using subdomains 

Here are some images:

![Alt text](https://github.com/shamsalmon/node-zipserver/blob/master/images/screen1.png?raw=true "Optional Title")
![Alt text](https://github.com/shamsalmon/node-zipserver/blob/master/images/screen2.png?raw=true "Optional Title")
![Alt text](https://github.com/shamsalmon/node-zipserver/blob/master/images/screen3.png?raw=true "Optional Title")
