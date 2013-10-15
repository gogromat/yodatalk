require(["jquery"], function ($) {
    $(document).ready(function () {
        var TogetherJSConfig_siteName = "YodaSlang",
            TogetherJSConfig_toolName = "Help me out",
            TogetherJSConfig_cloneClicks = $(".change_translation, .translate_button, .add_element, .remove, .selectoid"),
            TogetherJSConfig_findRoom = "yodaslang";
        
        $(".togetherJS").click(function () {
            var self = this;
            // I only need it here
            require(["togetherjs"], function (TogetherJS) {
                $(self).toggleClass("selectedTogether")
                    .children().toggleClass("hidden");
                TogetherJS(self);
            });
            return false;
        });         
    });
});