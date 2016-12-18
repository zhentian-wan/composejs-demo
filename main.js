const { List } = require('immutable-ext');

const Right = x => ({
    chain    : f => f(x),
    ap       : other => other.map(x),
    traverse : (of, f) => f(x).map(Right),
    map      : f => Right(f(x)),
    fold     : (f, g) => g(x),
    concat   : o => o.fold(_ => Right(x), y => Right(x.concat(y))),
    toString : () => `Right(${x})`
})

const Left = x => ({
    chain    : f => Left(x),
    ap       : other => Left(x),
    traverse : (of, f) => of(Left(x)),
    map      : f => Left(x),
    fold     : (f, g) => f(x),
    concat   : o => o.fold(_ => Left(x), y => o),
    toString : () => `Left(${x})`
});

const fromNullable = x => x != null ?
                          Right(x) :
                          Left(null);

const tryCatch = f => {
    try {
        return Right(f())
    }
    catch( e ) {
        return Left(e)
    }
};

let stats = List.of({
                          page : 'Home',
                          view : 40
                      }, {
                          page : 'About',
                          view : 10
                      }, {
                          page : 'Help',
                          view : null
                      });

const Sum = x => ({
    x,
    concat   : ({ x: y }) => Sum(x + y),
    toString : () => `Sum(${x})`
});
Sum.empty = () => Sum(0);

const res = stats.foldMap(x => fromNullable(x.view)
.map(Sum), Right(Sum(0)));
console.log(res.toString()); // Right(Sum(50))




