
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface MarkdownRendererProps {
  filePath: string;
  className?: string;
}

const MarkdownRenderer = ({ filePath, className = '' }: MarkdownRendererProps) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load markdown file from public directory
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Failed to load file: ${response.statusText}`);
        }
        
        const text = await response.text();
        setContent(text);
      } catch (err) {
        console.error('Error loading markdown:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    if (filePath) {
      loadMarkdown();
    }
  }, [filePath]);

  // Simple markdown to HTML converter (basic implementation)
  const parseMarkdown = (markdown: string): string => {
    return markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-2 text-gray-800">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mb-3 text-gray-800">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 text-gray-800">$1</h1>')
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code class="text-sm">$1</code></pre>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>')
      // Lists
      .replace(/^\* (.*$)/gim, '<li class="mb-1">$1</li>')
      .replace(/(<li.*<\/li>)/s, '<ul class="list-disc list-inside mb-4">$1</ul>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(.*)$/gm, '<p class="mb-4">$1</p>')
      // Clean up empty paragraphs
      .replace(/<p class="mb-4"><\/p>/g, '');
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span>Error loading content: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
        />
      </CardContent>
    </Card>
  );
};

export default MarkdownRenderer;
