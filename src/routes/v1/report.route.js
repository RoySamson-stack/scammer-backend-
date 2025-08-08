const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const reportValidation = require('../../validations/report.validation');
const reportController = require('../../controllers/report.controller');

const router = express.Router();

router
  .route('/create')
  .post(auth('createReport'), validate(reportValidation.createReport), reportController.createReport)
  // .get(auth('getReports'), validate(reportValidation.getReports), reportController.getReports);

router
  .route('/allReports')
  .get(auth('getReports'), validate(reportValidation.getReports), reportController.getReports);

router
  .route('/my-reports')
  .get(auth('getUserReports'), validate(reportValidation.getUserReports), reportController.getUserReports);

// router
//   .route('/user/:reportId')
//   .get(auth('getUserReports'), validate(reportValidation.getUserReports), reportController.getUserReports);

router
  .route('/:reportId')
  .get(validate(reportValidation.getReport), reportController.getReport);

router
  .route('/:reportId/update')
  .patch(auth('updateReport'), validate(reportValidation.updateReport), reportController.updateReport);

router
  .route('/:reportId/delete')  
  .delete(auth('deleteReport'), validate(reportValidation.deleteReport), reportController.deleteReport);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Report management and retrieval
 */

/**
 * @swagger
 * /reports:
 *   post:
 *     summary: Create a report
 *     description: Authenticated users can create reports.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the report
 *               description:
 *                 type: string
 *                 description: Detailed description of the incident
 *               type:
 *                 type: string
 *                 enum: [investment_scam, phishing, romance_scam, lottery_scam, scam_token, fake_aridrop, other]
 *                 description: Type of scam
 *               scammer_name:
 *                 type: string
 *                 description: Name of the scammer
 *               scammer_phone:
 *                 type: string
 *                 description: Phone number of the scammer
 *               location:
 *                 type: string
 *                 description: Location where scam occurred
 *             example:
 *               title: "Fake Investment Opportunity"
 *               description: "Someone contacted me promising high returns on a fake investment scheme"
 *               type: "investment_scam"
 *               scammer_name: "John Doe"
 *               scammer_phone: "070264178"
 *               location: "Nairobi"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Report'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all reports
 *     description: Get all reports with optional filtering
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by report type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by report status
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. createdAt:desc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of reports
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /reports/my-reports:
 *   get:
 *     summary: Get current user's reports
 *     description: Get all reports created by the current authenticated user
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by report type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by report status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. createdAt:desc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of reports
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /reports/{reportId}:
 *   get:
 *     summary: Get a report
 *     description: Get a specific report by ID
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *         description: Report id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Report'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a report
 *     description: Update a report (only report owner or admin)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *         description: Report id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [open, in-progress, closed, pending]
 *               scammer_name:
 *                 type: string
 *               scammer_phone:
 *                 type: string
 *               location:
 *                 type: string
 *             example:
 *               title: "Updated Report Title"
 *               status: "in-progress"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Report'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a report
 *     description: Delete a report (only report owner or admin)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *         description: Report id
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */