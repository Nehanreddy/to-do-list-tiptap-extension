import { Node, mergeAttributes } from '@tiptap/core';

export const TaskItem = Node.create({
  name: 'taskItem',

  group: 'block',

  content: 'inline*',

  defining: true,

  addAttributes() {
    return {
      checked: {
        default: false,
        parseHTML: (element) => element.getAttribute('data-checked') === 'true',
        renderHTML: (attributes) => ({
          'data-checked': attributes.checked,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'li[data-type="taskItem"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'li',
      mergeAttributes(HTMLAttributes, { 'data-type': 'taskItem' }),
      ['input', { type: 'checkbox', checked: HTMLAttributes.checked ? 'checked' : false }],
      ['span', 0],
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
