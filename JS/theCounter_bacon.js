// regular counter
var up = $('#up').asEventStream('click');
var down = $('#down').asEventStream('click');
var reset = $('#reset').asEventStream('click');

var theCounts1 = up.map(+1).merge(down.map(-1)).merge(reset.map(0)).scan(0, function(x, y) {if (y === 0) {return 0} else { return x + y }});
//assign value to counter
theCounts1.assign($('#theCounts1'), 'text');

// factorial counter
var factNext = $('#factNext').asEventStream('click');
var factPrev = $('#factPrev').asEventStream('click');
var reset = $('#resetFact').asEventStream('click');

// need to create an input stream of "consecutive pairs" of integers to build fact and reverse fact
var theCounts2 = factNext.map(1).merge(reset.map(0)).merge(factPrev.map(-1)).scan([0, 1], function(x,y) {if (y === 0) {return [0, 1]} else {return [x[1], x[1] + y]}}).scan(1, function(x, y) {if ( y[0] === 0 ) {return 1} else {if (y[0]>= y[1]) {return x/y[0] } else {return x*y[1]}}});

theCounts2.assign($('#theCounts2'), 'text');

// fib counter
var fibNext = $('#fibNext').asEventStream('click');
var fibPrev = $('#fibPrev').asEventStream('click');
var reset = $('#resetFib').asEventStream('click');

// similar to fact, need to keep in memory the previous value so that reverse fib can work
var  theCounts3 = fibNext.map(1).merge(reset.map(0)).merge(fibPrev.map(-1)).scan([0, 1], function(x,y) {if (y === 0) {return [0, 1]} else {if (y < 0) { return [x[1]-x[0], x[0]] } else {return [x[1], x[1] + x[0]]}}}).scan(1, function(x, y) {if ( y[0] === 0 ) {return 0} else {if (y[0]>= y[1]) {return y[0]} else {return y[1]}}});

theCounts3.assign($('#theCounts3'), 'text');

// foldleft counter

// some options for the folding function
function divide(x, y) {
    return x/y
}

function diff(x, y) {
    return x-y
}

function mult(x, y) {
    return x*y
}

function sum(x, y) {
    return x+y
}

var foldNext = $('#foldNext').asEventStream('click');
var foldPrev = $('#foldPrev').asEventStream('click');
var reset = $('#resetFold').asEventStream('click');

var s = foldNext.map(1).merge(reset.map(0)).merge(foldPrev.map(-1)).scan([0, 1], function(x,y) {if (y === 0) {return [0, 1]} else {return [x[1], x[1] + y]}});

// higher order function - takes an initial value, a function (and its inverse) and applies a foldleft on the integer stream
function myfunc(st, init, f, inv) {
    return st.scan(init, function(x, y) {if ( y[0] === 0 ) {return init} else {if (y[0] >= y[1]) {return inv(x, y[1])} else {return f(x, y[0])}}})
}

var theCounts_sum = myfunc(s, 0, sum, diff);
var theCounts_mult = myfunc(s, 1, mult, divide);
var theCounts_div = myfunc(s, 1, divide, mult);
var theCounts_diff = myfunc(s, 0, diff, sum);
    
theCounts_sum.assign($('#theCounts_sum'), 'text');
theCounts_mult.assign($('#theCounts_mult'), 'text');
theCounts_div.assign($('#theCounts_div'), 'text');
theCounts_diff.assign($('#theCounts_diff'), 'text');


// rolling mean on integers
var rollNext = $('#rollNext_m').asEventStream('click');
var rollPrev = $('#rollPrev_m').asEventStream('click');
var reset = $('#resetRoll_m').asEventStream('click');

var theCounts5 = rollNext.map(1).merge(reset.map(0)).merge(rollPrev.map(-1)).scan([0, 1, 0], function(x,y) {if (y === 0) {return [0, 1, 0]} else {if (y < 0) {return [x[0]+y, x[1]+y, diff(x[2], x[0])]} else {return [x[0] + y, x[1] + y, sum(x[2], x[1])]}}}).scan(0, function(x, y) {return y[2]/y[1]});

theCounts5.assign($('#theCounts5'), 'text');


// square (map) counter on integers
var sqNext = $('#sqNext').asEventStream('click');
var sqPrev = $('#sqPrev').asEventStream('click');
var reset = $('#resetSq').asEventStream('click');

function square(x) {
    return x*x
}

var theCounts6 = sqNext.map(1).merge(reset.map(0)).merge(sqPrev.map(-1)).scan(0, function(x,y) {if (y === 0) {return 0} else {return x + y}}).scan(0, function(x, y) {return square(y)});

theCounts6.assign($('#theCounts6'), 'text');


// foldleft2 counter
var foldNext = $('#fold2Next').asEventStream('click');
var foldPrev = $('#fold2Prev').asEventStream('click');
var reset = $('#resetFold2').asEventStream('click');

