// http://stackoverflow.com/questions/9071573/is-there-a-simple-way-to-make-a-random-selection-from-an-array-in-javascript-or
function choose(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

function generate_random(tree, seed) {
    var last = seed
    var next = seed;
    do {
        last = next;
        next = last.replace(/<([^>]+)>/g, function(match, token) {
            if (tree[token]) {
                return choose(tree[token]);
            } else {
                return match;
            }
        });
    } while (next !== last);
    return next;
};

function numbers(low, high){
    var list = [];
    for (var i = low; i <= high; i++) {
        list.push(i);
    }
    return list;
};

function acceptable_orc(orc) {
    var blacklist = ["orc", "the last orc", "orcs"];
    if (blacklist.indexOf(orc) >= 0) return false;
    var words = orc.split(" ");
    var count = {};
    words.forEach(function(i) { count[i] = (count[i]||0)+1;  });
    var whitelist = ["lots", "the", "of", "a"];
    for (var word in count) {
        if (count[word] > 1 && whitelist.indexOf(word) == -1) {
           return false;
        }
    }
    return true;
}

function generate_orc() {
    orctree = {
        "orc(s)": ["<number> <orcs>", "<single orc>", "the last <single orc>"],
        "orcs": ["<single orc>s"],
        "single orc": ["<adjective> <single orc>", "orc"],
        "adjective": ["smelly", "green", "big", "small", "dumb", "blue", "brown", "gross", "cross-eyed", "blood thirsty", "pretty", "slightly intimidating", "poop"],
        "number": ["10000", "73", "<specific number>", "<lots> of", "<generic number>"],
        "generic number": ["<lots> of", "hordes of", "a horde of", "many", "some", "a few", "quite a lot of", "tons of"],
        "specific number": numbers(2, 99),
        "lots": ["lots", "lots and <lots>"],
    };
    do { 
        var orc = generate_random(orctree, "<orc(s)>");
    }
    while (!acceptable_orc(orc));
    return orc;
};

function generate_orc_emails(n) {
    n = n || 1;
    var emails = [];
    for(var i=0; i<n; i++) {
       var orc = generate_orc();
       var prefix = orc.replace(/ /g,"");
       var email = prefix + "@moreorcs.com";
       var link = "https://mailinator.com/inbox2.jsp?to=" + prefix;
       emails.push({
           "orc": orc,
           "email": email,
           "link": link,
       });
    }
    return emails;
};

// http://ejohn.org/blog/javascript-micro-templating/
// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function(){
  var cache = {};
 
  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :
     
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
       
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
       
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
   
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();
