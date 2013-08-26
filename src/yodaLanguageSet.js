// Simple wrapper for languages
(function () {
    
    var root = this;
    
    var YodaLanguageSet = function () {
        this.languages = root.Languages;
        this.current;
        this.currentFormat;
        this.currentTranslator;
        return this;
    };
    
    YodaLanguageSet.prototype.setLanguageSet = function (abbreviation) {
        var lang_abbr = abbreviation;
        
        console.log(abbreviation);
        
        if (abbreviation === "bing") {
            lang_abbr = "bt";
            this.currentFormat = this.getLanguageFormat(lang_abbr);
            this.currentTranslator = new root.BingTranslator();
        } else if (abbreviation === "google" || abbreviation === "sangdol" || abbreviation === "stichoza") {
            lang_abbr = "gt";
            this.currentFormat = this.getLanguageFormat(lang_abbr);
            if (abbreviation === "stichoza") {
                this.currentTranslator = new root.StichozaTranslator();
            } else {
                this.currentTranslator = new root.SangdolTranslator();
            } 
        } else if (abbreviation === "mymem") {
            lang_abbr = "RFC3066";
            this.currentFormat = this.getLanguageFormat(lang_abbr);
            this.currentTranslator = new root.MyMemoryTranslator();
        }
        
        if (this[abbreviation] == null) this[abbreviation] = this.languages.getByAbbreviation(lang_abbr);
        this.current = this[abbreviation];
        return this.current;
    };
    
    YodaLanguageSet.prototype.getLanguageFormat = function (abbr) {
        return function (el) {
            return {
                name: el.name,
                value: el.abbreviation[abbr]
            };
        };
    }
    
    YodaLanguageSet.prototype.getCurrentTranslator = function () {
        return this.currentTranslator;  
    };
    
    
    var YodaCurrentLanguageSet = new YodaLanguageSet();
    // Set bing for now
    YodaCurrentLanguageSet.setLanguageSet("bing");
    
    root.YodaCurrentLanguageSet = YodaCurrentLanguageSet;
    
}).call(this);
