
export interface Job {
  id: string
  title: string
  company: string
  location: string
  platform: 'naukri' | 'linkedin' | 'indeed'
  requiredSkills: string[]
  experienceLevel: 'fresher' | 'mid' | 'senior'
  salaryRange: string
  url: string
}

export const JOBS: Job[] = [
  {
    id: 'j001',
    title: 'Full Stack Developer',
    company: 'TCS',
    location: 'Bangalore, India',
    platform: 'naukri',
    requiredSkills: ['react', 'nodejs', 'mongodb', 'express', 'typescript'],
    experienceLevel: 'mid',
    salaryRange: '8-14 LPA',
    url: 'https://naukri.com/job/fullstack-tcs',
  },
  {
    id: 'j002',
    title: 'MERN Stack Developer',
    company: 'Infosys',
    location: 'Chennai, India',
    platform: 'linkedin',
    requiredSkills: ['react', 'nodejs', 'mongodb', 'express', 'javascript'],
    experienceLevel: 'mid',
    salaryRange: '7-12 LPA',
    url: 'https://linkedin.com/jobs/mern-infosys',
  },
  {
    id: 'j003',
    title: 'Frontend Developer',
    company: 'Zoho',
    location: 'Chennai, India',
    platform: 'naukri',
    requiredSkills: ['react', 'typescript', 'html', 'css', 'tailwind'],
    experienceLevel: 'mid',
    salaryRange: '6-10 LPA',
    url: 'https://naukri.com/job/frontend-zoho',
  },
  {
    id: 'j004',
    title: 'Backend Node.js Developer',
    company: 'Freshworks',
    location: 'Chennai, India',
    platform: 'indeed',
    requiredSkills: ['nodejs', 'express', 'mongodb', 'redis', 'typescript'],
    experienceLevel: 'mid',
    salaryRange: '9-15 LPA',
    url: 'https://indeed.com/job/backend-freshworks',
  },
  {
    id: 'j005',
    title: 'DevOps Engineer',
    company: 'Wipro',
    location: 'Hyderabad, India',
    platform: 'linkedin',
    requiredSkills: ['docker', 'kubernetes', 'aws', 'linux', 'python'],
    experienceLevel: 'mid',
    salaryRange: '10-18 LPA',
    url: 'https://linkedin.com/jobs/devops-wipro',
  },
  {
    id: 'j006',
    title: 'React Developer',
    company: 'Razorpay',
    location: 'Bangalore, India',
    platform: 'linkedin',
    requiredSkills: ['react', 'typescript', 'javascript', 'html', 'css', 'git'],
    experienceLevel: 'mid',
    salaryRange: '12-20 LPA',
    url: 'https://linkedin.com/jobs/react-razorpay',
  },
  {
    id: 'j007',
    title: 'Junior Full Stack Developer',
    company: 'Startup Hub',
    location: 'Remote',
    platform: 'indeed',
    requiredSkills: ['react', 'nodejs', 'mongodb', 'javascript', 'git'],
    experienceLevel: 'fresher',
    salaryRange: '4-7 LPA',
    url: 'https://indeed.com/job/junior-fullstack',
  },
  {
    id: 'j008',
    title: 'Cloud & Backend Engineer',
    company: 'Amazon',
    location: 'Hyderabad, India',
    platform: 'linkedin',
    requiredSkills: ['aws', 'nodejs', 'docker', 'typescript', 'mongodb'],
    experienceLevel: 'senior',
    salaryRange: '25-40 LPA',
    url: 'https://linkedin.com/jobs/cloud-amazon',
  },
]