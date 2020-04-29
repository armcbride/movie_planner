DROP DATABASE IF EXISTS moviePlannerDB;

CREATE DATABASE moviePlannerDB;

USE moviePlannerDB;

CREATE TABLE movies (
 id INT NOT NULL AUTO_INCREMENT,
 movie VARCHAR(255) NOT NULL,
 PRIMARY KEY (id)
)