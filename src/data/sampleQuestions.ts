
import { Question } from "@/types/assessmentTypes";

export const questionBank: Question[] = [
  // Web Development Questions (25 questions)
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
    question: "Which HTML tag is used to link external CSS?",
    options: ["<style>", "<css>", "<link>", "<stylesheet>"],
    correctAnswer: 2,
    category: "Web Development"
  },
  {
    id: 5,
    question: "What does DOM stand for in web development?",
    options: ["Document Object Model", "Data Object Management", "Dynamic Object Model", "Document Oriented Model"],
    correctAnswer: 0,
    category: "Web Development"
  },
  {
    id: 6,
    question: "Which method is used to add an event listener in JavaScript?",
    options: ["addEventListener()", "addEvent()", "listen()", "on()"],
    correctAnswer: 0,
    category: "Web Development"
  },
  {
    id: 7,
    question: "What is the difference between '==' and '===' in JavaScript?",
    options: ["No difference", "=== checks type and value, == only checks value", "== is faster", "=== is deprecated"],
    correctAnswer: 1,
    category: "Web Development"
  },
  {
    id: 8,
    question: "Which CSS property is used to change text color?",
    options: ["font-color", "text-color", "color", "foreground"],
    correctAnswer: 2,
    category: "Web Development"
  },
  {
    id: 9,
    question: "What is a closure in JavaScript?",
    options: ["A way to close browser windows", "A function with access to outer scope", "A type of loop", "A CSS property"],
    correctAnswer: 1,
    category: "Web Development"
  },
  {
    id: 10,
    question: "Which HTTP method is used to update existing data?",
    options: ["GET", "POST", "PUT", "DELETE"],
    correctAnswer: 2,
    category: "Web Development"
  },
  {
    id: 11,
    question: "What is the purpose of the 'alt' attribute in HTML img tag?",
    options: ["Alternative styling", "Alternative text for accessibility", "Alternative source", "Alternative format"],
    correctAnswer: 1,
    category: "Web Development"
  },
  {
    id: 12,
    question: "Which of these is NOT a semantic HTML element?",
    options: ["<header>", "<section>", "<div>", "<article>"],
    correctAnswer: 2,
    category: "Web Development"
  },
  {
    id: 13,
    question: "What is the default display property of a div element?",
    options: ["inline", "block", "inline-block", "flex"],
    correctAnswer: 1,
    category: "Web Development"
  },
  {
    id: 14,
    question: "Which CSS unit is relative to the font size of the element?",
    options: ["px", "em", "pt", "cm"],
    correctAnswer: 1,
    category: "Web Development"
  },
  {
    id: 15,
    question: "What does AJAX stand for?",
    options: ["Asynchronous JavaScript and XML", "Advanced JavaScript and XML", "Automatic JavaScript and XML", "Active JavaScript and XML"],
    correctAnswer: 0,
    category: "Web Development"
  },
  {
    id: 16,
    question: "Which JavaScript method converts a string to lowercase?",
    options: ["toLowerCase()", "lower()", "downCase()", "toSmall()"],
    correctAnswer: 0,
    category: "Web Development"
  },
  {
    id: 17,
    question: "What is the correct way to declare a variable in modern JavaScript?",
    options: ["var name", "let name", "const name", "Both let and const"],
    correctAnswer: 3,
    category: "Web Development"
  },
  {
    id: 18,
    question: "Which CSS property is used to create space between elements?",
    options: ["padding", "margin", "spacing", "gap"],
    correctAnswer: 1,
    category: "Web Development"
  },
  {
    id: 19,
    question: "What is the purpose of the viewport meta tag?",
    options: ["SEO optimization", "Responsive design control", "Security", "Performance"],
    correctAnswer: 1,
    category: "Web Development"
  },
  {
    id: 20,
    question: "Which JavaScript operator is used for strict equality?",
    options: ["=", "==", "===", "!="],
    correctAnswer: 2,
    category: "Web Development"
  },
  {
    id: 21,
    question: "What is the box model in CSS?",
    options: ["A layout technique", "Content + Padding + Border + Margin", "A design pattern", "A JavaScript concept"],
    correctAnswer: 1,
    category: "Web Development"
  },
  {
    id: 22,
    question: "Which HTML5 element is used for navigation links?",
    options: ["<navigation>", "<nav>", "<menu>", "<links>"],
    correctAnswer: 1,
    category: "Web Development"
  },
  {
    id: 23,
    question: "What is event bubbling in JavaScript?",
    options: ["Creating bubbles", "Events propagating up the DOM tree", "Event animation", "Memory management"],
    correctAnswer: 1,
    category: "Web Development"
  },
  {
    id: 24,
    question: "Which CSS property is used to make elements flexible?",
    options: ["flexible", "flex", "bend", "stretch"],
    correctAnswer: 1,
    category: "Web Development"
  },
  {
    id: 25,
    question: "What is the purpose of the 'use strict' directive in JavaScript?",
    options: ["Better performance", "Strict type checking", "Enables strict mode", "Memory optimization"],
    correctAnswer: 2,
    category: "Web Development"
  },

  // Data Science Questions (25 questions)
  {
    id: 26,
    question: "Which language is primarily used for data science?",
    options: ["JavaScript", "Python", "HTML", "CSS"],
    correctAnswer: 1,
    category: "Data Science"
  },
  {
    id: 27,
    question: "What is pandas in Python?",
    options: ["An animal", "A data manipulation library", "A web framework", "A database"],
    correctAnswer: 1,
    category: "Data Science"
  },
  {
    id: 28,
    question: "Which of these is a machine learning algorithm?",
    options: ["HTML", "Linear Regression", "CSS", "DOM"],
    correctAnswer: 1,
    category: "Data Science"
  },
  {
    id: 29,
    question: "What does CSV stand for?",
    options: ["Computer System Values", "Comma Separated Values", "Central System Variables", "Code Structured Values"],
    correctAnswer: 1,
    category: "Data Science"
  },
  {
    id: 30,
    question: "Which Python library is commonly used for numerical computing?",
    options: ["requests", "numpy", "flask", "django"],
    correctAnswer: 1,
    category: "Data Science"
  },
  {
    id: 31,
    question: "What is the purpose of data visualization?",
    options: ["To hide data", "To represent data graphically", "To delete data", "To encrypt data"],
    correctAnswer: 1,
    category: "Data Science"
  },
  {
    id: 32,
    question: "Which of these is a supervised learning technique?",
    options: ["K-means clustering", "Decision Trees", "DBSCAN", "PCA"],
    correctAnswer: 1,
    category: "Data Science"
  },
  {
    id: 33,
    question: "What is overfitting in machine learning?",
    options: ["Model performs well on training but poor on test data", "Model is too simple", "Model trains too fast", "Model uses too little data"],
    correctAnswer: 0,
    category: "Data Science"
  },
  {
    id: 34,
    question: "Which library is commonly used for plotting in Python?",
    options: ["matplotlib", "requests", "os", "sys"],
    correctAnswer: 0,
    category: "Data Science"
  },
  {
    id: 35,
    question: "What is the difference between classification and regression?",
    options: ["No difference", "Classification predicts categories, regression predicts continuous values", "Classification is faster", "Regression is more accurate"],
    correctAnswer: 1,
    category: "Data Science"
  },
  {
    id: 36,
    question: "What is a DataFrame in pandas?",
    options: ["A type of chart", "A 2D labeled data structure", "A machine learning model", "A database connection"],
    correctAnswer: 1,
    category: "Data Science"
  },
  {
    id: 37,
    question: "Which metric is used to evaluate classification models?",
    options: ["Mean Squared Error", "Accuracy", "R-squared", "Standard Deviation"],
    correctAnswer: 1,
    category: "Data Science"
  },
  {
    id: 38,
    question: "What is feature engineering?",
    options: ["Building software features", "Creating or transforming variables for ML", "Engineering hardware", "Web development"],
    correctAnswer: 1,
    category: "Data Science"
  },
  {
    id: 39,
    question: "Which of these is an unsupervised learning algorithm?",
    options: ["Linear Regression", "K-means Clustering", "Logistic Regression", "Decision Trees"],
    correctAnswer: 1,
    category: "Data Science"
  },
  {
    id: 40,
    question: "What is cross-validation?",
    options: ["Validating data twice", "A technique to assess model performance", "Data cleaning", "Feature selection"],
    correctAnswer: 1,
    category: "Data Science"
  },
  {
    id: 41,
    question: "Which Python library is used for machine learning?",
    options: ["beautifulsoup", "scikit-learn", "requests", "flask"],
    correctAnswer: 1,
    category: "Data Science"
  },
  {
    id: 42,
    question: "What is the purpose of normalization in data preprocessing?",
    options: ["To remove data", "To scale features to similar ranges", "To add more data", "To visualize data"],
    correctAnswer: 1,
    category: "Data Science"
  },
  {
    id: 43,
    question: "What is a correlation coefficient?",
    options: ["A type of chart", "A measure of linear relationship between variables", "A machine learning algorithm", "A data cleaning technique"],
    correctAnswer: 1,
    category: "Data Science"
  },
  {
    id: 44,
    question: "Which of these is a deep learning framework?",
    options: ["pandas", "TensorFlow", "requests", "matplotlib"],
    correctAnswer: 1,
    category: "Data Science"
  },
  {
    id: 45,
    question: "What is the purpose of train-test split?",
    options: ["To split data into training and testing sets", "To clean data", "To visualize data", "To normalize data"],
    correctAnswer: 0,
    category: "Data Science"
  },
  {
    id: 46,
    question: "What is a neural network?",
    options: ["A computer network", "A model inspired by biological neural networks", "A database structure", "A web framework"],
    correctAnswer: 1,
    category: "Data Science"
  },
  {
    id: 47,
    question: "Which technique is used to reduce dimensionality?",
    options: ["Linear Regression", "PCA (Principal Component Analysis)", "K-means", "Decision Trees"],
    correctAnswer: 1,
    category: "Data Science"
  },
  {
    id: 48,
    question: "What is bias in machine learning?",
    options: ["Personal preference", "Error due to oversimplified assumptions", "Random error", "Data corruption"],
    correctAnswer: 1,
    category: "Data Science"
  },
  {
    id: 49,
    question: "Which of these is a time series analysis technique?",
    options: ["K-means", "ARIMA", "Decision Trees", "SVM"],
    correctAnswer: 1,
    category: "Data Science"
  },
  {
    id: 50,
    question: "What is ensemble learning?",
    options: ["Learning in groups", "Combining multiple models for better performance", "Fast learning", "Online learning"],
    correctAnswer: 1,
    category: "Data Science"
  },

  // Cloud Computing Questions (25 questions)
  {
    id: 51,
    question: "Which of these is a cloud service provider?",
    options: ["React", "AWS", "HTML", "CSS"],
    correctAnswer: 1,
    category: "Cloud Computing"
  },
  {
    id: 52,
    question: "What does SaaS stand for?",
    options: ["Software as a Service", "System as a Service", "Security as a Service", "Storage as a Service"],
    correctAnswer: 0,
    category: "Cloud Computing"
  },
  {
    id: 53,
    question: "Which AWS service is used for object storage?",
    options: ["EC2", "S3", "RDS", "Lambda"],
    correctAnswer: 1,
    category: "Cloud Computing"
  },
  {
    id: 54,
    question: "What is the main benefit of cloud computing?",
    options: ["Higher costs", "Scalability and flexibility", "More complexity", "Less security"],
    correctAnswer: 1,
    category: "Cloud Computing"
  },
  {
    id: 55,
    question: "Which of these is a container orchestration platform?",
    options: ["Docker", "Kubernetes", "Git", "npm"],
    correctAnswer: 1,
    category: "Cloud Computing"
  },
  {
    id: 56,
    question: "What does IaaS stand for?",
    options: ["Internet as a Service", "Infrastructure as a Service", "Integration as a Service", "Information as a Service"],
    correctAnswer: 1,
    category: "Cloud Computing"
  },
  {
    id: 57,
    question: "Which AWS service provides serverless computing?",
    options: ["EC2", "S3", "Lambda", "RDS"],
    correctAnswer: 2,
    category: "Cloud Computing"
  },
  {
    id: 58,
    question: "What is a Virtual Private Cloud (VPC)?",
    options: ["A type of database", "An isolated network within cloud infrastructure", "A storage service", "A monitoring tool"],
    correctAnswer: 1,
    category: "Cloud Computing"
  },
  {
    id: 59,
    question: "Which Google Cloud service is equivalent to AWS S3?",
    options: ["Compute Engine", "Cloud Storage", "BigQuery", "App Engine"],
    correctAnswer: 1,
    category: "Cloud Computing"
  },
  {
    id: 60,
    question: "What is auto-scaling in cloud computing?",
    options: ["Manual resource adjustment", "Automatic resource adjustment based on demand", "Fixed resource allocation", "Resource reduction"],
    correctAnswer: 1,
    category: "Cloud Computing"
  },
  {
    id: 61,
    question: "Which of these is a Microsoft Azure service?",
    options: ["EC2", "S3", "Virtual Machines", "Lambda"],
    correctAnswer: 2,
    category: "Cloud Computing"
  },
  {
    id: 62,
    question: "What is a CDN in cloud computing?",
    options: ["Central Data Network", "Content Delivery Network", "Cloud Database Network", "Compute Distribution Network"],
    correctAnswer: 1,
    category: "Cloud Computing"
  },
  {
    id: 63,
    question: "Which deployment model allows sharing of resources among multiple organizations?",
    options: ["Private Cloud", "Public Cloud", "Hybrid Cloud", "Community Cloud"],
    correctAnswer: 3,
    category: "Cloud Computing"
  },
  {
    id: 64,
    question: "What is Docker primarily used for?",
    options: ["Data analysis", "Containerization", "Web development", "Database management"],
    correctAnswer: 1,
    category: "Cloud Computing"
  },
  {
    id: 65,
    question: "Which AWS service is used for DNS management?",
    options: ["Route 53", "CloudFront", "API Gateway", "ELB"],
    correctAnswer: 0,
    category: "Cloud Computing"
  },
  {
    id: 66,
    question: "What is the difference between horizontal and vertical scaling?",
    options: ["No difference", "Horizontal adds more machines, vertical increases machine power", "Horizontal is cheaper", "Vertical is faster"],
    correctAnswer: 1,
    category: "Cloud Computing"
  },
  {
    id: 67,
    question: "Which service model provides the highest level of control?",
    options: ["SaaS", "PaaS", "IaaS", "FaaS"],
    correctAnswer: 2,
    category: "Cloud Computing"
  },
  {
    id: 68,
    question: "What is serverless computing?",
    options: ["Computing without servers", "Computing where server management is abstracted", "Offline computing", "Local computing"],
    correctAnswer: 1,
    category: "Cloud Computing"
  },
  {
    id: 69,
    question: "Which AWS service provides managed relational databases?",
    options: ["DynamoDB", "RDS", "S3", "Lambda"],
    correctAnswer: 1,
    category: "Cloud Computing"
  },
  {
    id: 70,
    question: "What is load balancing?",
    options: ["Balancing server loads", "Distributing incoming requests across multiple servers", "Reducing server count", "Increasing server speed"],
    correctAnswer: 1,
    category: "Cloud Computing"
  },
  {
    id: 71,
    question: "Which of these is a cloud-native application characteristic?",
    options: ["Monolithic architecture", "Microservices architecture", "Single server deployment", "Local storage only"],
    correctAnswer: 1,
    category: "Cloud Computing"
  },
  {
    id: 72,
    question: "What is the purpose of API Gateway?",
    options: ["Database management", "Managing and routing API requests", "File storage", "User authentication"],
    correctAnswer: 1,
    category: "Cloud Computing"
  },
  {
    id: 73,
    question: "Which AWS service is used for monitoring and logging?",
    options: ["CloudWatch", "S3", "EC2", "Lambda"],
    correctAnswer: 0,
    category: "Cloud Computing"
  },
  {
    id: 74,
    question: "What is Infrastructure as Code (IaC)?",
    options: ["Writing code for infrastructure", "Managing infrastructure through code", "Coding on infrastructure", "Infrastructure documentation"],
    correctAnswer: 1,
    category: "Cloud Computing"
  },
  {
    id: 75,
    question: "Which of these is a benefit of using managed services?",
    options: ["More control", "Reduced operational overhead", "Lower costs always", "Faster development"],
    correctAnswer: 1,
    category: "Cloud Computing"
  },

  // Data Structures & Algorithms Questions (25 questions)
  {
    id: 76,
    question: "What is the time complexity of accessing an element in an array by index?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: 0,
    category: "Data Structures & Algorithms"
  },
  {
    id: 77,
    question: "Which data structure follows the Last In, First Out (LIFO) principle?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: 1,
    category: "Data Structures & Algorithms"
  },
  {
    id: 78,
    question: "What is the worst-case time complexity of binary search?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correctAnswer: 2,
    category: "Data Structures & Algorithms"
  },
  {
    id: 79,
    question: "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble Sort", "Quick Sort", "Merge Sort", "Both Quick Sort and Merge Sort"],
    correctAnswer: 3,
    category: "Data Structures & Algorithms"
  },
  {
    id: 80,
    question: "Which data structure is most suitable for implementing a priority queue?",
    options: ["Array", "Linked List", "Heap", "Stack"],
    correctAnswer: 2,
    category: "Data Structures & Algorithms"
  },
  {
    id: 81,
    question: "What is the time complexity of inserting an element at the beginning of a linked list?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: 0,
    category: "Data Structures & Algorithms"
  },
  {
    id: 82,
    question: "Which traversal technique is used in Depth First Search (DFS)?",
    options: ["Breadth-first", "Stack-based", "Queue-based", "Random"],
    correctAnswer: 1,
    category: "Data Structures & Algorithms"
  },
  {
    id: 83,
    question: "What is the space complexity of merge sort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: 2,
    category: "Data Structures & Algorithms"
  },
  {
    id: 84,
    question: "Which data structure is used to implement recursion?",
    options: ["Queue", "Stack", "Array", "Tree"],
    correctAnswer: 1,
    category: "Data Structures & Algorithms"
  },
  {
    id: 85,
    question: "What is the time complexity of searching in a balanced binary search tree?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 1,
    category: "Data Structures & Algorithms"
  },
  {
    id: 86,
    question: "Which algorithm is used to find the shortest path in a weighted graph?",
    options: ["BFS", "DFS", "Dijkstra's Algorithm", "Binary Search"],
    correctAnswer: 2,
    category: "Data Structures & Algorithms"
  },
  {
    id: 87,
    question: "What is a hash collision?",
    options: ["When two keys hash to the same index", "When hash function fails", "When hash table is full", "When hash value is negative"],
    correctAnswer: 0,
    category: "Data Structures & Algorithms"
  },
  {
    id: 88,
    question: "Which data structure follows First In, First Out (FIFO) principle?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    correctAnswer: 1,
    category: "Data Structures & Algorithms"
  },
  {
    id: 89,
    question: "What is the best case time complexity of quick sort?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correctAnswer: 1,
    category: "Data Structures & Algorithms"
  },
  {
    id: 90,
    question: "Which technique is used to detect cycles in a linked list?",
    options: ["Linear search", "Binary search", "Floyd's cycle detection", "Hash table"],
    correctAnswer: 2,
    category: "Data Structures & Algorithms"
  },
  {
    id: 91,
    question: "What is dynamic programming?",
    options: ["Programming with dynamic languages", "Solving problems by breaking them into subproblems", "Real-time programming", "Object-oriented programming"],
    correctAnswer: 1,
    category: "Data Structures & Algorithms"
  },
  {
    id: 92,
    question: "Which tree traversal visits nodes level by level?",
    options: ["Inorder", "Preorder", "Postorder", "Level order"],
    correctAnswer: 3,
    category: "Data Structures & Algorithms"
  },
  {
    id: 93,
    question: "What is the time complexity of bubble sort in the worst case?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correctAnswer: 2,
    category: "Data Structures & Algorithms"
  },
  {
    id: 94,
    question: "Which data structure is used in breadth-first search?",
    options: ["Stack", "Queue", "Array", "Tree"],
    correctAnswer: 1,
    category: "Data Structures & Algorithms"
  },
  {
    id: 95,
    question: "What is the maximum number of children a binary tree node can have?",
    options: ["1", "2", "3", "Unlimited"],
    correctAnswer: 1,
    category: "Data Structures & Algorithms"
  },
  {
    id: 96,
    question: "Which sorting algorithm is stable and has O(n log n) time complexity?",
    options: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"],
    correctAnswer: 2,
    category: "Data Structures & Algorithms"
  },
  {
    id: 97,
    question: "What is the time complexity of finding the minimum element in an unsorted array?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: 2,
    category: "Data Structures & Algorithms"
  },
  {
    id: 98,
    question: "Which data structure is best for implementing undo functionality?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: 1,
    category: "Data Structures & Algorithms"
  },
  {
    id: 99,
    question: "What is the height of a complete binary tree with n nodes?",
    options: ["log n", "n", "n²", "2^n"],
    correctAnswer: 0,
    category: "Data Structures & Algorithms"
  },
  {
    id: 100,
    question: "Which graph representation is more space-efficient for sparse graphs?",
    options: ["Adjacency Matrix", "Adjacency List", "Edge List", "All are equal"],
    correctAnswer: 1,
    category: "Data Structures & Algorithms"
  }
];

// Function to get random questions for the assessment
export const getRandomQuestions = (totalQuestions: number = 15): Question[] => {
  const categories = ["Web Development", "Data Science", "Cloud Computing", "Data Structures & Algorithms"];
  const questionsPerCategory = Math.floor(totalQuestions / categories.length);
  const extraQuestions = totalQuestions % categories.length;
  
  const selectedQuestions: Question[] = [];
  
  categories.forEach((category, index) => {
    const categoryQuestions = questionBank.filter(q => q.category === category);
    const numToSelect = questionsPerCategory + (index < extraQuestions ? 1 : 0);
    
    // Shuffle and select random questions from this category
    const shuffled = [...categoryQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(numToSelect, categoryQuestions.length));
    
    selectedQuestions.push(...selected);
  });
  
  // Final shuffle to randomize the order
  return selectedQuestions.sort(() => Math.random() - 0.5);
};

// For backwards compatibility, export a random set as sampleQuestions
export const sampleQuestions = getRandomQuestions(15);
