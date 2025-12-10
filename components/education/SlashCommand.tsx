'use client';

import { Editor, Extension } from '@tiptap/core';
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy, { Instance as TippyInstance } from 'tippy.js';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

interface CommandItem {
  title: string;
  description: string;
  icon: string;
  shortcut?: string;
  command: (props: { editor: Editor; range: any }) => void;
  category: 'suggested' | 'basic' | 'advanced';
}

interface CommandListProps {
  items: CommandItem[];
  command: (item: CommandItem) => void;
}

interface CommandListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

const CommandList = forwardRef<CommandListRef, CommandListProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  // 카테고리별로 그룹화
  const suggested = props.items.filter((item) => item.category === 'suggested');
  const basic = props.items.filter((item) => item.category === 'basic');

  return (
    <div className="slash-command-menu z-50 min-w-[280px] max-w-[320px] max-h-[400px] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl">
      <div className="p-1.5">
        {/* Suggested */}
        {suggested.length > 0 && (
          <div className="mb-2">
            <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
              Suggested
            </div>
            {suggested.map((item, index) => {
              const globalIndex = props.items.indexOf(item);
              return (
                <button
                  key={index}
                  onClick={() => selectItem(globalIndex)}
                  onMouseEnter={() => setSelectedIndex(globalIndex)}
                  className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-md text-left transition-colors ${
                    globalIndex === selectedIndex
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center justify-center w-8 h-8 text-lg">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.title}
                    </div>
                  </div>
                  {item.shortcut && (
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {item.shortcut}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Basic blocks */}
        {basic.length > 0 && (
          <div>
            <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
              Basic blocks
            </div>
            {basic.map((item, index) => {
              const globalIndex = props.items.indexOf(item);
              return (
                <button
                  key={index}
                  onClick={() => selectItem(globalIndex)}
                  onMouseEnter={() => setSelectedIndex(globalIndex)}
                  className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-md text-left transition-colors ${
                    globalIndex === selectedIndex
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center justify-center w-8 h-8 text-lg">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.title}
                    </div>
                  </div>
                  {item.shortcut && (
                    <div className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                      {item.shortcut}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 px-2 py-1.5">
          <div className="text-xs text-gray-400 dark:text-gray-500">
            Type <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">/</span> on the page
          </div>
        </div>
      </div>
    </div>
  );
});

CommandList.displayName = 'CommandList';

const getSuggestionItems = ({ query }: { query: string }): CommandItem[] => {
  const items: CommandItem[] = [
    // Suggested
    {
      title: 'Callout',
      description: '중요한 내용을 강조',
      icon: '💡',
      category: 'suggested',
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('paragraph')
          .insertContent('💡 ')
          .run();
      },
    },
    {
      title: 'Toggle list',
      description: '접을 수 있는 리스트',
      icon: '▶',
      category: 'suggested',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run();
      },
    },
    {
      title: 'Table of contents',
      description: '목차 생성',
      icon: '📑',
      category: 'suggested',
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('heading', { level: 2 })
          .insertContent('목차')
          .run();
      },
    },

    // Basic blocks
    {
      title: 'Text',
      description: '일반 텍스트',
      icon: 'T',
      category: 'basic',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode('paragraph').run();
      },
    },
    {
      title: 'Heading 1',
      description: '가장 큰 제목',
      icon: 'H1',
      shortcut: '#',
      category: 'basic',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
      },
    },
    {
      title: 'Heading 2',
      description: '중간 크기 제목',
      icon: 'H2',
      shortcut: '##',
      category: 'basic',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
      },
    },
    {
      title: 'Heading 3',
      description: '작은 제목',
      icon: 'H3',
      shortcut: '###',
      category: 'basic',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
      },
    },
    {
      title: 'Bulleted list',
      description: '간단한 목록',
      icon: '•',
      shortcut: '-',
      category: 'basic',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: 'Numbered list',
      description: '숫자 목록',
      icon: '1.',
      shortcut: '1.',
      category: 'basic',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: 'To-do list',
      description: '체크박스 목록',
      icon: '☐',
      shortcut: '[]',
      category: 'basic',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run();
      },
    },
    {
      title: 'Quote',
      description: '인용구',
      icon: '"',
      shortcut: '>',
      category: 'basic',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setBlockquote().run();
      },
    },
    {
      title: 'Divider',
      description: '구분선',
      icon: '―',
      shortcut: '---',
      category: 'basic',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setHorizontalRule().run();
      },
    },
    {
      title: 'Code',
      description: '코드 블록',
      icon: '</>',
      shortcut: '```',
      category: 'basic',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setCodeBlock().run();
      },
    },
    {
      title: 'Table',
      description: '표 생성',
      icon: '⊞',
      category: 'basic',
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run();
      },
    },
  ];

  // 검색어로 필터링
  if (!query) return items;

  return items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );
};

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: '/',
        items: getSuggestionItems,
        render: () => {
          let component: ReactRenderer | null = null;
          let popup: TippyInstance[] | null = null;

          return {
            onStart: (props) => {
              component = new ReactRenderer(CommandList, {
                props,
                editor: props.editor,
              });

              if (!props.clientRect) {
                return;
              }

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect as any,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
                maxWidth: 'none',
              });
            },

            onUpdate(props) {
              component?.updateProps(props);

              if (!props.clientRect) {
                return;
              }

              popup?.[0]?.setProps({
                getReferenceClientRect: props.clientRect as any,
              });
            },

            onKeyDown(props) {
              if (props.event.key === 'Escape') {
                popup?.[0]?.hide();
                return true;
              }

              const commandListRef = component?.ref as CommandListRef | undefined;
              return commandListRef?.onKeyDown(props) ?? false;
            },

            onExit() {
              popup?.[0]?.destroy();
              component?.destroy();
            },
          };
        },
      } as SuggestionOptions),
    ];
  },
});
