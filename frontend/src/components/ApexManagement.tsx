import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, ExternalLink, Trash2, Crown, AlertCircle, CheckCircle } from 'lucide-react';

interface ManagedClient {
  id: number;
  clientName: string;
  clientEmail: string;
  createdAt: string;
  hasSpaceshipAccess: boolean;
  spaceshipIntegrationCompleted: boolean;
}

interface ApexManagementProps {
  userToken: string;
}

const ApexManagement: React.FC<ApexManagementProps> = ({ userToken }) => {
  const [clients, setClients] = useState<ManagedClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [maxAccounts, setMaxAccounts] = useState(30);
  
  // Create client form state
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [creating, setCreating] = useState(false);

  const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3004';

  // Load managed clients
  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/auth/managed-clients`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setClients(data.clients);
        setTotalCount(data.totalCount);
        setMaxAccounts(data.maxAccounts);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load clients');
      }
    } catch (err: any) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new managed client
  const createClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newClientEmail.trim()) return;

    try {
      setCreating(true);
      const response = await fetch(`${apiUrl}/api/auth/create-apex-client`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientName: newClientName.trim(),
          clientEmail: newClientEmail.trim()
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Reset form and close modal
        setNewClientName('');
        setNewClientEmail('');
        setShowCreateModal(false);
        
        // Reload clients list
        await loadClients();
      } else {
        setError(data.error || 'Failed to create client');
      }
    } catch (err: any) {
      setError('Network error: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  // Generate Spaceship access for client
  const generateSpaceshipAccess = async (clientId: number) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/generate-spaceship-token-for-client`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ clientId })
      });

      const data = await response.json();

      if (response.ok) {
        // Open Spaceship in new tab
        window.open(data.redirectUrl, '_blank');
      } else {
        setError(data.error || 'Failed to generate Spaceship access');
      }
    } catch (err: any) {
      setError('Network error: ' + err.message);
    }
  };

  // Delete managed client
  const deleteClient = async (clientId: number, clientName: string) => {
    if (!confirm(`Are you sure you want to delete client "${clientName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/auth/managed-client/${clientId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await loadClients(); // Reload the list
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete client');
      }
    } catch (err: any) {
      setError('Network error: ' + err.message);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  if (loading && clients.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        <span className="ml-3 text-slate-400">Loading managed clients...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-yellow-500/20">
            <Crown className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Client Management</h2>
            <p className="text-slate-400">
              {totalCount}/{maxAccounts} managed accounts
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          disabled={totalCount >= maxAccounts}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all
            ${totalCount >= maxAccounts
              ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
          `}
        >
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span className="text-red-200">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-300 hover:text-red-100"
          >
            ×
          </button>
        </motion.div>
      )}

      {/* Account Limit Warning */}
      {totalCount >= maxAccounts * 0.8 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <span className="text-yellow-200">
            You're approaching your account limit ({totalCount}/{maxAccounts}). 
            Consider upgrading for more managed accounts.
          </span>
        </motion.div>
      )}

      {/* Clients List */}
      <div className="space-y-3">
        {clients.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No managed clients yet</p>
            <p className="text-sm">Create your first client to get started</p>
          </div>
        ) : (
          clients.map((client) => (
            <motion.div
              key={client.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-slate-700/50 border border-slate-600/30 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {client.clientName?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{client.clientName || 'Unknown Client'}</h3>
                  <p className="text-sm text-slate-400">{client.clientEmail || 'No email'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {client.hasSpaceshipAccess ? (
                      <div className="flex items-center gap-1 text-xs text-green-400">
                        <CheckCircle className="w-3 h-3" />
                        Spaceship Ready
                      </div>
                    ) : (
                      <div className="text-xs text-yellow-400">Setting up...</div>
                    )}
                    <span className="text-xs text-slate-500">
                      Created {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : 'Unknown date'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => generateSpaceshipAccess(client.id)}
                  disabled={!client.hasSpaceshipAccess}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${client.hasSpaceshipAccess
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    }
                  `}
                >
                  <ExternalLink className="w-4 h-4" />
                  Access Portfolio
                </button>
                
                <button
                  onClick={() => deleteClient(client.id, client.clientName)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Client Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-800 border border-slate-600/50 rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-white mb-4">Add New Client</h3>
              
              <form onSubmit={createClient} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Client Email
                  </label>
                  <input
                    type="email"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="client@example.com"
                    required
                  />
                </div>
                
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating || !newClientName.trim() || !newClientEmail.trim()}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:text-slate-400 text-white rounded-xl transition-all"
                  >
                    {creating ? 'Creating...' : 'Create Client'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ApexManagement;