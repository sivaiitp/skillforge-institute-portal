
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, FileText } from 'lucide-react';

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
        
        console.log('Loading markdown from:', filePath);
        
        // Load markdown file from public directory
        const response = await fetch(filePath);
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers.get('content-type'));
        
        if (!response.ok) {
          throw new Error(`Failed to load file: ${response.status} ${response.statusText}`);
        }
        
        const text = await response.text();
        console.log('Loaded content length:', text.length);
        console.log('Content preview:', text.substring(0, 200));
        
        // Check if we got HTML instead of markdown (which means file doesn't exist)
        if (text.includes('<!DOCTYPE html>') && text.includes('<title>')) {
          throw new Error('File not found - got HTML page instead of markdown content');
        }
        
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
      // Code blocks (must come before inline code)
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4 border"><code class="text-sm">$1</code></pre>')
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-3 mt-6 text-gray-800">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mb-4 mt-8 text-gray-800">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-6 mt-4 text-gray-800">$1</h1>')
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Inline code
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
      // Lists (unordered)
      .replace(/^\* (.*$)/gim, '<li class="mb-1 ml-4">• $1</li>')
      // Lists (ordered) 
      .replace(/^\d+\. (.*$)/gim, '<li class="mb-1 ml-4 list-decimal">$1</li>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>')
      // Line breaks and paragraphs
      .split('\n\n')
      .map(paragraph => {
        if (paragraph.trim() === '') return '';
        if (paragraph.includes('<h') || paragraph.includes('<pre') || paragraph.includes('<li')) {
          return paragraph;
        }
        return `<p class="mb-4 leading-relaxed">${paragraph.replace(/\n/g, '<br>')}</p>`;
      })
      .join('\n')
      // Clean up empty paragraphs
      .replace(/<p class="mb-4 leading-relaxed"><\/p>/g, '');
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-gray-400" />
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-start gap-3 text-red-600">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">Unable to load content</h3>
              <p className="text-sm text-red-500 mb-3">{error}</p>
              <p className="text-xs text-gray-600">
                File path: <code className="bg-gray-100 px-1 rounded">{filePath}</code>
              </p>
            </div>
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
