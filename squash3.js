var squash3;

(function () {
   var squashNull = {};

   function squash (_tail, _name, _data) {
     this._tail = (_tail) ? _tail : squashNull;
     this._name = _name;
     this._data = _data;
   }

   function lookup (self, word) {
     if (this._tail  == squashNull) return eNotFound();
     if (this._name == word) return this._data;
     return lookup(self._tail, word);
   }

   function lookupAll (self, word, acc) {
     if (this._tail  == squashNull) {
       if (! acc) return eNotFound();
       else return acc;
     }
     if (this._name == word) {
       if (! acc) acc = [];
       acc.push(this._data);
     }
     return lookupAll(self._tail, word, acc);
   }

   function define (word) {
     return function (val) {
       if (! val) return lookup(this, word);
       return new squash(null, this, word, val);
     };
   }

   function toString () {
     var sources = {};
     var i, r = lookupAll(this, "from") || this.eMissingFrom();
     for (i in r) source[r[i]] = "t" + i;
   }

   function execute () {
     // do something
   }

   //// Export
   squash.prototype = {
     from:      define("from"),
     join:      define("join"),
     and:       define("and"),
     or:        define("or"),
     toString:  toString,
     execute:   execute
   };
   squash.prototype.where = squash.prototype.and;
   squash.prototype.b = squash.prototype.begin;
   squash.prototype.sub = squash.prototype.subselect;
   squash.prototype.run = squash.prototype.execute;
   squash3 = squash;
 })();