var s1 = foldNext.map(1).merge(reset.map(0)).merge(foldPrev.map(-1)).scan([0, 1], function(x,y) {if (y === 0) {return [0, 1]} else {return [x[1], x[1] + y]}});
var s2 = foldNext.map(1).merge(reset.map(0)).merge(foldPrev.map(-1)).scan([0, 1], function(x,y) {if (y === 0) {return [0, 1]} else {return [x[1], x[1] + y]}});

// higher order function - takes an initial value, a function (and its inverse) and applies a foldleft on a combination of the 2 integer streams
function myfunc2(st1, st2, init, f, inv) {
    return st1.combine(st2, function (x, y) {return [x, y]}).scan(init, function(x, y) {if ( y[0][0] === 0 ) {return init} else {if (y[0][0] >= y[0][1]) {return inv(x, y[0][0], y[1][0])} else {return f(x, y[0][1], y[1][1])}}})
}

function sumSq(x, y, z) {
    return x + y*z
}

function sumSqInv(x, y, z) {
    return x - y*z
}

function sumInvSq(x, y, z) {
    return x + 1/(y*z)
}

function sumInvSqInv(x, y, z) {
    return x - 1/(y*z)
}

var theCounts_sumSq = myfunc2(s1, s2, 0, sumSq, sumSqInv);
var theCounts_sumInvSq = myfunc2(s1, s2, 1, sumInvSq, sumInvSqInv);
    
theCounts_sumSq.assign($('#theCounts_sumSq'), 'text');
theCounts_sumInvSq.assign($('#theCounts_sumInvSq'), 'text');

// theNatsPairs counter
var pairNext = $('#pairsNext').asEventStream('click');
var pairPrev = $('#pairsPrev').asEventStream('click');
var reset = $('#resetPairs').asEventStream('click');

function aux1(n, i) {
    if (i <= n) {
	return "( " + [i, n-i] + " )" + ", " + aux1(n, i+1)
    } else {
	return []
    }
}

function diag(n) {
    return aux1(n, 0)
}

var next = pairNext.map(1).merge(pairPrev.map(-1)).merge(reset.map(0)).scan(0, function(x,y) {if (y === 0) {return 0} else {return x + y}});
var theCounts_pairs = next.map(function(x) {return "( " + diag(x).toString().slice(0, -2) + " )"});

theCounts_pairs.assign($('#theCounts_pairs'), 'text');


// theNatsTriples counter
var tripleNext = $('#triplesNext').asEventStream('click');
var triplePrev = $('#triplesPrev').asEventStream('click');
var reset = $('#resetTriples').asEventStream('click');

function aux2(n, i, j) {
    if (i+j < n) {
	return "( " + [i, j, n-(i+j)] + " )" + ", " + aux2(n, i+1, j)
    } else {
	if (j <= n) {
	    return "( " + [i, j, n-(i+j)] + " )" + ", " + aux2(n, 0, j+1)
	} else {
	    return []
	}
    }
}

function triang(n) {
    return aux2(n, 0, 0)
}

var next = tripleNext.map(1).merge(triplePrev.map(-1)).merge(reset.map(0)).scan(0, function(x,y) {if (y === 0) {return 0} else {return x + y}});
var theCounts_triples = next.map(function(x) {return "( " + triang(x).toString().slice(0, -2) + " )"});

theCounts_triples.assign($('#theCounts_triples'), 'text');

/*
// theNatsQuads counter
var quadNext = $('#quadsNext').asEventStream('click');
var quadPrev = $('#quadsPrev').asEventStream('click');
var reset = $('#resetQuads').asEventStream('click');

function aux3(n, i, j, k) {
    if (i+j+k < n) {
	return "( " + [i, j, k, n-(i+j+k)] + " )" + ", " + aux3(n, i+1, j, k)
    } else {
	if (j+k < n) {
	    return "( " + [i, j, k, n-(i+j+k)] + " )" + ", " + aux3(n, 0, j+1, k)
	} else {
	    if (k <= n) {
		return "( " + [i, j, k, n-(i+j+k)] + " )" + ", " + aux3(n, 0, 0, k+1)]
	    } else {
	        return []
	    }
        }
    }
}

function cubes(n) {
    return aux3(n, 0, 0)
}

var next = quadNext.map(1).merge(quadPrev.map(-1)).merge(reset.map(0)).scan(0, function(x,y) {if (y === 0) {return 0} else {return x + y}});
var theCounts_quads = next.map(function(x) {return "( " + cubes(x).toString().slice(0, -2) + " )"});

theCounts_quads.assign($('#theCounts_quads'), 'text');

// triangular numbers
var triangularNext = $('#triangularNext').asEventStream('click');
var triangularPrev = $('#triangularPrev').asEventStream('click');
var reset = $('#resetTriangular').asEventStream('click');

var s = triangularNext.map(1).merge(reset.map(0)).merge(triangularPrev.map(-1)).scan([0, 1], function(x,y) {if (y === 0) {return [0, 1]} else {return [x[1], x[1] + y]}});

var theCounts_triangular = myfunc(s, 0, sum, diff);

theCounts_triangular.assign($('#theCounts_triangular'), 'text');

// pentagonal numbers
var pentagonalNext = $('#pentagonalNext').asEventStream('click');
var pentagonalPrev = $('#pentagonalPrev').asEventStream('click');
var reset = $('#resetPentagonal').asEventStream('click');

function cube(n) {
    return n*n*n
}

function pentag(n) {
    return (3*cube(n) - n)/2
}

var s = pentagonalNext.map(1).merge(reset.map(0)).merge(pentagonalPrev.map(-1)).scan(0, function(x,y) {if (y === 0) {return 0} else {return x + y}});

var theCounts_pentagonal = s.map(function(y) {return pentag(y)});

theCounts_pentagonal.assign($('#theCounts_pentagonal'), 'text');
*/


