// ===== EDIT ONLY THIS FILE TO CHANGE YOUR CONTENT =====

const PROFILE = {
  name: "Fahim Mahmud Tamim",
  initials: "FT",
  hello: "Hello, I'm Fahim Mahmud Tamim",
  headline: "I turn ideas into working software.",
  roles: ["CSE student", "web developer", "Java learner", "problem solver"], // typing animation
  motive:
    "I build websites and programs from scratch. I want to become a developer who writes clean code, ships real projects, and keeps learning every day.",
  location: "Dhaka, Bangladesh",
  university: "University of Asia Pacific (UAP), Green Road",
  degree: "B.Sc. in Computer Science & Engineering",
  email: "your-email@example.com",
  githubUser: "your-username",    // your GitHub username: public repos are loaded automatically
  githubMax: 6,                   // how many GitHub repos to show at most
  photo: "assets/profile.jpg",    // your picture goes in public/assets/
  resume: "assets/resume.pdf",    // your resume goes in public/assets/
  socials: [
    { label: "GitHub",   url: "https://github.com/Fahim-Mahmud-Tamim" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/fahim-mahmud-tamim/" },
    { label: "Facebook", url: "https://www.facebook.com/share/1A2JX4SPrX/?mibextid=wwXIfr" }
  ]
};

const STRIP = ["Web Development", "Java", "Problem Solving", "Node.js", "Clean Code", "Git & GitHub"];

const ABOUT = [
  "I'm studying Computer Science and Engineering at the University of Asia Pacific in Dhaka. I enjoy building things I can see and use, from portfolio sites to small programs.",
  "I work with HTML, CSS, Tailwind CSS and Node.js for the web, and Java for my coursework. I use VS Code and Git every day."
];

const STATS = [
  { value: "3+", label: "Projects on GitHub" },
  { value: "Java", label: "Main coursework language" },
  { value: "Web", label: "Favorite area to build in" }
];

// Hand-written projects (shown first). repo = GitHub link, live = optional demo link,
// image = optional screenshot such as "assets/projects/one.png"
const PROJECTS = [

      {
    title: "First Portfolio",
    desc: "A personal basic Portfolio for Fahim Mahmud Tamim created with HTML CSS JS ..",
    tags: ["Java"],
    repo: "https://github.com/Fahim-Mahmud-Tamim/Begin-Portfolio-.git",
    live: "",

  },
  {
    title: "Operating System Lab Project",
    desc: "All the lab works of Operating System course are done in this project using Java programming language.",
    tags: ["python", "Java"],
    repo: "https://github.com/Fahim-Mahmud-Tamim/OS_Lab_402.git",
    live: "",
   
  },
  {
    title: "PT with framework",
    desc: "A professional Portfolio for Fahim Mahmud Tamim created with HTML CSS JS and Tailwind CSS framework.",
    tags: ["python", "Java"],
    repo: "https://github.com/Fahim-Mahmud-Tamim/Portfolio_Tailwind_React.git",
    live: "",
  
  },
  {
    title: "UAP ADMISSION PORTAL",
    desc: "A web application for managing admission processes at University of Asia Pacific.",
    tags: ["python", "Java", "Django", "Web", "Node.js", "Tailwind CSS"],
    repo: "https://github.com/Fahim-Mahmud-Tamim/UAP_Admission_Portal_Django.git",
    live: "",
   
  },
  {
    title: "MED EDU PORTAL",
    desc: "A web application for managing educational processes and all the staff and students activity at Medical University.",
    tags: ["python", "Java", "Django", "Web", "Node.js", "Tailwind CSS", "Bootstrap", "MySQL", "mongoDB"],
    repo: "https://github.com/ayesha-rahman37/MedEdu-Portal.git",
    live: "",
   
  },
  
  {
    title: "Calculator",
    desc: "A basic Calculator using basic html css and js.",
    tags: ["Web", "Node.js"],
    repo: "https://github.com/Fahim-Mahmud-Tamim/Calculator.git",
    live: "",
    },

 
];

const SKILLS = [
  { title: "Languages", items: ["Java", "JavaScript", "HTML", "CSS"] },
  { title: "Web",       items: ["Node.js", "Tailwind CSS", "Responsive design"] },
  { title: "Tools",     items: ["Git", "GitHub", "VS Code"] }
];

const EDUCATION = [
  { when: "Present", title: "B.Sc. in Computer Science & Engineering", place: "University of Asia Pacific, Dhaka" },
  { when: "2019 - 2020", title: "Higher Secondary Certificate", place: "Dhaka Uddan Government College, Moahmmadpur, Dhaka" },
  { when: "2017 - 2018", title: "Secondary Certificate", place: "Police Lines School and college , Pabna"}
  
];