(function ($) {
   
    var root = this,
    
        SangdolTranslator;
        
    
    SangdolTranslator = function () {
    
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
            return "http://google-translate-api.herokuapp.com/translate?callback=cb";
        };
        self.getFromLangArg = function () {
            return "&from=" + self.from;
        };
        self.getToLangArg = function () {
            return "&to=" + self.to;
        };
        self.getTextArg = function () {
            return "&text[]=" + self.text;
        };
        self.getUrl = function () {
            return self.getBaseUrl() +
                self.getTextArg() +
                self.getFromLangArg() +
                self.getToLangArg();   
        };
        self.getResultObj = function (jqXHR) {
            console.log("jqXHR Result: ",jqXHR, jqXHR[self.text]);
            return {
                "from": self.from,
                "to": self.to,
                "text": self.text,
                "result": fixText(jqXHR[self.text])
            };
        };
        
        self.ajaxCall = function () {
            console.log("URL: ", self.getUrl());
            return $.ajax({
                url: self.getUrl(),
                dataType: 'jsonp',
                scriptCharset: "utf-8"
            });
        };  
    };
    
    root.SangdolTranslator = SangdolTranslator;
    
}).call(this, jQuery);