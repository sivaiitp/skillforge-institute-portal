
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
        
        console.log('=== MARKDOWN RENDERER DEBUG ===');
        console.log('Original file path:', filePath);
        
        // Try different path variations
        const pathVariations = [
          filePath,
          filePath.startsWith('/') ? filePath : `/${filePath}`,
          filePath.startsWith('/public/') ? filePath : `/public/${filePath}`,
          filePath.replace('/public/', '/'),
          filePath.includes('public/') ? filePath.split('public/')[1] : filePath
        ];
        
        console.log('Trying path variations:', pathVariations);
        
        let lastError = null;
        let successfulPath = null;
        
        for (const path of pathVariations) {
          try {
            console.log(`Attempting to fetch: ${path}`);
            const response = await fetch(path);
            console.log(`Response for ${path}:`, {
              status: response.status,
              statusText: response.statusText,
              ok: response.ok,
              headers: Object.fromEntries(response.headers.entries())
            });
            
            if (response.ok) {
              const text = await response.text();
              console.log(`Success! Got content from ${path}, length:`, text.length);
              console.log('Content preview:', text.substring(0, 200));
              
              // Check if it's actually markdown content and not an error page
              if (text.includes('<!DOCTYPE html>') && text.includes('<title>')) {
                console.log('Got HTML error page instead of markdown');
                lastError = new Error(`Got HTML error page from ${path}`);
                continue;
              }
              
              if (text.trim().length < 5) {
                console.log('Content too short, might be empty');
                lastError = new Error(`Content too short from ${path}`);
                continue;
              }
              
              setContent(text);
              successfulPath = path;
              break;
            } else {
              lastError = new Error(`HTTP ${response.status}: ${response.statusText} for ${path}`);
              console.log('Failed:', lastError.message);
            }
          } catch (fetchError) {
            lastError = fetchError;
            console.log(`Fetch error for ${path}:`, fetchError);
          }
        }
        
        if (!successfulPath) {
          throw lastError || new Error('All path variations failed');
        }
        
        console.log('Successfully loaded from:', successfulPath);
        
      } catch (err) {
        console.error('=== MARKDOWN LOADING FAILED ===');
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    if (filePath) {
      loadMarkdown();
    } else {
      console.log('No file path provided');
      setError('No file path provided');
      setLoading(false);
    }
  }, [filePath]);

  const parseMarkdown = (markdown: string): string => {
    if (!markdown || markdown.trim().length === 0) {
      return '<p class="text-gray-500">No content available</p>';
    }

    console.log('Parsing markdown, length:', markdown.length);
    
    const parsed = markdown
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

    console.log('Markdown parsed successfully');
    return parsed;
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
              <p className="text-xs text-gray-500 mt-2">
                Check the browser console for detailed debugging information.
              </p>
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
