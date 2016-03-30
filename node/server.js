var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var baseDirectory = "/your/base/directory";
var Archiver = require('archiver');

function GetFiles(dir, files_) {
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){

        var name = {"path" : files[i], "directory" : false};
        if (fs.statSync(dir + "/" + files[i]).isDirectory()){
          name.directory = true;

        }
        files_.push(name);
    }
    return files_;
}
app.get('/browse', function (req, res) {
  var directory = new Buffer(req.query.dir, 'base64').toString("ascii");
  console.log(directory);
});

app.get('/download', function (req, res) {

  var directory = new Buffer(req.query.dir, 'base64').toString("ascii");
  if (!directory) {

  }
  else {
    console.log("Request to download " + directory);

    var pathSplit = directory.split("/");
    var archive = Archiver('zip');

    archive.on('error', function(err) {
        res.status(500).send({error: err.message});
    });

    archive.on('end', function() {
      console.log('Archive wrote %d bytes', archive.pointer());
    });

    res.attachment(pathSplit[pathSplit.length - 1] + ".zip");

    archive.pipe(res);
    archive.directory(baseDirectory + "/" + directory, "", "");
    archive.finalize();
  }
});


io.on('connection', function(socket){
  socket.on('artists', function(data){
    console.log("List Files command received");
    socket.emit("artists", {"data" : GetFiles(baseDirectory, null)});
  });

  socket.on('browse', function(data) {
    var directory = new Buffer(data.directory, 'base64').toString("ascii");
    socket.emit("browse", {"directory" : directory, "data" : GetFiles(baseDirectory + "/" + directory, null)});
  });

  socket.on('disconnect', function(){

  });

});

server.listen(8000);
