import Koa from 'koa';
import Router from 'koa-router';
import koaBody from 'koa-body';
import graphqlHttp from 'koa-graphql';
import graphql from 'graphql';

import database from './database';
import Todo from './mongoose/todo';
import schema from './schema';

const app = new Koa();
const router = new Router();

app.use(koaBody({
  jsonLimit: '1kb',
}));

async function create(ctx) {
  console.log(ctx);
  const todoItem = new Todo({
    itemId: ctx.request.body.itemId,
    item: ctx.request.body.item,
    completed: false,
  });

  try {
    await todoItem.save();
    console.log(`+++TodoItem saved successfully ${todoItem.item}`);
  } catch (err) {
    console.log(`---TodoItem save failed ${err}`);
  }
}

router.post('/', (req, res) => {
  graphql(schema, req.body).then((result) => {
    create(result);
    res.send(result);
  });
});
// router.post('/post', create);
// router.get('/list', graphqlHttp({ schema, pretty: true }));

app.use(router.routes());

app.use(async (ctx) => {
  ctx.body = 'Hello World';
});

database()
  .then((res) => {
    console.log(res);
    console.log('listen');
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
