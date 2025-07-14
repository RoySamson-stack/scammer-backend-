const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const reportValidation = require('../../validations/report.validation');//change this to report
const reportController = require('../../controllers/report.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(reportValidation.createReport), reportController.createReport)
  .get(auth('getReports'), validate(reportValidation.getReports), reportController.getReports);

router
  .route('/:reportId')
  .get(validate(reportValidation.getReport), reportController.getReport)
  .patch(
    // auth('manageReports'), 
    validate(reportValidation.updateReport), reportController.updateReport)
  .delete(
    // auth('manageReports'), 
    validate(reportValidation.deleteReport), reportController.deleteReport);

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
 *     description: Only admins can create other reports.
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
 *               - scammerInfo
 *               - amountLost
 *               - dateOfIncident
 *               - evidence        
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the report
 *               description:
 *                 type: string
 *                 description: Detailed description of the incident
 *               type:
 *                 type: string
 *                 description: Type of scam
 *               rscammerInfo:
 *                 type: string
 *                 description: Information about the scammer
 *               amountLost:
 *                 type: number
 *                 description: Amount of money lost
 *               dateOfIncident:
 *                 type: string
 *                 format: date
 *                 description: Date when the incident occurred
 *               evidence:
 *                 type: string
 *                 description: Evidence file name or URL
 *             example:
 *               title: scammed using a fake job scam
 *               description: something to note on the fake job scam conned money
 *               type: fake job
 *               rscammerInfo: 070264178
 *               amountLost: 15000
 *               dateOfIncident: 2023-10-12
 *               evidence: scam.jpg
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Report'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all reports
 *     description: Only admins can retrieve all reports.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Report name
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Report role
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
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
 * /reports/{id}:
 *   get:
 *     summary: Get a report
 *     description: Logged in reports can fetch only their own report information. Only admins can fetch other reports.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a report
 *     description: Logged in reports can only update their own information. Only admins can update other reports.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Report'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a report
 *     description: Logged in reports can delete only themselves. Only admins can delete other reports.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Report id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
