//http://social.msdn.microsoft.com/Forums/en-US/0ed61e34-1199-4000-8575-7976d7b98067/jquery-ajax-bing-translator
/*
var BingTranslator = function () {
  this.getFromLang = function (language) {
      return "&from=" + encodeURIComponent(language);
  };
  this.getToLang = function (language) {
      return "&to=" + encodeURIComponent(language);
  };
  this.getAppId = function () {
      return "appId=Bearer%20" + encodeURIComponent("4A5i4QyEJeWBE+KRE2ayD4h4OCPyR3ZlYXJdt4mU9wQ=");
  };
  this.getText = function (text) {
      return "&text=" + encodeURIComponent($.trim(text));
  };
  this.getUrl = function (text, from, to) {
      
      //Http.svc
      var url = "http://api.microsofttranslator.com/V2/Ajax.svc/Translate?" +
          this.getAppId() +
          "oncomplete=ajaxCallback" +
          this.getFromLang(from) +
          this.getToLang(to) +
          this.getText(text) + 
          encodeURIComponent("&contentType=text/plain");
         
      console.log(url);
          
      return url;
  };
};*/