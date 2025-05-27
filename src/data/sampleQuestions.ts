
import { Question } from "@/types/assessmentTypes";

export const sampleQuestions: Question[] = [
  {
    id: 1,
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
    correctAnswer: 0,
    category: "Web Development"
  },
  {
    id: 2,
    question: "Which of the following is a JavaScript framework?",
    options: ["Python", "React", "HTML", "CSS"],
    correctAnswer: 1,
    category: "Web Development"
  },
  {
    id: 3,
    question: "What is the primary purpose of CSS?",
    options: ["To add interactivity", "To style web pages", "To create databases", "To handle server requests"],
    correctAnswer: 1,
    category: "Web Development"
  },
  {
    id: 4,
    question: "Which language is primarily used for data science?",
    options: ["JavaScript", "Python", "HTML", "CSS"],
    correctAnswer: 1,
    category: "Data Science"
  },
  {
    id: 5,
    question: "What does SQL stand for?",
    options: ["Structured Query Language", "Simple Query Language", "System Query Language", "Standard Query Language"],
    correctAnswer: 0,
    category: "Database"
  },
  {
    id: 6,
    question: "Which of these is a cloud service provider?",
    options: ["React", "AWS", "HTML", "CSS"],
    correctAnswer: 1,
    category: "Cloud Computing"
  },
  {
    id: 7,
    question: "What is the main purpose of version control systems like Git?",
    options: ["To style websites", "To track code changes", "To host websites", "To write documentation"],
    correctAnswer: 1,
    category: "Development Tools"
  },
  {
    id: 8,
    question: "Which of these is a database management system?",
    options: ["React", "MySQL", "CSS", "HTML"],
    correctAnswer: 1,
    category: "Database"
  },
  {
    id: 9,
    question: "What does API stand for?",
    options: ["Application Programming Interface", "Advanced Programming Interface", "Automated Programming Interface", "Application Process Interface"],
    correctAnswer: 0,
    category: "Programming Concepts"
  },
  {
    id: 10,
    question: "Which methodology emphasizes iterative development?",
    options: ["Waterfall", "Agile", "Sequential", "Linear"],
    correctAnswer: 1,
    category: "Project Management"
  },
  {
    id: 11,
    question: "What is the time complexity of accessing an element in an array by index?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: 0,
    category: "Data Structures & Algorithms"
  },
  {
    id: 12,
    question: "Which data structure follows the Last In, First Out (LIFO) principle?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: 1,
    category: "Data Structures & Algorithms"
  },
  {
    id: 13,
    question: "What is the worst-case time complexity of binary search?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correctAnswer: 2,
    category: "Data Structures & Algorithms"
  },
  {
    id: 14,
    question: "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble Sort", "Quick Sort", "Merge Sort", "Both Quick Sort and Merge Sort"],
    correctAnswer: 3,
    category: "Data Structures & Algorithms"
  },
  {
    id: 15,
    question: "Which data structure is most suitable for implementing a priority queue?",
    options: ["Array", "Linked List", "Heap", "Stack"],
    correctAnswer: 2,
    category: "Data Structures & Algorithms"
  }
];
