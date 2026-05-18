import { useState } from "react";

// ── All 14 career fields ───────────────────────────────
const FIELDS = [
  { id: "datascience",    label: "Data Science",          icon: "📊", color: "#6c63ff", bg: "#ede9ff" },
  { id: "ml",             label: "Machine Learning",       icon: "🤖", color: "#00b894", bg: "#e0faf4" },
  { id: "ai",             label: "Artificial Intelligence",icon: "🧠", color: "#e17055", bg: "#fef0ec" },
  { id: "webdev",         label: "Web Development",        icon: "🌐", color: "#0984e3", bg: "#e8f4fd" },
  { id: "fullstack",      label: "Full Stack Dev",         icon: "⚡", color: "#6c5ce7", bg: "#f0eeff" },
  { id: "backend",        label: "Backend Development",    icon: "⚙️", color: "#00cec9", bg: "#e0fafa" },
  { id: "frontend",       label: "Frontend Development",   icon: "🎨", color: "#fd79a8", bg: "#fef0f5" },
  { id: "devops",         label: "DevOps",                 icon: "🔧", color: "#fdcb6e", bg: "#fef9e7" },
  { id: "cybersecurity",  label: "Cybersecurity",          icon: "🔒", color: "#d63031", bg: "#fdecea" },
  { id: "dataanalytics",  label: "Data Analytics",         icon: "📈", color: "#00b894", bg: "#e0faf4" },
  { id: "cloud",          label: "Cloud Computing",        icon: "☁️", color: "#0984e3", bg: "#e8f4fd" },
  { id: "appdev",         label: "App Development",        icon: "📱", color: "#a29bfe", bg: "#f0eeff" },
  { id: "blockchain",     label: "Blockchain",             icon: "🔗", color: "#e17055", bg: "#fef0ec" },
  { id: "uiux",           label: "UI/UX Design",           icon: "✏️", color: "#fd79a8", bg: "#fef0f5" },
];

