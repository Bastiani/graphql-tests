import {
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} from 'graphql';

import Todo from './mongoose/todo';

const TodoType = new GraphQLObjectType({
  name: 'Todo',
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

const MutationAdd = {
  type: TodoType,
  description: 'Add a Todo',
  args: {
    title: {
      item: 'Todo item',
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: (root, { title }) => {
    const todoItem = new Todo({
      itemId: 1,
      item: title,
      completed: false,
    });
    todoItem
      .save()
      .then(() => todoItem)
      .catch(err => err);
  },
};

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    add: MutationAdd,
  },
});

const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

export default schema;
