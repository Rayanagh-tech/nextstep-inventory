import { Search, Plus, Edit, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAllTags, createTag, updateTag, deleteTag } from '@/services/tagService';
import type { Tag } from '@/types/entities/Tag';
import { toast } from 'sonner';
import { getTagWithCount } from '@/services/tagService';
import { useStore } from '@/store';

const getTagColor = (tagName: string): string => {
  const colors: { [key: string]: string } = {
    Production: '#EF4444',
    Development: '#10B981',
    Critical: '#F59E0B',
    'Web-Server': '#3B82F6',
    Database: '#8B5CF6',
    Backup: '#6B7280',
    Legacy: '#DC2626',
    'High-Performance': '#059669',
    Staging: '#F97316',
    Testing: '#06B6D4',
    'App-Server': '#0EA5E9',
    Cache: '#F472B6',
    Proxy: '#A855F7',
    Archive: '#4B5563',
    'Storage Bay': '#475569',
    'GPU Node': '#7C3AED',
    'Virtual Machine': '#60A5FA',
    'Physical Server': '#9D174D',
    Secure: '#0F766E',
    'MFA Enabled': '#22C55E',
    'Access Restricted': '#B91C1C',
    'Under Maintenance': '#E11D48',
    'To Upgrade': '#A16207',
    Sousse: '#10B981',
    Tunis: '#3B82F6',
    Datacenter1: '#2563EB',
    Datacenter2: '#9333EA',
    Default: '#64748B',
    TestLab: '#64548B',
  };
  return colors[tagName] || '#64748B';
};

const Tags = () => {
  const user = useStore((state) => state.user); // 👈 get current user
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTag, setNewTag] = useState<{ name: string; description?: string }>({ name: '', description: '' });

  const fetchTags = async () => {
    try {
      const result = await getTagWithCount();
      setTags(result);
    } catch (err) {
      toast.error('Failed to load tags');
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteTag(id);
      toast.success('Tag deleted');
      fetchTags();
    } catch (err) {
      toast.error('Failed to delete tag');
    }
  };

  const handleCreateTag = async () => {
    if (!newTag.name.trim()) return toast.error('Tag name is required');
    try {
      await createTag(newTag);
      toast.success('Tag created');
      setNewTag({ name: '', description: '' });
      setIsCreateOpen(false);
      fetchTags();
    } catch (err) {
      toast.error('Failed to create tag');
    }
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tags</h1>
        
        {/* ✅ Only show Create button if admin */}
        {user?.role === 'admin' && (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="w-4 h-4" />
            <span>Create Tag</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTags.map((tag) => (
          <div key={tag.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getTagColor(tag.name) }}></div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tag.name}</h3>
              </div>
              <div className="flex items-center space-x-1">
                <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 rounded">
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded"
                  onClick={() => handleDelete(tag.id)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{tag.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tag.count?.toLocaleString() ?? '0'}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">resources</span>
              </div>
              <div className="px-3 py-1 rounded-full text-white text-xs font-medium" style={{ backgroundColor: getTagColor(tag.name) }}>
                {tag.name}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Usage Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tag Usage Statistics</h3>
        <div className="space-y-3">
          {tags.slice(0, 5).map((tag) => (
            <div key={tag.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getTagColor(tag.name) }}></div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{tag.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div className="h-2 rounded-full" style={{
                    backgroundColor: getTagColor(tag.name),
                    width: `${(tag.count! / Math.max(...tags.map(t => t.count ?? 0))) * 100}%`
                  }}></div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 w-8 text-right">{tag.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Tag Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 space-y-4 border dark:border-gray-600">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Tag</h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Tag Name"
                value={newTag.name}
                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
              <textarea
                placeholder="Description (optional)"
                value={newTag.description}
                onChange={(e) => setNewTag({ ...newTag, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 rounded-lg text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTag}
                className="px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tags;
