import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import { connectionDefinitions, fromGlobalId, globalIdField, nodeDefinitions } from 'graphql-relay';

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

const { connectionType: TodosConnection, edgeType: GraphQLTodoEdge } = connectionDefinitions({
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

const schema = new GraphQLSchema({
  query: Query,
});

export default schema;
