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
        $('#artistDetails').html(item.metadata.bio);
        $('#fullName').text(item.metadata.name);
        $('#categories').text(item.genres);
        $('#country').text(item.metadata.country.name);
      });
      $('#progress').remove();
    },
    error: function(){
      output.text('There was an error loading the data.');
    }
  });
});


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
