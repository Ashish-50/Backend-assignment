# Backend-assignment
AudioBook assignment

This is an audiobook application project developed for the Poshn assignment. It includes features such as user authentication, audiobook management, category management, and user progress tracking.

Installation
Clone the repository to your local machine.
Install dependencies using npm:

 npm install

To start the server, run:
 npm start


Or to run in development mode with nodemon:
 npm run dev

Features
1. User authentication and authorization using JWT.
2. Register and login endpoints.
3. Category management with CRUD operations.
4. Audiobook management with CRUD operations.
5. User progress tracking for audiobooks.
6. Personalization features like playback speed and volume level.
7. Last listened position tracking for audiobooks.
8. Browse audiobooks by category.
9. Filter audiobooks by price, language, new release, and duration.
10. Search audiobooks by title or author name.



...ENV
MONGODB_URI=mongodb://127.0.0.1:27017/user
PORT=3001
ACCESS_TOKEN_SECRET=thisisJWTSECRETTOKENTHISSHOUDLBE32bit
REFRESH_TOKEN_SECRET=thisisJWTSECRETTOKENTHISSHOUDLBE32bit
ACCESS_TOKEN_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=1d
ORIGIN=*
