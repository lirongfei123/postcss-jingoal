function convert_obj_str(obj){
  var temp={};
  temp[obj.prop]=obj.value;
  var temp_str=JSON.stringify(temp).replace(/^{|}$/g,"").replace(/\s/g,"");
  return temp_str;
}
function cloneBefore(decl,obj){
  var temp_str=convert_obj_str(obj);
  if(exist_str.indexOf(temp_str)===-1){
      decl.cloneBefore({ prop: obj.prop, value: obj.value});
  }
}
function cloneAfter(decl,obj){
  var temp_str=convert_obj_str(obj);
  if(exist_str.indexOf(temp_str)===-1){
     decl.cloneAfter({ prop: obj.prop, value: obj.value});
  }
}
module.exports = {
  /*将px 全部加上rem支持*/
  add_rem:function(decl,prop,value){
    if(/px\b/g.test(decl.value) 
      && decl.parent.selector.trim().indexOf("rem-") > -1
      && decl.raws.before.trim()!="*"
      ){
      cloneAfter(decl,{ 
        prop:decl.prop, 
        value: decl.value.replace(/\b(\d+(?:\.\d+)?)px\b/g, function(base, $1){
          return ($1/100).toFixed(2) + "rem"
        }) 
      });
      return true;
    }
  },
  /*改变ie9:root ie78,ie7,ie8的位置*/
  change_root_position:function(decl,prop,value){
    var selectors=decl.parent.selector.trim().split(","),
        prefix="",
        result;
    var reg =/( (?:\.ie(?:lte)?\d+)+)(:| |$)/;//匹配.ie7 .ie7.ie8.ielte9 这种
    selectors = selectors.map(function(selector){
      var lastSelector = null;
      while(true){
        selector = selector.replace(reg, function(base,r1,r2){
          prefix+=r1.trim();
          return r2;
        });
        if(lastSelector == selector){
          break;
        }
        lastSelector = selector;
      }
      return prefix + " " +selector;
    })
    decl.parent.selector=selectors.join(",");
  },
  linear_gradient:function(decl,prop,value){//垂直线性渐变
    var value=decl.value.replace(/\s/,"");
    if(decl.prop=="background"&&/^linear-gradient\(#(\w+),#(\w+)\)$/.test(value)){
      var resultReg=value.match(/^linear-gradient\(#(\w+),#(\w+)\)$/);
       cloneBefore(decl,{
          prop: 'filter',
          value:"progid:DXImageTransform.Microsoft.gradient(startcolorstr=#"+resultReg[1]+", endcolorstr=#"+resultReg[2]+", gradientType=0)"
      });
      cloneBefore(decl,{ prop: 'background', value: "-webkit-"+value});
      cloneBefore(decl,{ prop: 'background', value: "-moz-"+value});
      cloneBefore(decl,{ prop: 'background', value: "-ms-"+value});
      cloneBefore(decl,{ prop: 'background', value: "-o-"+value});
      return true;
    }
  },
  //背景透明
  background_rgba:function(decl,prop,value){//背景透明
    function rgba_to_hex(r,g,b,a){
      var h_a=(parseInt(a*255)).toString(16);
      var h_r=(parseInt(r)).toString(16);
      var h_g=(parseInt(g)).toString(16);
      var h_b=(parseInt(b)).toString(16);
      function addo(str){
        if(str.length==1){
          return "0"+str;
        }
        return str;
      }
      return addo(h_a)+addo(h_r)+addo(h_g)+addo(h_b);
    }
    var value=decl.value.replace(/\s/g,"");
    var reg=/^rgba\((\d+),(\d+),(\d+),([\d\.]+)\)$/;
    if(decl.prop=="background"&&reg.test(value)){
      var resultReg=value.match(reg);
      var hexColor=rgba_to_hex(resultReg[1],resultReg[2],resultReg[3],resultReg[4]);
      cloneBefore(decl,{ prop: 'filter', value: "progid:DXImageTransform.Microsoft.gradient(startcolorstr=#"+hexColor+",endcolorstr=#"+hexColor+")"});
      return true;
    }
  },
  inline_block:function(decl,prop,value){
    if(decl.prop=="display"&&decl.value=="inline-block"){
      cloneAfter(decl,{ prop: '*zoom', value: "1" });
      cloneAfter(decl,{ prop: '*display', value: "inline" });
      return true;
    }
  },
  pro_prefix:function(decl,prop,value){//值前缀
    if(/^flex$/.test(value)){
      cloneBefore(decl,{ prop: prop, value: "-webkit-flex" });
      cloneBefore(decl,{ prop: prop, value: "-moz-flex" });
      cloneBefore(decl,{ prop: prop, value: "-ms-flex" });
      cloneBefore(decl,{ prop: prop, value: "-o-flex" });
      return true;
    }
  },
  bro_prefix:function(decl,prop,value){//属性前缀
    if(/^transition.*|transform.*|box-shadow$/.test(decl.prop)){
      cloneBefore(decl,{ prop: '-webkit-'+prop, value: value });
      cloneBefore(decl,{ prop: '-moz-'+prop, value: value });
      cloneBefore(decl,{ prop: '-ms-'+prop, value: value });
      cloneBefore(decl,{ prop: '-o-'+prop, value: value });
      return true;
    }
  },
  opacity:function(decl,prop,value){//透明度
    if(decl.prop=="opacity"){
      cloneAfter(decl,{
        prop: 'filter',
        value: 'alpha(opacity=' + decl.value*100 + ')'
      });
      return true;
    }
  }
};
