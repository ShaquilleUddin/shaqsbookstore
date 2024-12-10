# Create database script for Shaqs Game Store

# Create the database
CREATE DATABASE IF NOT EXISTS shaqsgamestore;
USE shaqsgamestore;

# Create the tables for books 
CREATE TABLE IF NOT EXISTS games (id INT AUTO_INCREMENT,name VARCHAR(50),price DECIMAL(5, 2) unsigned,PRIMARY KEY(id));

# Create the tables for users
CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT,username VARCHAR(50),first_name VARCHAR(50),last_name VARCHAR(50),email VARCHAR(50),hashedPassword VARCHAR(100),PRIMARY KEY(id));

# Create the app user
CREATE USER IF NOT EXISTS 'shaqsgamestore'@'localhost' IDENTIFIED BY 'qwertyuiop'; 
GRANT ALL PRIVILEGES ON shaqsgamestore.* TO ' shaqsgamestore'@'localhost';  