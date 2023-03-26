const { default: Client } = require('vendor/client.js');

const context = `
	This is a todo app, each todo has a content and can be marked as done
`;
const api = new Client({ context });

// Example usage:
const $form = document.querySelector('form');

$form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData($form);
  const data = Object.fromEntries(formData);

  const res = await api.createTodo(data);

  console.log({ res });
});

const $button = document.querySelector('button');

$button.addEventListener('click', async (event) => {
  event.preventDefault();
  const res = await api.getTodos();

  console.log({ res });
});
