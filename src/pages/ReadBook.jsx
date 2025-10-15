// src/pages/ReadBook.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  AlertCircle,
  Loader,
  ShieldCheck,
  Fullscreen,
  Minimize,
} from "lucide-react";
import { getBookMetadata, getBookContentUrl } from "../lib/api/read";

const ReadBook = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const readerRef = useRef(null);

  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contentLoading, setContentLoading] = useState(true);
  const [contentUrl, setContentUrl] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!bookId) {
      setError('Book ID is required');
      setLoading(false);
      return;
    }
    loadBook();

    const handleSecurityEvents = (e) => e.preventDefault();
    const events = ['contextmenu', 'selectstart', 'dragstart'];
    events.forEach(event => document.addEventListener(event, handleSecurityEvents));
    
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => {
      events.forEach(event => document.removeEventListener(event, handleSecurityEvents));
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, [bookId]);

  const loadBook = async () => {
    try {
      setLoading(true);
      setError(null);
      const metaResponse = await getBookMetadata(bookId);
      if (metaResponse.success && metaResponse.data) {
        setMetadata(metaResponse.data);
        const url = await getBookContentUrl(bookId);
        setContentUrl(url);
      } else {
        throw new Error(metaResponse.message || 'Failed to load book metadata');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading the book.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      readerRef.current?.requestFullscreen().catch(err => {
        alert(`Could not enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50">
        <div className="text-center">
          <Loader className="mx-auto mb-4 h-10 w-10 animate-spin text-blue-600" />
          <p className="text-base text-zinc-600">Preparing your reading experience...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 p-4">
        <div className="w-full max-w-md text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h2 className="mb-2 text-xl font-semibold text-zinc-900">Unable to Load Book</h2>
          <p className="mb-6 text-zinc-600">{error}</p>
          <button
            onClick={() => navigate('/my-library')}
            className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-blue-700"
          >
            <ArrowLeft size={18} className="mr-2" />
            Return to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={readerRef} className="flex h-screen flex-col bg-white">
      {/* Professional Header */}
      <header className="sticky top-0 z-20 flex-shrink-0 border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <button
              onClick={() => navigate('/profile/my-library')}
              className="hidden rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 sm:block"
              title="Back to Library"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="h-8 w-px bg-zinc-200 hidden sm:block"></div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-900" title={metadata?.title}>
                {metadata?.title}
              </p>
              <p className="truncate text-sm text-zinc-500" title={metadata?.author}>
                by {metadata?.author}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-4 md:flex">
              <span className="flex items-center text-xs text-zinc-500">
                <Clock size={14} className="mr-1.5" />
                {formatDate(metadata?.lastAccessedAt)}
              </span>
              <span className="flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                <ShieldCheck size={14} className="mr-1.5" />
                Secure Reading
              </span>
            </div>
            <button
              onClick={handleToggleFullscreen}
              className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize size={20} /> : <Fullscreen size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          {contentLoading && (
            <div className="absolute inset-x-0 top-12 z-10 flex justify-center">
              <div className="flex items-center gap-2 rounded-lg bg-white p-3 shadow-md">
                <Loader className="h-5 w-5 animate-spin text-blue-600" />
                <span className="text-sm text-zinc-600">Loading content...</span>
              </div>
            </div>
          )}
          <iframe
            src={contentUrl}
            title={metadata?.title}
            className={`h-full min-h-screen w-full transition-opacity duration-500 ${contentLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setContentLoading(false)}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </main>
    </div>
  );
};

export default ReadBook;