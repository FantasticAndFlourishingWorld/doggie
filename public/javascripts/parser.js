var Parser = function (option) {
  if (!option || !option.comparisonEx || !option.logicalEx) {
    option = initialOptions;
  }
  this.comparisonEx = option.comparisonEx;
  this.logicalEx = option.logicalEx;
}

var initialOptions = {
  comparisonEx: {
    'eq': '==',
    'ne': '!=',
    'gt': '>',
    'lt': '<',
    'ge': '>=',
    'le': '<='
  },
  logicalEx: {
    'and': '&&',
    'or': '||',
    'xor': '^',
    'not': '!'
  }
};

Parser.prototype.parse = function (str) {
  for (var key in this.comparisonEx) {
    str = str.replace(new RegExp(' ' + key + ' ', 'g'), this.comparisonEx[key]);
  }
  for (var key in this.logicalEx) {
    var space = key === 'not' ? '' : ' '
    str = str.replace(new RegExp(space + key + ' ', 'g'), this.logicalEx[key]);
  }

  return str;
}

Parser.prototype.rule = function (str) {
  var logicals = [];
  for (var key in this.logicalEx) {
    if (key !== 'not') {
      var value = this.logicalEx[key].replace(/([\^\$\.\*\+\?\=\!\:\|\\\/\(\)\[\]\{\}])/g, '\\$1');
      logicals.push(value);
    }
  }
  logicalsRegEx = new RegExp(logicals.join('|'));
  var rules = str.split(logicalsRegEx);
  
  return rules
}

module.exports = Parser;
