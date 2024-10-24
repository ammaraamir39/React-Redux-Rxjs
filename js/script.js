jQuery(document).ready(function($){

    $(".fancybox").fancybox({
        padding: 0,
        helpers: {
            overlay: {
                locked: false
            }
        },
        openEffect : 'elastic',
        closeEffect : 'elastic',
        scrolling : 'no'
    });

    $(window).load(function(){
        $(".animate").each(function(){
            if ($(this).data("delay"))
            {
                $(this).css("animation-delay", $(this).data("delay")+"s");
            }
            if ($(window).width() > 1050)
            {
                $(this).viewportChecker({
                    classToAdd: 'animated '+$(this).data("animation"),
                    classToRemove : 'hidden',
                    offset: 100,
                    callbackFunction: function(){
                        console.log($(window).scrollTop());
                    }
                });
            } else {
                $(this).removeClass("hidden animate");
            }
        });
    });

    function validateEmail(email) { 
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    } 
    $(document).on("click", ".form-validation .error_msg", function(){
        $(this).remove();
    });
    $(document).on("click", ".form-validation .required", function(){
        $(this).removeClass("has-error");
        $(this).parent().find(".error_msg").remove();
    });
    $(".form-validation").submit(function(e){
        e.stopPropagation();
        var form = $(this);
        var error = false;
        form.removeClass("error");
        form.find(".has-error").removeClass("has-error");
        form.find(".error_msg").remove();
        form.find(".required:visible").each(function(){
            if ($(this).val() === "")
            {
                $(this).addClass("has-error").before('<span class="error_msg">This field is required.</span>');
                error = true;
            } else if ($(this).hasClass("email") && !validateEmail($(this).val()))
            {
                $(this).addClass("has-error").before('<span class="error_msg">Your email address is invalid.</span>');
                error = true;
            }
        });
        if (error)
        {
            form.addClass("error");
            return false;
        }
    });
    $("form#contact_form, form.contact_form").submit(function(){
        var form = $(this);
        form.find(".message_success, .message_fail").slideUp("fast");
        $(".form_container").removeClass("success");
        if (!form.hasClass("error"))
        {
            $.post(form.attr("action"), form.serialize(), function(msg){
                $(".message_success").slideDown("fast");
                setTimeout(function(){
                    $(".message_success").slideUp("fast");
                }, 4000);
                $(".form_container").addClass("success");
                form[0].reset();
            });
        }
        return false;
    });

    var swiper = new Swiper('.swiper-container', {
        autoplay: 8000,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        grabCursor: true,
        loop: true
    });

    $("#navigation a.goto").click(function(){
        var href = $(this).attr("href");
        $("html, body").animate({ scrollTop: $(href).offset().top }, 1000);
        return false;
    });

    $(".package_type .monthly").click(function(){
        $(".package_type a").removeClass("active");
        $(this).addClass("active");
        $("#annual").fadeOut("fast", function(){
            $("#monthly").fadeIn("slow");
        });
        return false;
    });
    $(".package_type .annual").click(function(){
        $(".package_type a").removeClass("active");
        $(this).addClass("active");
        $("#monthly").fadeOut("fast", function(){
            $("#annual").fadeIn("slow");
        });
        return false;
    });

    $('.modal-trigger').leanModal({
    });

    $(window).load(function(){
        setTimeout(function(){
            $("#demo_register").slideDown("slow", function(){
                $("#demo_register .btn").removeClass("hidden").addClass("animated bounceIn");
            });
        }, 10000);
    });

});