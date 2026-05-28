# ReFlow: Retail Product Return & Refund Management System

Welcome to the **ReFlow** repository. ReFlow is a comprehensive, multi-role web application designed to streamline the e-commerce return and refund lifecycle. It bridges the gap between customers returning items, support agents conducting physical inspections, and administrators authorizing financial refunds, all tied together with a real-time notification system and analytics dashboard.

## 🎥 Demo Video

Check out a full walkthrough of the ReFlow platform in action:

[![ReFlow Demo Video](https://img.shields.io/badge/Watch-Demo_Video-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://your-demo-video-link.com)

## 🔗 Project Links

- **Live Deployment:** [refundflow.netlify.app](https://refundflow.netlify.app/login)
- **Demo Video:** [Insert Video Link Here]
- **GitHub Repository:** https://github.com/mandapati-prasad/ReFlow.git

## 🔐 Demo Credentials

To explore the different role-based views, use the following credentials:

- **Admin:** admin@gmail.com / 123456
- **Support Agent:** support@gmail.com / 123456
- **Customer:** arjun@gmail.com / 123456

## 🚀 Quick Start / Installation

To get ReFlow running locally on your machine, follow these steps:

**1. Clone the repository**

```bash
git clone https://github.com/mandapati-prasad/ReFlow.git
cd reflow
```

**2. Install Backend Dependencies**

```bash
cd backend
npm install
```

**3. Install Frontend Dependencies**

```bash
cd ../frontend
npm install
```

**4. Start the Development Servers**
Open two separate terminal windows.

_Terminal 1 (Backend):_

```bash
cd backend
npm run dev
```

_Terminal 2 (Frontend):_

```bash
cd frontend
npm run dev
```

## 🔐 Environment Variables

To run this project, you will need to add the following environment variables to your `backend/.env` file. Do **not** commit this file to version control.

```env
# Server Configuration
PORT=5000

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
```

## 📂 Project Folder Structure

Here is the complete architecture of the ReFlow repository:

```text
Reflow/
├── backend/                 # Node.js & Express API
│   ├── database/            # SQLite setup, schema, and seed files
│   ├── middleware/          # Auth, Role guards, and Upload handlers
│   ├── routes/              # API Endpoints (auth, returns, refunds, etc.)
│   ├── uploads/             # Local storage for profiles and return evidence images
│   ├── utils/               # Helper logic (e.g., createNotification)
│   ├── .env                 # Environment variables
|   ├── fix.js               # Encrypts the password in user table
│   ├── returns.db           # SQLite database file
│   └── server.js            # Backend entry point
│
└── frontend/                # React application (Vite)
    ├── public/              # Static assets (favicons, icons)
    ├── src/
    │   ├── assets/          # Images and SVGs used in UI
    │   ├── components/      # Reusable UI components (Sidebar, Badges, Charts)
    │   ├── context/         # AuthContext (JWT handling, state management)
    │   ├── pages/           # Role-based Views (Dashboard, Login, Returns, etc.)
    │   ├── services/        # Axios API clients separated by domain
    │   ├── styles/          # Global styles and theme definitions
    │   ├── App.jsx          # React Router setup
    │   └── main.jsx         # React DOM rendering
    ├── package.json
    └── vite.config.js
```

## 🛠 Tech Stack

### Frontend

- **React.js (Vite):** Core UI framework.
- **Styled-Components:** CSS-in-JS for modular, scoped, and theme-aware styling.
- **React Router DOM:** Handling multi-role protected routing.
- **React Query (@tanstack/react-query):** Server-state management, caching, and background data fetching.
- **Recharts:** Rendering dynamic analytical charts on the staff dashboard.
- **React Toastify:** For transient success/error UI notifications.
- **Date-FNS:** Robust date and time formatting.
- **React Icons:** Consistent SVG iconography.

### Backend

- **Node.js & Express.js:** RESTful API architecture.
- **SQLite:** Relational database management.
- **JSON Web Tokens (JWT):** Secure, stateless authentication and role authorization.
- **Bcrypt:** Password hashing and security.
- **Multer:** Handling multipart/form-data for user image uploads (return evidence).

## 👥 User Roles & Permissions

ReFlow employs strict Role-Based Access Control (RBAC) to ensure security and operational separation of concerns.

### 1. Customer

- **Returns:** Can initiate a new return request, upload image evidence, and provide descriptions.
- **Tracking:** Can view the real-time status of their returns and refunds on their dashboard.
- **Communication:** Can leave comments on active return requests to communicate with staff.
- **Notifications:** Receives automated alerts when staff reply, when a return is approved, and when a refund is processed.

### 2. Support Agent

- **Queue Management:** Has access to the Inspection Queue to view incoming returns.
- **Physical Inspection:** Can fill out detailed Inspection Reports (product condition, packaging, accessories) once the physical item arrives at the warehouse.
- **Status Updates:** Can advance a return from `Requested` to `Under Review`.
- **Communication:** Can respond to customer comments.
- **Alerts:** Notified automatically when a new return is submitted by a customer or a customer leaves a comment.

### 3. Administrator (Admin)

- _Inherits all Support Agent privileges._
- **Financial Authority:** The only role capable of authorizing and processing actual monetary refunds to the customer.
- **Final Approvals:** Can transition return statuses to `Approved`, `Rejected`, or `Refunded`.
- **System Analytics:** Has access to a high-level dashboard displaying system-wide volume trends (Bar Charts), status distributions (Pie Charts), and total financial metrics.
- **User Management:** Can view all users and deactivate/activate accounts. (Deactivated users are blocked at the authentication layer).

## 🔄 Overall Project Workflow

1.  **Initiation:** A Customer submits a return request for a previously purchased item, uploading a photo and reason.
2.  **Staff Alert:** The backend dynamically generates a notification for all Support Agents and Admins, incrementing the unread badge in their sidebar.
3.  **Inspection Phase:** A Support Agent picks up the item from the physical warehouse, navigates to the Inspection Queue, and submits an Inspection Report evaluating the item's condition.
4.  **Admin Handoff:** The submission of the inspection report automatically triggers a notification to Admins that the item is ready for review.
5.  **Approval:** The Admin reviews the inspection report and customer notes, changing the status to `Approved`.
6.  **Refund Processing:** The Admin navigates to the Pending Refunds queue, confirms the financial details, and issues the refund.
7.  **Resolution Alert:** The Customer receives a final notification that their money has been successfully refunded, and the item's status updates to `Refunded`.

## 🗄️ Database Schema & Tables

The SQLite database is normalized to track the full history of an item's return journey.

### `users`

- `id` (PK)
- `full_name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `role` (Enum: 'customer', 'support_agent', 'admin')
- `status` (Enum: 'active', 'inactive') - _Used for Admin-level access revoking._
- `created_at` (Timestamp)

### `return_requests`

- `id` (PK)
- `return_number` (String, e.g., 'RET-168... ')
- `order_item_id` (FK -> order_items)
- `customer_id` (FK -> users)
- `reason` (String)
- `description` (Text)
- `image_url` (String, Path to uploaded file)
- `support_agent_id` (FK -> users)
- `status` (Enum: 'Requested', 'Under Review', 'Approved', 'Rejected', 'Refunded')
- `created_at` (Timestamp)

### `return_status_logs`

- _Tracks the lifecycle of a return for auditing purposes._
- `id` (PK)
- `return_request_id` (FK -> return_requests)
- `status` (String)
- `changed_by` (FK -> users)
- `created_at` (Timestamp)

### `inspection_reports`

- `id` (PK)
- `return_request_id` (FK -> return_requests)
- `inspector_name` (String)
- `product_condition` (String)
- `packaging_condition` (String)
- `accessories_included` (String)
- `inspection_notes` (Text)
- `inspection_result` (String)
- `created_at` (Timestamp)

### `refunds`

- `id` (PK)
- `refund_number` (String, e.g., 'REF-168... ')
- `return_request_id` (FK -> return_requests)
- `refund_amount` (Decimal)
- `refund_status` (Enum: 'Processing', 'Completed', 'Failed')
- `payment_method` (String)
- `created_at` (Timestamp)

### `comments`

- `id` (PK)
- `return_request_id` (FK -> return_requests)
- `user_id` (FK -> users)
- `comment` (Text)
- `created_at` (Timestamp)

### `notifications`

- `id` (PK)
- `user_id` (FK -> users)
- `title` (String)
- `message` (Text)
- `type` (String)
- `is_read` (Boolean/Integer: 0 or 1)
- `created_at` (Timestamp)

## 🔮 Future Enhancements

ReFlow is an evolving platform. Planned features for the roadmap include:

- **💳 Stripe API Integration:** Moving from mock system refunds to actual financial transaction processing.
- **✉️ Email Alerts (SendGrid):** Sending real email notifications to customers alongside the in-app alerts.
- **🤖 AI Support Chatbot:** Integrating an LLM to handle Tier-1 customer questions and auto-evaluate initial return reasons.
- **📦 Shipping API Integration:** Automatically generating return shipping labels (FedEx/UPS/USPS) for approved requests.
