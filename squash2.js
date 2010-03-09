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
       if (! this.k) this.k = env.execute;
       var value = env[this.proc].apply(env, this.args);
       this.k.call(value);
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

   function operate (a1, op, a2) {
     if (op == "==")  return a1 == a2;
     if (op == "===")  return a1 === a2;
     if (op == "!=")  return a1 != a2;
     if (op == "!==")  return a1 !== a2;
     if (op == "<")  return a1 < a2;
     if (op == "<=") return a1 <= a2;
     if (op == ">")  return a1 > a2;
     if (op == ">=") return a1 >= a2;
     return false;
   };

   squash.source.object.prototype = {
     select: function (key1, key2) {
       var result = {};
       for (var ii = 0; ii < arguments.length; ii++) {
         result[arguments[ii]] = this.obj[arguments[ii]];
       }
       return result;
     },
     where: function (key, op, val) {
       if (op == "=")  return this.obj[key] === val;
       if (op == "!")  return this.obj[key] !== val;
       if (op == "<")  return this.obj[key] < val;
       if (op == "<=") return this.obj[key] <= val;
       if (op == ">")  return this.obj[key] > val;
       if (op == ">=")  return this.obj[key] >= val;
       return false;
     },
     assert: function (key, op, key2) {
       return this.where(key, op, this.obj[key2]);
     },
     logical: function (op, statement1, statement2) {
       var optable = {
         "and": function (v, r) { return r && v; },
         "or":  function (v, r) { return r || v; },
         "not": function (v, r) { return r && !v; }
       };
       return foldr(optable[op], true, slice.call(arguments, 1));
     },
     group: function () {},
     order: function () {}
   };

   squash.source.objects = function (arr) {
     this.objects = arr;
   };
   squash.source.objects.prototype = squash.source.object.prototype;
   
 });
