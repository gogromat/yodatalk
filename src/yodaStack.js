"use strict";

(function ($) {
    
    var root = this,
    
        HtmlStack,
        
        YodaLanguagesSet = root.YodaCurrentLanguageSet;
    
    var fixText = function (text) {
        return $.trim(text.replace(/(\r\n|\r|\n)/gm," ").replace(/\s+/g," "));
    };

    // Html Elements Stack
    HtmlStack = function (options) {
          
        var self = this;
          
        self.options = {
            items : "",
            addItems: "",
            toggleElements: ".toggle_elements"
        };
        
        $.extend(self.options, options);
        
        self.restart();
    };
    
    HtmlStack.prototype.restart = function () {
        
        var self = this;
        
        // Un-registed previous results
        if (self.addItemsStack) {
            $.each(self.addItemsStack, function (i, e) {
                $(e).off();
            });  
        }
        
        // (re)calculate the stacks
        self.registerStacks();
        
        // Clean and Show hidden elements
        self.toggleMiddleElements();
        
        // Remove elements on "remove" click
        self.registerRemoveListeners();
        
        // Add elements on "add" click
        self.registerAddListeners();
        
        // empty deferred object
        self.deferred = {};        
    };
    
    HtmlStack.prototype.registerStacks = function () {
        var self = this; 
        self.stack = [],
        self.addItemsStack = [];
        
        // Populate stack of elements we will be working on
        $.each($(self.options.items), function (i, e) {
            self.pushObject(e);
        });
        $.each($(self.options.addItems), function (i, e) {
            self.addItemsStack.push($(e));
        });
    };
      
    HtmlStack.prototype.getStackSize = function () {
        return this.stack.length;
    };
      
    HtmlStack.prototype.getHtmlElements = function (element) {
        
        var object       = $(element),
            conversion   = $(element).find(".conversion"),
            progressDivs = $(element).find(".yoda")[0],
            removeDivs   = $(element).find(".remove")[0],
            selectoid    = $($(element).find(".selectoid")[0]);
        
        this.addSelectoid(selectoid);
        
        var result = {
            object: object,
            element: conversion,
            progress: (typeof progressDivs === "undefined" ? [] : root.YodaProgress(progressDivs)),
            language:  conversion.find(".selectoid_select > option:selected").val(),
            textElement: $(conversion.find(".conversion_div")[0]),
            removeElement: (typeof removeDivs === "undefined" ? [] : removeDivs)
        };
        result.text = fixText(result.textElement.text());
        
        return result;
    };
    
    HtmlStack.prototype.addSelectoid = function (selectoidObject) {
        
        var selectoidObjectId = selectoidObject.attr("id");
        
        if (!root.Selectoid[selectoidObjectId]) {
            
            var selectoid = new root.Selectoid({
                object: selectoidObject,
                data: YodaLanguagesSet.current,
                parameters: {
                    closeOnMouseLeave: false,
                    closeOnFocusOut: false,
                    button_class: "galaxy"
                },
                dataFormat: YodaLanguagesSet.currentFormat
            });
            
        } else {
            
            var prevVal = $("#" + root.Selectoid[selectoidObjectId].defaults.select).find("option:selected").val();
            
            root.Selectoid[selectoidObjectId].changeData({
               data: YodaLanguagesSet.current,
               dataFormat: YodaLanguagesSet.currentFormat,
               parameters: {
                   initial: prevVal
               }
            });
        }
    };
    
      
    HtmlStack.prototype.pushObject = function (element, force) {
                  
        this.stack.push(this.getHtmlElements(element));
          
        // allows to add text and result if needed (ex. initial value)
        if (this.stack.length <= 1 || force) {
            var current = this.getCurrent(),
                text = current.text,
                result = (this.stack.length <= 1 ? text : null);
            current.text = text;
            current.result = result;
        }
        //console.log("...pushing object onto stack",this.stack[this.stack.length -1]);  
    };
    
    HtmlStack.prototype.pushTranslations = function (resultObject) {
        // todo look into how to modify it if necessary
        // skip resultObject[from|to|text] for now
        var elementWithoutResult = this.stack[this.getNextIndex()];
        //console.log("...pushing new translation", resultObject);
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
        return [r.result, r.language, this.getNext().language];
    };
      
      
    HtmlStack.prototype.setNextText = function (text) {
        var result = $.trim(this.getCurrentResult());
        return this.slowTextInput(this.getCurrent().textElement, result);    
    };
      
      
    HtmlStack.prototype.slowTextInput = function (textElement, text) {
        var deferred = Q.defer(),
            promise = deferred.promise.when(
                root.Teletype(textElement[0], text, 25, true, function (i, l) {
                    deferred.notify( parseFloat((i+1)/l).toFixed(2) );
                })
            );
        this.deferred = deferred;
        return promise;
    };
      
      
    HtmlStack.prototype.registerRemoveListeners = function () {
        var self = this;
        
        $.each(self.stack, function (i, e) {
            $(e.removeElement).click(function () {
                $(e.object).hide('slow', function () { 
                    $(self.addItemsStack[i]).hide('slow');
                    $(self.addItemsStack[i]).remove();
                    $(e.object).remove();
                });
                //todo: change to cleaner way
                self.restart();
            });
        });
        
    };
      
    HtmlStack.prototype.registerAddListeners = function () {
        var self = this;
        
        $.each(self.addItemsStack, function (i, e) {
            
            $(e).click(function () {
                
                var add_element = $("<li class='add_element'><i class='icon-plus-sign icon-4'></i>&nbsp;<span class='galaxy'>Add another</span></li>"),
                    element = $(
                    "<li class='element'>" +
                        "<div class='yoda relative'></div>" +
                        "<div class='conversion'>" +
                            "<div class='leftSide'>" +
                                "<div class='selectoid language' data-initial='en'></div><br>" +
                                "<button class='galaxy remove'><i class='icon-minus-sign'></i>&nbsp;remove</button>" +
                            "</div>" +
                            "<div class='conversion_div'></div>" +
                        "</div>" +
                   "</li>");
                
                // Hide the newly generated element
                element.hide();
                // Hide newly generated add_element item
                add_element.hide();
                
                
                // Add newlygenereated element (in the DOM) after this add_element item
                $(this).after(element);
                
                // Add selectoid to newly generated element
                var newSelectoid = new root.Selectoid({
                    object: $($(element).find(".selectoid")[0]),
                    data: YodaLanguagesSet.current,
                    parameters: { button_class: "galaxy" },
                    dataFormat: YodaLanguagesSet.currentFormat
                });
                
                // Show the newly generated element
                element.slideDown();
                
                // Add newly generated add_element item (in the DOM) after newly generated element
                $(element).after(add_element);
                
                // Show newly generated add_element item
                add_element.slideDown();
                
                // recalculate stack, addItemStack
                self.restart();
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
            if (action === "hide" || action === "show") callback(e);
        });
        
        $.each(self.stack, function (i, e) {
            
            // in-the-middle elements
            if (i != 0 && i != stackSize - 1) {
              
                //todo: progress objects re-init, hide
                //e.textElement.text("");
                if (action === "hide" || action === "show") callback(e.object);
            }  
        });
        
        if (action == "hide") {
            
            $(self.options.toggleElements).css("display", "block");
            
        } else {
            $(self.options.toggleElements).hide();
        }
    };
    
    root.YodaStack = HtmlStack;
    
}).call(this, jQuery);