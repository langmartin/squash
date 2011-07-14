var squash3;

(function () {
   var squashNull = {};

   function squash (_tail, _name, _data) {
     this._tail = (_tail) ? _tail : squashNull;
     this._name = _name;
     this._data = _data;
   }

   function lookup (self, word) {
     if (self._tail  == squashNull) return eNotFound();
     if (self._name == word) return self._data;
     return lookup(self._tail, word);
   }

   function depthFirst (self, handler) {
     if (self._tail  == squashNull) return;
     if (handler(self) === false) return;
     else {
       if (self._data instanceof squash) depthFirst(self._data, handler);
       else depthFirst(self._tail, handler);
     }
   }

   // function iterator (self, handler) {
   //   if (self._tail  == squashNull) handler(self);
   //   else {
   //     var tail = (self._data instanceof squash) ? self._data : self._tail;
   //     handler(self, function () { iterator(tail, handler); });
   //   }
   // }

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
     var select = [];


     function lp (self, up) {
       var from = lookup(self, "from");
       
     }

     breadthFirst(
       this,
       function (s) {
         switch(s._name) {
         case "from":
           prefix[s._data] = "t" + prefixCount++;
           break;
         case "select":
           select.push(
             
         if (s._name == "from") 
         if (s._name
       });


     var i, r = lookupAll(this, "from") || this.eMissingFrom();
     for (i in r) prefix[r[i]] = "t" + i;

     r = lookupAll(this, "select");
     for (i in r) {
       result.push(
     }


     // depthFirst(
     //   this,
     //   function (s) {
     //   });
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
