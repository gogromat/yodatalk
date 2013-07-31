  //var window = this;
  //global $
  
  
  (function () {
      
      var root = this;
      
      var getElementId = (function () {
        var incrementingId = 0;
        return function(element) {
          if (!element.id) {
            element.id = "progress_id_" + incrementingId++;
          }
          return element.id;
        };
      }());
      
      var hashCode = function (string) {
          var hash = 0, 
              length = string.length,
              char;
          if (length == 0) return hash;
          for (var i = 0; i < length; i++) {
            char = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
      };
      
      var getElementUniqueId = function(element) {
          return hashCode(getElementId(element));  
      };
      
      var YodaProgress = function (element) {
  
          if ($.isEmptyObject(element)) return;
          
          console.log("Children are:", element);
          
         var elementId = getElementUniqueId(element);

          
          console.log("ELE ID", elementId);
          
          if (YodaProgress[elementId]) {
              console.log("OLD FRIEND");
              return YodaProgress[elementId];
          } else {
              console.log("NEW STRANGER");
             YodaProgress[elementId] = new ElementProgress($(element));
              return YodaProgress[elementId];
          }
          
      };
      
      var ElementProgress = function (element, options) {
         
          var self = this;
          self.options = {
              element : element,
              progress : 0,
              doneValue : 1,
              isDone : false,
              width: element.parent().width(),
              extraWidth: 120,
              doneCSSRule: {
                  "background-image": "url('libs/img/yoda_flipped.png')"
              }
          };
         $.extend(self.options, options);
      };
      
      ElementProgress.prototype.progress = function (progress) {
         var self = this;
          
         if (progress > self.options.progress) {
              // First time, show
             if (this.options.progress == 0) {
                 this.options.element.show();
                 console.log("SHOWING YODA!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            }
              
              self.options.progress = progress;
             if (progress >= self.options.doneValue) {
                  // Done
                 self.options.progress = self.options.doneValue;
                 self.options.isDone = true;
                 self.options.element.css(self.options.doneCSSRule);
              }
             self.updateCSSPosition();
          }
      };
     ElementProgress.prototype.updateCSSPosition = function () {
         var self = this;
         self.options.element.css({
             "background-position": self.getPosition() + "px"
          });
      };    
      ElementProgress.prototype.getPosition = function () {
          return ((this.options.width * this.options.progress)-this.options.extraWidth);
      };
      
      ElementProgress.prototype.reset = function () {
          var self = this;
          self = new ElementProgress(self.options.element);
      };
      
      ElementProgress.prototype.isDone = function () {
          return this.options.isDone;  
      };
      ElementProgress.prototype.toggle = function (action) {
          var self = this,
              action = action || "hide";
          if (action === "hide") {
              self.options.element.hide();
          } else {
              self.options.element.show();
          }
      };
      
      root.YodaProgress = YodaProgress;
  })();
  
  
  
  $(window.document).ready(function () {
      
      "use strict";
      
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
      
      
      
      // Chrome, Firefox, Opera 12+, IE 8+ (7 has no querySelector)
    function teletype(element, text, delay, redraw, userFunction, undefined) {
          console.log("XXX", element);
      var el = (typeof element === "object" ? element : document.querySelector(element)),
        div = document.createElement('div'),
        innerText = document.body.textContent ? "textContent" : "innerText";
        delay = delay || 10,
        redraw = (redraw !== undefined ? redraw : true);
          for (var i = 0, length = text.length; i < length; i++) {
              (function (i) {
                  setTimeout(function () {
                      div[innerText] += text[i];
                      el.appendChild(div);
                      if (redraw && i == length-1) el[innerText] = div[innerText];
                      if (userFunction) userFunction.call(undefined, i, length);
                  }, delay * i);
            })(i);
          }
    }
        
      var fixText = function (text) {
          return text.replace(/(\r\n|\r|\n)/gm," ").replace(/\s+/g," ");
      };
      
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
              
              //console.log("TEXT:", self.text);            
              //console.log("XHR Result: ", jqXHR);
              //console.log("...result:",jqXHR[self.text]);
  
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
      
  
  
      // Html Elements Stack
      var HtmlStack = function (items, addItems) {
          
          var self = this;
          self.stack = [],
          self.addItemsStack = [];
          
          // Populate languages that we are going to translate
          // Populate stack of elements we will be working on
          console.log(items);
          $.each($(items), function () {
              self.pushObject(this);
          });
          
          $.each($(addItems), function (i, e) {
              self.addItemsStack.push($(e));
          });
          
          // Clean and Show hidden elements
          self.toggleMiddleElements();

          self.deferred = {};
      };
      
      HtmlStack.prototype.getStackSize = function () {
          return this.stack.length;
      };
      
     HtmlStack.prototype.getHtmlElements = function (element) {    
         var object      = $(element),
             conversion  = object.children(".conversion"),
             children    = object.children(".yoda")[0];
         
         return {
              object: object,
              element: conversion,
              progress: (typeof children === "undefined" ? [] : YodaProgress(children)),
              language:  conversion.children(".selectoid").children(".selectoid_select").find(":selected").val(),
              text: fixText ( conversion.find(".conversion_div").text() ),
              textElement: $(conversion.children(".conversion_div")[0])
          };
      };
      
      
      HtmlStack.prototype.pushObject = function (element, force) {
                  
          var htmlElement = this.getHtmlElements(element),
              nextElement = $.extend({}, htmlElement);
              
          this.stack.push(nextElement);
          
          // allows to add text and result if needed (ex. initial value)
          if (this.stack.length <= 1 || force) {
              var current = this.getCurrent();
              var text = fixText( $(current.element).find(".conversion_div").text() ),
                  result = (this.stack.length <= 1 ? text : null);
              
              current.text = text;
              current.result = result;
          }
          
          console.log("...pushing stack",this.stack[this.stack.length -1]);
          
      };
      HtmlStack.prototype.pushTranslations = function (resultObject) {
          // todo look into how to modify it if necessary
          // skip resultObject[from|to|text] for now 
          var elementWithoutResult = this.stack[this.getNextIndex()];
          console.log("...pushing new translation", resultObject);
          elementWithoutResult.text   = resultObject.text;
          elementWithoutResult.result = resultObject.result;
      };
      
      HtmlStack.prototype.getCurrentIndex = function () {
          var current = 0;
          for (var i=0, length = this.stack.length; i < length; i++) {
              if (this.stack[i].result) current = i;
              else break;
          }
          return current;
      };
      
      HtmlStack.prototype.getNextIndex = function () {
          var current = this.getCurrentIndex();
          if (current == this.stack.length - 1) return current;
          return current + 1;
      };
      
      
      HtmlStack.prototype.getCurrent = function () {
          return this.stack[this.getCurrentIndex()];
      };
      HtmlStack.prototype.getCurrentElement = function () {
          return this.stack[this.getCurrentIndex()].element;
      };
      HtmlStack.prototype.getNext = function () {
          return this.stack[this.getNextIndex()];
      };
      HtmlStack.prototype.getNextElement = function () {
          return this.stack[this.getNextIndex()].element;
      };
      HtmlStack.prototype.getCurrentText = function () {
          return this.stack[this.getCurrentIndex()].text;
      };
      
      HtmlStack.prototype.getCurrentResult = function () {
          return this.stack[this.getCurrentIndex()].result;  
      };
  
      HtmlStack.prototype.getCurrentStep = function () {
          
          var r = this.getCurrent();
          console.log("...next values [text from to]", [r.result, r.language, this.getNext().language]);
          return [r.result, r.language, this.getNext().language];
      };
      
      /*
          HtmlStack.prototype.hasNextStep = function () { return this.stack.length >= 2; };    
          HtmlStack.prototype.setCurrentText = function (text) {this.setElementText(this.getCurrent().textElement, text); };
          HtmlStack.prototype.setElementText = function (element, text) {$(element).text(text);};
      */
      
      
      HtmlStack.prototype.setNextText = function (text) {
          var result = $.trim(this.getCurrentResult());
          return this.slowTextInput(this.getCurrent().textElement, result);    
      };
      
  
      
      HtmlStack.prototype.slowTextInput = function (textElement, text) {
          console.log("Text Element",textElement);
          var deferred = Q.defer(),
              promise = deferred.promise.when(
                 teletype(textElement[0], text, 25, true, function (i, l) {
                     deferred.notify( parseFloat((i+1)/l).toFixed(2) );
                 })
              );
              this.deferred = deferred;
          return promise;
      };

      HtmlStack.prototype.toggleMiddleElements = function (action, callback) {
          var self = this,
              action = action || "show",
              stackSize = self.getStackSize();
  
          if (action === "show" && !callback) {
              callback = function (e) { e.show(); };
          }
          if (action === "hide" && !callback) {
              callback = function (e) { e.slideUp(2000); };
          }
      
  
         if (!$.isEmptyObject(self.progress)) self.progress.toggle("hide");
          
              
          $.each(self.addItemsStack, function (i, e) {
             
             
             console.log('OBJECT', e.object);
              if (action === "hide" || action === "show") callback(e);
          });
          
          $.each(self.stack, function (i, e) {
              
              
              console.log('OBJECT', e.object);
              
              // in-the-middle elements
              if (i != 0 && i != stackSize - 1) {
                  
                  //todo: progress objects re-init, hide
                  //e.textElement.text("");
                  if (action === "hide" || action === "show") callback(e.object);
              }
                  
          });
          
          
          if (action == "hide") $(".toggle_elements").css("display","block");
          else $(".toggle_elements").hide();
          
      };
  
      
      
      
      
   
   
   
  
      
      
      
      
      
  
      
      
      
      $(".translate_button").click(function () {
          initiateTranslationSequence();
      });
  
  
      //todo: remove global variables from code
      function obtainAjaxPromise(someResult, Yoda) {
          
                  // text, from, to
          Yoda.translator.setTranslations.apply(
              undefined, 
              Yoda.translationStack.getCurrentStep()    
          );
          
          var promise = Q
              .when( Yoda.translator.ajaxCall());
              
          var textFillInPromise = promise.then(function (result) {
              
              var resultObject = Yoda.translator.getResultObj(result);
              console.log("RESULT>>>:", resultObject);
              Yoda.translationStack.pushTranslations(resultObject);
              var currentResult = Yoda.translationStack.getCurrentResult();
              
              // returns a promise
              return Yoda.translationStack.setNextText(currentResult);
              
          }, function (error) {
              console.log("YodaTalk: Happened Error: ", error);
          }, function (progress) {
              console.log("OnProgress:", progress);
          });
              
              
          return textFillInPromise.then(function(result) {
              console.log(result);
          }, function (error) {
              console.log("YodaTalk: Happened Error: ", error);
          }, function (progress) {
              
              var YodaProgressElement = Yoda.translationStack.getCurrent().progress;
              
              if (!YodaProgressElement) return;
              
              console.log(YodaProgressElement);
              
              YodaProgressElement.progress(parseFloat(progress));
              if (YodaProgressElement.isDone()) { //>= 1
                  Yoda.translationStack.deferred.resolve();
              }
              
              console.log("Progress %:", progress);
          });
      }
      
  
        function initiateTranslationSequence () {
          
            var YodaTalk = function (translator, translationStack) {
                    // translator Class
                    this.translator = translator;
                    // html elements model & controller
                      this.translationStack = translationStack;
                }, Yoda = new YodaTalk(new SangdolTranslator(), new HtmlStack(".element", ".add_element"));
  
          $(".toggle_elements").on("click", function () {
             Yoda.translationStack.toggleMiddleElements("show");
          });
          
          function processItem(prevResult) {
              console.log("...processing item");
              return obtainAjaxPromise(prevResult, Yoda);
          }
          
          var nextTick = Q.when(),
              length = Yoda.translationStack.getStackSize();
         
          for (var i = length; i > 1; i --) {
              nextTick = nextTick.then( processItem );
          }
          
          // After all translations happened
          nextTick.then(function () {
              Yoda.translationStack.toggleMiddleElements("hide");
          });
          
          nextTick.fin(function(result) {
              console.log("Result:", result); 
          }, function (error) {
              console.log("Error", error);
          });       
      }
  
        
});