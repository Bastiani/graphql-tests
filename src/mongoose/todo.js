import mongoose from 'mongoose';

const { Schema } = mongoose;

const todoSchema = new Schema(
  {
    itemId: Number,
    item: String,
    completed: Boolean,
  },
  { collection: 'TodoList' },
);

const todo = mongoose.model('todo', todoSchema);

export default todo;
