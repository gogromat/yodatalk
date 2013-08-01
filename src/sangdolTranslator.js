var SangdolTranslator = function () {

    var self = this;
    
    self.from = "";
    self.to = "";
    self.text = "";
    
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