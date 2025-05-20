const reviewController = require('../controllers/reviewController');
const Review = require('../models/Review');

jest.mock('../models/Review');

describe('reviewController', () => {
  afterEach(() => jest.clearAllMocks());

  describe('addReview', () => {
    it('should create a review and return it', async () => {
      const mockReview = { rating: 5 };
      Review.create.mockResolvedValue(mockReview);

      const req = { body: { rating: 5 }, user: { _id: 'user1' }, params: { id: 'book1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await reviewController.addReview(req, res);

      expect(Review.create).toHaveBeenCalledWith({ ...req.body, user: req.user._id, book: req.params.id });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockReview);
    });

    it('should return 400 on error', async () => {
      Review.create.mockRejectedValue(new Error('fail'));
      const req = { body: {}, user: { _id: 'user1' }, params: { id: 'book1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await reviewController.addReview(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'fail' });
    });
  });

  describe('updateReview', () => {
    it('should update and return review', async () => {
      const updatedReview = { rating: 4 };
      Review.findOneAndUpdate.mockResolvedValue(updatedReview);

      const req = { params: { id: 'review1' }, user: { _id: 'user1' }, body: { rating: 4 } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await reviewController.updateReview(req, res);

      expect(Review.findOneAndUpdate).toHaveBeenCalledWith({ _id: 'review1', user: 'user1' }, req.body, { new: true });
      expect(res.json).toHaveBeenCalledWith(updatedReview);
    });

    it('should return 404 if review not found', async () => {
      Review.findOneAndUpdate.mockResolvedValue(null);

      const req = { params: { id: 'review1' }, user: { _id: 'user1' }, body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await reviewController.updateReview(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Review not found' });
    });
  });

  describe('deleteReview', () => {
    it('should delete review and return message', async () => {
      Review.findOneAndDelete.mockResolvedValue({});

      const req = { params: { id: 'review1' }, user: { _id: 'user1' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await reviewController.deleteReview(req, res);

      expect(Review.findOneAndDelete).toHaveBeenCalledWith({ _id: 'review1', user: 'user1' });
      expect(res.json).toHaveBeenCalledWith({ message: 'Deleted' });
    });

    it('should return 404 if review not found', async () => {
      Review.findOneAndDelete.mockResolvedValue(null);

      const req = { params: { id: 'review1' }, user: { _id: 'user1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await reviewController.deleteReview(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Review not found' });
    });
  });
});
