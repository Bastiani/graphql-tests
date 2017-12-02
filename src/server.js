import Koa from 'koa';
import Router from 'koa-router';
import koaBody from 'koa-body';
import graphqlHttp from 'koa-graphql';
// import graphql from 'graphql';

import connectToDatabase from './database';
// import Todo from './mongoose/todo';
import schema from './schema';

const app = new Koa();
const router = new Router();

app.use(koaBody({
  jsonLimit: '1kb',
}));

router.all(
  '/graphql',
  graphqlHttp({
    schema,
    graphiql: process.env.NODE_ENV !== 'production',
  }),
);
// router.post('/post', create);
// router.get('/list', graphqlHttp({ schema, pretty: true }));

app.use(router.routes());

app.use(async (ctx) => {
  ctx.body = 'Hello World';
});

connectToDatabase()
  .then((res) => {
    console.log(res);
    console.log('listen');
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
