(function ($) {
   
    var root = this,
    
        StichozaTranslator;
    
    StichozaTranslator = function () {
    
        var self = this;
        
        self.from = "";
        self.to = "";
        self.text = "";
        
        var fixText = function (text) {
            return $.trim(text.replace(/(\r\n|\r|\n)/gm," ").replace(/\s+/g," "));
        };
    
        self.setTranslations = function (text, from, to) {
            //console.log("Setting TEXT:", text, "Setting FROM/TO:", from, to);
            self.text = text;
            self.from = from;
            self.to = to;
        };
        self.getBaseUrl = function () {
            return "googleTranslator/translator.php";
        };
        self.getFromLangArg = function () {
            return "&from=" + self.from;
        };
        self.getToLangArg = function () {
            return "&to=" + self.to;
        };
        self.getTextArg = function () {
            return "?text=" + self.text;
        };
        self.getUrl = function () {
            return self.getBaseUrl() +
                self.getTextArg() +
                self.getFromLangArg() +
                self.getToLangArg(); 
        };
        self.getResultObj = function (jqXHR) {
            //console.log("jqXHR Result: ",jqXHR, jqXHR.result);
            return {
                "from": self.from,
                "to": self.to,
                "text": self.text,
                "result": fixText(jqXHR.result)
            };
        };
        
        self.ajaxCall = function () {
            //console.log("Stichoza!", "URL: ", self.getUrl());
            return $.ajax({
                url: self.getUrl(),
                dataType: 'json',
                scriptCharset: "utf-8"
            });
        };  
    };
    
    root.StichozaTranslator = StichozaTranslator;
    
}).call(this, jQuery);

//$.fn.StichozaTranslator = this.StichozaTranslator;