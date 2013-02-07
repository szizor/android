// Current div displayed
var divIndex = -1;

    // Divs used to display content using transition
    var div0 = null;
    var div1 = null;
    var myMedia = null;
    var playing = false;


    /**
     * Load page into url
     *
     * @param url           The url to load
     * @param onleave       The function to call before leaving
     * @param onenter       The function to call after loading
     */
     function loadPage(url, onleave, onenter) {
        $(body).append('<div id="progress">Loading...</div>');
        scrollTo(0,0);
        // If onleave function specified
        if (onleave) {
            onleave();
        }

        var xmlhttp = new XMLHttpRequest();

        // Callback function when XMLHttpRequest is ready
        xmlhttp.onreadystatechange=function(){
            if(xmlhttp.readyState === 4){
                if (xmlhttp.status === 200) {
                    //console.log("Received content"+xmlhttp.responseText);

                    animate(xmlhttp.responseText);

                    if (RegExp(/artistlist.*/).test(url)){
                        //var old = document.getElementById('script_container');
                        var old = $('#script_container');
                        old.remove();
                        var ga = document.createElement('script');
                        ga.type = 'text/javascript';
                        ga.async = true;
                        ga.src = 'js/artistlist.js';
                        var s = document.getElementsByTagName('script')[0];
                        s.parentNode.insertBefore(ga, s);
                    } else if  (RegExp(/artist_details.*/).test(url)) {
                        var old = $('#script_container');
                        old.remove();
                        var ga = document.createElement('script');
                        ga.type = 'text/javascript';
                        ga.async = true;
                        ga.src = 'js/artistdetails.js';
                        var s = document.getElementsByTagName('script')[0];
                        s.parentNode.insertBefore(ga, s);

                        var id = url.split("id=")[1];
                        var gb = document.getElementById('id_container');
                        gb.value = id;
                    } else {
                        var old = $('#script_container');
                        old.remove();
                        var ga = document.createElement('script');
                        ga.type = 'text/javascript';
                        ga.async = true;
                        ga.src = 'js/bio.js';
                        var s = document.getElementsByTagName('script')[0];
                        s.parentNode.insertBefore(ga, s);

                        var id = url.split("id=")[1];
                        var gb = document.getElementById('id_container');
                        gb.value = id;
                    }



                    // If onenter function specified
                    if (onenter) {
                        onenter();
                    }
                }
                else {
                    animate("Error loading page " + url);
                }
            }
        };
        console.log("loadPage("+url+")");
        xmlhttp.open("GET", url , true);
        xmlhttp.send();

        // var scroll = new iScroll('wrapper', { vScrollbar: false, hScrollbar:false, hScroll: false });

    }

    function loadplayer(){
        a= parseInt($('#player').css('bottom'), 10);
        if (/^\+?(0|[1-9]\d*)$/.test(a)){
            $('#player').css("bottom", "-1060px");
        } else{
            $('#player').css("bottom", "34px");
        }
    }

    function animate(content) {
        if (divIndex === 0) {

            // Slide div0 out and div1 in from left
            div1.innerHTML = content;

            div0.style.webkitTransition = "left 0.5s ease-in";
            div1.style.webkitTransition = "left 0.5s ease-in";
            div0.style.left = "-100%";
            div1.style.left = "0px";
            // Clear transition so div0 can be moved to the right of div1
            setTimeout(function() {
                div0.style.webkitTransition = null;
                div1.style.webkitTransition = null;
                div0.style.left = "100%";

            }, 500);

            divIndex = 1;
        }
        else {
            div0.innerHTML = content;

            if (divIndex === 1) {

                // Slide div1 out and di0 in from left
                div0.style.webkitTransition = "left 0.5s ease-in";
                div1.style.webkitTransition = "left 0.5s ease-in";
                div1.style.left = "-100%";
                div0.style.left = "0px";
                // Clear transition so div1 can be moved to the right of div0
                setTimeout(function() {
                    div0.style.webkitTransition = null;
                    div1.style.webkitTransition = null;
                    div1.style.left = "100%";

                }, 500);
            }
            divIndex = 0;

        }

    }


    function playAudio() {
      if (!playing) {
        myMedia.play();
        document.getElementById('play').src = "img/PlayerControlPause.png";
        playing = true;
        } else {
            myMedia.pause();
            document.getElementById('play').src = "img/PlayerControlPlay.png";
            playing = false;
        }
    }

    function stopAudio() {
      myMedia.stop();
      playing = false;
      document.getElementById('play').src = "/img/PlayerControlPlay.png";
      document.getElementById('audio_position').innerHTML = "0.000 sec";
    }

    function onLoad() {
       document.addEventListener("deviceready", onDeviceReady, false);
    }

    function onDeviceReady(){
      console.log("Got device ready");
      updateMedia();
    }

    function updateMedia(src) {
        // Clean up old file
        if (myMedia != null) {
          myMedia.release();
        }
        console.log(src);
        // Get the new media file
        myMedia = new Media(src, stopAudio, null);

        // Update media position every second
        var mediaTimer = setInterval(function() {
          // get media position
          myMedia.getCurrentPosition(
              // success callback
              function(position) {
                if (position > -1) {
                  document.getElementById('audio_position').innerHTML = (position/1000) + " sec";
                }
              },
                  // error callback
                  function(e) {
                    console.log("Error getting pos=" + e);
                }
                    );
              }, 1000);
        playAudio();
    }

    function setAudioPosition(position) {
     document.getElementById('audio_position').innerHTML =position;
    }
    function setAudioPlaylist(id) {
        var list = [];
        var myPlaylist = new jPlayerPlaylist({
        jPlayer: "#jquery_jplayer_N",
        cssSelectorAncestor: "#jp_container_N"
          }, {
            playlistOptions: {
              enableRemoveControls: true,
              autoPlay:true
            },
            swfPath: "js",
            supplied: "webmv,oga, mp3"
          });
        var id = $("#id_container").val()
        $.ajax({
            url: 'http://mideastunes.com/api/v1/artists/'+id+'?greedy=pictures,songs',
            dataType: 'json',
            jsonp: 'jsoncallback',
            timeout: 5000,
            success: function(data, status){
              $.each(data.data, function(i,item){

                $.each(item.songs, function(i,record){
                    list.push(
                        {title: record.title, artist: item.metadata.name, mp3: record.mp3_lo, oga: record.ogg_lo, poster: item.pictures[1].detail}
                    );
                });

              });
              myPlaylist.setPlaylist(list);
              myPlaylist.play();
            },
            error: function(){
              output.text('There was an error loading the data.');
            }
        });
    }

