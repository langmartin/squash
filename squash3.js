/*

from = tree, text
and(text) = cons, and, text
and(squash) = cons, and, recurse
join = from
select = cons, text

*/

var squash3;

(function () {
   // Constructors
   function squash () { }
   function isNull (o) {return ((o instanceof squash)&&(!o instanceof cons));}

   function cons (tail, name, data) {
     squash.call(this);
     this._tail = tail;
     this._name = name;
     this._data = data;
   }

   function tree (tail, name, data) {
     cons.call(this, tail, name, data);
   }

   // Iteration
   function lookup (self, word) {
     if (isNull(self._tail)) return eNotFound();
     if (self._name == word) return self._data;
     return lookup(self._tail, word);
   }

   function depthFirst (self, handler, noRecurse) {
     if (isNull(self._tail)) return;
     if (handler(self) === false) return;
     else {
       if (! noRecurse) {
         if (self._data instanceof squash) depthFirst(self._data, handler);
       }
       depthFirst(self._tail, handler);
     }
   }

   function lookupAll(self, word) {
     var acc = [];
     depthFirst(
       self,
       function (s) {
         if (s._name == word) acc.push(s._data);
       });
     if (acc.length == 0) return eNotFound();
     else return acc;
   }

   function define (word) {
     return function (val) {
       if (! val) return lookup(this, word);
       return new squash(null, this, word, val);
     };
   }

   function toString () {
     var prefix = {}, prefixCount = 0;
     var from = depthFirst(this, "from", true);
     var select = [];

     var i, r = lookupAll(this, "from") || this.eMissingFrom();
     for (i in r) prefix[r[i]] = "t" + i;

     r = lookupAll(this, "select");
     for (i in r) {
       result.push();
     }
   }

   function execute () {
     // do something
   }

   //// Export
   squash.prototype = {
     from:      define("from"),
     join:      define("join"),
     and:       define("and"),
     andnot:    define("andnot"),
     andlike:   define("andlike"),
     or:        define("or"),
     ornot:     define("ornot"),
     orlike:    define("orlike"),
     split:     define("split"),
     toString:  toString,
     execute:   execute
   };
   squash.prototype.where = squash.prototype.and;
   squash.prototype.b = squash.prototype.begin;
   squash.prototype.sub = squash.prototype.subselect;
   squash.prototype.run = squash.prototype.execute;
   squash3 = squash;
 })();
