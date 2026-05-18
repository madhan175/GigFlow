import { Router } from 'express';
import {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from '../controllers/leadsController';
import { protect, restrictTo } from '../middlewares/auth';
import { validateLead, validateLeadUpdate } from '../middlewares/validation';

const router = Router();

// Protect all routes under leads
router.use(protect);

// CSV Export route - placed before general id patterns to prevent routing overrides
router.get('/export/csv', exportLeadsCSV);

// Lead CRUD Operations
router.route('/')
  .get(getLeads)
  .post(validateLead, createLead);

router.route('/:id')
  .get(getLead)
  .put(validateLeadUpdate, updateLead)
  .delete(restrictTo('admin'), deleteLead); // Role-Based Access Control: Deletion is Admin only

export default router;
