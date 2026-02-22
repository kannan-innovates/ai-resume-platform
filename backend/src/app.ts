import express from 'express';
import cors from 'cors';

import resumeRoutes from './modules/resume/resume.routes'
import aiAnalysisRoutes from './modules/ai-analysis/ai-analysis.routes';
import skillGapRoutes from './modules/skill-gap/skill-gap.routes';
import careerPivotRoutes from './modules/career-pivot/career-pivot.routes';
import adminVaultRoutes from './modules/admin-vault/admin-vault.routes';
import userVaultRoutes from './modules/admin-vault/user-vault.routes';
import jobRoutes from './modules/job-recommendation/job-recommendation.routes';
import cvTailoringRoutes from './modules/cv-tailoring/cv-tailoring.routes'
import authRoutes from './modules/auth/auth.routes';
import { protect, adminOnly } from './shared/middleware/auth.middleware';

const app = express();
app.use(cors());
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);

app.use('/api/resumes', resumeRoutes);
app.use('/api/analysis', protect, aiAnalysisRoutes);
app.use('/api/skill-gap', protect, skillGapRoutes);
app.use('/api/career-pivot', protect, careerPivotRoutes);
app.use('/api/admin-vault', protect, userVaultRoutes); // user-readable GET /resume/:id MUST come first
app.use('/api/admin-vault', protect, adminOnly, adminVaultRoutes);
app.use('/api/jobs', protect, jobRoutes);
app.use('/api/cv', protect, cvTailoringRoutes);


// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

export default app