// ── Roadmap steps for each field ──────────────────────
const ROADMAPS = {

  datascience: {
    title: "Data Science",
    duration: "6-9 months",
    jobRoles: ["Data Scientist", "ML Engineer", "Data Analyst", "Research Scientist"],
    avgSalary: "6-25 LPA",
    steps: [
      { num: "01", title: "Mathematics & Statistics",      icon: "📐", level: "beginner",     time: "4 weeks", free: true,  desc: "Linear Algebra (vectors, matrices), Probability (Bayes theorem), Statistics (mean, std, hypothesis testing, p-value). These are the foundations of every ML algorithm.", resources: "Khan Academy, 3Blue1Brown YouTube, StatQuest" },
      { num: "02", title: "Python Programming",            icon: "🐍", level: "beginner",     time: "3 weeks", free: true,  desc: "Python basics, functions, OOP, file handling. Then NumPy for array operations and Pandas for data manipulation — these two libraries are used daily in data science.", resources: "Python.org docs, Kaggle Python course, Corey Schafer YouTube" },
      { num: "03", title: "Data Wrangling & EDA",         icon: "🔍", level: "beginner",     time: "3 weeks", free: true,  desc: "Exploratory Data Analysis — understanding your data before modelling. Handle missing values, outliers, data types. Visualise with Matplotlib and Seaborn.", resources: "Kaggle EDA notebooks, Pandas docs, Seaborn gallery" },
      { num: "04", title: "Machine Learning Fundamentals", icon: "🤖", level: "intermediate", time: "6 weeks", free: true,  desc: "Supervised learning (regression, classification), unsupervised (clustering, dimensionality reduction). Learn Scikit-learn deeply. Understand train/test split, cross-validation, bias-variance.", resources: "Andrew Ng ML Course (Coursera), Hands-On ML book, StatQuest" },
      { num: "05", title: "SQL & Databases",               icon: "🗄️", level: "intermediate", time: "2 weeks", free: true,  desc: "SQL is non-negotiable in data science. Learn SELECT, JOIN, GROUP BY, subqueries, window functions. Most DS interviews have SQL rounds.", resources: "Mode Analytics SQL, LeetCode SQL, W3Schools" },
      { num: "06", title: "Deep Learning",                 icon: "🧠", level: "intermediate", time: "6 weeks", free: false, desc: "Neural networks, backpropagation, CNNs for images, RNNs/LSTMs for sequences. Learn TensorFlow or PyTorch. Build at least 2 deep learning projects.", resources: "fast.ai (free), DeepLearning.AI Coursera, TensorFlow tutorials" },
      { num: "07", title: "Feature Engineering & Model Tuning", icon: "⚙️", level: "intermediate", time: "3 weeks", free: true, desc: "The difference between a 70% and 90% accurate model is often feature engineering. Learn encoding, scaling, feature selection. Master hyperparameter tuning with GridSearchCV and Optuna.", resources: "Kaggle competitions, Feature Engineering for ML book" },
      { num: "08", title: "Data Visualisation & Storytelling", icon: "📊", level: "intermediate", time: "2 weeks", free: true, desc: "A data scientist must communicate insights to non-technical stakeholders. Learn Tableau or Power BI basics. Master Plotly for interactive Python charts.", resources: "Tableau Public, Storytelling with Data book" },
      { num: "09", title: "Build End-to-End Projects",     icon: "🚀", level: "advanced",     time: "4 weeks", free: true,  desc: "Build 3 complete projects: data collection → EDA → modelling → evaluation → deployment. Host on GitHub. Ideas: churn prediction, sentiment analysis, image classifier, recommendation system.", resources: "GitHub, Kaggle datasets, Streamlit for deployment" },
      { num: "10", title: "MLOps & Model Deployment",      icon: "☁️", level: "advanced",     time: "3 weeks", free: false, desc: "Learn to deploy ML models using Flask or FastAPI. Docker for containerisation. Basic knowledge of cloud (AWS SageMaker or GCP Vertex AI). CI/CD pipelines for ML.", resources: "MLflow, DVC, AWS Free Tier, Docker docs" },
    ],
  },

  ml: {
    title: "Machine Learning",
    duration: "7-10 months",
    jobRoles: ["ML Engineer", "AI Researcher", "MLOps Engineer", "Data Scientist"],
    avgSalary: "8-30 LPA",
    steps: [
      { num: "01", title: "Python + Math Foundations",     icon: "📐", level: "beginner",     time: "4 weeks", free: true,  desc: "Python, NumPy, linear algebra, calculus (derivatives for backprop), probability and statistics. These are mandatory foundations — do not skip.", resources: "Khan Academy, 3Blue1Brown, Python docs" },
      { num: "02", title: "Classical ML Algorithms",       icon: "🤖", level: "beginner",     time: "5 weeks", free: true,  desc: "Linear/Logistic Regression, Decision Trees, Random Forest, SVM, KNN, Naive Bayes, K-Means clustering. Understand each mathematically, not just usage.", resources: "Andrew Ng Coursera, StatQuest YouTube, Scikit-learn docs" },
      { num: "03", title: "Deep Learning Core",            icon: "🧠", level: "intermediate", time: "8 weeks", free: false, desc: "Artificial Neural Networks, activation functions, loss functions, optimisers (Adam, SGD). CNNs for computer vision. RNNs, LSTMs, GRUs for sequences. Transformers architecture.", resources: "fast.ai, DeepLearning.AI, PyTorch official tutorials" },
      { num: "04", title: "Natural Language Processing",   icon: "📝", level: "intermediate", time: "5 weeks", free: false, desc: "Text preprocessing, tokenisation, word embeddings (Word2Vec, GloVe). BERT, GPT architecture. Fine-tuning pre-trained models using HuggingFace Transformers.", resources: "HuggingFace course (free), Stanford CS224N lectures" },
      { num: "05", title: "Computer Vision",               icon: "👁️", level: "intermediate", time: "4 weeks", free: false, desc: "Image processing, CNN architectures (ResNet, VGG, EfficientNet), object detection (YOLO), image segmentation. Transfer learning for custom datasets.", resources: "OpenCV docs, fast.ai vision, YOLO tutorials" },
      { num: "06", title: "Model Evaluation & Tuning",     icon: "⚙️", level: "intermediate", time: "3 weeks", free: true,  desc: "Evaluation metrics (precision, recall, F1, AUC-ROC), cross-validation, hyperparameter tuning (Optuna, Keras Tuner), model interpretability (SHAP, LIME).", resources: "Scikit-learn docs, SHAP library docs" },
      { num: "07", title: "ML System Design",              icon: "🏗️", level: "advanced",     time: "4 weeks", free: true,  desc: "How to design production ML systems. Data pipelines, model serving, A/B testing, monitoring model drift. Feature stores, model registries.", resources: "Chip Huyen's ML Systems Design (free book), Made With ML" },
      { num: "08", title: "MLOps & Production",            icon: "🔧", level: "advanced",     time: "4 weeks", free: false, desc: "MLflow for experiment tracking, Docker + Kubernetes for deployment, CI/CD for ML pipelines, cloud deployment (AWS/GCP/Azure). Model monitoring in production.", resources: "MLflow docs, AWS SageMaker, Kubeflow" },
      { num: "09", title: "Research & Advanced Topics",    icon: "🔬", level: "advanced",     time: "6 weeks", free: true,  desc: "Read ML papers on ArXiv. Implement papers from scratch. Reinforcement Learning basics. Generative AI (GANs, VAEs, Diffusion Models). Large Language Models.", resources: "ArXiv, Papers With Code, Andrej Karpathy YouTube" },
      { num: "10", title: "Portfolio & Contributions",     icon: "🏆", level: "advanced",     time: "Ongoing", free: true,  desc: "Kaggle competitions (aim for top 20%), contribute to open source ML projects, write blog posts, build end-to-end ML products and deploy them.", resources: "Kaggle, GitHub, Medium, Towards Data Science" },
    ],
  },

  webdev: {
    title: "Web Development",
    duration: "5-7 months",
    jobRoles: ["Web Developer", "Frontend Dev", "Full Stack Dev", "UI Engineer"],
    avgSalary: "5-20 LPA",
    steps: [
      { num: "01", title: "HTML & CSS Fundamentals",       icon: "🌐", level: "beginner",     time: "3 weeks", free: true,  desc: "HTML structure, semantic tags, forms. CSS selectors, box model, flexbox, grid, responsive design, media queries. Build 3 static pages before moving on.", resources: "MDN Web Docs, freeCodeCamp, CSS-Tricks" },
      { num: "02", title: "JavaScript Core",               icon: "⚡", level: "beginner",     time: "5 weeks", free: true,  desc: "Variables, functions, arrays, objects, DOM manipulation, events, async/await, promises, fetch API. ES6+ features. This is the most important step — take your time.", resources: "javascript.info, Eloquent JavaScript (free), Fireship YouTube" },
      { num: "03", title: "Responsive Design & CSS Advanced", icon: "🎨", level: "beginner",  time: "2 weeks", free: true,  desc: "CSS animations, transitions, variables, Tailwind CSS basics. Mobile-first design. Accessibility basics (ARIA, semantic HTML).", resources: "Tailwind CSS docs, Kevin Powell YouTube" },
      { num: "04", title: "React.js",                      icon: "⚛️", level: "intermediate", time: "6 weeks", free: true,  desc: "Components, props, state, hooks (useState, useEffect, useContext), routing with React Router, state management basics. Build 2-3 React projects.", resources: "React official docs, Scrimba React course, Jack Herrington YouTube" },
      { num: "05", title: "Backend Basics with Node.js",   icon: "🟢", level: "intermediate", time: "4 weeks", free: true,  desc: "Node.js runtime, Express.js for REST APIs, middleware, routing, error handling. HTTP methods, status codes, request/response cycle.", resources: "Node.js docs, The Odin Project, Traversy Media YouTube" },
      { num: "06", title: "Databases",                     icon: "🗄️", level: "intermediate", time: "3 weeks", free: true,  desc: "SQL (PostgreSQL) — CRUD, joins, indexes, transactions. MongoDB (NoSQL) — documents, collections, aggregation. ORM/ODM basics — Prisma or Mongoose.", resources: "PostgreSQL tutorial, MongoDB University (free), Prisma docs" },
      { num: "07", title: "Authentication & Security",      icon: "🔒", level: "intermediate", time: "2 weeks", free: true,  desc: "JWT tokens, sessions, cookies, OAuth. Password hashing (bcrypt). XSS, CSRF, SQL injection prevention. HTTPS basics.", resources: "OWASP Top 10, Auth0 docs, Fireship auth videos" },
      { num: "08", title: "Deployment & DevOps Basics",    icon: "🚀", level: "advanced",     time: "2 weeks", free: false, desc: "Deploy frontend to Vercel/Netlify. Deploy backend to Railway or Render. Environment variables, domain setup. Basic Docker understanding.", resources: "Vercel docs, Railway docs, TechWorld with Nana YouTube" },
      { num: "09", title: "Build Full Projects",           icon: "🏗️", level: "advanced",     time: "4 weeks", free: true,  desc: "Build 2 complete full-stack projects. Ideas: Job board, E-commerce, Social media app, Real-time chat. Deploy everything with a custom domain.", resources: "GitHub, PlanetScale, Supabase for backend as a service" },
      { num: "10", title: "TypeScript + Testing",          icon: "🧪", level: "advanced",     time: "3 weeks", free: true,  desc: "TypeScript for type safety. Unit testing with Jest. Integration testing. React Testing Library. This separates professionals from beginners.", resources: "TypeScript handbook, Jest docs, Kent C. Dodds blog" },
    ],
  },

  fullstack: {
    title: "Full Stack Development",
    duration: "8-12 months",
    jobRoles: ["Full Stack Developer", "SDE", "Software Engineer", "Tech Lead"],
    avgSalary: "6-25 LPA",
    steps: [
      { num: "01", title: "HTML, CSS, JavaScript",         icon: "🌐", level: "beginner",     time: "6 weeks", free: true,  desc: "Master all three together. HTML structure, CSS styling and layout, JavaScript logic and DOM. Build 5 static projects before adding frameworks.", resources: "The Odin Project (free, comprehensive), freeCodeCamp" },
      { num: "02", title: "React + TypeScript",            icon: "⚛️", level: "intermediate", time: "6 weeks", free: true,  desc: "React with TypeScript from the start. Hooks, context, React Router, React Query for data fetching. Build typed, production-quality components.", resources: "React TypeScript Cheatsheet, Total TypeScript" },
      { num: "03", title: "Node.js + Express",             icon: "🟢", level: "intermediate", time: "4 weeks", free: true,  desc: "Build REST APIs with Node.js and Express. Middleware, routing, error handling, file uploads. MVC architecture pattern.", resources: "Node.js docs, Express docs, Traversy Media" },
      { num: "04", title: "Databases — SQL + NoSQL",       icon: "🗄️", level: "intermediate", time: "4 weeks", free: true,  desc: "PostgreSQL for relational data. MongoDB for document storage. Redis for caching. Understand when to use which. ORMs: Prisma (SQL), Mongoose (MongoDB).", resources: "Prisma docs, MongoDB University, Redis docs" },
      { num: "05", title: "Authentication & APIs",         icon: "🔒", level: "intermediate", time: "2 weeks", free: true,  desc: "JWT, sessions, OAuth 2.0 (Google login), refresh tokens. REST API design principles. GraphQL basics.", resources: "Passport.js docs, NextAuth.js, GraphQL official" },
      { num: "06", title: "System Design Basics",          icon: "🏗️", level: "intermediate", time: "3 weeks", free: true,  desc: "How to design scalable systems. Load balancers, caching strategies, CDN, microservices vs monolith. Required for mid-level interviews.", resources: "System Design Primer GitHub, ByteByteGo YouTube" },
      { num: "07", title: "DevOps & Cloud",                icon: "☁️", level: "advanced",     time: "3 weeks", free: false, desc: "Docker for containerisation. CI/CD with GitHub Actions. Deploy to AWS or GCP. Nginx as reverse proxy. SSL certificates.", resources: "Docker docs, GitHub Actions, AWS Free Tier" },
      { num: "08", title: "Testing",                       icon: "🧪", level: "advanced",     time: "2 weeks", free: true,  desc: "Unit tests with Jest. Integration tests. E2E tests with Playwright or Cypress. Test-driven development basics.", resources: "Jest docs, Playwright docs, Kent C. Dodds blog" },
      { num: "09", title: "Performance & Optimisation",    icon: "⚡", level: "advanced",     time: "2 weeks", free: true,  desc: "Frontend: lazy loading, code splitting, image optimisation. Backend: query optimisation, indexing, connection pooling. Lighthouse audits.", resources: "web.dev, PostgreSQL query planning docs" },
      { num: "10", title: "Build & Launch SaaS Project",   icon: "🚀", level: "advanced",     time: "6 weeks", free: true,  desc: "Build one complete SaaS application — authentication, payments (Stripe), dashboards, email notifications. Deploy with custom domain. This is your showpiece project.", resources: "Stripe docs, Resend for emails, Vercel deployment" },
    ],
  },

  backend: {
    title: "Backend Development",
    duration: "6-8 months",
    jobRoles: ["Backend Developer", "SDE", "API Developer", "Software Engineer"],
    avgSalary: "5-22 LPA",
    steps: [
      { num: "01", title: "Programming Language (Python/Java/Node)", icon: "🐍", level: "beginner", time: "4 weeks", free: true, desc: "Pick one: Python (Django/FastAPI), Java (Spring Boot), or Node.js (Express). Master the language itself before frameworks. OOP is mandatory.", resources: "Official docs for your chosen language" },
      { num: "02", title: "Data Structures & Algorithms",  icon: "🧮", level: "beginner",     time: "8 weeks", free: true,  desc: "Arrays, strings, linked lists, stacks, queues, trees, graphs, hash maps. Sorting and searching algorithms. Dynamic programming basics. Essential for technical interviews.", resources: "LeetCode, HackerRank, NeetCode YouTube" },
      { num: "03", title: "Databases",                     icon: "🗄️", level: "intermediate", time: "4 weeks", free: true,  desc: "SQL mastery — complex queries, indexes, transactions, ACID properties. NoSQL — MongoDB, Redis. Database design and normalisation.", resources: "PostgreSQL docs, MongoDB University, SQLZoo" },
      { num: "04", title: "REST API Design",               icon: "🔌", level: "intermediate", time: "3 weeks", free: true,  desc: "HTTP methods, status codes, API versioning, pagination, rate limiting, documentation (Swagger/OpenAPI). Build a complete REST API with auth.", resources: "RESTful API design guide, FastAPI docs, Postman" },
      { num: "05", title: "Authentication & Security",     icon: "🔒", level: "intermediate", time: "2 weeks", free: true,  desc: "JWT, OAuth 2.0, API keys, role-based access control. Security basics: input validation, SQL injection, rate limiting, CORS.", resources: "OWASP, JWT.io, OAuth.net" },
      { num: "06", title: "System Design",                 icon: "🏗️", level: "intermediate", time: "6 weeks", free: true,  desc: "Load balancing, caching (Redis), message queues (Kafka/RabbitMQ), microservices, API gateways. Required for senior roles.", resources: "System Design Primer, Designing Data-Intensive Applications book" },
      { num: "07", title: "Docker & Containers",           icon: "🐳", level: "advanced",     time: "2 weeks", free: true,  desc: "Containerise your applications with Docker. Docker Compose for local development. Kubernetes basics for orchestration.", resources: "Docker docs, TechWorld with Nana YouTube" },
      { num: "08", title: "Cloud Deployment",              icon: "☁️", level: "advanced",     time: "3 weeks", free: false, desc: "Deploy to AWS (EC2, RDS, S3, Lambda) or GCP. Auto-scaling, load balancers, managed databases. Infrastructure as Code with Terraform basics.", resources: "AWS Free Tier, Cloud Guru, Terraform docs" },
      { num: "09", title: "Testing & CI/CD",               icon: "🧪", level: "advanced",     time: "2 weeks", free: true,  desc: "Unit testing, integration testing, API testing with Pytest or JUnit. GitHub Actions for CI/CD pipelines. Code coverage.", resources: "Pytest docs, GitHub Actions docs" },
      { num: "10", title: "Build Production API",          icon: "🚀", level: "advanced",     time: "4 weeks", free: true,  desc: "Build a production-grade API: authentication, database, caching, rate limiting, logging, monitoring, documentation. Deploy to cloud.", resources: "FastAPI advanced docs, AWS deployment guides" },
    ],
  },

  frontend: {
    title: "Frontend Development",
    duration: "5-7 months",
    jobRoles: ["Frontend Developer", "UI Engineer", "React Developer", "Web Developer"],
    avgSalary: "5-18 LPA",
    steps: [
      { num: "01", title: "HTML5 Semantics",               icon: "📄", level: "beginner",     time: "1 week",  free: true,  desc: "Semantic HTML tags, forms, accessibility (ARIA labels), SEO basics. Understand how the DOM works. Validate your HTML.", resources: "MDN Web Docs, HTML5 Doctor" },
      { num: "02", title: "CSS3 Mastery",                  icon: "🎨", level: "beginner",     time: "3 weeks", free: true,  desc: "Box model, flexbox, CSS grid, animations, transitions, CSS variables, pseudo-elements. Responsive design with media queries. Mobile-first approach.", resources: "CSS-Tricks, Kevin Powell YouTube, Flexbox Froggy game" },
      { num: "03", title: "JavaScript Deep Dive",          icon: "⚡", level: "beginner",     time: "5 weeks", free: true,  desc: "All JS fundamentals, DOM API, event handling, async programming, fetch API, ES6+ (spread, destructuring, optional chaining). No shortcuts here.", resources: "javascript.info (best free resource), You Don't Know JS" },
      { num: "04", title: "React.js",                      icon: "⚛️", level: "intermediate", time: "6 weeks", free: true,  desc: "Components, hooks, custom hooks, context API, React Router. Performance optimisation (useMemo, useCallback, lazy loading). React DevTools.", resources: "React official docs, Epic React by Kent C. Dodds" },
      { num: "05", title: "TypeScript",                    icon: "🔷", level: "intermediate", time: "2 weeks", free: true,  desc: "Types, interfaces, generics, type narrowing. TypeScript with React. This is required at most companies — not optional anymore.", resources: "TypeScript handbook, Total TypeScript, Matt Pocock" },
      { num: "06", title: "State Management",              icon: "🗄️", level: "intermediate", time: "2 weeks", free: true,  desc: "When to use local state vs global state. Zustand (simple), Redux Toolkit (complex apps), React Query / TanStack Query for server state.", resources: "Zustand docs, TanStack Query docs, Redux Toolkit" },
      { num: "07", title: "Testing",                       icon: "🧪", level: "intermediate", time: "2 weeks", free: true,  desc: "Unit testing with Vitest or Jest. Component testing with React Testing Library. E2E with Playwright. Test coverage.", resources: "Testing Library docs, Playwright docs" },
      { num: "08", title: "Performance Optimisation",      icon: "🚀", level: "advanced",     time: "2 weeks", free: true,  desc: "Core Web Vitals (LCP, FID, CLS), code splitting, lazy loading, image optimisation, bundle analysis, CDN. Lighthouse scores matter.", resources: "web.dev, Chrome DevTools, Bundle Analyzer" },
      { num: "09", title: "Build Tools & Ecosystem",       icon: "⚙️", level: "advanced",     time: "1 week",  free: true,  desc: "Vite (build tool), ESLint + Prettier (code quality), Git workflow, npm/yarn, environment variables, deployment to Vercel/Netlify.", resources: "Vite docs, Vercel docs, Git docs" },
      { num: "10", title: "Portfolio Projects",            icon: "🏆", level: "advanced",     time: "4 weeks", free: true,  desc: "Build 3 polished projects: a portfolio site, a complex UI app (dashboard, e-commerce), a collaborative project. Focus on design quality.", resources: "Dribbble for inspiration, Figma for design" },
    ],
  },

  devops: {
    title: "DevOps Engineering",
    duration: "7-10 months",
    jobRoles: ["DevOps Engineer", "SRE", "Platform Engineer", "Cloud Engineer"],
    avgSalary: "7-28 LPA",
    steps: [
      { num: "01", title: "Linux & Shell Scripting",       icon: "🐧", level: "beginner",     time: "3 weeks", free: true,  desc: "Linux commands, file system, permissions, processes, networking basics, bash scripting, cron jobs. You'll use Linux every day as a DevOps engineer.", resources: "Linux Journey (free), OverTheWire Bandit, The Linux Command Line book" },
      { num: "02", title: "Networking Fundamentals",       icon: "🌐", level: "beginner",     time: "2 weeks", free: true,  desc: "TCP/IP, DNS, HTTP/HTTPS, load balancing, proxies, firewalls, VPN. You need to understand how data flows through networks.", resources: "Computer Networking: A Top-Down Approach, NetworkChuck YouTube" },
      { num: "03", title: "Git & Version Control",         icon: "📦", level: "beginner",     time: "1 week",  free: true,  desc: "Git branching strategies, pull requests, merge conflicts, git hooks, monorepo vs polyrepo. GitFlow and trunk-based development.", resources: "Pro Git book (free), GitHub docs" },
      { num: "04", title: "Docker & Containerisation",     icon: "🐳", level: "intermediate", time: "3 weeks", free: true,  desc: "Dockerfile, Docker Compose, image layers, networking, volumes, multi-stage builds, Docker Hub. Containerise a full application.", resources: "Docker official docs, TechWorld with Nana YouTube" },
      { num: "05", title: "CI/CD Pipelines",               icon: "🔄", level: "intermediate", time: "3 weeks", free: true,  desc: "GitHub Actions, Jenkins, GitLab CI. Build pipelines that test, build, and deploy automatically. Pipeline as code.", resources: "GitHub Actions docs, Jenkins docs" },
      { num: "06", title: "Kubernetes",                    icon: "☸️", level: "intermediate", time: "6 weeks", free: false, desc: "Pods, deployments, services, ingress, config maps, secrets, namespaces, Helm charts. Deploy and manage containerised applications at scale.", resources: "Kubernetes docs, KodeKloud (paid), Killer.sh" },
      { num: "07", title: "Cloud Platforms",               icon: "☁️", level: "intermediate", time: "6 weeks", free: false, desc: "AWS (most in-demand) or GCP/Azure. EC2, S3, RDS, VPC, IAM, Lambda, CloudWatch. Get the AWS Solutions Architect Associate certification.", resources: "AWS Free Tier, A Cloud Guru, ExamPro" },
      { num: "08", title: "Infrastructure as Code",        icon: "📝", level: "advanced",     time: "3 weeks", free: true,  desc: "Terraform for provisioning cloud resources. Ansible for configuration management. Write infrastructure code instead of clicking in consoles.", resources: "Terraform docs, HashiCorp Learn, Ansible docs" },
      { num: "09", title: "Monitoring & Observability",    icon: "📊", level: "advanced",     time: "2 weeks", free: true,  desc: "Prometheus for metrics, Grafana for dashboards, ELK stack for logs, Jaeger for distributed tracing. Set up alerts and on-call procedures.", resources: "Prometheus docs, Grafana docs, Elastic docs" },
      { num: "10", title: "Security (DevSecOps)",          icon: "🔒", level: "advanced",     time: "2 weeks", free: true,  desc: "Shift security left. SAST/DAST in pipelines, container scanning, secret management (Vault), vulnerability scanning, compliance as code.", resources: "OWASP DevSecOps, HashiCorp Vault docs" },
    ],
  },

  dataanalytics: {
    title: "Data Analytics",
    duration: "4-6 months",
    jobRoles: ["Data Analyst", "Business Analyst", "BI Analyst", "Analytics Engineer"],
    avgSalary: "4-15 LPA",
    steps: [
      { num: "01", title: "Excel & Google Sheets",         icon: "📊", level: "beginner",     time: "2 weeks", free: true,  desc: "VLOOKUP, pivot tables, charts, conditional formatting, data validation, basic formulas. Excel is still used in 80% of companies — master it first.", resources: "Excel Easy (free), ExcelJet, Google Sheets docs" },
      { num: "02", title: "SQL Mastery",                   icon: "🗄️", level: "beginner",     time: "4 weeks", free: true,  desc: "SELECT, WHERE, JOIN (all types), GROUP BY, HAVING, subqueries, CTEs, window functions (ROW_NUMBER, RANK, LAG, LEAD). SQL is the most important skill for data analysts.", resources: "Mode SQL tutorial, LeetCode SQL, SQLZoo" },
      { num: "03", title: "Statistics for Analytics",      icon: "📐", level: "beginner",     time: "3 weeks", free: true,  desc: "Descriptive statistics (mean, median, mode, std), distributions, correlation vs causation, hypothesis testing, A/B testing basics, p-values, confidence intervals.", resources: "Khan Academy Statistics, StatQuest YouTube" },
      { num: "04", title: "Python for Data Analysis",      icon: "🐍", level: "intermediate", time: "4 weeks", free: true,  desc: "Python basics, then Pandas for data manipulation, NumPy for numerical computing, Matplotlib and Seaborn for visualisation. EDA workflows.", resources: "Kaggle Python and Pandas courses (free), Real Python" },
      { num: "05", title: "Data Visualisation",            icon: "📈", level: "intermediate", time: "3 weeks", free: false, desc: "Tableau (most in-demand) or Power BI. Build dashboards that tell a clear story. Understand chart types — when to use bar vs line vs scatter.", resources: "Tableau Public (free), Power BI free tier, Tableau training videos" },
      { num: "06", title: "Business Intelligence",         icon: "💼", level: "intermediate", time: "2 weeks", free: false, desc: "Data warehousing concepts, dimensional modelling (star schema, snowflake schema), ETL processes. Tools: dbt for data transformation.", resources: "dbt fundamentals (free course), Kimball data warehouse book" },
      { num: "07", title: "Advanced Analytics",            icon: "🔬", level: "advanced",     time: "3 weeks", free: true,  desc: "Cohort analysis, funnel analysis, retention analysis, RFM analysis, customer segmentation. These are real business analytics frameworks.", resources: "Towards Data Science articles, Analytics Vidhya" },
      { num: "08", title: "Communication & Storytelling",  icon: "📣", level: "advanced",     time: "2 weeks", free: true,  desc: "The most underrated analyst skill. Learn to present data insights to non-technical stakeholders. Structure reports, choose right visualisations, tell a story.", resources: "Storytelling with Data book, Cole Nussbaumer Knaflic" },
    ],
  },

  cloud: {
    title: "Cloud Computing",
    duration: "6-9 months",
    jobRoles: ["Cloud Engineer", "Solutions Architect", "Cloud Developer", "DevOps Engineer"],
    avgSalary: "8-30 LPA",
    steps: [
      { num: "01", title: "Networking & OS Fundamentals",  icon: "🌐", level: "beginner",     time: "3 weeks", free: true,  desc: "TCP/IP, DNS, HTTP, subnets, VPCs. Linux basics. These are the foundations of all cloud concepts — you can't skip this.", resources: "NetworkChuck YouTube, Linux Journey" },
      { num: "02", title: "Cloud Fundamentals",            icon: "☁️", level: "beginner",     time: "2 weeks", free: true,  desc: "IaaS vs PaaS vs SaaS, regions and availability zones, shared responsibility model. Take the AWS Cloud Practitioner exam (good entry point).", resources: "AWS Cloud Practitioner Essentials (free), ExamPro" },
      { num: "03", title: "AWS Core Services",             icon: "🟠", level: "intermediate", time: "6 weeks", free: false, desc: "EC2 (virtual machines), S3 (storage), RDS (databases), VPC (networking), IAM (security), CloudWatch (monitoring), Lambda (serverless). These are the most used.", resources: "AWS Free Tier (hands-on), A Cloud Guru, AWS Skill Builder" },
      { num: "04", title: "Docker & Kubernetes",           icon: "🐳", level: "intermediate", time: "5 weeks", free: true,  desc: "Containerise applications with Docker. Orchestrate with Kubernetes (EKS on AWS). Essential for modern cloud architectures.", resources: "Docker docs, Kubernetes docs, KodeKloud" },
      { num: "05", title: "Infrastructure as Code",        icon: "📝", level: "intermediate", time: "3 weeks", free: true,  desc: "Terraform to provision cloud resources with code. CloudFormation (AWS native). Write reproducible, version-controlled infrastructure.", resources: "Terraform docs, HashiCorp Learn (free)" },
      { num: "06", title: "Serverless Architecture",       icon: "⚡", level: "intermediate", time: "2 weeks", free: false, desc: "AWS Lambda, API Gateway, DynamoDB, SQS/SNS. Build event-driven architectures. Serverless Framework or SAM for deployment.", resources: "AWS Lambda docs, Serverless Framework docs" },
      { num: "07", title: "Cloud Security",                icon: "🔒", level: "advanced",     time: "3 weeks", free: false, desc: "IAM policies and roles, encryption at rest/in transit, VPC security groups, WAF, Shield, CloudTrail for auditing. Security is a key cloud skill.", resources: "AWS Security specialty prep, OWASP Cloud" },
      { num: "08", title: "Cloud Certifications",          icon: "🏆", level: "advanced",     time: "4 weeks", free: false, desc: "AWS Solutions Architect Associate (most valuable), then either Developer Associate or SysOps. GCP or Azure certifications as second option.", resources: "A Cloud Guru, Whizlabs, official AWS practice exams" },
    ],
  },

  cybersecurity: {
    title: "Cybersecurity",
    duration: "8-12 months",
    jobRoles: ["Security Analyst", "Penetration Tester", "SOC Analyst", "Security Engineer"],
    avgSalary: "6-25 LPA",
    steps: [
      { num: "01", title: "Networking Deep Dive",          icon: "🌐", level: "beginner",     time: "4 weeks", free: true,  desc: "OSI model, TCP/IP, DNS, HTTP/HTTPS, firewalls, VPN, proxies, Wireshark for packet analysis. Security starts with understanding networks.", resources: "Professor Messer, NetworkChuck, TryHackMe networking rooms" },
      { num: "02", title: "Linux & Command Line",          icon: "🐧", level: "beginner",     time: "3 weeks", free: true,  desc: "Linux is the primary OS in security. File permissions, processes, networking commands (netstat, nmap, curl), bash scripting, log analysis.", resources: "OverTheWire Bandit (hands-on Linux), TryHackMe Linux rooms" },
      { num: "03", title: "Security Fundamentals",         icon: "🔒", level: "beginner",     time: "3 weeks", free: true,  desc: "CIA triad, encryption (symmetric/asymmetric), hashing, PKI, authentication vs authorisation, common attack types (phishing, MITM, DDoS). CompTIA Security+ prep.", resources: "Professor Messer Security+ (free), Cybrary" },
      { num: "04", title: "Web Application Security",      icon: "🌐", level: "intermediate", time: "5 weeks", free: true,  desc: "OWASP Top 10 (SQL injection, XSS, CSRF, IDOR, SSRF). Burp Suite for web app testing. HTTP deeply. Bug bounty fundamentals.", resources: "PortSwigger Web Academy (free!), HackTheBox Web, OWASP" },
      { num: "05", title: "Ethical Hacking & Pen Testing", icon: "🔓", level: "intermediate", time: "8 weeks", free: false, desc: "Reconnaissance, scanning, exploitation, post-exploitation, reporting. Tools: Nmap, Metasploit, Burp Suite, Nikto, Gobuster. CEH or OSCP prep.", resources: "TryHackMe, HackTheBox, TCM Security (affordable courses)" },
      { num: "06", title: "SOC & Blue Team",               icon: "🛡️", level: "intermediate", time: "4 weeks", free: true,  desc: "Security monitoring, SIEM (Splunk, ELK), incident response, threat hunting, log analysis, malware analysis basics. Blue team is easier to get hired in.", resources: "Splunk free training, Blue Team Labs Online" },
      { num: "07", title: "Malware Analysis",              icon: "🦠", level: "advanced",     time: "4 weeks", free: true,  desc: "Static and dynamic malware analysis, reverse engineering basics, sandbox analysis, YARA rules, threat intelligence.", resources: "ANY.RUN sandbox, Malware Traffic Analysis, Flare-ON challenges" },
      { num: "08", title: "Certifications",                icon: "🏆", level: "advanced",     time: "6 weeks", free: false, desc: "CompTIA Security+ (entry), CEH, OSCP (most respected for pen testing), CISSP (for management). Certifications are important in cybersecurity.", resources: "Offensive Security (OSCP), CompTIA, EC-Council" },
    ],
  },

  appdev: {
    title: "Mobile App Development",
    duration: "5-8 months",
    jobRoles: ["Android Developer", "iOS Developer", "React Native Dev", "Flutter Dev"],
    avgSalary: "5-20 LPA",
    steps: [
      { num: "01", title: "Choose Your Path",              icon: "🔱", level: "beginner",     time: "1 week",  free: true,  desc: "Three options: Flutter (Dart — cross-platform, Google), React Native (JavaScript — cross-platform, Meta), Android Native (Kotlin). Flutter is recommended for freshers — one codebase, both platforms.", resources: "Compare on flutter.dev, reactnative.dev" },
      { num: "02", title: "Dart / JavaScript / Kotlin",    icon: "📝", level: "beginner",     time: "3 weeks", free: true,  desc: "Learn the language for your chosen path. Dart for Flutter, JavaScript for React Native, Kotlin for Android. OOP is essential for all.", resources: "Dart docs, Kotlin docs, JavaScript.info" },
      { num: "03", title: "Flutter / React Native Basics", icon: "📱", level: "beginner",     time: "4 weeks", free: true,  desc: "Widgets/components, layouts, navigation, styling, state management basics. Build a simple app (to-do list, calculator) before advancing.", resources: "Flutter docs, React Native docs, The Net Ninja YouTube" },
      { num: "04", title: "State Management",              icon: "🗄️", level: "intermediate", time: "3 weeks", free: true,  desc: "Flutter: Provider, Riverpod, or BLoC pattern. React Native: Redux, Zustand, or React Query. State management is critical for complex apps.", resources: "Riverpod docs, BLoC library, Redux docs" },
      { num: "05", title: "APIs & Backend Integration",    icon: "🔌", level: "intermediate", time: "2 weeks", free: true,  desc: "HTTP calls (Dio for Flutter, Axios for RN), REST API integration, JSON parsing, error handling, loading states, authentication (JWT tokens).", resources: "Dio docs, Axios docs, JSONPlaceholder for practice" },
      { num: "06", title: "Firebase",                      icon: "🔥", level: "intermediate", time: "3 weeks", free: true,  desc: "Firebase Authentication, Firestore (real-time DB), Storage, Cloud Functions, Push Notifications (FCM). Firebase removes the need for a backend in many apps.", resources: "Firebase docs, Firebase YouTube channel" },
      { num: "07", title: "Local Storage & Offline",       icon: "💾", level: "intermediate", time: "1 week",  free: true,  desc: "SharedPreferences, SQLite, Hive (Flutter), AsyncStorage (RN). Offline-first apps are higher quality. Sync strategies.", resources: "Hive docs, SQLite Flutter, Async Storage RN" },
      { num: "08", title: "App Store Deployment",          icon: "🚀", level: "advanced",     time: "2 weeks", free: false, desc: "Google Play Store submission (Android — $25 one time fee), Apple App Store (iOS — $99/year), app signing, release builds, store listing optimisation.", resources: "Google Play Console, App Store Connect, Flutter deployment docs" },
      { num: "09", title: "Testing & Performance",         icon: "🧪", level: "advanced",     time: "2 weeks", free: true,  desc: "Unit tests, widget tests (Flutter), integration tests. Performance profiling — jank detection, memory leaks, startup time optimisation.", resources: "Flutter testing docs, React Native testing library" },
      { num: "10", title: "Publish 2 Real Apps",           icon: "🏆", level: "advanced",     time: "6 weeks", free: true,  desc: "Build and publish two apps on the Play Store. This is the strongest portfolio signal for app development jobs. Ideas: expense tracker, habit tracker, quiz app.", resources: "Play Store, Firebase for backend, Figma for design" },
    ],
  },

  blockchain: {
    title: "Blockchain Development",
    duration: "7-10 months",
    jobRoles: ["Blockchain Developer", "Smart Contract Dev", "Web3 Developer", "DApp Developer"],
    avgSalary: "8-35 LPA",
    steps: [
      { num: "01", title: "Blockchain Fundamentals",       icon: "🔗", level: "beginner",     time: "2 weeks", free: true,  desc: "How blockchain works (distributed ledger, consensus mechanisms, PoW vs PoS, hashing). Bitcoin and Ethereum architecture. Wallets, addresses, transactions.", resources: "Bitcoin whitepaper, Ethereum.org, Andreas Antonopoulos YouTube" },
      { num: "02", title: "Solidity Programming",          icon: "📝", level: "beginner",     time: "6 weeks", free: true,  desc: "Smart contract language for Ethereum. Variables, functions, events, modifiers, inheritance, interfaces. This is the primary skill for blockchain developers.", resources: "CryptoZombies (free, gamified), Solidity docs, Remix IDE" },
      { num: "03", title: "Ethereum Development",          icon: "💎", level: "intermediate", time: "4 weeks", free: true,  desc: "Hardhat or Foundry for development environment. Deploy to testnets (Sepolia). Ethers.js or Web3.js to interact with smart contracts from frontend.", resources: "Hardhat docs, Ethers.js docs, Patrick Collins YouTube" },
      { num: "04", title: "DeFi Protocols",                icon: "💰", level: "intermediate", time: "3 weeks", free: true,  desc: "Understand Uniswap (AMM), Aave (lending), Compound, Chainlink (oracles). Study their smart contract code. DeFi knowledge is essential.", resources: "DeFi Pulse, protocol documentation, Dune Analytics" },
      { num: "05", title: "NFT & Token Standards",         icon: "🖼️", level: "intermediate", time: "2 weeks", free: true,  desc: "ERC-20 (fungible tokens), ERC-721 (NFTs), ERC-1155 (multi-token). Build and deploy your own token. IPFS for decentralised storage.", resources: "OpenZeppelin docs, IPFS docs, ERC standards" },
      { num: "06", title: "Security & Auditing",           icon: "🔒", level: "advanced",     time: "4 weeks", free: true,  desc: "Common vulnerabilities: reentrancy, integer overflow, front-running, access control. Smart contract auditing methodology. Tools: Slither, MythX.", resources: "SWC Registry, Damn Vulnerable DeFi, Code4rena" },
      { num: "07", title: "Web3 Frontend",                 icon: "🌐", level: "advanced",     time: "3 weeks", free: true,  desc: "React + Ethers.js or Wagmi. Wallet connection (MetaMask, WalletConnect). Build a complete DApp frontend. The Graph for blockchain data.", resources: "Wagmi docs, RainbowKit, The Graph docs" },
      { num: "08", title: "Build & Deploy DApps",          icon: "🚀", level: "advanced",     time: "4 weeks", free: true,  desc: "Build 2 complete DApps — DeFi protocol, NFT marketplace, DAO voting system, or DeFi yield farming. Deploy to mainnet or L2 (Polygon, Arbitrum).", resources: "Polygon docs, Arbitrum docs, Alchemy for node infra" },
    ],
  },

  uiux: {
    title: "UI/UX Design",
    duration: "4-6 months",
    jobRoles: ["UI Designer", "UX Designer", "Product Designer", "Interaction Designer"],
    avgSalary: "4-18 LPA",
    steps: [
      { num: "01", title: "Design Fundamentals",           icon: "🎨", level: "beginner",     time: "2 weeks", free: true,  desc: "Colour theory, typography, spacing, visual hierarchy, contrast, alignment, proximity. These principles apply to every design you'll ever create.", resources: "Canva Design School (free), Refactoring UI book" },
      { num: "02", title: "Figma Mastery",                 icon: "✏️", level: "beginner",     time: "4 weeks", free: true,  desc: "Figma is the industry standard. Frames, components, auto-layout, variants, prototyping, design systems. Figma is free for students.", resources: "Figma YouTube channel, Figma community files, DesignCourse YouTube" },
      { num: "03", title: "UX Research Methods",           icon: "🔍", level: "intermediate", time: "3 weeks", free: true,  desc: "User interviews, surveys, usability testing, card sorting, affinity mapping, personas, user journey maps. Research drives better design decisions.", resources: "Nielsen Norman Group (free articles), UX Collective Medium" },
      { num: "04", title: "Information Architecture",      icon: "🗂️", level: "intermediate", time: "2 weeks", free: true,  desc: "Site maps, user flows, navigation design, content organisation. How users think vs how designers think. Mental models.", resources: "IA Institute, Peter Morville IA book" },
      { num: "05", title: "Prototyping & Interaction",     icon: "🔄", level: "intermediate", time: "3 weeks", free: true,  desc: "Low-fi wireframes to high-fi prototypes. Micro-interactions, transitions, animation principles. Figma prototyping. User testing your prototypes.", resources: "Figma prototyping docs, Principle app, Motion design principles" },
      { num: "06", title: "Design Systems",                icon: "📚", level: "intermediate", time: "2 weeks", free: true,  desc: "Component libraries, design tokens, spacing scales, colour systems, typography scales. Study Material Design, Apple HIG, IBM Carbon.", resources: "Material Design, Apple HIG, Storybook for component docs" },
      { num: "07", title: "Accessibility (A11y)",          icon: "♿", level: "advanced",     time: "1 week",  free: true,  desc: "WCAG guidelines, colour contrast ratios, screen reader compatibility, keyboard navigation, inclusive design. Accessibility is now a legal requirement.", resources: "WebAIM, A11y Project, Contrast Checker" },
      { num: "08", title: "Portfolio & Case Studies",      icon: "🏆", level: "advanced",     time: "4 weeks", free: true,  desc: "3 detailed case studies: problem → research → ideation → design → testing → results. Your portfolio is your resume. Quality over quantity.", resources: "Notion, Figma for portfolio, Behance, UXfolio" },
    ],
  },

  ai: {
    title: "Artificial Intelligence",
    duration: "8-12 months",
    jobRoles: ["AI Engineer", "AI Researcher", "LLM Engineer", "AI Product Manager"],
    avgSalary: "10-40 LPA",
    steps: [
      { num: "01", title: "Math for AI",                   icon: "📐", level: "beginner",     time: "5 weeks", free: true,  desc: "Linear algebra (eigenvalues, SVD), calculus (gradients, chain rule, Jacobians), probability theory (Bayes, distributions), information theory. This is non-negotiable for understanding AI.", resources: "Gilbert Strang Linear Algebra (MIT OpenCourseWare), 3Blue1Brown" },
      { num: "02", title: "Python + Scientific Libraries", icon: "🐍", level: "beginner",     time: "3 weeks", free: true,  desc: "Python, NumPy, Pandas, Matplotlib. Jupyter notebooks for experimentation. Writing clean, efficient Python code. Vectorised operations.", resources: "NumPy docs, Kaggle notebooks, Real Python" },
      { num: "03", title: "Classical ML to Deep Learning", icon: "🤖", level: "intermediate", time: "8 weeks", free: false, desc: "All ML algorithms, then deep neural networks, backpropagation, CNNs, RNNs. Implementation from scratch in NumPy first, then PyTorch. PyTorch is the industry standard for AI research.", resources: "Andrej Karpathy Neural Networks Zero to Hero (free, best), fast.ai" },
      { num: "04", title: "Transformers & Attention",      icon: "🔄", level: "intermediate", time: "4 weeks", free: true,  desc: "The architecture that powers ChatGPT, DALL-E, and everything modern AI. Self-attention mechanism, multi-head attention, positional encoding. Implement a small Transformer.", resources: "Attention Is All You Need paper, Andrej Karpathy GPT from scratch video" },
      { num: "05", title: "Large Language Models",         icon: "🧠", level: "intermediate", time: "5 weeks", free: false, desc: "Pre-training, fine-tuning, RLHF, instruction tuning, prompt engineering. HuggingFace ecosystem. Fine-tune a model on custom data.", resources: "HuggingFace course (free), LLM Bootcamp (free videos)" },
      { num: "06", title: "LLM Application Development",  icon: "⚡", level: "advanced",     time: "4 weeks", free: true,  desc: "LangChain, LlamaIndex for building LLM applications. RAG (Retrieval Augmented Generation), vector databases (Pinecone, Chroma), function calling, agents.", resources: "LangChain docs, LlamaIndex docs, Pinecone learning" },
      { num: "07", title: "Multimodal AI",                 icon: "🎨", level: "advanced",     time: "3 weeks", free: true,  desc: "Vision-language models (CLIP, LLaVA), text-to-image (Stable Diffusion, DALL-E), speech (Whisper), video AI. The future is multimodal.", resources: "Stability AI docs, OpenAI Whisper, HuggingFace multimodal" },
      { num: "08", title: "AI Safety & Alignment",         icon: "🛡️", level: "advanced",     time: "2 weeks", free: true,  desc: "Constitutional AI, RLHF, red teaming, model evaluation, hallucination reduction, bias detection. Increasingly important and well-paid field.", resources: "Anthropic papers, DeepMind Safety, AI Safety fundamentals course" },
      { num: "09", title: "AI Infrastructure & MLOps",     icon: "🔧", level: "advanced",     time: "3 weeks", free: false, desc: "GPU computing (CUDA basics), distributed training, model quantisation and compression, model serving at scale, inference optimisation.", resources: "NVIDIA docs, vLLM for inference, Triton inference server" },
      { num: "10", title: "Research & Contribute",         icon: "🔬", level: "advanced",     time: "Ongoing", free: true,  desc: "Read 1 AI paper per week. Implement papers from scratch. Contribute to open source AI projects. Write blog posts. Participate in AI competitions.", resources: "ArXiv, Papers With Code, Weights & Biases community" },
    ],
  },
};

