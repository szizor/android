function init() {
document.addEventListener("deviceready", deviceReady, true);
$("#loginForm").on("submit",handleLogin);
delete init;
}


function checkPreAuth() {
    var form = $("#loginForm");
    if(window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {
        $("#username", form).val(window.localStorage["username"]);
        $("#password", form).val(window.localStorage["password"]);
        handleLogin();
    }
}

function handleLogin() {
    var form = $("#loginForm");
    //disable the button so we can't resubmit while we wait
    $("#submitButton",form).attr("disabled","disabled");
    var u = $("#username", form).val();
    var p = $("#password", form).val();
    console.log("click");
    if(u != '' && p!= '') {
        $.post("http://mideastunes.com/api/v1/sessions", {email:u,password:p}, function(res) {
            debugger
            if(res == true) {
                //store
                window.localStorage["email"] = u;
                window.localStorage["user_id"] = res.user_id;
                $.mobile.changePage("some.html");
            } else {
                navigator.notification.alert("Your login failed", function() {});
            }
         $("#submitButton").removeAttr("disabled");
        },"json");
    } else {
        //Thanks Igor!
        navigator.notification.alert("You must enter a username and password", function() {});
        $("#submitButton").removeAttr("disabled");
    }
    return false;
}

function deviceReady() {

    //$("#loginForm").on("submit",handleLogin);

}
