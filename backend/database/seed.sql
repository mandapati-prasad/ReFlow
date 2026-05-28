INSERT INTO users (full_name,email,password,role,phone,address) VALUES
('Rahul Sharma','rahul@gmail.com','$2b$10$X1jR4/h30N77nK0g/G1X/.P89d1Q87B9xO9m.C3t4w.3n/18Y2CgG','customer','9876543210','Bangalore'),
('Priya Reddy','priya@gmail.com','$2b$10$X1jR4/h30N77nK0g/G1X/.P89d1Q87B9xO9m.C3t4w.3n/18Y2CgG','customer','9876543211','Hyderabad'),
('Arjun Kumar','arjun@gmail.com','$2b$10$X1jR4/h30N77nK0g/G1X/.P89d1Q87B9xO9m.C3t4w.3n/18Y2CgG','customer','9876543212','Chennai'),
('Sneha Patel','sneha@gmail.com','$2b$10$X1jR4/h30N77nK0g/G1X/.P89d1Q87B9xO9m.C3t4w.3n/18Y2CgG','customer','9876543213','Mumbai'),
('Karan Mehta','karan@gmail.com','$2b$10$X1jR4/h30N77nK0g/G1X/.P89d1Q87B9xO9m.C3t4w.3n/18Y2CgG','customer','9876543214','Delhi'),
('Amit Singh','amit@gmail.com','$2b$10$X1jR4/h30N77nK0g/G1X/.P89d1Q87B9xO9m.C3t4w.3n/18Y2CgG','customer','9876543215','Pune'),
('Neha Joshi','neha@gmail.com','$2b$10$X1jR4/h30N77nK0g/G1X/.P89d1Q87B9xO9m.C3t4w.3n/18Y2CgG','customer','9876543216','Kolkata'),
('Support Agent','support@gmail.com','$2b$10$X1jR4/h30N77nK0g/G1X/.P89d1Q87B9xO9m.C3t4w.3n/18Y2CgG','support_agent','9999999999','Bangalore'),
('Admin User','admin@gmail.com','$2b$10$X1jR4/h30N77nK0g/G1X/.P89d1Q87B9xO9m.C3t4w.3n/18Y2CgG','admin','8888888888','Bangalore');

INSERT INTO orders (order_number,customer_id,total_amount,status) VALUES
('ORD-1001',1,2499,'Delivered'),
('ORD-1002',1,1599,'Delivered'),
('ORD-1003',2,899,'Delivered'),
('ORD-1004',3,4999,'Delivered'),
('ORD-1005',4,699,'Delivered'),
('ORD-1006',5,1299,'Delivered'),
('ORD-1007',6,999,'Delivered'),
('ORD-1008',7,3299,'Delivered'),
('ORD-1009',1,1899,'Delivered'),
('ORD-1010',2,4599,'Delivered'),
('ORD-1011',3,899,'Delivered'),
('ORD-1012',4,2799,'Delivered'),
('ORD-1013',5,999,'Delivered'),
('ORD-1014',6,3999,'Delivered'),
('ORD-1015',7,1499,'Delivered');

