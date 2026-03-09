import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Search, LogOut, Settings,
    ChevronRight, Calendar, Clock,
    Trash2, Share2, FileText, Menu, X
} from 'lucide-react';
import { format } from 'date-fns';
import API from '../api/axios';
import NoteEditor from '../components/NoteEditor';
import CollaboratorModal from '../components/CollaboratorModal';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [time, setTime] = useState(new Date());

    const saveTimeoutRef = useRef(null);

    // Clock update
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchNotes = useCallback(async (query = '') => {
        try {
            const endpoint = query ? `/notes/search?q=${query}` : '/notes';
            const res = await API.get(endpoint);
            setNotes(res.data.data.notes);
        } catch (err) {
            console.error('Failed to fetch notes', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    useEffect(() => {
        if (searchQuery) {
            const delayDebounce = setTimeout(() => {
                fetchNotes(searchQuery);
            }, 300);
            return () => clearTimeout(delayDebounce);
        } else {
            fetchNotes();
        }
    }, [searchQuery, fetchNotes]);

    const handleCreateNote = async () => {
        try {
            const res = await API.post('/notes', {
                title: 'Untitled Note',
                content: '<p></p>'
            });
            const newNote = res.data.data.note;
            setNotes([newNote, ...notes]);
            setSelectedNote(newNote);
        } catch (err) {
            console.error('Failed to create note', err);
        }
    };

    const handleUpdateNote = async (updates) => {
        if (!selectedNote) return;

        // Local update for responsiveness
        const updatedNote = { ...selectedNote, ...updates };
        setSelectedNote(updatedNote);
        setNotes(notes.map(n => n._id === updatedNote._id ? updatedNote : n));

        // Auto-save logic
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(async () => {
            try {
                await API.patch(`/notes/${selectedNote._id}`, updates);
            } catch (err) {
                console.error('Failed to auto-save', err);
            }
        }, 1000);
    };

    const handleDeleteNote = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this note?')) return;
        try {
            await API.delete(`/notes/${id}`);
            setNotes(notes.filter(n => n._id !== id));
            if (selectedNote?._id === id) setSelectedNote(null);
        } catch (err) {
            console.error('Failed to delete note', err);
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden p-4 md:p-6 gap-6">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 320 : 0, opacity: isSidebarOpen ? 1 : 0 }}
                className="glass-panel relative flex flex-col rounded-3xl overflow-hidden"
            >
                <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                            My Notes
                        </h2>
                        <button
                            onClick={handleCreateNote}
                            className="p-2 rounded-xl bg-brand-pink text-gray-900 hover:scale-110 active:scale-95 transition-all shadow-lg shadow-brand-pink/20"
                        >
                            <Plus size={20} fontWeight="bold" />
                        </button>
                    </div>

                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                        <input
                            type="text"
                            placeholder="Search thoughts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/30 transition-all"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                        {loading ? (
                            <div className="flex flex-col gap-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
                                ))}
                            </div>
                        ) : notes.length === 0 ? (
                            <div className="text-center py-10 opacity-30">
                                <FileText className="mx-auto mb-2" size={32} />
                                <p>No notes found</p>
                            </div>
                        ) : (
                            notes.map(note => (
                                <motion.div
                                    key={note._id}
                                    onClick={() => setSelectedNote(note)}
                                    whileHover={{ scale: 1.02 }}
                                    whileActive={{ scale: 0.98 }}
                                    className={`group relative cursor-pointer p-4 rounded-2xl border transition-all ${selectedNote?._id === note._id
                                            ? 'bg-brand-pink/10 border-brand-pink/30 shadow-lg shadow-brand-pink/5'
                                            : 'bg-white/5 border-transparent hover:border-white/10'
                                        }`}
                                >
                                    <h3 className="font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis mb-1">
                                        {note.title || 'Untitled Note'}
                                    </h3>
                                    <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest font-bold">
                                        <span>{format(new Date(note.updatedAt), 'MMM dd')}</span>
                                        {note.collaborators?.length > 0 && (
                                            <span className="bg-brand-mint/20 text-brand-mint px-1.5 py-0.5 rounded">Shared</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={(e) => handleDeleteNote(note._id, e)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-300 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* User Profile Widget */}
                    <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-brand-mint/20 flex items-center justify-center text-brand-mint font-bold uppercase ring-2 ring-brand-mint/10">
                                {user?.name?.[0]}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold whitespace-nowrap overflow-hidden text-ellipsis">{user?.name}</p>
                                <p className="text-[10px] text-white/40 uppercase tracking-tighter">Contributor</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 text-white/30 hover:text-white transition-colors"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col gap-6 overflow-hidden">
                {/* Top bar with ambient clock */}
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-3 glass-panel rounded-2xl hover:scale-105 active:scale-95 transition-all"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <div className="glass-panel px-6 py-3 rounded-2xl flex items-center gap-4">
                            <div className="flex items-center gap-2 text-brand-mint">
                                <Clock size={16} />
                                <span className="font-mono text-lg font-bold">{format(time, 'HH:mm:ss')}</span>
                            </div>
                            <div className="w-px h-4 bg-white/10" />
                            <div className="flex items-center gap-2 text-white/60">
                                <Calendar size={16} />
                                <span className="text-sm">{format(time, 'EEEE, MMMM do')}</span>
                            </div>
                        </div>
                    </div>

                    {selectedNote && (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsShareModalOpen(true)}
                                className="flex items-center gap-2 px-5 py-3 glass-panel rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all text-brand-mint"
                            >
                                <Share2 size={18} />
                                <span>Share</span>
                            </button>
                        </div>
                    )}
                </header>

                {/* Editor Area */}
                <div className="flex-1 glass-panel rounded-[2rem] overflow-hidden p-8 md:p-12 relative">
                    <AnimatePresence mode="wait">
                        {selectedNote ? (
                            <motion.div
                                key={selectedNote._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="h-full"
                            >
                                <NoteEditor
                                    title={selectedNote.title}
                                    onTitleChange={(title) => handleUpdateNote({ title })}
                                    content={selectedNote.content}
                                    onChange={(content) => handleUpdateNote({ content })}
                                />
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                                <div className="p-8 rounded-[2.5rem] bg-white/5 mb-6">
                                    <FileText size={80} />
                                </div>
                                <h3 className="text-2xl font-bold">Select a note to read</h3>
                                <p className="mt-2">Or create a new one to start your journey</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Share Modal */}
            {selectedNote && (
                <CollaboratorModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    noteId={selectedNote._id}
                    collaborators={selectedNote.collaborators || []}
                    onUpdate={(updatedNote) => {
                        setSelectedNote(updatedNote);
                        setNotes(notes.map(n => n._id === updatedNote._id ? updatedNote : n));
                    }}
                />
            )}
        </div>
    );
};

export default Dashboard;
