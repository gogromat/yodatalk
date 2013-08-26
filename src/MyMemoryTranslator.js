(function ($) {
   
    var root = this,
    
        MyMemoryTranslator;
        
    
    MyMemoryTranslator = function () {
    
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
            return "http://api.mymemory.translated.net/get?of=json&de=gogromat@gmail.com";
        };
        self.getFromLangArg = function () {
            return "&langpair=" + self.from;
        };
        self.getToLangArg = function () {
            return "|" + self.to;
        };
        self.getTextArg = function () {
            return "&q=" + self.text;
        };
        self.getUrl = function () {
            return self.getBaseUrl() +
                self.getTextArg() +
                self.getFromLangArg() +
                self.getToLangArg();
        };
        self.getResultObj = function (jqXHR) {
            //console.log("jqXHR Result: ",jqXHR, jqXHR[self.text]);
            return {
                "from": self.from,
                "to": self.to,
                "text": self.text,
                "result": fixText(jqXHR.responseData.translatedText)
            };
        };
        
        self.ajaxCall = function () {
            console.log("MyMemory!", "URL: ", self.getUrl());
            return $.ajax({
                url: self.getUrl(),
                dataType: 'json',
                scriptCharset: "utf-8"
            });
        };  
    };
    
    root.MyMemoryTranslator = MyMemoryTranslator;
    
}).call(this, jQuery);