const Task          = require('data.task');
const { List, Map } = require('immutable-ext');

const httpGet = (path, params) => Task.of(`${path} result`);


// map
const res0 = Map(
    {
        home  : '/',
        about : '/about'
    }
).map(route =>
        httpGet(route, {})
);
console.log(res0); // Map{ home: Task(), about: Task()}


// Traverse
Map(
    {
        home: '/',
        about: '/about'
    }
).traverse(
    Task.of,
    route => httpGet(route, {})
).fork(console.error, console.log); // Map { "home": "/ result", "about": "/about result" }


// Double traverse
Map(
    {
        home: ['/', '/home'],
        about: ['/about', '/help']
    }
).traverse(
    Task.of,
    routes =>
        List(routes)
            .traverse(
                Task.of,
                route => httpGet(route, {})
            )
).fork(
    console.error, console.log
); // Map { "home": List [ "/ result", "/home result" ], "about": List [ "/about result", "/help result" ] }
