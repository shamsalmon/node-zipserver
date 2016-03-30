var socket = io.connect('http://your.app:8000');
var files = [];
var parent_map = [];
var current_directory = "";
var last_directory = "";

socket.on('connection');

socket.on('connect', function() {
  console.log('Connected to server');
  socket.emit('artists', {"data" : null});
});

socket.on("file", function (data) {
  console.log(data);
});

socket.on('artists', function(msg) {
  hideDownloadButton();
  hideBackButton();

  $("#directory").html("Artists");
  var folders = $("#folders");
  folders.html("");

  for (var i = 0; i < msg.data.length; i++) {
    var fmsg = msg.data[i];
    console.log(fmsg);
    if (fmsg.directory == false)
      continue;
    folders.append(
      $("<div>").addClass("mdl-cell").append(
        $("<h5>").append(
          $("<a>")
            .on('click', function () {
              console.log("Browsing directory: " + this.artist);
              socket.emit('browse', {"directory" : btoa(this.artist)});
              //window.open("http://sshannon.servebeer.com:8000/browse?dir=" + btoa(this.artist));
            }.bind({artist:fmsg.path}))
            .attr("href", "#")
            .append(fmsg.path)
    )));
  }
});

function addTorrent(folders, path) {
  folders.append(
    $("<div>").addClass("mdl-cell--12-col").append(
      $("<div>").addClass("material-icons mdl-badge mdl-badge--overlap").append("add"))
        .append(
          $("<span>").append(
            $("<a>")
              .on('click', function () {
                console.log("torrent click: " + this.file);
              }.bind({file: current_directory + "/" + path}))
              .append(path)
  )));
}

function addMusic(folders, path) {
//  console.log("Adding music file " + path);
  folders.append(
    $("<div>").addClass("mdl-cell--12-col").append(
      $("<div>").addClass("material-icons mdl-badge mdl-badge--overlap").append("audiotrack"))
        .append(
          $("<span>").append(
            $("<a>")
              .on('click', function () {
                console.log("File click: " + this.file);
                //socket.emit('browse', {"directory" : btoa(this.folder)});
                //window.open("http://sshannon.servebeer.com:8000/browse?dir=" + btoa(this.artist));
              }.bind({file: current_directory + "/" + path}))
              .append(path)
  )));
}

function showBackButton() {
  var back_button = $("#back-button");
  if (back_button.is(':visible') == false) {
    back_button.show();
  }

}

function hideBackButton() {
  var back_button = $("#back-button");
  back_button.hide();
}

function hideDownloadButton() {
    var download_button = $("#download-button");
    download_button.hide();
}

function addParents(directory, last_directory) {
    for (var i in parent_map) {
        if (parent_map[i].directory == directory)
          return false;
    }
    parent_map.push({directory: directory, parent: last_directory});
}

function lastDirectory() {
  for (var i in parent_map) {
      if (parent_map[i].directory == current_directory)
        if (parent_map[i].parent != "")
          return socket.emit('browse', {"directory" : btoa(parent_map[i].parent)});
  }
  socket.emit('artists', {"data" : null});
}

socket.on('browse', function(msg) {
  var folders = $("#folders");
  var download_button = $("#download-button");
  var back_button = $("#back-button");

  showBackButton();
  hideDownloadButton();

  folders.html("");

  $("#directory").html(msg.directory);
  addParents(msg.directory, current_directory);
  current_directory = msg.directory;

  console.log(parent_map);

  for (var i in msg.data) {
    var fmsg = msg.data[i];
    if (fmsg.directory == false) {
      if (fmsg.path.indexOf(".mp3") >= 0 || fmsg.path.indexOf(".flac") >= 0) {
        addMusic(folders, fmsg.path);
        if (download_button.is(':visible') == false) {
          download_button.show();
        }
      }
      else if (fmsg.path.indexOf(".torrent") >= 0) {
        addTorrent(folders, fmsg.path);
      }

    }
    else {
      folders.append(
        $("<div>").addClass("mdl-cell--8-col").append(
          $("<div>").addClass("material-icons mdl-badge mdl-badge--no-background").append("folder"))
          .append(
          $("<span>").append(
            $("<a>")
              .on('click', function () {
                console.log("Browsing directory: " + this.folder);
                socket.emit('browse', {"directory" : btoa(this.folder)});
                //window.open("http://sshannon.servebeer.com:8000/browse?dir=" + btoa(this.artist));
              }.bind({folder: current_directory + "/" + fmsg.path}))
              .attr("href", "#")
              .append(fmsg.path)
      )));
    }
  }
  download_button.off('click');
  download_button.on('click', function () {
    window.open("http://sshannon.servebeer.com:8000/download?dir=" + btoa(this.directory));
  }.bind({directory : current_directory}));

});
