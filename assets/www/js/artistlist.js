$(document).ready(function(){

  popular();

  // $("#player").load("audio.html");
});

function popular() {
  var output = $('#artistList');
    output.html("");
    $.ajax({
      url: 'http://mideastunes.com/api/v1/popular_artists?limit=30&greedy=pictures',
      dataType: 'json',
      jsonp: 'jsoncallback',
      timeout: 5000,
      success: function(data, status){

        $.each(data.data, function(i,item){
          var landmark =
          '<li>\
            <a onclick="javascript:loadPage(&quot;artist_details.html?id='+item.id+'&quot;)" >\
              <img class="left" src="'+item.pictures[0].ios_thumb+'"/>\
              <div class="left data-container">\
                <span class="artist_name bold">'+item.metadata.name+'</span><br/>\
                <span class="genre_name">'+ item.genres+'</span>\
              </div>\
            </a>\
          </li>';

          output.append(landmark);
        });
         $('#progress').remove();
      },
      error: function(){
        output.text('There was an error loading the data.');
      }
    });
  }

  function new_artists() {
    var output = $('#artistList');
    output.html("");
    $.ajax({
      url: 'http://mideastunes.com/api/v1/popular_artists?limit=30&greedy=pictures&order=desc',
      dataType: 'json',
      jsonp: 'jsoncallback',
      timeout: 5000,
      success: function(data, status){

        $.each(data.data, function(i,item){
          var landmark =
          '<li>\
            <a onclick="javascript:loadPage(&quot;artist_details.html?id='+item.id+'&quot;)" >\
              <img class="left" src="'+item.pictures[0].ios_thumb+'"/>\
              <div class="left data-container">\
                <span class="artist_name bold">'+item.metadata.name+'</span><br/>\
                <span class="genre_name">'+ item.genres+'</span>\
              </div>\
            </a>\
          </li>';

          output.append(landmark);
        });
      },
      error: function(){
        output.text('There was an error loading the data.');
      }
    });
  }
  $('form').submit(function(e){
    e.preventDefault();
    var output = $('#artistList');
    var postData = $(this).serialize();
    output.html("");
    $.ajax({
      url: 'http://mideastunes.com/api/v1/search/' + postData.split("query=")[1] +'?limit=10&greedy=pictures',
      dataType: 'json',
      jsonp: 'jsoncallback',
      timeout: 5000,
      success: function(data, status){
        $.each(data.data, function(i,item){
          var landmark = '\
          <li class="list_li">\
            <a onclick="javascript:loadPage(&quot;artist_details.html?id='+item.id+'&quot;)" >\
              <img class="left" src="'+item.pictures[0].ios_thumb+'"/>\
              <div class="left data-container">\
                <span class="artist_name bold">'+item.metadata.name+'</span><br/>\
                <span class="genre_name">'+ item.genres+'</span>\
              </div>\
            </a>\
          </li>';

          output.append(landmark);
        });
      },
      error: function(){
        output.text('There was an error loading the data.');
      }
    });
  });
  function show_search(){
    $('#wrapper').toggleClass('search_pos');
    $('#search_input').toggle();
  }

