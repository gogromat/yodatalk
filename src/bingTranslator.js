(function ($) {
   
    var root = this,
    
        BingTranslator;
    
    BingTranslator = function () {
    
        var self = this;
        
        self.from = "";
        self.to = "";
        self.text = "";
        
        var fixText = function (text) {
            return $.trim(text.replace(/(\r\n|\r|\n)/gm," ").replace(/\s+/g," "));
        };
    
        self.setTranslations = function (text, from, to) {
            console.log("Setting TEXT:", text);
            console.log("Setting FROM/TO:", from, to);
            self.text = text;
            self.from = from;
            self.to = to;
        };
        self.getBaseUrl = function () {
            return "bing/translator.php";
        };
        self.getFromLangArg = function () {
            return "&from=" + self.from;
        };
        self.getToLangArg = function () {
            return "&to=" + self.to;
        };
        self.getTextArg = function (sign) {
            var sign = sign || "&";
            return sign + "text=" + self.text;
        };
        self.getUrl = function () {
            return self.getBaseUrl() +
                self.getTextArg("?") +
                self.getFromLangArg() +
                self.getToLangArg();   
        };
        self.getResultObj = function (jqXHR) {
            console.log("jqXHR Result: ",jqXHR);
            //success, translation
            return {
                "from": self.from,
                "to": self.to,
                "text": self.text,
                "result": fixText(jqXHR.translation)
            };
        };
        
        self.ajaxCall = function () {
            console.log("URL: ", self.getUrl());
            return $.ajax({
                url: self.getUrl(),
                dataType: 'json',
                scriptCharset: "utf-8"
            });
        };  
    };
    
    root.BingTranslator = BingTranslator;
    
}).call(this, jQuery);