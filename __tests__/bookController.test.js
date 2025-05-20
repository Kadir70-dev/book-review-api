const bookController = require('../controllers/bookController');
const Book = require('../models/Book');
const Review = require('../models/Review');

jest.mock('../models/Book');
jest.mock('../models/Review');

describe('bookController', () => {
  afterEach(() => jest.clearAllMocks());

  describe('addBook', () => {
    it('should create book and return it', async () => {
      const mockBook = { title: 'Test Book' };
      Book.create.mockResolvedValue(mockBook);

      const req = { body: { title: 'Test Book' }, user: { _id: 'user1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await bookController.addBook(req, res);

      expect(Book.create).toHaveBeenCalledWith({ ...req.body, createdBy: req.user._id });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockBook);
    });

    it('should return 400 on error', async () => {
      Book.create.mockRejectedValue(new Error('fail'));
      const req = { body: {}, user: { _id: 'user1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await bookController.addBook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'fail' });
    });
  });

  describe('getBooks', () => {
    it('should return filtered books with pagination', async () => {
      const mockBooks = [{ title: 'Book1' }, { title: 'Book2' }];
      Book.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockBooks),
      });

      const req = { query: { author: 'John', page: '1', limit: '2' } };
      const res = { json: jest.fn() };

      await bookController.getBooks(req, res);

      expect(Book.find).toHaveBeenCalledWith({ author: /John/i });
      expect(res.json).toHaveBeenCalledWith(mockBooks);
    });
  });

  describe('getBookById', () => {
    it('should return book with reviews and avgRating', async () => {
      const book = { _id: 'b1', title: 'Test' };
      const reviews = [{ rating: 4 }, { rating: 5 }];
      Book.findById = jest.fn().mockResolvedValue(book);
      Review.find = jest.fn().mockResolvedValue(reviews);

      const req = { params: { id: 'b1' } };
      const res = { json: jest.fn() };

      await bookController.getBookById(req, res);

      expect(Book.findById).toHaveBeenCalledWith('b1');
      expect(Review.find).toHaveBeenCalledWith({ book: 'b1' });
      expect(res.json).toHaveBeenCalledWith({
        book,
        avgRating: 4.5,
        reviews,
      });
    });
  });

  describe('searchBooks', () => {
    it('should return books matching search query', async () => {
      const mockBooks = [{ title: 'Alpha' }, { author: 'Beta' }];
      Book.find.mockResolvedValue(mockBooks);

      const req = { query: { q: 'a' } };
      const res = { json: jest.fn() };

      await bookController.searchBooks(req, res);

      expect(Book.find).toHaveBeenCalledWith({
        $or: [
          { title: /a/i },
          { author: /a/i },
        ],
      });
      expect(res.json).toHaveBeenCalledWith(mockBooks);
    });
  });
});
