DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS return_requests;
DROP TABLE IF EXISTS return_status_logs;
DROP TABLE IF EXISTS refunds;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS inspection_reports;
DROP TABLE IF EXISTS settings;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    profile_image TEXT,
    status TEXT DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT,
    customer_id INTEGER,
    total_amount REAL,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(customer_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_name TEXT,
    category TEXT,
    quantity INTEGER,
    price REAL,
    image_url TEXT,
    FOREIGN KEY(order_id) REFERENCES orders(id)
);

CREATE TABLE return_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    return_number TEXT,
    order_item_id INTEGER,
    customer_id INTEGER,
    reason TEXT,
    description TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'Requested',
    support_agent_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(order_item_id) REFERENCES order_items(id),
    FOREIGN KEY(customer_id) REFERENCES users(id)
);

CREATE TABLE return_status_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    return_request_id INTEGER NOT NULL,
    status TEXT NOT NULL,
    changed_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(return_request_id) REFERENCES return_requests(id),
    FOREIGN KEY(changed_by) REFERENCES users(id)
);

CREATE TABLE refunds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    refund_number TEXT,
    return_request_id INTEGER,
    refund_amount REAL,
    refund_status TEXT,
    payment_method TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(return_request_id) REFERENCES return_requests(id)
);

CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    message TEXT,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    return_request_id INTEGER,
    user_id INTEGER,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(return_request_id) REFERENCES return_requests(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE inspection_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    return_request_id INTEGER,
    inspector_name TEXT,
    product_condition TEXT,
    packaging_condition TEXT,
    accessories_included TEXT,
    inspection_notes TEXT,
    inspection_result TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(return_request_id) REFERENCES return_requests(id)
);

CREATE TABLE settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    system_name TEXT,
    support_email TEXT,
    website TEXT,
    currency TEXT
);