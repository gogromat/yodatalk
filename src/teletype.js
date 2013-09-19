// Chrome, Firefox, Opera 12+, IE 8+ (7 has no querySelector)
(function ($) {
    
    var root = this,
    
        oldTeletype = root.Teletype,
        
        // Will type in 'element' the 'text' with 'delay'.
        // Will 'redraw' the div by default as well as call
        // 'userFunction' on every iteration (status update)
        
        // The 0..100% status can be found with  parseFloat((index + 1) / length).toFixed(2) in 'userDefined'
        // function that accepts arguments 'index' and 'length'
        
        Teletype = function (element, text, delay, redraw, userFunction, undefined) {
        
        var el = (typeof element === "object" ? element : document.querySelector(element)),
            div = document.createElement('div'),
            innerText = document.body.textContent ? "textContent" : "innerText";
    
        delay = delay || 10;
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
    };
    
    
    // Run Teletype in noConflict mode, 
    // returning the Teletype variable to its previous owner. 
    // Returns a reference to the Teletype object.
    Teletype.prototype.noConflict = function () {
        root.Teletype = oldTeletype;
        return this;
    };
    
    root.Teletype = Teletype;
    
}).call(this, jQuery);