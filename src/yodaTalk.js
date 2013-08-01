//var window = this;
//global $

//"use strict";

var root = this;

$(window.document).ready(function () {
    
    console.clear();
            
    function meths(obj, contains, check) {
        var methods = [], check = check || "function";
        for (var m in obj) {
            if (typeof obj[m] == check) {
                if ((contains && m.match(contains)) || !contains) methods.push(m);
            }
        }
        return (methods.join(","));
    }
    
    function formatLanguage(element) {
        return {
            "name":  element.name,
            "value": element.abbreviation.gt
        }
    }
    
    
    var input = new Selectoid({
        object: "#language_input",
        data: Languages,
        parameters: {
            initial: "en",
            closeOnMouseLeave: false,
            closeOnFocusOut: false,
            button_class: "galaxy"
        },
        dataFormat: formatLanguage
    });

    var in1 = new Selectoid({
        object: "#one",
        data: Languages,
        parameters: {
            initial: "ja",//zh-cn
            button_class: "galaxy"
        },         
        dataFormat: formatLanguage
    });
    
    var in2 = new Selectoid({
        object: "#two",
        data: Languages,
        parameters: {
            initial: "sv",//de
            button_class: "galaxy"
        },         
        dataFormat: formatLanguage
    });

    var output = new Selectoid({
        object: "#language_output",
        data: Languages,
        parameters: {
            initial: "en",
            button_class: "galaxy"
        },         
        dataFormat: formatLanguage
    });
    
            

            
            
    root.LightSaber(".color_laser");
            
            
            




    var YodaTalk = function (translator, translationStack) {
        // translator Class
        this.translator = translator;
        // html elements model & controller
        this.translationStack = translationStack;
    };
    
    var Yoda = new YodaTalk(
        new root.SangdolTranslator(), 
        new root.YodaStack({
            items: ".element", 
            addItems: ".add_element"
        })
    );
                
  

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
            console.log("YodaTalk: Error: ", error);
        }, function (progress) {
            console.log("YodaTalk: Progress: ", progress);
        });
          
          
        return textFillInPromise.then(function(result) {
            console.log("YodaTalk: Result: ",result);
        }, function (error) {
            console.log("YodaTalk: Error: ", error);
        }, function (progress) {
            
            var YodaProgressElement = Yoda.translationStack.getCurrent().progress;
            if (!YodaProgressElement) return;
            YodaProgressElement.progress(parseFloat(progress));
            if (YodaProgressElement.isDone()) Yoda.translationStack.deferred.resolve();
            //console.log("Progress %:", progress);
      });
    }
      
      
      

    function initiateTranslationSequence () {
        
        $(".toggle_elements").on("click", function () {
            Yoda.translationStack.toggleMiddleElements("show");
        });
      
        function processItem(prevResult) {
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
            console.log("YodaTalk: Result:", result); 
        }, function (error) {
            console.log("YodaTalk: Error:", error);
        });
        
    }
    
    
});