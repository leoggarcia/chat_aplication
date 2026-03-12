# Italian Chef Chat Application

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%233178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%232496ED.svg?style=for-the-badge&logo=docker&logoColor=white)
![Google Gemini](https://img.shields.io/badge/google%20gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)

This project is a full-stack chat application that allows users to interact with an AI-powered Italian Chef. The Chef is an expert in traditional Italian cuisine, offering recipes, culinary techniques, and gastronomic tips in real-time.

## Features

- **AI Italian Chef**: Specialized AI persona that acts as a professional Italian chef.
- **Real-time Streaming**: Responses are streamed directly from Google's Gemini LLM for a fluid user experience.
- **Rate Limiting**: Integrated security guard to prevent API abuse.
- **Modern UI**: Responsive and clean chat interface built with React 19 and TailwindCSS 4.
- **Dockerized Backend**: Easily deploy and run the backend service using Docker.

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing.

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/leoggarcia/chat_aplication.git
    cd chat_aplication
    ```

2.  **Set up Environment Variables:**
    Create a `.env` file in the `chat_aplication_back` directory:
    ```bash
    cp chat_aplication_back/.env.example chat_aplication_back/.env
    ```
    Edit the `.env` file and add your `LLM_API_KEY` and `LLM_MODEL`:
    ```env
    LLM_API_KEY=your_gemini_api_key_here
    LLM_MODEL=gemini-2.0-flash-exp
    ```

3.  **Install Backend Dependencies:**
    ```bash
    cd chat_aplication_back
    npm install
    cd ..
    ```

4.  **Install Frontend Dependencies:**
    ```bash
    cd chat_aplication_front
    npm install
    cd ..
    ```

### Running the Application

You can run the application services individually or using Docker for the backend.

1.  **Start the Backend (via Docker):**
    ```bash
    docker-compose up -d
    ```
    Alternatively, run it with npm:
    ```bash
    cd chat_aplication_back
    npm run start:dev
    ```
    The backend will be running on `http://localhost:3000`.

2.  **Start the Frontend:**
    ```bash
    cd chat_aplication_front
    npm run dev
    ```
    The frontend will be available at the URL provided by Vite (usually `http://localhost:5173`).

## Future Improvements

-   **Chat History**: Implement a database (PostgreSQL/MongoDB) to save and retrieve previous conversations.
-   **User Authentication**: Add JWT-based authentication for personalized chef experiences.
-   **Voice Integration**: Enable voice-to-text and text-to-speech for a hands-free cooking assistant.
-   **Recipe Export**: Feature to export generated recipes as PDF or Markdown files.

## Technologies Used

*   **Backend**: [NestJS](https://nestjs.com/)
*   **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
*   **Styling**: [TailwindCSS 4](https://tailwindcss.com/)
*   **AI Engine**: [Google Gemini Pro](https://deepmind.google/technologies/gemini/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Containerization**: [Docker](https://www.docker.com/)
