import { Node, mergeAttributes } from '@tiptap/core';

// TaskList extension (for the overall task list container)
export const TaskList = Node.create({
  name: 'taskList',
  group: 'block',
  content: 'taskItem+', // Ensures that the task list contains task items

  parseHTML() {
    return [
      {
        tag: 'ul[data-type="taskList"]', // Match <ul> elements with 'data-type="taskList"'
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'ul',
      mergeAttributes(HTMLAttributes, { 'data-type': 'taskList' }), // Merge attributes with the task list
      0, // Content (task items) will be inserted here
    ];
  },
});

// TaskItem extension (for individual items inside the task list)
export const TaskItem = Node.create({
  name: 'taskItem',
  group: 'block',
  content: 'inline*', // Content of a task item can be text and inline elements
  defining: true, // Marks this node as defining (used for the list item structure)

  addAttributes() {
    return {
      checked: {
        default: false, // Default value is unchecked
        parseHTML: (element) => element.getAttribute('data-checked') === 'true', // Parse 'data-checked' attribute as boolean
        renderHTML: (attributes) => ({
          'data-checked': attributes.checked, // Render checked status to 'data-checked'
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'li[data-type="taskItem"]', // Match <li> elements with 'data-type="taskItem"'
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'li',
      mergeAttributes(HTMLAttributes, { 'data-type': 'taskItem' }), // Merge attributes with the task item
      ['input', { type: 'checkbox', checked: HTMLAttributes.checked ? 'checked' : false }], // Checkbox element for task item
      ['span', 0], // Placeholder for task item text
    ];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const dom = document.createElement('li');
      dom.setAttribute('data-type', 'taskItem');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = node.attrs.checked;
      checkbox.addEventListener('change', () => {
        // Update the checked status when the checkbox is clicked
        editor.chain().focus().updateAttributes('taskItem', { checked: checkbox.checked }).run();
      });

      const content = document.createElement('span');
      content.textContent = node.textContent;

      dom.appendChild(checkbox);
      dom.appendChild(content);

      return { dom };
    };
  },
});

export default TaskList;
