import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } from 'graphql';

import ToDo from './mongoose/todo';

const ToDoType = new GraphQLObjectType({
  name: 'ToDo',
  fields: () => ({
    _id: {
      type: GraphQLString,
      resolve: todo => todo.id,
    },
    item: {
      type: GraphQLString,
      resolve: todo => todo.item,
    },
  }),
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    findToDos: {
      type: new GraphQLList(ToDoType),
      args: {
        itemId: {
          type: GraphQLInt,
        },
      },
      resolve(_, args) {
        const response = ToDo.find({ itemId: args.itemId });
        return response;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: QueryType,
});

export default schema;
