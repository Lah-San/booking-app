# AirBooknC

AirBooknC is a web application that enables users to offer and reserve accommodations for tourists and travelers, or to explore and book places, similar to AirBnB.

## Features

- User authentication and authorization using JWT
- CRUD operations for places and bookings
- Image upload and storage using AWS S3
- Responsive design using Tailwind CSS
- Front-end routing using React Router
- Data fetching and state management using React Query
- Form validation and error handling using React Hook Form and Yup

## Technologies

- Front-end: React.js, Vite, Tailwind CSS
- Back-end: Node.js, Express.js, MongoDB
- Deployment: Vercel, MongoDB Atlas

## Installation

To run this project locally or on a server, you need to have Node.js and MongoDB installed on your machine.

1. Clone this repository or download the zip file.
2. Navigate to the project directory and install the dependencies using `npm install` or `yarn install`.
3. Create a `.env` file in both `api` and `client` folders and add the following environment variables:

   ### api

   - MONGO_URL: The connection string to your MongoDB database
   - S3_ACCESS_KEY: The access key for your AWS S3 bucket
   - S3_SECRET_ACCESS_KEY: The secret key for your AWS S3 bucket
   - JWTKEY: The secret key for generating JWT tokens
   - VITE_API_BASE_URL: The base URL for your API endpoints (e.g. http://localhost:3000/api)

   ### client

   - VITE_API_BASE_URL: The base URL for your API endpoints (e.g. http://localhost:3000/api)

4. Start the development server using `npm run dev` or `yarn dev` in both `api` and `client` folders.
5. Open your browser and go to http://localhost:3000 to see the web app in action.

## Contribution

If you want to contribute to this project or report any issues, please follow these steps:

1. Fork this repository or create a new branch.
2. Make your changes or additions.
3. Create a pull request or merge your branch to the main branch.
4. Wait for the review and approval.

## License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

## Acknowledgements

This project was inspired by [AirBnB](https://www.airbnb.com/), a popular online marketplace for lodging and tourism.
