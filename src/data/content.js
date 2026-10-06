// Single source of truth for portfolio content.
// Everything here comes from the CV (ABU_ARSHID_P.pdf), the experience letter,
// and the project screenshots / certificate image supplied by Abu Arshid P.

export const asset = (path) => `${import.meta.env.BASE_URL}${path}`

export const profile = {
  name: 'ABU ARSHID P',
  qualification: 'MCA Graduate',
  headline: 'Software Engineer | AI & Machine Learning',
  location: 'Dubai, UAE',
  email: 'abuarshidppp@gmail.com',
  phone: '+971 525776735',
  phoneHref: '+971525776735',
  github: 'https://github.com/Arshid920',
  linkedin: 'https://www.linkedin.com/in/abu-arshid',
  photo: 'images/arshid.jpg',
  cv: 'ABU_ARSHID_P.pdf',
  cvPreview: 'images/cv-preview.webp',
}

export const nav = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'education', label: 'Education' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
]

export const interests = [
  'Software Development',
  'AI / Machine Learning',
  'Web Development',
  'IT & Technology',
]

export const intro =
  'Software Engineer and MCA graduate with internship experience in software development, web technologies and AI/ML projects, based in Dubai, UAE.'

export const about = {
  paragraphs: [
    'I am a Software Engineer and MCA graduate with internship experience in software development, web technologies and AI/ML projects.',
    'I work with Python, Java, JavaScript, React.js, SQL and REST APIs. On the AI side, I have hands-on experience with OpenCV, YOLO, Flask, Scikit-learn, Pandas and NumPy, and I understand OOP, data structures and algorithms, SDLC and Agile methodology.',
    'My recent work includes a computer-vision boat safety system and a full-stack medical scheduling application. I am looking for software development and AI/ML roles in the UAE.',
  ],
  highlights: [
    { value: 'MCA', label: 'Jain Deemed-to-be-University, 2025–2026' },
    { value: '2', label: 'Internships: React.js and Python' },
    { value: '2', label: 'Projects: AI/ML and full-stack' },
  ],
  languages: [
    { name: 'English', level: 'Professional' },
    { name: 'Malayalam', level: 'Native' },
    { name: 'Tamil', level: 'Conversational' },
    { name: 'Hindi', level: 'Conversational' },
  ],
}

export const skills = [
  { title: 'Programming', icon: 'code', items: ['Python', 'Java', 'JavaScript', 'SQL', 'Golang'] },
  { title: 'Web Development', icon: 'globe', items: ['React.js', 'HTML5', 'CSS3', 'Bootstrap'] },
  { title: 'Backend & APIs', icon: 'server', items: ['REST APIs', 'Flask', 'Node.js', 'Express.js'] },
  { title: 'Databases', icon: 'database', items: ['MySQL', 'PostgreSQL', 'MongoDB'] },
  {
    title: 'AI / ML',
    icon: 'cpu',
    items: [
      'Artificial Intelligence',
      'Machine Learning',
      'Computer Vision',
      'OpenCV',
      'YOLO',
      'Scikit-learn',
      'Pandas',
      'NumPy',
    ],
  },
  {
    title: 'Tools & Technologies',
    icon: 'wrench',
    items: ['Git', 'GitHub', 'VS Code', 'Jupyter Notebook', 'Postman', 'Power BI'],
  },
  { title: 'Engineering Fundamentals', icon: 'layers', items: ['OOP', 'DSA', 'SDLC', 'Agile'] },
]

export const experience = [
  {
    role: 'React JS Intern',
    company: 'ERE Business Solutions (EBS), India',
    period: 'Jul – Sep 2025',
    points: [
      'Built responsive web interfaces using React.js and reusable components.',
      'Implemented application navigation using React Router.',
      'Connected frontend applications with backend APIs.',
    ],
  },
  {
    role: 'Python Technology Intern',
    company: 'Acura Software Solutions, India',
    period: '2023',
    points: [
      'Completed a 20-day internship focused on Python programming and software development.',
      'Applied Python fundamentals through technical training and practical activities.',
      'Gained exposure to real-world development practices and workflows.',
    ],
  },
]

const boat = (file) => asset(`images/${file}`)

export const projects = {
  featured: {
    name: 'Vision-Enabled AI-Boat Safety and Passenger Monitoring System',
    short: 'BoatSafetyAI',
    summary:
      'A web application that classifies whether a boat trip is safe to start and then monitors passengers during the voyage using computer vision.',
    purpose:
      'Checks wind speed, wave height, atmosphere, day of travel and boat condition before departure, then tracks passenger count and safety events while the boat is underway.',
    tech: ['Python', 'OpenCV', 'YOLO', 'Machine Learning', 'Flask'],
    features: [
      'AI-based boat safety classification using weather and boat-condition data',
      'Passenger detection with a live passenger count against a capacity limit',
      'Overcrowding, life jacket and person-overboard alerts',
      'Passenger heatmap',
      'Separate administrator and boat driver logins, with driver registration',
    ],
    images: [
      { src: boat('boat-home.webp'), alt: 'BoatSafetyAI home page with administrator and boat driver options', caption: 'Home page' },
      { src: boat('boat-prevoyage.webp'), alt: 'Pre-voyage parameters and AI prediction result showing SAFE', caption: 'Pre-voyage safety prediction' },
      { src: boat('boat-pretrip.webp'), alt: 'Pre-trip clearance screen with parameters and AI prediction matrix', caption: 'Pre-trip clearance' },
      { src: boat('boat-voyage.webp'), alt: 'Live voyage monitoring with passenger count and safety protocols', caption: 'Voyage monitoring' },
      { src: boat('boat-driver-login.webp'), alt: 'Driver login screen', caption: 'Driver login' },
      { src: boat('boat-driver-register.webp'), alt: 'Driver registration screen', caption: 'Driver registration' },
      { src: boat('boat-admin-login.webp'), alt: 'Administrator login screen', caption: 'Administrator login' },
    ],
  },
  others: [
    {
      name: 'MedShed: Medical Scheduling and Assistance System',
      summary:
        'A full-stack medical scheduling and assistance application built on the MERN stack.',
      tech: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
      features: [
        'Appointment booking',
        'Schedule management',
        'Emergency bystander assistance',
      ],
    },
  ],
}

export const certifications = [
  {
    name: 'One Million Prompters',
    issuer: 'Dubai Centre for Artificial Intelligence',
    date: 'Jul 2026',
    image: asset('images/cert-one-million-prompters.webp'),
    alt: 'One Million Prompters certificate of completion awarded to Abu Arshid P',
  },
  {
    name: 'Career Essentials in Generative AI',
    issuer: 'Microsoft & LinkedIn Learning',
  },
  {
    name: 'Artificial Intelligence Fundamentals',
    issuer: 'IBM SkillsBuild',
  },
  {
    name: 'Responsible AI: Applying AI Principles with Google Cloud',
  },
]

export const education = [
  {
    degree: 'Master of Computer Application (MCA)',
    school: 'Jain Deemed-to-be-University, India',
    period: '2025 – 2026',
  },
  {
    degree: 'Bachelor of Computer Application (BCA)',
    school: 'University of Calicut, India',
    period: '2021 – 2024',
  },
]
