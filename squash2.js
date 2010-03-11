function foldr_generic (proc, nil, lst, car, cdr, nul) {
  if (nul(lst)) return nil;
  return proc(
    proc,
    proc(car(lst), nil),
    cdr(lst)
  );
};

//// Operates on Arrays.
function foldr (proc, nil, lst) {
  var idx = 0;
  function car (lst) {
    return lst[idx];
  }
  function cdr (lst) {
    idx = idx + 1;
    return lst;
  }
  function nul (lst) {
    return idx === lst.length;
  }
  return foldr_generic(proc, nil, lst, car, cdr, nul);
}

var squash;

(function () {
   squash = function (source, arg0, arg1) {
     return new unclosure(null, "source", slice.call(arguments));
   };

   var slice = Array.prototype.slice;

   function unclosure (k, proc, args) {
     this.k = k;
     this.proc = proc;
     this.args = args;
   }

   unclosure.prototype = {
     call: function (env) {
       if (! this.k) this.k = env.receive;
       this.k.call(k, env.apply(this));
     }
   };

   function make_method (name) {
     return function (arg0, arg1) {
       return new unclosure(this, name, slice.call(arguments));
     };
   }

   function make_where (op) {
     return function (key, val) {
       return this.where.apply(this, key, op, val);
     };
   }

   function make_logical (op) {
     return function (key, val) {
       return this.logical.apply(this, key, op, val);
     };
   }

   squash.fn = unclosure.prototype = {
     select: make_method("select"),
     where: make_method("where"),
     assert: make_method("assert"),
     logical: make_method("logical"),
     group: make_method("group"),
     order: make_method("order"),
     // Convenience
     eq: make_where("="),
     noteq: make_where("="),
     less: make_where("<"),
     lesseq: make_where("<="),
     greater: make_where(">"),
     greatereq: make_where(">="),
     or: make_logical("or"),
     and: make_logical("and"),
     not: make_where("not")
   };

   squash.source = {};
   squash.source.object = function (obj) {
     this.obj = obj;
   };

   //// An elegant argument for first-class operators.
   function operate (op, a1, a2) {
     switch (op) {
     case "=": return a1 == a2;
     case "==": return a1 == a2;
     case "===": return a1 === a2;
     case "!=": return a1 != a2;
     case "<>": return a1 != a2;
     case "!==": return a1 !== a2;
     case "<": return a1 < a2;
     case "<=": return a1 <= a2;
     case ">": return a1 > a2;
     case ">=": return a1 >= a2;
     case "&&": return a1 && a2;
     case "and": return a1 && a2;
     case "||": return a1 || a2;
     case "or": return a1 || a2;
     case "!": return !a1;
     case "not": return !a1;
     default: return false;
     };
   };

   var objpt = squash.source.object.prototype = {
     select: function (key1, key2) {
       var result = {};
       for (var ii = 0; ii < arguments.length; ii++) {
         result[arguments[ii]] = this.obj[arguments[ii]];
       }
       return result;
     },
     where: function (key, op, val) {
       if (operate(op, key, val)) return this;
       else return false;
     },
     assert: function (key, op, key2) {
       return this.where(key, op, this.obj[key2]);
     },
     logical: function (op, statement1, statement2) {
       var env = {
         apply: function (cl) {
           if (! ((cl.proc == "where") || (cl.proc == "assert"))) return null;
           return this[cl.proc].apply(this, cl.args);
         },
         receive: function (value) {
           this.result = value;
           return value;
         }
       };

       return foldr(
         function (head, tail) {
           return operate(op, head.call(env), tail);
         },
         true,
         slice.call(arguments, 1)
       );
     },
     group: function () {},
     order: function () {}
   };

   squash.source.objects = function (arr) {
     this.data = arr;
     this.result = [];
   };

   squash.source.objects.prototype = {
     select: function (key1, key2) {
       var result = [], obj;
       for (var ii = 0; ii < this.result.length; ii++) {
         this.obj = this.result[ii];
         result.push(objpt.where.apply(this, slice.call(arguments)));
       }
       return result;
     },
     where: function (key, op, val) {
       var data = (this.result.length > 0) ? this.result : this.data;
       for (var ii = 0; ii < data.length; ii++) {
         this.obj = data[ii];
         this.obj = objpt.where.call(this, key, op, val);
       }
       return result;
     },
     assert: objpt.assert
   };
 });
