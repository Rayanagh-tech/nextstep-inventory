const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Summary KPIs
router.get('/stats', dashboardController.getDashboardStats);

// Historical trends
router.get('/vm-trends', dashboardController.getVmTrends);
router.get('/datacenter-metrics', dashboardController.getDatacenterMetrics);
router.get('/storage-usage', dashboardController.getStorageUsage);

// System health and activity
router.get('/heartbeats', dashboardController.getSystemHeartbeats);
router.get('/activity', dashboardController.getRecentActivity);
router.get('/vm-metrics', dashboardController.getVmMetrics);


module.exports = router;
