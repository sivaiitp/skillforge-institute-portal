
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Award, Check, ChevronsUpDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Student {
  id: string;
  full_name: string;
  email: string;
}

interface Course {
  id: string;
  title: string;
}

interface IssueCertificateFormProps {
  students: Student[];
  courses: Course[];
  onCertificateIssued: () => void;
}

const IssueCertificateForm = ({ students, courses, onCertificateIssued }: IssueCertificateFormProps) => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [open, setOpen] = useState(false);

  const generateCertificateNumber = () => {
    const year = new Date().getFullYear();
    const timestamp = Date.now();
    return `CERT-${year}-${timestamp.toString().slice(-6)}`;
  };

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !selectedCourse) {
      toast.error('Please select both student and course');
      return;
    }

    const certificateNumber = generateCertificateNumber();
    
    const { error } = await supabase
      .from('certificates')
      .insert({
        user_id: selectedStudent,
        course_id: selectedCourse,
        certificate_number: certificateNumber,
        certificate_id: certificateNumber,
        issued_date: new Date().toISOString(),
        is_valid: true
      });

    if (error) {
      console.error('Error issuing certificate:', error);
      toast.error('Error issuing certificate');
      return;
    }

    toast.success(`Certificate issued successfully! Number: ${certificateNumber}`);
    setSelectedStudent('');
    setSelectedCourse('');
    onCertificateIssued();
  };

  const selectedStudentData = students.find(student => student.id === selectedStudent);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          Issue Certificate
        </CardTitle>
        <CardDescription>
          Issue a new certificate to a student
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleIssueCertificate} className="space-y-4">
          <div>
            <Label htmlFor="student">Student</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {selectedStudentData ? 
                    `${selectedStudentData.full_name} (${selectedStudentData.email})` : 
                    "Search student by email..."
                  }
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search student by email..." />
                  <CommandList>
                    <CommandEmpty>No student found.</CommandEmpty>
                    <CommandGroup>
                      {students.map((student) => (
                        <CommandItem
                          key={student.id}
                          value={`${student.email} ${student.full_name}`}
                          onSelect={() => {
                            setSelectedStudent(student.id);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedStudent === student.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">{student.full_name}</span>
                            <span className="text-sm text-gray-500">{student.email}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="course">Course</Label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Issue Certificate
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default IssueCertificateForm;
