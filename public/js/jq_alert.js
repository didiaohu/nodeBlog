;(function($, window, document,undefined){
    $.extend({
        BeautyAlert:function(msg,title){
           $(".BeautyAlert").remove();
           $("body").append(
               '<div class="BeautyAlert">' + '<span>'+ title + '</span>'+ '</div>'
           );
            switch(msg) {
                case "success":
                    $(".BeautyAlert").addClass("BeautyAlert_success");
                    break;
                case "error":
                    $(".BeautyAlert").addClass("BeautyAlert_error");
                    break;
                case "warn":
                    $(".BeautyAlert").addClass("BeautyAlert_warn");
                    break;
                default:
                    $(".BeautyAlert").addClass("BeautyAlert_success");
                    break;
            }
            $(".BeautyAlert").css("margin-left",-$(".BeautyAlert").width()/2);
            $(".BeautyAlert").animate({"top":"0px"},100);
            setTimeout(function(){
                $(".BeautyAlert").animate({"top":"-50px"},100);
            },1800);
        }
    })
})(jQuery, window, document);