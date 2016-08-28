global.checkRules={
  zoom:function(decl,prop,value){
    if(prop=="*zoom"){
      exist.zoom=true;
      return true;
    }
  },
  display:function(decl,prop,value){
    if(prop=="*display"){
      exist.display=true;
      return true;
    }
  },
  filter:function(decl,prop,value){
    if(prop=="filter"){
      exist.filter=true;
      return true;
    }
  }
}