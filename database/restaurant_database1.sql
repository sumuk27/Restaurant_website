CREATE DATABASE restaurant;
use restaurant;

-- Users table (simplified without authentication)
CREATE TABLE  users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Food items table
CREATE TABLE IF NOT EXISTS food_items (
    food_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    category VARCHAR(50) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    delivery_address VARCHAR(255) NOT NULL,
    order_status ENUM('pending', 'confirmed', 'delivered', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Order items table (to store items in each order)
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    food_id INT NOT NULL,
    quantity INT NOT NULL,
    item_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES food_items(food_id) ON DELETE RESTRICT
);

-- Reviews
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


-- Insert sample food items
INSERT INTO food_items (name, description, price, image_url, category) VALUES
('Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and basil', 12.99, 'images/margherita.jpg', 'Pizza'),
('Pepperoni Pizza', 'Pizza topped with pepperoni, cheese, and tomato sauce', 14.99, 'images/pepperoni.jpg', 'Pizza'),
('Chicken Alfredo Pasta', 'Fettuccine pasta with creamy Alfredo sauce and grilled chicken', 16.99, 'images/alfredo.jpg', 'Pasta'),
('Caesar Salad', 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan', 9.99, 'images/caesar.jpg', 'Salad'),
('Classic Burger', 'Beef patty with lettuce, tomato, cheese, and special sauce', 13.99, 'images/burger.jpg', 'Burger'),
('Mushroom Risotto', 'Creamy Italian rice dish with mushrooms and parmesan', 15.99, 'images/risotto.jpg', 'Main Course'),
('Tiramisu', 'Italian coffee-flavored dessert with layers of mascarpone and ladyfingers', 7.99, 'images/tiramisu.jpg', 'Dessert'),
('Chocolate Lava Cake', 'Warm chocolate cake with a molten chocolate center', 8.99, 'images/lava_cake.jpg', 'Dessert'),
('Garlic Bread', 'Toasted bread with garlic butter and herbs', 5.99, 'images/garlic_bread.jpg', 'Appetizer');

-- Sample user for testing
INSERT INTO users (name, email, password, address, phone) VALUES
('John Doe', 'john@example.com', 'johndoe' , '123 Main St, Anytown, USA', '555-123-4567');

select * from users;
select * from orders;
select * from order_items;
select * from food_items;
select * from reviews;

UPDATE food_items
SET image_url = 'https://thekittchen.com/wp-content/uploads/2017/01/The-Best-Garlic-Bread-5.jpg'
WHERE food_id = 9;

INSERT INTO food_items (name, description, price, image_url, category) VALUES
('Oreo Shake', 'Oreo biscuit crushed and blended with milk', 6.99, 'https://iambaker.net/wp-content/uploads/2024/06/Oreo-Milkshake-2.jpg', 'Shake');