
var id = $("#id_container").val()
var output = $('#actionList');

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

}

$(document).ready(function(){
  $.ajax({
    url: 'http://mideastunes.com/api/v1/artists/'+id+'?greedy=pictures,songs',
    dataType: 'json',
    jsonp: 'jsoncallback',
    timeout: 5000,
    success: function(data, status){
      $.each(data.data, function(i,item){
        $("#bio").attr('onclick', 'javascript:loadPage("bio.html?id='+item.id+'")');
        $('#artistPic').attr('src',  item.pictures[0].detail);
        $('#fullName').text(item.metadata.name);
        $.each(item.songs, function(i,record){
          var landmark = ' \
            <li>\
              <a href="#" onclick="setAudioPlaylist({{track}})">\
                <div class="left data-container">\
                  <span class="artist_name bold">{{title}}</span><br/>\
                  <span class="genre_name">{{name}}</span>\
                </div>\
              </a>\
            </li>';
          landmark = landmark.replace(/{{track}}/, "'id=" + id + "'");
          landmark = landmark.replace(/{{title}}/, record.title);
          landmark = landmark.replace(/{{name}}/, item.metadata.name);
          output.append(landmark);
        });
        $('#progress').remove();
      });
    },
    error: function(){
      output.text('There was an error loading the data.');
    }
  });
});

function playStream(url) {
  try {
    var myaudio = new Audio(url);
    myaudio.id = 'playerMyAdio';
    myaudio.play();
  } catch (e) {
    alert('no audio support!');
  }
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
