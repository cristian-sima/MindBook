/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var app = app | null;

function Data() {
  this.keys = {
    "TAB": {
      code: 9,
      symbol: "\t",
      special: true
    },
    "ENTER": {
      code: 13,
      symbol: "\n",
      special: true
    },
    "ARROW-UP": {
      code: 38,
      special: true
    },
    "ARROW-DOWN": {
      code: 40,
      special: true
    }
  };
}

Data.prototype = {  
  isSpecialKey : function (keyCode) {
    for(var keyName in this.keys) {
      var key = this.keys[keyName];
      if(key.code === keyCode) {
        return true;
      }
    }
    return false;
  }
};