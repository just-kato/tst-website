/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/BlogView.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { PlusCircle, Calendar, Tag, FileText } from 'lucide-react';
import Button from '@/components/Button/Button';
import { Post } from '@/types';
import { NewsletterViewSkeleton } from '@/components/skeleton';
import toast from 'react-hot-toast';
import BlogDetailModal from '@/components/Blog/BlogDetailModal';

const BlogView = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [archivedPosts, setArchivedPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const supabase = createClientComponentClient();
  const router = useRouter();

  const statusColors = {
    draft: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
  };

  const tagColors = [
    'bg-tst-teal',
    'bg-tst-purple',
    'bg-tst-yellow',
    'bg-tst-green',
    'bg-tst-red',
  ];

  const fetchPosts = useCallback(async () => {
    setLoading(true);

    // Fetch active blog posts
    const { data: activeData, error: activeError } = await supabase
      .from('posts')
      .select('*')
      .eq('type', 'blog')
      .eq('archived', false)
      .order('created_at', { ascending: false });

    // Fetch archived blog posts
    const { data: archivedData, error: archivedError } = await supabase
      .from('posts')
      .select('*')
      .eq('type', 'blog')
      .eq('archived', true)
      .order('created_at', { ascending: false });

    if (activeError) {
      console.error('Error fetching active blog posts:', activeError);
      toast.error('Failed to fetch active blog posts');
    } else {
      setPosts(activeData as Post[]);
    }

    if (archivedError) {
      console.error('Error fetching archived blog posts:', archivedError);
      toast.error('Failed to fetch archived blog posts');
    } else {
      setArchivedPosts(archivedData as Post[]);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleRowClick = (post: Post) => {
    setSelectedPost(post);
  };

  const handleUpdatePost = async (
    postId: string,
    updatedData: Partial<Post>,
    successMessage = 'Blog post updated successfully!'
  ) => {
    // Implement optimistic UI update
    const originalPosts = [...posts];
    const originalArchivedPosts = [...archivedPosts];

    // Update in the appropriate list
    const newPosts = posts.map(post =>
      post.id === postId ? { ...post, ...updatedData } : post
    );
    const newArchivedPosts = archivedPosts.map(post =>
      post.id === postId ? { ...post, ...updatedData } : post
    );

    setPosts(newPosts);
    setArchivedPosts(newArchivedPosts);

    const { error } = await supabase
      .from('posts')
      .update(updatedData)
      .eq('id', postId);

    if (error) {
      toast.error(`Failed to update blog post: ${error.message}`);
      // Revert on failure
      setPosts(originalPosts);
      setArchivedPosts(originalArchivedPosts);
      return false;
    } else {
      toast.success(successMessage);
      return true;
    }
  };

  const handleArchivePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ archived: true })
        .eq('id', postId);

      if (error) {
        throw error;
      }

      // Move post from active to archived
      const postToArchive = posts.find(p => p.id === postId);
      if (postToArchive) {
        setPosts(prev => prev.filter(p => p.id !== postId));
        setArchivedPosts(prev => [
          { ...postToArchive, archived: true },
          ...prev,
        ]);
      }

      toast.success('Blog post archived successfully!');
      return true;
    } catch (error: any) {
      toast.error(`Failed to archive blog post: ${error.message}`);
      return false;
    }
  };

  const handleUnarchivePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ archived: false })
        .eq('id', postId);

      if (error) {
        throw error;
      }

      // Move post from archived to active
      const postToUnarchive = archivedPosts.find(p => p.id === postId);
      if (postToUnarchive) {
        setArchivedPosts(prev => prev.filter(p => p.id !== postId));
        setPosts(prev => [{ ...postToUnarchive, archived: false }, ...prev]);
      }

      toast.success('Blog post unarchived successfully!');
      return true;
    } catch (error: any) {
      toast.error(`Failed to unarchive blog post: ${error.message}`);
      return false;
    }
  };

  const handleEditPost = (postId: string) => {
    router.push(`/dashboard/mental-health-healing-blog/${postId}`);
  };

  // Get the current posts to display based on active tab
  const currentPosts = activeTab === 'active' ? posts : archivedPosts;

  // Show skeleton while loading
  if (loading) {
    return <NewsletterViewSkeleton rowCount={5} />;
  }

  return (
    <>
      <div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
            <h2 className="text-2xl lg:text-3xl font-bold">
              Toasted Insights Blog Posts
            </h2>

            {/* Tab Navigation */}
            <div className="flex border-2 border-black rounded-lg overflow-hidden w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-3 sm:px-4 py-2 font-bold transition-colors flex-1 sm:flex-none text-sm sm:text-base ${
                  activeTab === 'active'
                    ? 'bg-tst-purple text-black'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                Active ({posts.length})
              </button>
              <button
                onClick={() => setActiveTab('archived')}
                className={`px-3 sm:px-4 py-2 font-bold transition-colors border-l-2 border-black flex-1 sm:flex-none text-sm sm:text-base ${
                  activeTab === 'archived'
                    ? 'bg-tst-purple text-black'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                Archived ({archivedPosts.length})
              </button>
            </div>
          </div>

          {/* Only show Create Blog Post button on active tab */}
          {activeTab === 'active' && (
            <Button
              className="bg-tst-purple flex items-center w-full lg:w-auto justify-center"
              onClick={() =>
                router.push('/dashboard/blog/create')
              }
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Create Blog Post
            </Button>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white border-2 border-black rounded-lg shadow-brutalistLg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b-2 border-black bg-gray-50">
                <tr>
                  <th className="p-4 font-bold">Title</th>
                  <th className="p-4 font-bold">Tags</th>
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      {activeTab === 'active'
                        ? 'No active blog posts found'
                        : 'No archived blog posts found'}
                    </td>
                  </tr>
                ) : (
                  currentPosts.map(post => (
                    <tr
                      key={post.id}
                      className="border-b border-gray-200 hover:bg-tst-yellow cursor-pointer group"
                      onClick={() => handleRowClick(post)}
                    >
                      <td className="p-4 font-medium">
                        {post.title}
                        {activeTab === 'archived' && (
                          <span className="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                            Archived
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {(post.tags || []).map((tag, index) => (
                            <span
                              key={tag}
                              className={`px-2 py-1 text-xs font-bold rounded-full text-black ${tagColors[index % tagColors.length]}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        {format(new Date(post.created_at), 'PPP')}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 text-xs font-bold rounded-full capitalize ${statusColors[post.status] || 'bg-gray-100'}`}
                        >
                          {post.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {currentPosts.length === 0 ? (
            <div className="bg-white border-2 border-black rounded-lg p-8 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="mb-4">
                {activeTab === 'active'
                  ? 'No active blog posts found'
                  : 'No archived blog posts found'}
              </p>
              {activeTab === 'active' && (
                <Button
                  className="bg-tst-purple w-full sm:w-auto text-black"
                  onClick={() =>
                    router.push('/dashboard/mental-health-healing-blog/create')
                  }
                >
                  Create Your First Blog Post
                </Button>
              )}
            </div>
          ) : (
            currentPosts.map(post => (
              <div
                key={post.id}
                className="bg-white border-2 border-black rounded-lg shadow-brutalistLg p-4 cursor-pointer hover:bg-tst-yellow transition-colors"
                onClick={() => handleRowClick(post)}
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 pr-3">
                    <h3 className="font-bold text-lg leading-tight mb-2">
                      {post.title}
                    </h3>
                    {activeTab === 'archived' && (
                      <span className="inline-block px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                        Archived
                      </span>
                    )}
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 text-sm font-bold rounded-full capitalize flex-shrink-0 ${statusColors[post.status] || 'bg-gray-100'}`}
                  >
                    {post.status}
                  </span>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag size={16} className="text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Tags
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={tag}
                          className={`px-2 py-1 text-xs font-bold rounded-full text-black ${tagColors[index % tagColors.length]}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>{format(new Date(post.created_at), 'PPP')}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Blog Detail Modal */}
        {selectedPost && (
          <BlogDetailModal
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            onUpdate={handleUpdatePost}
            onArchive={selectedPost.archived ? undefined : handleArchivePost}
            onUnarchive={
              selectedPost.archived ? handleUnarchivePost : undefined
            }
            onEdit={handleEditPost}
          />
        )}
      </div>
    </>
  );
};

export default BlogView;
