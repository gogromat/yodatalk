//var window = this;
//global $

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
    var HtmlStack = function (items) {
        
        var self = this;
        self.stack = [];
        
        // Populate languages that we are going to translate
        // Populate stack of elements we will be working on
        $.each($(items), function (i, e) {
            self.push(e);
        });
    };
    
    HtmlStack.prototype.getStackSize = function () {
        return this.stack.length;
    };
    
    HtmlStack.prototype.getHtmlElements = function (element) {
        var object = $(element),
            element = object.children(".conversion");
        return {
            object: object,
            element: element,
            progress: object.children(".yoda"),
            language:  element.children(".selectoid").children(".selectoid_select").find(":selected").val(),
            text: fixText ( element.find(".conversion_div").text() )
        };
    };
    
    HtmlStack.prototype.push = function (element, force) {
                
        var htmlElements = this.getHtmlElements(element),
            nextElement = $.extend({}, htmlElements);
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
    
    
    //todo change
    HtmlStack.prototype.hasNextStep = function () {
        return this.stack.length >= 2;
    };
    
    
    
    
    HtmlStack.prototype.setCurrentText = function (text) {
        console.log("set current text text to: ", text);
        this.setElementText(this.getCurrent(), text);    
    };
    
    HtmlStack.prototype.setNextText = function (text) {
        var result = $.trim(this.getCurrentResult());
        console.log("STACK:", this.stack, text, result, this.getNext() );
        return this.slowTextInput(this.getCurrent().element, result);    
    };
    
    HtmlStack.prototype.setElementText = function (element, text) {
        $(element).children(".conversion_div").text(text);
    };
    
    HtmlStack.prototype.slowTextInput = function (element, text) {
        
        var deferred = Q.defer(),
            textElement = $(element).children(".conversion_div")[0],
            promise = deferred.promise.when(
                teletype(textElement, text, 25, true, function (i, l) {
                    deferred.notify( parseFloat((i+1)/l).toFixed(2) );
                })
            );
            $.fn.shit = deferred;
        return promise;
    };
    
    
    var fixText = function (text) {
        return text.replace(/(\r\n|\r|\n)/gm," ").replace(/\s+/g," ");
    };
    
    
    
    
 
 
 
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
            
            
            var progressElement = Yoda.translationStack.getCurrent().progress,
                progressWidth = progressElement.width();
            
            
            progressElement.show();
            
            progressElement.css({
                "background-position": ((progressWidth * progress)-120) + "px" 
            });
            
            if (progress >= 1) {
                progressElement.css({
                    "background-image": "url('libs/img/yoda_flipped.png')" 
                });
                $.fn.shit.resolve();
            }
            
            console.log("Progress %:", progress);
            
        });
        //.finally(function(data){console.log("DONE",data)});
    
    }
    
    
    
    
    
    

    
    
    
    $("#translate").click(function () {
        initiateTranslationSequence();
    });


    function initiateTranslationSequence () {
        
        var YodaTalk = function (translator, translationStack) {
            this.translator = translator;
            this.translationStack = translationStack;
        };
    
         // html elements model & controller
        var translationStack = new HtmlStack(".element");
        
        var Yoda = new YodaTalk(new SangdolTranslator(), translationStack);
      
        
        function processItem(prevResult) {
            console.log("...processing item")
            return obtainAjaxPromise(prevResult, Yoda);
        }
        
        
        var nextTick = Q.when(),
            length = Yoda.translationStack.getStackSize();
       
        for (var i = length; i > 1; i --) {
            console.log(">>>>>>>>>>>>>>>>>>>>HERE>>>>>>>>>>>>>>>>>", i);
            nextTick = nextTick.then( processItem );
            nextTick = nextTick.then(function(){});
        }
        
        nextTick.fin(function(result) {
            console.log("Result:", result); 
        }, function (error) {
            console.log("Error", error);
        });       
    }

    //$(".add_element").on("click", function () {});
    //$(".clear").click(function () {});
});