// ── Level tag component ────────────────────────────────
function LevelTag({ level }) {
  const map = {
    beginner:     { cls: "tag-beginner", label: "Beginner" },
    intermediate: { cls: "tag-mid",      label: "Intermediate" },
    advanced:     { cls: "tag-advanced", label: "Advanced" },
  };
  const { cls, label } = map[level] || map.beginner;
  return <span className={`roadmap-tag ${cls}`}>{label}</span>;
}

export default function Roadmap({ navigate }) {
  const [selected, setSelected] = useState("datascience");
  const [filter,   setFilter]   = useState("all");
  // filter: all | beginner | intermediate | advanced

  const field   = FIELDS.find((f) => f.id === selected);
  const roadmap = ROADMAPS[selected];

  const filteredSteps = roadmap?.steps.filter((s) =>
    filter === "all" ? true : s.level === filter
  ) || [];

  return (
    <div className="roadmap-page">

      {/* ── Page Header ───────────────────────────── */}
      <div style={{ marginBottom: "32px" }}>
        <div className="interview-page-title">Career Roadmaps</div>
        <div className="interview-page-sub">
          Step-by-step visual roadmaps for 14 career paths — know exactly what to learn and when
        </div>
      </div>

      <div className="roadmap-layout">

        {/* ── Sidebar — Field selector ──────────────── */}
        <div className="roadmap-sidebar">
          <div className="roadmap-sidebar-title">Choose Your Path</div>
          {FIELDS.map((f) => (
            <button
              key={f.id}
              className={`roadmap-field-btn ${selected === f.id ? "active" : ""}`}
              onClick={() => { setSelected(f.id); setFilter("all"); }}
            >
              <span
                style={{
                  width: "28px", height: "28px",
                  borderRadius: "6px",
                  background: selected === f.id ? f.bg : "var(--surface2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  flexShrink: 0,
                  transition: "var(--transition)",
                }}
              >
                {f.icon}
              </span>
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Main — Roadmap content ────────────────── */}
        <div>
          {roadmap && (
            <>
              {/* Header card */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${field.color}22, ${field.color}08)`,
                  border: `1px solid ${field.color}30`,
                  borderRadius: "var(--radius-xl)",
                  padding: "28px 32px",
                  marginBottom: "24px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: "36px",
                      width: "60px", height: "60px",
                      background: field.bg,
                      borderRadius: "var(--radius)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {field.icon}
                  </span>
                  <div>
                    <div className="roadmap-title">{roadmap.title} Roadmap</div>
                    <div style={{ fontSize: "13px", color: "var(--muted)" }}>
                      {roadmap.steps.length} steps to get job-ready
                    </div>
                  </div>
                </div>

                {/* Meta info */}
                <div className="roadmap-meta">
                  <div className="roadmap-meta-item">
                    <span>⏱️</span>
                    <span><strong>Duration:</strong> {roadmap.duration}</span>
                  </div>
                  <div className="roadmap-meta-item">
                    <span>💰</span>
                    <span><strong>Avg Salary:</strong> {roadmap.avgSalary}</span>
                  </div>
                  <div className="roadmap-meta-item">
                    <span>💼</span>
                    <span><strong>Roles:</strong> {roadmap.jobRoles.slice(0, 2).join(", ")}</span>
                  </div>
                </div>

                {/* Job roles */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
                  {roadmap.jobRoles.map((role, i) => (
                    <span
                      key={i}
                      style={{
                        background: field.bg,
                        color: field.color,
                        fontSize: "12px",
                        fontWeight: 600,
                        padding: "4px 12px",
                        borderRadius: "var(--radius-full)",
                        border: `1px solid ${field.color}25`,
                      }}
                    >
                      {role}
                    </span>
                  ))}
                </div>

                {/* Filter by level */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["all", "beginner", "intermediate", "advanced"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      style={{
                        padding: "6px 16px",
                        borderRadius: "var(--radius-full)",
                        border: filter === f ? `1.5px solid ${field.color}` : "1.5px solid var(--border)",
                        background: filter === f ? field.bg : "var(--surface)",
                        color: filter === f ? field.color : "var(--muted)",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "var(--transition)",
                        textTransform: "capitalize",
                      }}
                    >
                      {f === "all" ? "All Steps" : f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div className="roadmap-content">
                <div className="roadmap-steps">
                  {filteredSteps.map((step, i) => (
                    <div key={i} className="roadmap-step">
                      {/* Step icon */}
                      <div
                        className="roadmap-step-icon"
                        style={{
                          borderColor: field.color,
                          color: field.color,
                        }}
                      >
                        {step.icon}
                      </div>

                      {/* Step body */}
                      <div className="roadmap-step-body">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: "12px",
                            marginBottom: "6px",
                            flexWrap: "wrap",
                          }}
                        >
                          <div className="roadmap-step-title">
                            <span
                              style={{
                                color: field.color,
                                fontFamily: "var(--font-display)",
                                fontSize: "12px",
                                marginRight: "6px",
                              }}
                            >
                              {step.num}
                            </span>
                            {step.title}
                          </div>
                        </div>

                        <div className="roadmap-step-desc">{step.desc}</div>

                        {/* Tags */}
                        <div className="roadmap-step-meta">
                          <span className="roadmap-tag tag-time">⏱️ {step.time}</span>
                          <span className={`roadmap-tag ${step.free ? "tag-free" : "tag-paid"}`}>
                            {step.free ? "✓ Free" : "💳 Paid"}
                          </span>
                          <LevelTag level={step.level} />
                        </div>

                        {/* Resources */}
                        <div
                          style={{
                            marginTop: "10px",
                            fontSize: "12px",
                            color: "var(--muted)",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "6px",
                          }}
                        >
                          <span style={{ color: field.color, flexShrink: 0 }}>📚</span>
                          <span><strong style={{ color: "var(--text-secondary)" }}>Resources:</strong> {step.resources}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredSteps.length === 0 && (
                  <div className="empty-state" style={{ padding: "40px 0" }}>
                    <div className="empty-icon">🔍</div>
                    <div className="empty-title">No steps match this filter</div>
                    <button
                      className="btn-secondary"
                      style={{ margin: "0 auto" }}
                      onClick={() => setFilter("all")}
                    >
                      Show All Steps
                    </button>
                  </div>
                )}

                {/* Bottom CTA */}
                <div
                  style={{
                    marginTop: "40px",
                    background: `linear-gradient(135deg, ${field.color}15, ${field.color}05)`,
                    border: `1px solid ${field.color}20`,
                    borderRadius: "var(--radius-lg)",
                    padding: "24px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "24px", marginBottom: "10px" }}>🚀</div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "var(--text)",
                      marginBottom: "6px",
                    }}
                  >
                    Ready to test your {roadmap.title} knowledge?
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--muted)",
                      marginBottom: "16px",
                    }}
                  >
                    Take a mock interview personalised for {roadmap.title} role
                  </div>
                  <button
                    className="btn-primary"
                    style={{ width: "auto", padding: "12px 28px" }}
                    onClick={() => navigate("interview")}
                  >
                    Start Mock Interview →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}