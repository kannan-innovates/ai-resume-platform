export interface Course {
  title: string
  platform: string
  url: string
  skill: string
  level: 'beginner' | 'intermediate' | 'advanced'
}

export const COURSES: Course[] = [
  { skill: 'docker',      title: 'Docker for Developers',          platform: 'Udemy',    url: 'https://udemy.com/course/docker-mastery',          level: 'beginner' },
  { skill: 'kubernetes',  title: 'Kubernetes Complete Guide',       platform: 'Udemy',    url: 'https://udemy.com/course/kubernetes-complete',      level: 'intermediate' },
  { skill: 'python',      title: 'Python Bootcamp',                 platform: 'Udemy',    url: 'https://udemy.com/course/complete-python-bootcamp', level: 'beginner' },
  { skill: 'aws',         title: 'AWS Cloud Practitioner',          platform: 'Coursera', url: 'https://coursera.org/learn/aws-cloud-practitioner', level: 'beginner' },
  { skill: 'ci/cd',       title: 'CI/CD with GitHub Actions',       platform: 'YouTube',  url: 'https://youtube.com/watch?v=R8_veQiYBjI',          level: 'intermediate' },
  { skill: 'machine learning', title: 'ML Crash Course',           platform: 'Google',   url: 'https://developers.google.com/machine-learning/crash-course', level: 'beginner' },
  { skill: 'tensorflow',  title: 'TensorFlow Developer Certificate', platform: 'Coursera', url: 'https://coursera.org/professional-certificates/tensorflow-in-practice', level: 'intermediate' },
  { skill: 'postgresql',  title: 'PostgreSQL Full Course',          platform: 'YouTube',  url: 'https://youtube.com/watch?v=qw--VYLpxG4',          level: 'beginner' },
  { skill: 'nextjs',      title: 'Next.js Complete Guide',          platform: 'Udemy',    url: 'https://udemy.com/course/nextjs-react-the-complete-guide', level: 'intermediate' },
  { skill: 'typescript',  title: 'TypeScript Masterclass',          platform: 'Udemy',    url: 'https://udemy.com/course/typescript-the-complete-developers-guide', level: 'intermediate' },
  { skill: 'linux',       title: 'Linux Command Line Basics',       platform: 'Coursera', url: 'https://coursera.org/learn/unix',                   level: 'beginner' },
  { skill: 'github actions', title: 'GitHub Actions CI/CD',        platform: 'YouTube',  url: 'https://youtube.com/watch?v=R8_veQiYBjI',          level: 'intermediate' },
  { skill: 'pytorch',     title: 'PyTorch for Deep Learning',       platform: 'Udemy',    url: 'https://udemy.com/course/pytorch-for-deep-learning', level: 'advanced' },
  { skill: 'deep learning', title: 'Deep Learning Specialization', platform: 'Coursera', url: 'https://coursera.org/specializations/deep-learning', level: 'advanced' },
]