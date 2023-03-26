# ChatGPT as a Backend

Small experiment to see if it's possible to use ChatGPT as a backend

It's as easy as 1, 2, 3!

```javascript
import { GPTBackendAPI } from 'chatgpt-as-a-backend';

// Just give it a context, that's it
const api = new GPTBackendAPI({ context: 'This is a todo app' });

// Start using any API method, they are generated on the fly!
await api.createTodo({ content: 'Buy some milk' });
// -> { id: 123, created_at: 1675385912266, content: 'Buy some milk', done: false }
await api.markTodoAsDone({ id: 123 });
// -> { id: 123, created_at: '1675385934216', content: 'Buy some milk', done: true }
setTimeout(() => {
  await api.createTodo({ content: 'Walk the dog' });
  await api.createTodo({ content: 'Wash dishes' });

  await api.getTodosCreatedSince({ seconds: 60 });
  // -> [{ ...data, content: 'Walk the dog' }, { ...data, content: 'Wash dishes' }]
}, 60_000);
```
