/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */

// class Rectangle {
//   constructor(width, height) {
//     this.width = width;
//     this.height = height;
//   }

//   getArea() {
//     return this.width * this.height;
//   }
// }

function Rectangle(width, height) {
  this.width = width;
  this.height = height;
}

Rectangle.prototype.getArea = function area() {
  return this.width * this.height;
};


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = Object.create(proto);
  return Object.assign(obj, JSON.parse(json));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class Builder {
  constructor(selectorStr = '', order = null, statObj = {}) {
    this.str = selectorStr;
    this.order = order;
    this.stat = statObj;
  }

  chain(type, selectorStr, order) {
    this.validate(type, order);

    const newStr = this.str + selectorStr;
    const newStatObj = { ...this.stat };
    if (type in newStatObj) newStatObj[type] += 1;
    else newStatObj[type] = 1;

    return new Builder(newStr, order, newStatObj);
  }

  validate(type, order) {
    const uniqueTypes = ['element', 'id', 'pseudoElement'];

    if (this.order > order) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');

    if (uniqueTypes.includes(type) && this.stat[type]) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
  }

  element(value) {
    return this.chain('element', `${value}`, 0);
  }

  id(value) {
    return this.chain('id', `#${value}`, 1);
  }

  class(value) {
    return this.chain('class', `.${value}`, 2);
  }

  attr(value) {
    return this.chain('attr', `[${value}]`, 3);
  }

  pseudoClass(value) {
    return this.chain('pseudoClass', `:${value}`, 4);
  }

  pseudoElement(value) {
    return this.chain('pseudoElement', `::${value}`, 5);
  }

  combine(selector1, combinator, selector2) {
    let newStr = this.str;
    newStr = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return new Builder(newStr);
  }

  stringify() {
    return this.str;
  }
}

const cssSelectorBuilder = new Builder();


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
