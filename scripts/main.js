require.config({
    paths: {
        // AMD
        
        //  Vendor
        jquery: [
            "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min",
            "//ajax.aspnetcdn.com/ajax/jQuery/jquery-1.10.1.min",
            "//code.jquery.com/jquery-1.10.1.min",
            "//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min",
            "vendor/jquery_1.10.0_min"
        ],
        //RequestAnimationFrame shim
        "requestAnimFrame": [ "vendor/requestAnimFrameShim" ],
        //A++ spec-compliant library "Q"
        q: [
            "vendor/q/q",
            "//cdnjs.cloudflare.com/ajax/libs/q.js/0.9.6/q.min" //wait until 0.9.7
        ],
        
        //  App
        lightSaber:     [ "lightSaber"  ],
        //Teletype - mimics human typing of text
        teletype:       [ "teletype"    ],
        //Progress Bar. Yoda Progress Bar
        yodaProgress:   ["yodaProgress" ],

        // Non-AMD
        //  Vendor
        trip:       [ "vendor/trip.min" ],
        togetherjs: [
            "https://togetherjs.com/togetherjs-min",
            "vendor/together"
        ],
        //Selectoid - JS select box
        selectoid: "vendor/selectoid/lib/selectoid.min",
        
        //  App
        
        //  Language sets
        languages:    "languages",
        
        //  Translators
        //Free google's translator using spreadsheets (author: Stichoza) 
        stichoza: "StichozaTranslator",
        //Free Bing Translator 
        bing:     "BingTranslator",
        //Free MyMemory Translator 
        mymemory: "MyMemoryTranslator",
        //Free google's translator using spreadsheets (author: Sangdol) 
        sangdol:  "SangdolTranslator",
        
        // Object that holds language sets
        yodaLang:     "yodaLanguageSet",
        // HTML Stack
        yodaStack:    "yodaStack",
        //Main SRC file
        yodaTalk:     "yodaTalk",
        
        tourHelper: "app/tour_helper",
        togetherHelper: "app/together_helper"
    },
    shim: {
        
        togetherjs:     { exports: "TogetherJS"                             },
        trip:           { exports: "Trip"              , deps: ["jquery"]   },
        selectoid:      { exports: "Selectoid"         , deps: ["jquery"]   },
        
        stichoza:       { exports: "StichozaTranslator", deps: ["jquery"]   },
        bing:           { exports: "BingTranslator"    , deps: ["jquery"]   },
        mymemory:       { exports: "MyMemoryTranslator", deps: ["jquery"]   },
        sangdol:        { exports: "SangdolTranslator" , deps: ["jquery"]   },
        
        // All languages
        languages:      { exports: "languages"                              },
        yodaLang:       { 
            exports: "YodaLanguageSet", 
            deps:   ["languages", "stichoza", "bing", "mymemory", "sangdol"] 
        },
       
        
        yodaStack:      { 
            exports: "YodaStack",
            deps:   ["jquery", "q", "yodaLang", "teletype", "selectoid"]
        },
        yodaTalk:       {
            deps:   ["jquery", "q", "yodaLang", "yodaStack"]
        },
        
        
        tourHelper:    { deps:   ["jquery"] },
        togetherHelper: { deps:   ["jquery"] }
    }
});

// Load Translators
require(["stichoza", "bing", "mymemory", "sangdol"]);

// Load main Yoda Files & Q library
require(["q", "yodaProgress", "yodaLang", "yodaStack", "yodaTalk"]);

require(["teletype", "requestAnimFrame"], function (Teletype) {
    // Activate Teletype and type in Star Wars opening
    Teletype("#preBrand", "A long time ago in a galaxy far, far away....", 10);            
});

// Activate Light Saber
require(["lightSaber", "requestAnimFrame"], function (LightSaber) {
    LightSaber(".color_laser");
});

// Require "user helpers"
require(['tourHelper', 'togetherHelper']);