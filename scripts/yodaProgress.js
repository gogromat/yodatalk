(function () {

    var root = this,
    
        oldYodaProgress = root.YodaProgress;
    
    var getElementId = (function () {
        var incrementingId = 0;
        return function (element) {
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
          
    var YodaProgress = function (element, options) {
    
        if ($.isEmptyObject(element)) return;
        
        var elementId = getElementUniqueId(element);
        
        if (YodaProgress[elementId]) {
            return YodaProgress[elementId];
        } else {
            YodaProgress[elementId] = new ElementProgress($(element), options);
            return YodaProgress[elementId];
        }
    
    };
          
    var ElementProgress = function (element, options) {
        this.options = {
            element : element,
            progress : 0,
            doneValue : 1,
            isDone : false,
            width: element.parent().width(),
            extraWidth: 120,
            doneCSSRule: {
              "background-image": "url('img/yoda_flipped.png')"
            }
        };
        $.extend(this.options, options);
    };
    
    ElementProgress.prototype.progress = function (progress) {
        
        var self = this;
        
        if (progress > self.options.progress) {
            // First time, show
            if (self.options.progress == 0) {
                self.options.element.show();
            }
            self.options.progress = progress;
            if (progress >= self.options.doneValue) {
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
        var action = action || "hide";
        if (action === "hide") {
            this.options.element.hide();
        } else {
            this.options.element.show();
        }
    };
        
    // Run YodaProgress in noConflict mode, 
    // returning the YodaProgress variable to its previous owner. 
    // Returns a reference to the YodaProgress object.
    YodaProgress.prototype.noConflict = function () {
        root.YodaProgress = oldYodaProgress;
        return this;
    };
    
	// Register as a named AMD module, since YodaProgress can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and YodaProgress is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of YodaProgress, it will work.
	if ( typeof define === "function" && define.amd ) {
		define("yodaProgress", ["jquery"], function () { 
		    return YodaProgress; 
		});
	}
    
    root.YodaProgress = YodaProgress;
    
}).call(this);