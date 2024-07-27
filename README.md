# Overview
This project involves creating a set of endpoints for managing posts, including functionalities for upvotes, downvotes, comments, and comment replies. Additionally, JWT-based authentication is implemented to secure the endpoints. Below are the high-level steps taken to solve the problem, along with the challenges faced and their solutions.

##Documentation

[See Docs](https://documenter.getpostman.com/view/22684334/2sA3kaBJrw)

# High-Level Steps
Set Up NestJS Project

## Initialized a new NestJS project.
Installed necessary dependencies, including Mongoose for MongoDB, Bcrypt for hashing and used JWT-based authentication.
Define Schemas and DTOs

Created Mongoose schemas for Post, Comment, and User.

Defined DTOs for creating and updating posts and comments.

## Implement Auth with JWT
Set up JWT-based authentication using Passport.

Created guards to protect the endpoints and ensure only authenticated users can interact with them.

## Create Endpoints
Developed endpoints for creating, updating, retrieving, and deleting posts.

Added endpoints for upvoting and downvoting posts.

Implemented endpoints for adding comments to posts and replying to comments.

## Handle Upvotes and Downvotes
Ensured that each user can upvote or downvote a post only once by storing user IDs in arrays.
Nested Comment Structure

Implemented a recursive approach to handle nested comments, allowing comments to have replies.


# Challenges and Solutions

## Schema Structure for Comments
Solution: Used a recursive approach by allowing each comment to reference an array of sub-comments (replies), making the schema flexible for any depth of nesting.

## Ensuring One Upvote/Downvote per User
Solution: Added arrays (upvotedBy and downvotedBy) in the Post schema to store user IDs. Checked these arrays before allowing an upvote or downvote, ensuring each user can only vote once.