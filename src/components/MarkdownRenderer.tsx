
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
        
        // Try multiple URL patterns to ensure we can load the file
        const urlsToTry = [
          filePath,
          filePath.startsWith('/') ? filePath : `/${filePath}`,
          filePath.startsWith('/public/') ? filePath.substring(7) : filePath,
          filePath.includes('public/') ? filePath.split('public/')[1] : filePath
        ];

        let lastError = null;
        
        for (const url of urlsToTry) {
          try {
            console.log('Trying URL:', url);
            const response = await fetch(url);
            
            if (response.ok) {
              const text = await response.text();
              console.log('Successfully loaded content, length:', text.length);
              
              // Basic validation
              if (text && text.trim().length > 0) {
                setContent(text);
                return;
              }
            }
            lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
          } catch (fetchError) {
            lastError = fetchError;
            console.log('Fetch failed for URL:', url, fetchError);
          }
        }
        
        throw lastError || new Error('All URL attempts failed');
        
      } catch (err) {
        console.error('Error loading markdown:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    if (filePath) {
      loadMarkdown();
    } else {
      setError('No file path provided');
      setLoading(false);
    }
  }, [filePath]);

  const parseMarkdown = (markdown: string): string => {
    if (!markdown || markdown.trim().length === 0) {
      return '<p class="text-gray-500">No content available</p>';
    }

    return markdown
      // Code blocks (must come before inline code)
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto my-4 border font-mono text-sm"><code>$1</code></pre>')
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800 border-l-4 border-blue-500 pl-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-4 mt-8 text-gray-800 border-b-2 border-gray-200 pb-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 mt-4 text-gray-900 border-b-4 border-blue-600 pb-3">$1</h1>')
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
      // Inline code
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-red-600 border">$1</code>')
      // Lists (unordered)
      .replace(/^\* (.*$)/gim, '<li class="mb-2 ml-6 text-gray-700 relative before:content-[\"•\"] before:absolute before:-left-4 before:text-blue-600 before:font-bold">$1</li>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline font-medium transition-colors" target="_blank" rel="noopener noreferrer">$1</a>')
      // Line breaks and paragraphs
      .split('\n\n')
      .map(paragraph => {
        if (paragraph.trim() === '') return '';
        if (paragraph.includes('<h') || paragraph.includes('<pre') || paragraph.includes('<li')) {
          return paragraph;
        }
        return `<p class="mb-4 leading-relaxed text-gray-700">${paragraph.replace(/\n/g, '<br>')}</p>`;
      })
      .join('\n')
      // Clean up empty paragraphs
      .replace(/<p class="mb-4 leading-relaxed text-gray-700"><\/p>/g, '');
  };

  if (loading) {
    return (
      <Card className={`${className} border-0 shadow-lg`}>
        <CardContent className="p-8">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-gray-400" />
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="space-y-4">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-5 bg-gray-200 rounded w-1/2"></div>
              <div className="h-5 bg-gray-200 rounded w-5/6"></div>
              <div className="h-5 bg-gray-200 rounded w-2/3"></div>
              <div className="h-16 bg-gray-200 rounded w-full"></div>
              <div className="h-5 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`${className} border-0 shadow-lg`}>
        <CardContent className="p-8">
          <div className="flex items-start gap-4 text-red-600">
            <AlertCircle className="w-6 h-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-3 text-lg">Unable to load content</h3>
              <p className="text-sm text-red-500 mb-4">{error}</p>
              <p className="text-xs text-gray-600">
                File path: <code className="bg-gray-100 px-2 py-1 rounded">{filePath}</code>
              </p>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Troubleshooting tips:</strong>
                </p>
                <ul className="text-xs text-yellow-700 mt-1 list-disc list-inside">
                  <li>Ensure the file exists in the public folder</li>
                  <li>Check if the file path is correct</li>
                  <li>Verify the file has content</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!content || content.trim().length === 0) {
    return (
      <Card className={`${className} border-0 shadow-lg`}>
        <CardContent className="p-8">
          <div className="text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No content available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const parsedHTML = parseMarkdown(content);

  return (
    <Card className={`${className} border-0 shadow-lg`}>
      <CardContent className="p-8">
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: parsedHTML }}
        />
      </CardContent>
    </Card>
  );
};

export default MarkdownRenderer;
