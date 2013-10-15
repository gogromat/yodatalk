require(["jquery", "q", "yodaLang", "yodaStack"], 
function ($, Q, YodaCurrentLanguageSet, YodaStack) {

    var root = this;
    
    $(document).ready(function () {
    
        var YodaTalk = function (translator, translationStack) {
            // translator Class
            this.translator = translator;
            // html elements model & controller
            this.translationStack = translationStack;
        };
        
        // Initial YodaTalk - for events
        var YT = new YodaTalk(
            root.YodaCurrentLanguageSet.getCurrentTranslator(),
            new root.YodaStack({
                items: ".element", 
                addItems: ".add_element"
            })
        );
            
        $(".change_translation").click(function () {
            
            $(".change_translation.selectedTranslation").removeClass("selectedTranslation");
            
            $(this).addClass("selectedTranslation");
            
            var translator = $(this).data("value");
            
            if (translator === "bing") {
                root.YodaCurrentLanguageSet.setLanguageSet("bing");
            } else if (translator === "sangdol") {
                root.YodaCurrentLanguageSet.setLanguageSet("sangdol");   
            } else if (translator === "stichoza") {
                root.YodaCurrentLanguageSet.setLanguageSet("stichoza");   
            } else if (translator === "mymem") {
                root.YodaCurrentLanguageSet.setLanguageSet("mymem");   
            }
            
            YT.translationStack.restart();
        });
        
        
        $(".translate_button").click(function () {
            YT = new YodaTalk(
                root.YodaCurrentLanguageSet.getCurrentTranslator(), 
                new root.YodaStack({
                    items: ".element", 
                    addItems: ".add_element"
                })
            );
            initiateTranslationSequence(YT);
        });
       
      
        //todo: remove global variables from code
        function obtainAjaxPromise(someResult, YodaTalk) {
          
            // text, from, to
            YodaTalk.translator.setTranslations.apply(
                undefined, 
                YodaTalk.translationStack.getCurrentStep()    
            );
          
            var promise = Q.when( YodaTalk.translator.ajaxCall());
              
            var textFillInPromise = promise.then(function (result) {
              
                var resultObject = YodaTalk.translator.getResultObj(result);
                
                //console.log("RESULT>>>:", resultObject);
                
                YodaTalk.translationStack.pushTranslations(resultObject);
                
                // returns a promise
                return YodaTalk.translationStack.setNextText();
              
            }, function (error) {
                console.log("YodaTalk: Error: ", error);
            }, function (progress) {
                console.log("YodaTalk: Progress: ", progress);
            });
            
            
            return textFillInPromise.then(function(result) {
                //console.log("YodaTalk: Result: ", result);
            }, function (error) {
                console.log("YodaTalk: Error: ", error);
            }, function (progress) {
                
                // Get progress bar element
                var YodaProgressElement = YodaTalk.translationStack.getCurrent().progress;
                
                // If not defined, return false
                if (!YodaProgressElement || !YodaProgressElement.progress) return false;
                
                // Try to progress with 0.00 - 1.00 values
                YodaProgressElement.progress(parseFloat(progress).toFixed(2));
                
                // When progress bar returns true for isDone?, resolve a deferred object
                if (YodaProgressElement.isDone()) YodaTalk.translationStack.deferred.resolve();
                
                //console.log("Progress %:", progress);
          });
        }
    
        function initiateTranslationSequence (YodaTalk) {
            
            $(".toggle_elements").on("click", function () {
                YodaTalk.translationStack.toggleMiddleElements("show");
            });
          
            function processItem(prevResult) {
                return obtainAjaxPromise(prevResult, YodaTalk);
            }
          
            var nextTick = Q.when(),
                length = YodaTalk.translationStack.getStackSize();
            
            // Process all translations that are in the stack
            for (var i = length; i > 1; i --) {
                nextTick = nextTick.then( processItem );
            }
            
            nextTick.
            // After all translations happened
            then(function () {
                YodaTalk.translationStack.toggleMiddleElements("hide");
            }).
            // Scroll to the top of translation stack
            then(function () {
               $('html, body').animate({
                    scrollTop: YodaTalk.translationStack.stack[0].textElement.offset().top - 150
                }, 1500);
            }).
            // Finalize sequence
            fin(function(result) {
                //console.log("YodaTalk: Result: ", result); 
            }, function (error) {
                console.log("YodaTalk: Error: ", error);
            });
            
        }
        
    });
    
});