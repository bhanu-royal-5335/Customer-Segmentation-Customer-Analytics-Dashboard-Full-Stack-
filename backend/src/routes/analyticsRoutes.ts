import { Router } from 'express';
import { getDashboardSummary, getAnalyticsCharts, getAIInsights } from '../controllers/analyticsController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/dashboard', getDashboardSummary);
router.get('/analytics', getAnalyticsCharts);
router.get('/insights', getAIInsights);

export default router;
