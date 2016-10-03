/*
 * This Parser is used for filtering the rules of the filter
 */
var Parser = function (option) {
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

  if (!option || !option.comparisonEx || !option.logicalEx) {
    option = initialOptions;
  }

  this.comparisonEx = option.comparisonEx;
  this.logicalEx = option.logicalEx;
}

/*
 * Parse comparision strings and logical strings to expressions, for example: eq => ==
 */
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

/*
 * Find rules and expressions from parsed string
 */
Parser.prototype.rule = function (str) {
  var logicals = [];
  for (var key in this.logicalEx) {
    if (key !== 'not') {
      var value = this.logicalEx[key].replace(/([\^\$\.\*\+\?\=\!\:\|\\\/\(\)\[\]\{\}])/g, '\\$1');
      logicals.push(value);
    }
  }
  logicalsRegEx = new RegExp(logicals.join('|'));
  antiLogicalsRegEx = new RegExp('[^' + logicals.join('|') + ']');
  var rules = str.split(logicalsRegEx);
  var exs = str.split(antiLogicalsRegEx).filter(function (s) {
    return s.length > 0;
  });

  return {
    rules: rules,
    exs: exs
  }
}

Parser.prototype.run = function (str) {
  // 'use strict'
  str = this.parse(str);
  // var result = true;
  // console.log(eval(str));
  // var ruleArrs = this.rule(str);
  // var rules = ruleArrs.rules;
  // var exs = ruleArrs.exs;
  // for (var i = 0, len = rules.length; i < len; ++i) {
  //   result = eval(rules[i])
  //   console.log(result);
  //   console.log(rules[i]);
  // }

  return eval(str);
}

module.exports = Parser;
