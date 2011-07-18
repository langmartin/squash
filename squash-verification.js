(function () {
   var o = {}, s = {};

   o.s0 = new squash3().from("foo");
   s.s0 = "select * from foo t0";

   o.s1 = o.s0.select("a", "b", "c");
   s.s1 = "select t0.a, t0.b, t0.c from foo t0";

   o.s2 = o.s0.and("a", 1).andnot("a", 3).andlike(b, "%f%");
   s.s2 = "select * from foo t0 where "
     + "t0.a = 1 and t0.a <> 3 and t0.b not like '%f%'";

   o.or0 = o.s0.or("a", 1).or("b", 2);
   o.or1 = o.s1.and(o.or0).and(o.or0);
   s.or1 = "select t0.a, t0.b, t0.c from foo t0 "
     + "where (t0.a = 1 or t0.b = 2) and "
     + "(t0.a = 1 or t0.b = 2)";
   
   o.t0 = new squash3().from("bar");
   o.j0 = o.s1.join(o.t0, "a", "d");
   s.j0 = "select t0.a, t0.b, t0.c from foo t0 "
     + "join bar t1 on t0.a = t1.d";

   for (var key in sq) {
     if (st[key]) {
       var out = "" + sq[key];
       if (out != st[key])
         throw new Error("test failed " + out + " != " + st[key]);
     }
   }
 })();
