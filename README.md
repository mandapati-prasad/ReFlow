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
Open four separate terminal windows.

_Terminal 1 (Backend):_

```bash
cd backend
npm run dev
```

_Terminal 2 (Database Setup):_

```bash
sqlite3 returns.db
.read ./database/schema.sql
.read ./database/seed.sql
```

_Terminal 3 (Password Encryption):_

```bash
cd backend
node fix.js
```

_Terminal 4 (Frontend):_

```bash
cd frontend
npm run dev
```

## 🔐 Environment Variables

To run this project, you will need to add the following environment variables to your `backend/.env` file and `frontend/.env` file.

**_ backend/.env _**

```env
# Server Configuration
PORT=5000

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
```

**_ frontend/.env _**

```env
#api base url
VITE_API_URL = http://localhost:5000/api

#backend images base url
VITE_BACKEND_IMG_URL = http://localhost:5000/
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
- `phone` (String)
- `address` (String)
- `profile_image` (String)
- `status` (Enum: 'active', 'inactive') - _Used for Admin-level access revoking._
- `created_at` (Timestamp)

### `orders`

- `id` (PK)
- `order_number` (String, e.g., 'ORD-001...')
- `customer_id` (FK -> users)
- `total_amount` (Decimal)
- `status` (String)
- `created_at` (Timestamp)

### `order_items`

- `id` (PK)
- `order_id` (FK -> orders)
- `product_name` (String)
- `category` (String)
- `quantity` (Decimal)
- `price` (Decimal)
- `image_url` (String)

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

## 📡 API Endpoints Summary

Below is a detailed summary of the available REST API endpoints across the system, categorized by their functional domain.

| Method     | End Point                          | Purpose                                                                      |
| :--------- | :--------------------------------- | :--------------------------------------------------------------------------- |
| **POST**   | `/api/auth/login`                  | Authenticate a user and receive an access token.                             |
| **GET**    | `/api/dashboard/customer`          | Retrieve metrics and data for the customer dashboard.                        |
| **GET**    | `/api/dashboard/support`           | Retrieve metrics and data for the support agent dashboard.                   |
| **GET**    | `/api/dashboard/admin`             | Retrieve metrics and data for the administrator dashboard.                   |
| **GET**    | `/api/orders`                      | Retrieve a paginated list of all orders.                                     |
| **GET**    | `/api/orders/:id`                  | Retrieve comprehensive details for a specific order.                         |
| **GET**    | `/api/orders/:id/items`            | Retrieve a list of all items associated with a specific order.               |
| **GET**    | `/api/order-items/:id`             | Retrieve detailed information for a specific order item.                     |
| **GET**    | `/api/returns`                     | Retrieve a list of all return requests.                                      |
| **GET**    | `/api/returns/:id`                 | Retrieve detailed information for a specific return request.                 |
| **POST**   | `/api/returns`                     | Submit a new return request.                                                 |
| **PUT**    | `/api/returns/:id/status`          | Update the lifecycle status of a specific return request.                    |
| **DELETE** | `/api/returns/:id`                 | Cancel or delete a return request.                                           |
| **GET**    | `/api/returns/:id/comments`        | Retrieve all discussion comments for a specific return request.              |
| **POST**   | `/api/returns/:id/comments`        | Add a new comment to a specific return request.                              |
| **GET**    | `/api/refunds`                     | Retrieve a list of pending or processed refunds.                             |
| **POST**   | `/api/refunds`                     | Initiate or process a new refund transaction.                                |
| **PUT**    | `/api/refunds/:id/status`          | Update the approval/processing status of a specific refund.                  |
| **GET**    | `/api/notifications`               | Retrieve a list of system notifications for the authenticated user.          |
| **POST**   | `/api/notifications/read-all`      | Mark all unread notifications as read for the user.                          |
| **GET**    | `/api/inspection/:returnRequestId` | Retrieve the inspection outcome/details for a specific return request.       |
| **POST**   | `/api/inspection`                  | Submit a new quality inspection report for a returned item.                  |
| **GET**    | `/api/users`                       | Retrieve a list of all registered users (admin only).                        |
| **GET**    | `/api/users/profile`               | Retrieve the profile details of the currently authenticated user.            |
| **PUT**    | `/api/users/profile-image`         | Upload or update the authenticated user's profile image.                     |
| **PUT**    | `/api/users/:id/status`            | Update the active/suspended status of a specific user account.               |
| **DELETE** | `/api/users/:id`                   | Permanently delete a user account from the system.                           |
| **GET**    | `/api/settings`                    | Retrieve global application or user-specific settings.                       |
| **PUT**    | `/api/settings`                    | Update application or user-specific settings.                                |
| **GET**    | `/api/analytics/top-reasons`       | Retrieve analytical data detailing the most common reasons for item returns. |
| **GET**    | `/api/analytics/requests-timeline` | Retrieve a timeline dataset of return requests for trend analysis.           |
| **GET**    | `/api/analytics/overview`          | Retrieve a high-level overview of system analytics                           |

# 🖼️UI Screenshots

## 1. Customer Screens

- ### Dashboard Overview

<img src="./UI_Screens/customer/dashboard.png" alt="Dashboard UI" width="600" height="300">

- ### Orders

<img src="./UI_Screens/customer/orders.png" alt="Dashboard UI" width="600" height="300">

- ### Order_details

<img src="./UI_Screens/customer/order_details.png" alt="Dashboard UI" width="600" height="300">

- ### My Returns

<img src="./UI_Screens/customer/my_returns.png" alt="Dashboard UI" width="600" height="300">

- ### Return Details

<img src="./UI_Screens/customer/return_details.png" alt="Dashboard UI" width="600" height="300">

- ### Return Form

<img src="./UI_Screens/customer/return_form.png" alt="Dashboard UI" width="600" height="300">

- ### Refund History

<img src="./UI_Screens/customer/Refund-history.png" alt="Dashboard UI" width="600" height="300">

- ### Notifications

<img src="./UI_Screens/customer/notifications.png" alt="Dashboard UI" width="600" height="300">

- ### Profile

<img src="./UI_Screens/customer/profile.png" alt="Dashboard UI" width="600" height="300">

## 2. Support Agent Screens

- ### Dashboard Overview

<img src="./UI_Screens/support_agent/dashboard.png" alt="Dashboard UI" width="600" height="300">

- ### Return Management

<img src="./UI_Screens/support_agent/return-management.png" alt="Dashboard UI" width="600" height="300">

- ### Return Details

<img src="./UI_Screens/support_agent/return-details.png" alt="Dashboard UI" width="600" height="300">

- ### Orders

<img src="./UI_Screens/support_agent/orders.png" alt="Dashboard UI" width="600" height="300">

- ### Inspection Queue

<img src="./UI_Screens/support_agent/Inspections.png" alt="Dashboard UI" width="600" height="300">

- ### Inspection Report Form

<img src="./UI_Screens/support_agent/inspection_report_form.png" alt="Dashboard UI" width="600" height="300">

- ### Notifications

<img src="./UI_Screens/support_agent/notifications.png" alt="Dashboard UI" width="600" height="300">

## 3. Admin Screens

- ### Dashboard Overview

<img src="./UI_Screens/admin/dashboard.png" alt="Dashboard UI" width="600" height="300">

- ### Refunds Queue and Refunds History

<img src="./UI_Screens/admin/refunds_queue.png" alt="Dashboard UI" width="450" height="300">
<img src="./UI_Screens/admin/refunds_history.png" alt="Dashboard UI" width="450" height="300">

- ### Process Refund

<img src="./UI_Screens/admin/process-refund.png" alt="Dashboard UI" width="600" height="300">

- ### User Management

<img src="./UI_Screens/admin/user_management.png" alt="Dashboard UI" width="600" height="300">

- ### System Settings

<img src="./UI_Screens/admin/system_settings.png" alt="Dashboard UI" width="600" height="300">

## 🔮 Future Enhancements

ReFlow is an evolving platform. Planned features for the roadmap include:

- **💳 Stripe API Integration:** Moving from mock system refunds to actual financial transaction processing.
- **✉️ Email Alerts (SendGrid):** Sending real email notifications to customers alongside the in-app alerts.
- **🤖 AI Support Chatbot:** Integrating an LLM to handle Tier-1 customer questions and auto-evaluate initial return reasons.
- **📦 Shipping API Integration:** Automatically generating return shipping labels (FedEx/UPS/USPS) for approved requests.
