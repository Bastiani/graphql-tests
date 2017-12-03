import {
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import Todo from './mongoose/todo';

const TodoType = new GraphQLObjectType({
  name: 'TodoType',
  fields: () => ({
    _id: {
      type: GraphQLString,
      resolve: todo => todo.id,
    },
    itemId: {
      type: GraphQLInt,
      resolve: todo => todo.itemId,
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
    findTodos: {
      type: new GraphQLList(TodoType),
      args: {
        itemId: {
          type: GraphQLInt,
        },
      },
      resolve(_, args) {
        const response = Todo.find({ itemId: args.itemId });
        return response;
      },
    },
  }),
});

const AddTodo = mutationWithClientMutationId({
  name: 'AddTodo',
  inputFields: {
    itemId: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    item: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: ({ itemId, item }) => {
    const todoItem = new Todo({
      itemId,
      item,
      completed: false,
    });

    return todoItem
      .save()
      .then(todo => todo)
      .catch(err => err);
  },
  outputFields: {
    todo: {
      type: TodoType,
      resolve: obj => obj,
    },
    err: {
      type: GraphQLString,
      resolve: err => err,
    },
  },
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    AddTodo,
  },
});

const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

export default schema;
