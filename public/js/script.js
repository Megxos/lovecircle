$(document).ready(function(){
    $("ul #user_message").click(function(){
        $(this).find("#delete").toggleClass("delete slideInRight animated")
    })
   $("input[type=password]").on("change paste keyup", function () {
       if ($("input[type=password]").val().length < 5) {
           $(this).css("border-bottom", "2px solid red")
       } else {
            ($("input[type=password]").val().length >= 5) 
           $(this).css("border-bottom", "2px solid green")
       }
   })
   //scroll to last li in messages

        var scrolled = false;
        function updateScroll() {
            if (!scrolled) {
                var element = document.getElementById("message_collection");
                element.scrollTop = element.scrollHeight;
            }
        }

        $("#message_collection").on('scroll', function () {
            scrolled = true;
        });

        setInterval(updateScroll, 500)
   $("#confirmPassword").on("change paste keyup", function () {

       if ($("#confirmPassword").val() != $("#password").val()) {
           $(this).css("border-bottom", "2px solid red")
           $("#signup").addClass("disabled")
       } else {
           $(this).css("border-bottom", "2px solid green")
           $("#signup").removeClass("disabled")
       }
   })
    $("ul #user_message").hover(function(){
        $(this).find("#delete").addClass("delete slideInRight animated");
         }, function(){
        $(this).find("#delete").removeClass("delete slideInRight animated")
    })
    $("#view_messages").on("click", function(){
        $(".message").fadeOut()
        $(".my_messages").fadeIn()
    })
    $("#send_message").on("click", function(){
        $(".message").fadeIn()
        $(".my_messages").fadeOut()
    })
    $("#mode_switch").click(function(){
        $(".message .control_btn").toggleClass("white")
        $(".message").toggleClass("grey")
        $("body, message").toggleClass("dark_mode")
    })

    $("#info").click(function(){
        alert("---------- Love Circle -----------\n---------------- v1.0.1 -----------------\n------- by Mikah Gidado 2020 ---------")
    })

})