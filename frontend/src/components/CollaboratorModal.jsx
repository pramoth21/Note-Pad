import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Plus, UserMinus, Users } from 'lucide-react';
import API from '../api/axios';

const CollaboratorModal = ({ isOpen, onClose, noteId, collaborators, onUpdate }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAdd = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await API.post(`/notes/${noteId}/collaborators`, { email });
            onUpdate(res.data.data.note);
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add collaborator');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (collaboratorId) => {
        try {
            const res = await API.delete(`/notes/${noteId}/collaborators`, {
                data: { collaboratorId }
            });
            onUpdate(res.data.data.note);
        } catch (err) {
            setError('Failed to remove collaborator');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="glass-panel relative w-full max-w-md overflow-hidden rounded-3xl"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <Users className="text-brand-mint" size={24} />
                                <h2 className="text-xl font-bold">Manage Collaborators</h2>
                            </div>
                            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <form onSubmit={handleAdd} className="space-y-4">
                                <label className="text-sm font-medium text-white/60 ml-1">Add by Email</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="friend@example.com"
                                            className="w-full rounded-xl bg-white/5 border border-white/10 py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-mint/50 transition-all font-light"
                                        />
                                    </div>
                                    <button
                                        disabled={loading}
                                        className="bg-brand-mint text-gray-900 px-4 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                {error && <p className="text-xs text-red-400 mt-1 ml-1">{error}</p>}
                            </form>

                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-white/60 ml-1">Current Collaborators</h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                                    {collaborators.length === 0 ? (
                                        <p className="text-sm text-white/30 italic ml-1">No collaborators yet</p>
                                    ) : (
                                        collaborators.map((c) => (
                                            <div key={c._id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                                <div>
                                                    <p className="text-sm font-medium">{c.name}</p>
                                                    <p className="text-xs text-white/40">{c.email}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleRemove(c._id)}
                                                    className="text-white/30 hover:text-red-400 transition-colors"
                                                >
                                                    <UserMinus size={18} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CollaboratorModal;
