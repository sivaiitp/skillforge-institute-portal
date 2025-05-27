
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Download, FileText, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface QuestionImporterProps {
  assessmentId: string;
  onImportComplete: () => void;
}

const QuestionImporter = ({ assessmentId, onImportComplete }: QuestionImporterProps) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [importStats, setImportStats] = useState<{
    total: number;
    successful: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const downloadSampleCsv = () => {
    const sampleData = [
      'question_text,question_type,option1,option2,option3,option4,correct_answer,explanation,points,difficulty_level',
      '"What is 2+2?",multiple_choice,"2","3","4","5","4","Basic addition problem",1,easy',
      '"JavaScript is a programming language",true_false,"","","","","true","JavaScript is indeed a programming language",1,medium',
      '"What is the capital of France?",short_answer,"","","","","Paris","The capital city of France",2,medium',
      '"Which of the following are programming languages?",multiple_choice,"Python","HTML","CSS","All of the above","Python","Python is a programming language while HTML and CSS are markup languages",3,hard'
    ];
    
    const blob = new Blob([sampleData.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_questions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Sample CSV downloaded!');
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = parseCSVLine(lines[0]);
    const questions = [];
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i]);
        if (values.length < 10) {
          errors.push(`Line ${i + 1}: Insufficient columns (expected 10, got ${values.length})`);
          continue;
        }

        const question = {
          question_text: values[0]?.trim(),
          question_type: values[1]?.trim() || 'multiple_choice',
          option1: values[2]?.trim(),
          option2: values[3]?.trim(),
          option3: values[4]?.trim(),
          option4: values[5]?.trim(),
          correct_answer: values[6]?.trim(),
          explanation: values[7]?.trim(),
          points: parseInt(values[8]) || 1,
          difficulty_level: values[9]?.trim() || 'medium'
        };

        if (!question.question_text) {
          errors.push(`Line ${i + 1}: Question text is required`);
          continue;
        }

        if (!question.correct_answer) {
          errors.push(`Line ${i + 1}: Correct answer is required`);
          continue;
        }

        if (!['easy', 'medium', 'hard'].includes(question.difficulty_level)) {
          errors.push(`Line ${i + 1}: Invalid difficulty level. Must be 'easy', 'medium', or 'hard'`);
          continue;
        }

        questions.push(question);
      } catch (error) {
        errors.push(`Line ${i + 1}: Error parsing line - ${error}`);
      }
    }

    return { questions, errors };
  };

  const parseCSVLine = (line: string): string[] => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"' && (i === 0 || line[i - 1] === ',')) {
        inQuotes = true;
      } else if (char === '"' && inQuotes && (i === line.length - 1 || line[i + 1] === ',')) {
        inQuotes = false;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  };

  const handleImport = async () => {
    if (!csvFile) {
      toast.error('Please select a CSV file');
      return;
    }

    try {
      setLoading(true);
      const text = await csvFile.text();
      const { questions, errors } = parseCSV(text);

      if (questions.length === 0) {
        toast.error('No valid questions found in CSV file');
        setImportStats({
          total: 0,
          successful: 0,
          failed: errors.length,
          errors
        });
        return;
      }

      // Transform questions for database
      const questionsToInsert = questions.map((q, index) => ({
        assessment_id: assessmentId,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.question_type === 'multiple_choice' 
          ? [q.option1, q.option2, q.option3, q.option4].filter(opt => opt)
          : null,
        correct_answer: q.correct_answer,
        explanation: q.explanation || null,
        points: q.points,
        difficulty_level: q.difficulty_level,
        sort_order: index
      }));

      const { data, error } = await supabase
        .from('assessment_questions')
        .insert(questionsToInsert)
        .select();

      if (error) throw error;

      const stats = {
        total: questions.length,
        successful: data?.length || 0,
        failed: questions.length - (data?.length || 0),
        errors
      };

      setImportStats(stats);
      
      if (stats.successful > 0) {
        toast.success(`Successfully imported ${stats.successful} questions!`);
        onImportComplete();
      }

      setCsvFile(null);
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Error importing questions');
      setImportStats({
        total: 0,
        successful: 0,
        failed: 1,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Import Questions from CSV
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Upload a CSV file with questions. The file should have columns: question_text, question_type, option1-4, correct_answer, explanation, points, difficulty_level.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <Label htmlFor="csv-file">Select CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
              className="mt-1"
            />
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleImport} 
              disabled={!csvFile || loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              {loading ? 'Importing...' : 'Import Questions'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={downloadSampleCsv}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Sample CSV
            </Button>
          </div>
        </div>

        {importStats && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Import Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{importStats.total}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{importStats.successful}</div>
                  <div className="text-sm text-gray-600">Successful</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{importStats.failed}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
              </div>
              
              {importStats.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-red-600 mb-2">Errors:</h4>
                  <div className="bg-red-50 border border-red-200 rounded p-3 max-h-40 overflow-y-auto">
                    {importStats.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-700 mb-1">{error}</div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionImporter;
