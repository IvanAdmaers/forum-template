const { body, validationResult } = require('express-validator');

const PostService = require('../services/PostService');
const CommentService = require('../services/CommentService');
const ComplaintService = require('../services/ComplaintService');

const { isValidObjectId } = require('../utills');

const complaintTypes = ['post', 'comment'];
const [post] = complaintTypes;

const complaintValidator = [
  body('complaint.type')
    .isIn(complaintTypes)
    .withMessage('Complant type is incorrect')
    .bail(),

  body('complaint.reason')
    .isString()
    .withMessage('Complant reason must be a string')
    .bail()

    .isLength({ min: 1, max: 300 })
    .withMessage('Complant reason length problem')
    .bail(),

  body('complaint.id')
    .isString()
    .withMessage('Complant id must be a string')
    .bail()
    .custom(async (id, { req }) => {
      const { type } = req.body.complaint;

      const isValid = isValidObjectId(id);

      if (!isValid) {
        throw new Error('Object id is invalid');
      }

      // Check post or comment exists
      const exists = await (type === post
        ? PostService.findById(id)
        : CommentService.get(id));

      if (!exists) {
        throw new Error(`Failed to find ${type}`);
      }

      // Check user previous complaints
      const previousComplaints = await ComplaintService.exists(type, id);

      if (previousComplaints) {
        throw new Error(`We're already checking this ${type}`);
      }

      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    return next();
  },
];

module.exports = complaintValidator;
