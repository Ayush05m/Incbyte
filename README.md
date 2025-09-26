# Sweet Shop Management System

This is a web application designed to manage a sweet shop's inventory. It provides a seamless experience for both administrators managing the products and customers browsing and purchasing them. The system features robust user authentication, comprehensive product management, a dynamic shopping cart, and secure payment processing through Razorpay.

## Core Features

-   **User Authentication:** Secure registration and login for both administrators and customers.
-   **Admin Dashboard:** A powerful interface for admins to perform full CRUD (Create, Read, Update, Delete) operations on sweets.
-   **Product Management:** Admins can easily add new sweets, upload images, update details, and manage stock levels.
-   **Customer Catalog:** Customers can browse a visually appealing catalog of all available sweets, view detailed descriptions, and see pricing.
-   **Shopping Cart:** A fully functional shopping cart allows users to add items, adjust quantities, and view their selections before checkout.
-   **Payment Integration:** Secure and reliable payment processing is handled through an integration with Razorpay.
-   **Advanced Search & Filtering:** Users can quickly find what they're looking for with powerful search functionality and filters for category and price range.

## Technical Stack

This project is built with a modern, robust, and scalable tech stack:

-   **Frontend:** [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/) and [Vite](https://vitejs.dev/) for a fast and efficient development experience.
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) for a beautiful, responsive, and accessible user interface.
-   **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) for simple and effective global state management.
-   **Data Fetching:** [React Query (TanStack Query)](https://tanstack.com/query/v4) for efficient data fetching, caching, and synchronization.
-   **Routing:** [React Router](https://reactrouter.com/) for seamless client-side navigation.
-   **Form Handling:** [React Hook Form](https://react-hook-form.com/) and [Zod](https://zod.dev/) for powerful and type-safe form validation.

## AI-Assisted Development

This project was developed in collaboration with **Dyad**, an AI-powered coding assistant. The entire application, from initial setup to final features, was built through a conversational development process. The AI was responsible for:

-   **Generating Code:** Writing React components, services, and state management logic based on natural language prompts.
-   **Implementing Features:** Building out core functionalities like user authentication, product management, and the shopping cart.
-   **Styling and UI:** Applying Tailwind CSS and shadcn/ui to create a modern and responsive user interface.
-   **Debugging and Refactoring:** Identifying and fixing bugs, as well as improving code quality and structure.

This project serves as a demonstration of an AI-driven development workflow, where the AI acts as a real-time pair programmer to accelerate the creation of complex web applications.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or later)
-   npm or your package manager of choice

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/sweet-shop.git
    cd sweet-shop
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of your project and add your Razorpay Key ID:
    ```env
    VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:8080`.

## API Endpoints

This frontend application interacts with a separate backend service. Here are the key endpoints it consumes:

-   `POST /api/auth/register`: User registration.
-   `POST /api/auth/login`: User login.
-   `GET /api/users/me`: Fetch current user data.
-   `GET /api/sweets/`: Fetch all sweets (with optional query params for filtering).
-   `POST /api/sweets/`: Create a new sweet (admin only).
-   `PUT /api/sweets/{id}`: Update an existing sweet (admin only).
-   `DELETE /api/sweets/{id}`: Delete a sweet (admin only).
-   `POST /api/purchases/initiate`: Initiate a purchase and create a Razorpay order.
-   `POST /api/purchases/verify`: Verify the payment signature after a successful transaction.