const express = require('express');

const MeetupsService = require('../services/meetups');
const MeetupsDBApi = require('../db/api/meetups');
const wrapAsync = require('../helpers').wrapAsync;

const router = express.Router();

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Meetups:
 *        type: object
 *        properties:

 *          name:
 *            type: string
 *            default: name
 *          location:
 *            type: string
 *            default: location
 *          lat:
 *            type: string
 *            default: lat
 *          long:
 *            type: string
 *            default: long
 *          hasNode:
 *            type: string
 *            default: hasNode
 *          website:
 *            type: string
 *            default: website
 *          city:
 *            type: string
 *            default: city
 *          link1:
 *            type: string
 *            default: link1
 *          link2:
 *            type: string
 *            default: link2
 *          link3:
 *            type: string
 *            default: link3
 *          link4:
 *            type: string
 *            default: link4

 *          type:
 *            type: integer
 *            format: int64
 *          category:
 *            type: integer
 *            format: int64

 */

/**
 *  @swagger
 * tags:
 *   name: Meetups
 *   description: The Meetups managing API
 */

/**
 *  @swagger
 *  /api/meetups:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags: [Meetups]
 *      summary: Add new item
 *      description: Add new item
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                data:
 *                  description: Data of the updated item
 *                  type: object
 *                  $ref: "#/components/schemas/Meetups"
 *      responses:
 *        200:
 *          description: The item was successfully added
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Meetups"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        405:
 *          description: Invalid input data
 *        500:
 *          description: Some server error
 */

router.post('/', async (req, res) => {
  await MeetupsService.create(
    req.body.data,
    req.currentUser,
    true,
    req.headers.referer,
  );
  const payload = true;
  res.status(200).send(payload);
});

/**
 *  @swagger
 *  /api/meetups/{id}:
 *    put:
 *      security:
 *        - bearerAuth: []
 *      tags: [Meetups]
 *      summary: Update the data of the selected item
 *      description: Update the data of the selected item
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Item ID to update
 *          required: true
 *          schema:
 *            type: string
 *      requestBody:
 *        description: Set new item data
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                id:
 *                  description: ID of the updated item
 *                  type: string
 *                data:
 *                  description: Data of the updated item
 *                  type: object
 *                  $ref: "#/components/schemas/Meetups"
 *              required:
 *                - id
 *      responses:
 *        200:
 *          description: The item data was successfully updated
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Meetups"
 *        400:
 *          description: Invalid ID supplied
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Item not found
 *        500:
 *          description: Some server error
 */

router.put(
  '/:id',
  wrapAsync(async (req, res) => {
    await MeetupsService.update(req.body.data, req.body.id, req.currentUser);
    const payload = true;
    res.status(200).send(payload);
  }),
);

/**
 * @swagger
 *  /api/meetups/{id}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags: [Meetups]
 *      summary: Delete the selected item
 *      description: Delete the selected item
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Item ID to delete
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: The item was successfully deleted
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Meetups"
 *        400:
 *          description: Invalid ID supplied
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Item not found
 *        500:
 *          description: Some server error
 */

router.delete(
  '/:id',
  wrapAsync(async (req, res) => {
    await MeetupsService.remove(req.params.id, req.currentUser);
    const payload = true;
    res.status(200).send(payload);
  }),
);

/**
 *  @swagger
 *  /api/meetups:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Meetups]
 *      summary: Get all meetups
 *      description: Get all meetups
 *      responses:
 *        200:
 *          description: Meetups list successfully received
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/Meetups"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Data not found
 *        500:
 *          description: Some server error
 */

router.get(
  '/',
  wrapAsync(async (req, res) => {
    const payload = await MeetupsDBApi.findAll(req.query);

    res.status(200).send(payload);
  }),
);

router.get('/autocomplete', async (req, res) => {
  const payload = await MeetupsDBApi.findAllAutocomplete(
    req.query.query,
    req.query.limit,
  );

  res.status(200).send(payload);
});

/**
 * @swagger
 *  /api/meetups/{id}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Meetups]
 *      summary: Get selected item
 *      description: Get selected item
 *      parameters:
 *        - in: path
 *          name: id
 *          description: ID of item to get
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Selected item successfully received
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Meetups"
 *        400:
 *          description: Invalid ID supplied
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Item not found
 *        500:
 *          description: Some server error
 */

router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    const payload = await MeetupsDBApi.findBy({ id: req.params.id });

    res.status(200).send(payload);
  }),
);

router.use('/', require('../helpers').commonErrorHandler);

module.exports = router;
