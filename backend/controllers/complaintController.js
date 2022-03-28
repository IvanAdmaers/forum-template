const ComplaintService = require('../services/ComplaintService');
const PostService = require('../services/PostService');
const CommentService = require('../services/CommentService');
const ComplaintDTO = require('../dtos/ComplaintDTO');

const { getPaginationData } = require('../utills');

exports.add = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type, id, reason } = req.body.complaint;

    const complaintId = await ComplaintService.add(type, id, reason, userId);

    return res.status(201).json({ complaint: { id: complaintId } });
  } catch (error) {
    return next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page: pageQuery, limit: limitQuery } = req.query;

    const totalCount = await ComplaintService.count();

    const { page, limit, startIndex, numberOfPages } = getPaginationData(
      pageQuery,
      limitQuery,
      totalCount
    );

    const complaintsList = await ComplaintService.list(limit, startIndex);

    const complaints = complaintsList.map(
      (complaint) => new ComplaintDTO(complaint, userId)
    );

    return res.json({
      currentPage: page,
      numberOfPages,
      complaints,
    });
  } catch (error) {
    return next(error);
  }
};

exports.decision = async (req, res, next) => {
  try {
    const { block, id } = req.body.decision;

    if (!block) {
      await ComplaintService.delete(id);

      return res.status(202).json({ success: true, id });
    }

    const complaint = await ComplaintService.get(id);

    const postId = complaint.post?._id;
    const commentId = complaint.comment?._id;

    await Promise.all([
      ComplaintService.delete(id),
      postId ? PostService.delete(postId) : CommentService.delete(commentId),
    ]);

    return res.status(202).json({ success: true, id });
  } catch (error) {
    return next(error);
  }
};