var canvas = document.getElementById("theCanvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "#123456";
ctx.fillRect(0, 0, 10, 10)

var width = 200;
var height = 200;

var u = $('#upWorm').asEventStream('click').map([0, -1]);
var d = $('#downWorm').asEventStream('click').map([0, 1]);
var l = $('#leftWorm').asEventStream('click').map([-1, 0]);
var r = $('#rightWorm').asEventStream('click').map([1, 0]);
var reset = $('#resetWorm').asEventStream('click').map([0, 0]);

function inc(x, y) {
    if (x < 0) {
	x = width + x
    }
    if (y < 0) {
	y = height + y
    }
    ctx.clearRect(0, 0, 200, 200);
    ctx.fillRect(x, y, 10, 10);
}

var theWormPos = u.merge(d).merge(l).merge(r).merge(reset).scan([0, 0], function(x, y) {if (y[0] !== y[1]) {return [(x[0] + 10*y[0])%width, (x[1] + 10*y[1])%height]} else {return [0,0]}}).map(function(x) {return inc(x[0], x[1])});

theWormPos.assign($('#theCanvas'), 'text');


/*

need to add auto button and some prizes to make worm grow

*/


function *naturalNumbers() {

    function *_naturalNumbers(n) {
	yield n;
	yield *_naturalNumbers(n + 1);
    }

    yield *_naturalNumbers(2);
}


function* filter(fn, st) {
    var n = st.next().value;
    
    while (!fn( n )) {
	var n = st.next().value;
    }
    yield n;
    yield* filter(fn, st);
}

function *sieve (theNats) {

    function *_sieve(Nats) {
	let n = Nats.next();
	yield n.value;
	yield* _sieve(filter(x => x%n.value !== 0, Nats));
    }
    
    yield *_sieve(theNats);
}

const N = naturalNumbers();

const primes = sieve(N);

function help(Nat) {
    return Nat.next().value;
}

var nextp = $('#nextPrime').asEventStream('click').map(1);

var thePrimes = nextp.scan(0, function(x, y) {return help(primes)});

thePrimes.assign($('#thePrimes'), 'text');



//permutations

function swap(xs, i, j) {
    var ys = xs.slice();
    var temp = ys[j];
    ys[j] = ys[i];
    ys[i] = temp;
    return ys;
}


function permutate(xs, p1, p2) {
    if (p1 < p2 && xs[p1-1] > xs[p2]) {
	return permutate(xs, p1, p2 -1)
    } else {
	var xss = swap(xs, p1-1, p2);
	return xss.slice(0, p1).concat(xss.slice(p1,).reverse());
    }
}

function pivot(xs) {
    var n = xs.length - 1;
    for (i=0; i <= n; i++) {
	if (i === n) {
	    return i
	} else {
	    if (xs[n-i] > xs[n-i-1]) {
		return n-i
	    }
	}
    }
}

function fact(n) {
    
    function aux(n, res) {
	if (n <= 1) {
	    return res
	} else {
	    return aux(n-1, res*n)
	}
    }

    return aux(n, 1);

}

function nextPermutation(xs, i) {
    if (i === 0) {
	return xs
    }
    var piv = pivot(xs);
    return nextPermutation(permutate(xs, piv, xs.length - 1), i-1);
}

function reset_action() {
    var intmax = parseInt(document.getElementById("intmax").value);
    var resetbtn = $('#set').asEventStream('click').map(0);
    var nextPerm = $('#nextPerm').asEventStream('click').map(1).merge(resetbtn).scan(0, function(x, y) {if (y === 0) { return 0 } else { return x+y }});
    var myArray = Array.apply(null, Array(intmax)).map(function (_, i) {return i});
    var thePerms = nextPerm.map(function(x) { return nextPermutation(myArray, x).toString() });
    thePerms.assign($('#thePerms'), 'text');
}

reset_action();
