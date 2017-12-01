import mongoose from 'mongoose';

const { Schema } = mongoose;

// create a schema
const todoSchema = new Schema(
  {
    itemId: Number,
    item: String,
    completed: Boolean,
  },
  { collection: 'TodoList' },
);

// we need to create a model using it
const todo = mongoose.model('todo', todoSchema);

export default todo;
