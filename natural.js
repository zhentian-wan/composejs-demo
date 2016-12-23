const Right = x => ({
    chain    : f => f(x),
    ap       : other => other.map(x),
    traverse : (of, f) => f(x).map(Right),
    map      : f => Right(f(x)),
    fold     : (f, g) => g(x),
    concat   : o => o.fold(_ => Right(x), y => Right(x.concat(y))),
    toString : () => `Right(${x})`
});

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

const Task = require('data.task');
const {List} = require('immutable-ext');

const fake = id =>
    ({
        id,
        name: 'user1',
        best_friend_id: id + 1
    });

const Db = ({
    find: id =>
        new Task((rej, res) => {
            res(id > 2 ? Right(fake(id)) : Left('not found'))
        })
});

const eitherToTask = e =>
    e.fold(
        Task.rejected,
        Task.of
    ); // Right(x) --> Task(user)

const res = Db.find(3) // Task(Right(user))
    .chain(eitherToTask) // Task(user)
    .chain(user =>
        Db.find(user.best_friend_id)
    ) // Task(Right(user))
    .chain(eitherToTask) // Task(user)
    .fork(e => console.error(e),
          r => console.log(r)
    );