INSERT INTO order_items (order_id,product_name,category,quantity,price,image_url) VALUES
(1,'Wireless Headphones','Electronics',1,2499,'https://plus.unsplash.com/premium_photo-1679513691474-73102089c117?q=80&w=1113&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
(2,'Gaming Mouse','Electronics',1,1599,'https://images.unsplash.com/photo-1588440573874-54185a266452?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
(3,'Bluetooth Speaker','Electronics',1,899,'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
(4,'Smart Watch','Wearables',1,4999,'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
(5,'Phone Charger','Accessories',1,699,'https://images.unsplash.com/photo-1731616103600-3fe7ccdc5a59?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
(6,'Mechanical Keyboard','Electronics',1,1299,'https://images.unsplash.com/photo-1697022976749-35bac4eb77dc?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
(7,'Laptop Stand','Accessories',1,999,'https://images.unsplash.com/photo-1629317480826-910f729d1709?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
(8,'Fitness Band','Wearables',1,3299,'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
(9,'USB Hub','Accessories',1,1899,'https://plus.unsplash.com/premium_photo-1761043248662-42f371ad31b4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
(10,'Noise Cancelling Earbuds','Electronics',1,4599,'https://images.unsplash.com/photo-1606400082777-ef05f3c5cde2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
(11,'Webcam','Electronics',1,899,'https://images.unsplash.com/photo-1623949556303-b0d17d198863?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
(12,'Portable SSD','Storage',1,2799,'https://images.unsplash.com/photo-1577538926210-fc6cc624fde2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
(13,'Microphone','Electronics',1,999,'https://images.unsplash.com/photo-1590602846581-7d3eec520d07?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
(14,'Gaming Chair','Furniture',1,3999,'https://images.unsplash.com/photo-1770195483917-b3bb444b7a29?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
(15,'Tablet Cover','Accessories',1,1499,'https://images.unsplash.com/photo-1693943710068-bb1d67ec616e?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

INSERT INTO return_requests (return_number,order_item_id,customer_id,reason,description,image_url,status,support_agent_id) VALUES
('RET-1001',1,1,'Damaged Product','Left speaker not working','uploads/r1.jpg','Approved',8),
('RET-1002',2,1,'Wrong Item','Received wrong model','uploads/r2.jpg','Under Review',8),
('RET-1003',3,2,'Size Issue','Not suitable','uploads/r3.jpg','Requested',8),
('RET-1004',4,3,'Damaged Product','Screen scratches','uploads/r4.jpg','Rejected',8),
('RET-1005',5,4,'Missing Parts','Cable missing','uploads/r5.jpg','Approved',8),
('RET-1006',6,5,'Wrong Item','Different color','uploads/r6.jpg','Refunded',8),
('RET-1007',7,6,'Defective','Stand unstable','uploads/r7.jpg','Under Review',8),
('RET-1008',8,7,'Battery Issue','Battery draining quickly','uploads/r8.jpg','Requested',8),
('RET-1009',9,1,'Not Working','USB ports not detecting','uploads/r9.jpg','Approved',8),
('RET-1010',10,2,'Damaged Product','Left earbud damaged','uploads/r10.jpg','Refunded',8);

INSERT INTO return_status_logs (return_request_id, status, changed_by) VALUES 
(1, 'Requested', 1),
(1, 'Under Review', 8),
(1, 'Approved', 8),
(2, 'Requested', 1),
(2, 'Under Review', 8),
(3, 'Requested', 2),
(4, 'Requested', 3),
(4, 'Rejected', 8),
(5, 'Requested', 4),
(5, 'Approved', 8),
(6, 'Requested', 5),
(6, 'Approved', 8),
(6, 'Refunded', 8),
(7, 'Requested', 6),
(7, 'Under Review', 8),
(8, 'Requested', 7),
(9, 'Requested', 1),
(9, 'Approved', 8),
(10, 'Requested', 2),
(10, 'Approved', 8),
(10, 'Refunded', 8);

INSERT INTO refunds (refund_number,return_request_id,refund_amount,refund_status,payment_method) VALUES
('REF-1002',5,699,'Processing','Card'),
('REF-1003',6,1299,'Completed','UPI'),
('REF-1004',9,1899,'Completed','Net Banking');

INSERT INTO notifications (user_id,title,message) VALUES
(1,'Return Approved','Your return request RET-1001 has been approved'),
(1,'Refund Completed','Refund REF-1001 has been processed'),
(2,'Return Under Review','Your return RET-1002 is under review'),
(3,'Inspection Scheduled','Inspection scheduled'),
(4,'Return Rejected','Your request was rejected');

INSERT INTO comments (return_request_id,user_id,comment) VALUES
(1,8,'Product damage verified'),
(2,8,'Need additional images'),
(5,8,'Cable missing confirmed');

INSERT INTO inspection_reports (return_request_id,inspector_name,product_condition,packaging_condition,accessories_included,inspection_notes,inspection_result) VALUES
(1,'Support Agent','Damaged','Good','Yes','Internal speaker damage verified','Approved');

INSERT INTO settings (system_name,support_email,website,currency) VALUES
('Return Management System','support@returnsystem.com','returnsystem.com','INR');