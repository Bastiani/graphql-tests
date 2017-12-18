import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';

import {
  mutationWithClientMutationId,
  connectionDefinitions,
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
} from 'graphql-relay';

import Todo from './mongoose/todo';

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);
    if (type === 'Todo') {
      return Todo.find({ id });
    }
    return null;
  },
  (obj) => {
    if (obj instanceof Todo) {
      // eslint-disable-next-line
      return GraphQLTodo;
    }
    return null;
  },
);

const GraphQLTodo = new GraphQLObjectType({
  name: 'Todo',
  fields: {
    id: globalIdField('Todo'),
    item: {
      type: GraphQLString,
      resolve: obj => obj.item,
    },
    completed: {
      type: GraphQLBoolean,
      resolve: obj => obj.completed,
    },
  },
  interfaces: [nodeInterface],
});

const { edgeType: GraphQLTodoEdge } = connectionDefinitions({
  name: 'Todo',
  nodeType: GraphQLTodo,
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    allTodos: {
      type: new GraphQLList(GraphQLTodo),
      resolve: () => Todo.find({}),
    },
    node: nodeField,
  },
});

const GraphQLAddTodoMutation = mutationWithClientMutationId({
  name: 'AddTodo',
  inputFields: {
    item: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    todoEdge: {
      type: GraphQLTodoEdge,
      resolve: ({ _id }) => {
        console.log(`========== ${_id}`);
        const todo = Todo.find({ _id });
        return {
          // cursor: cursorForObjectInConnection(Todo, todo),
          node: todo,
        };
      },
    },
  },
  mutateAndGetPayload: async ({ item }) => {
    const todo = new Todo({
      item,
      completed: false,
    });
    try {
      const localTodoId = await todo.save();
      const { _id } = localTodoId;
      return { _id };
    } catch (err) {
      return { err };
    }
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addTodo: GraphQLAddTodoMutation,
  },
});

const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});

export default schema;
