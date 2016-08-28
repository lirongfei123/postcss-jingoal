var postcss = require('postcss');
var replaceRules = require("./replaceRules.js");
module.exports = postcss.plugin('postcss-jingoal', function (opts) {
  opts = opts || {};
  return function (css,result) {
   css.walk(function(rule){
    if(rule.type=="atrule"&&rule.name=="keyframes"){
      rule.cloneBefore({name:"-webkit-"+rule.name});
    }
   });
    css.walkRules(function (rule) {
      var exist={};
      rule.walkDecls(/.*/, function (decl) {
        if(typeof decl.raws.before!="undefined"){
          var before=decl.raws.before.trim();
          var prop=before+decl.prop;
        }else{
          var prop=decl.prop;
        }
        var value=decl.value.replace(/\s/,"");
        exist[prop]=value;
      });
      global.exist_str=JSON.stringify(exist);
      rule.walkDecls(/.*/, function (decl) {
        if(typeof decl.raws.before!="undefined"){
          var before=decl.raws.before.trim();
          var prop=before+decl.prop;
        }else{
          var prop=decl.prop;
        }
        var value=decl.value.replace(/^\s+|\s+$/,"");
        for(var i in replaceRules){
          if(replaceRules[i](decl,prop,value)){
            return;
          }
        }
      });
    });
  };
});
