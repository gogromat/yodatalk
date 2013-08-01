(function () {
    
    var root = this,
        HtmlStack;
    
    var fixText = function (text) {
        return text.replace(/(\r\n|\r|\n)/gm," ").replace(/\s+/g," ");
    };


    // Html Elements Stack
    HtmlStack = function (options) {
          
        console.log("NEW HTML STACK");
          
        var self = this;
          
        self.options = {
            items : "",
            addItems: ""
        };
        
        $.extend(self.options, options);
          
        self.stack = [],
        self.addItemsStack = [];
          
          
        // Populate languages that we are going to translate
        // Populate stack of elements we will be working on
        console.log("All new objects: ",self.options.items);
        
        $.each($(self.options.items), function () {
            self.pushObject(this);
        });
          
        $.each($(self.options.addItems), function (i, e) {
            self.addItemsStack.push($(e));
        });
        
        
        // Clean and Show hidden elements
        self.toggleMiddleElements();
        
        self.registerRemoveListeners();
        
        self.deferred = {};
    };
      
    HtmlStack.prototype.getStackSize = function () {
        return this.stack.length;
    };
      
    HtmlStack.prototype.getHtmlElements = function (element) {    
        var object       = $(element),
            conversion   = object.children(".conversion"),
            progressDivs = object.children(".yoda")[0],
            removeDivs   = object.find(".remove")[0];
         
        console.log("..........................................",progressDivs, removeDivs);
         
         
        return {
            object: object,
            element: conversion,
            progress: (typeof progressDivs === "undefined" ? [] : YodaProgress(progressDivs)),
            language:  conversion.children(".selectoid").children(".selectoid_select").find(":selected").val(),
            text: fixText ( conversion.find(".conversion_div").text() ),
            textElement: $(conversion.children(".conversion_div")[0]),
            removeElement: (typeof removeDivs === "undefined" ? [] : removeDivs)
            
        };
    };
      
      
    HtmlStack.prototype.pushObject = function (element, force) {
                  
        var htmlElement = this.getHtmlElements(element),
            nextElement = $.extend({}, htmlElement);
              
        this.stack.push(nextElement);
          
        // allows to add text and result if needed (ex. initial value)
        if (this.stack.length <= 1 || force) {
            var current = this.getCurrent(),
                text = fixText( $(current.element).find(".conversion_div").text() ),
                result = (this.stack.length <= 1 ? text : null);
            current.text = text;
            current.result = result;
        }
        console.log("...pushing object onto stack",this.stack[this.stack.length -1]);  
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
      
      
    HtmlStack.prototype.registerRemoveListeners = function() {
        var self = this;
        
        $.each(self.stack, function (i, e) {
            $(e.removeElement).click(function () {
                $(e.object).hide('slow', function(){ 
                    $(self.addItemsStack[i]).hide('slow');
                    $(self.addItemsStack[i]).remove();
                    $(e.object).remove(); 
                }); 
            });
        });
    };
      

    HtmlStack.prototype.toggleMiddleElements = function (action, callback) {
        var self = this,
            stackSize = self.getStackSize();
        action = action || "show";
            
        if (action === "show" && !callback) {
            callback = function (e) { e.show(); };
        }
        if (action === "hide" && !callback) {
            callback = function (e) { e.slideUp(2000); };
        }
        
        if (!$.isEmptyObject(self.progress)) self.progress.toggle("hide");
        
          
        $.each(self.addItemsStack, function (i, e) {
            console.log('OBJECT', e);
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
        
        if (action == "hide") {
            $(".toggle_elements").css("display", "block");
        } else {
            $(".toggle_elements").hide();
        }
    };
    
    root.YodaStack = HtmlStack;
    
})();