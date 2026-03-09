import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { motion } from 'framer-motion';
import { Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2 } from 'lucide-react';

const MenuButton = ({ onClick, isActive, children }) => (
    <button
        onClick={onClick}
        className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-brand-mint text-gray-900 shadow-lg shadow-brand-mint/20' : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
    >
        {children}
    </button>
);

const NoteEditor = ({ content, onChange, title, onTitleChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Start writing your ambient thoughts...',
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) return null;

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6 space-y-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="Note Title"
                    className="w-full bg-transparent text-4xl font-bold text-white placeholder:text-white/20 focus:outline-none"
                />

                <div className="flex flex-wrap gap-2 p-2 glass-panel-dark rounded-2xl border border-white/5">
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                    >
                        <Bold size={20} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                    >
                        <Italic size={20} />
                    </MenuButton>
                    <div className="w-px h-6 bg-white/10 mx-1 self-center" />
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                    >
                        <Heading1 size={20} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                    >
                        <Heading2 size={20} />
                    </MenuButton>
                    <div className="w-px h-6 bg-white/10 mx-1 self-center" />
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                    >
                        <List size={20} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                    >
                        <ListOrdered size={20} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                    >
                        <Quote size={20} />
                    </MenuButton>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                <EditorContent editor={editor} className="text-lg leading-relaxed text-white/90" />
            </div>
        </div>
    );
};

export default NoteEditor;
