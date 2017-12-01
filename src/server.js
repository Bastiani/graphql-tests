import Koa from 'koa';
import Router from 'koa-router';
import koaBody from 'koa-body';
import graphqlHttp from 'koa-graphql';

import database from './database';
import todo from '../mongoose/todo';
import schema from './schema';

database();

const app = new Koa();
const router = new Router();

app.use(koaBody({
  jsonLimit: '1kb',
}));

async function create(ctx) {
  const todoItem = new todo({
    itemId: ctx.request.body.itemId,
    item: ctx.request.body.item,
    completed: false,
  });

  todoItem.save((err, result) => {
    err
      ? console.log(`---TodoItem save failed ${err}`)
      : console.log(`+++TodoItem saved successfully ${todoItem.item}`);
  });
}

router.post('/post', create);
router.get('/list', graphqlHttp({ schema, pretty: true }));

app.use(router.routes());

app.use(async (ctx) => {
  ctx.body = 'Hello World';
});

app.listen(3000);
