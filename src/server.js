import Koa from 'koa';
import Router from 'koa-router';
import koaBody from 'koa-body';
import graphqlHttp from 'koa-graphql';

import connectToDatabase from './database';
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
    pretty: true,
    graphiql: true,
  }),
);

app.use(router.routes());

(async () => {
  try {
    const res = await connectToDatabase();
    console.log(res);
    console.log('listen');
    app.listen(3000);
  } catch (err) {
    console.log(err);
  }
})();
