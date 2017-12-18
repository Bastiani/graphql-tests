import mockingoose from 'mockingoose';
import todo from '../src/mongoose/todo';

describe('test mongoose todo model', () => {
  it('should return the todo with find', () => {
    const todoItem = {
      _id: '5a2192118b9a881f1fe480f0',
      item: 'test todo',
      completed: false,
    };

    mockingoose.todo.toReturn(todoItem, 'find');

    return todo
      .find({ itemId: 1 })
      .then(todoResult => expect(JSON.parse(JSON.stringify(todoResult))).toMatchObject(todoItem));
  });
});
