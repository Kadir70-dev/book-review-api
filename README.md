   #  Book Review APIS.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
                                                                                                                                                                                                                                                                                                                                                                                                                                         
                   
  
                                                                                  A RESTful API built with Node.js, Express.js, and MongoDB to manage books and user reviews. Includes JWT-based authentication and search functionality.

---

##  Tech Stack.   

- Node.js + Express
- MongoDB + Mongoose
- JWT for Authentication

---

##  Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/Kadir70-dev/book-review-api.git
   cd book-review-api
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create `.env` file**

   ```env
   PORT=5000
   MONGODB_URI=""
   JWT_SECRET=your_secret_key
   ```

4. **Start the server**

   ```bash
   npm run dev
   ```

---

##  Auth Endpoints

* `POST /signup` → Register new user
* `POST /login` → Get JWT token

---

##  Book Routes

* `POST /books` → Add book (auth required)
* `GET /books` → List books (with pagination & filters)
* `GET /books/:id` → Book details + average rating & reviews
* `GET /search?query=term` → Search books by title or author

---

##  Review Routes

* `POST /books/:id/reviews` → Add review (auth required)
* `PUT /reviews/:id` → Update own review
* `DELETE /reviews/:id` → Delete own review

---

##  Sample API Request (Postman/cURL)

```bash
curl -X POST http://localhost:5000/signup \
-H "Content-Type: application/json" \
-d '{"username":"john","email":"john@example.com","password":"123456"}'
```

---

##  Sample Schema

**User:** `username`, `email`, `password`
**Book:** `title`, `author`, `genre`, `[reviews]`
**Review:** `user`, `book`, `rating`, `comment`

---

##  Author

Abdul Kadir
 [kadirab1999@gmail.com](mailto:kadirab1999@gmail.com)
[GitHub](https://github.com/Kadir70-dev)

---+++---------------
