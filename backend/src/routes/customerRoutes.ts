import { Router } from 'express';
import {
  uploadDataset,
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/customerController';
import { trainModel, predictCustomerSegment, getMLClusters } from '../controllers/mlController';
import { upload } from '../middleware/upload';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.post('/upload', upload.single('file'), uploadDataset);
router.get('/customers', getCustomers);
router.get('/customer/:id', getCustomerById);
router.post('/customer', createCustomer);
router.put('/customer/:id', updateCustomer);
router.delete('/customer/:id', deleteCustomer);

// ML endpoints
router.post('/train', trainModel);
router.post('/predict', predictCustomerSegment);
router.get('/clusters', getMLClusters);

export default router;
