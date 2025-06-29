# DC CMS API Documentation

This document provides comprehensive documentation for the DC CMS API, which allows you to interact with the content management system programmatically.

## Base URL

```
https://your-api-domain.com/api
```

## Authentication

Most API endpoints require authentication. The API uses JWT (JSON Web Token) for authentication.

### Obtaining a Token

```http
POST /auth/login
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "username": "username",
      "email": "user@example.com",
      "role": "admin"
    },
    "token": "your-jwt-token"
  },
  "message": "Login successful"
}
```

### Using the Token

Include the token in the Authorization header for all protected requests:

```
Authorization: Bearer your-jwt-token
```

## API Endpoints

### Authentication

#### Register a new user

```http
POST /auth/register
```

**Request Body:**

```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "secure-password",
  "role": "customer"
}
```

#### Login

```http
POST /auth/login
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

#### Get User Profile

```http
GET /auth/profile
```

#### Update User Profile

```http
PUT /auth/profile
```

**Request Body:**

```json
{
  "username": "updated-username",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

### Content Management

#### Get All Posts

```http
GET /posts
```

**Query Parameters:**

- `page` (default: 1): Page number
- `limit` (default: 10): Items per page
- `status` (default: published): Filter by status (published, draft, archived, all)
- `category`: Filter by category ID
- `search`: Search term
- `sort` (default: created_at): Field to sort by
- `order` (default: desc): Sort order (asc, desc)

#### Get Single Post

```http
GET /posts/:id
```

#### Create Post

```http
POST /posts
```

**Request Body:**

```json
{
  "title": "New Post Title",
  "slug": "new-post-slug",
  "content": "Post content here...",
  "excerpt": "Brief excerpt",
  "featured_image": "https://example.com/image.jpg",
  "status": "published",
  "category_id": "category-uuid",
  "content_blocks": [],
  "seo_title": "SEO Title",
  "seo_description": "SEO Description"
}
```

#### Update Post

```http
PUT /posts/:id
```

**Request Body:** Same as Create Post

#### Delete Post

```http
DELETE /posts/:id
```

### Categories

#### Get All Categories

```http
GET /categories
```

**Query Parameters:**

- `parent_id`: Filter by parent category
- `include_products` (boolean): Include product count

#### Get Single Category

```http
GET /categories/:id
```

#### Create Category

```http
POST /categories
```

**Request Body:**

```json
{
  "name": "New Category",
  "slug": "new-category",
  "description": "Category description",
  "color": "#3B82F6",
  "parent_id": "parent-category-uuid"
}
```

#### Update Category

```http
PUT /categories/:id
```

**Request Body:** Same as Create Category

#### Delete Category

```http
DELETE /categories/:id
```

### Content Pages

#### Get All Content Pages

```http
GET /content
```

**Query Parameters:**

- `page` (default: 1): Page number
- `limit` (default: 10): Items per page
- `status` (default: published): Filter by status
- `search`: Search term

#### Get Content Page by ID

```http
GET /content/:id
```

#### Get Content Page by HTML Name

```http
GET /content/page/:htmlName
```

#### Create Content Page

```http
POST /content
```

**Request Body:**

```json
{
  "title": "About Us",
  "html_name": "about",
  "description": "About our company",
  "background_image": "https://example.com/bg.jpg",
  "background_color": "#FFFFFF",
  "sections": [
    {
      "type": "text",
      "order": 0,
      "data": {
        "content": "<h1>About Us</h1><p>Our company story...</p>"
      }
    }
  ],
  "status": "published"
}
```

#### Update Content Page

```http
PUT /content/:id
```

**Request Body:** Same as Create Content Page

#### Delete Content Page

```http
DELETE /content/:id
```

### Products

#### Get All Products

```http
GET /products
```

**Query Parameters:**

- `page` (default: 1): Page number
- `limit` (default: 10): Items per page
- `category`: Filter by category ID
- `status` (default: active): Filter by status
- `search`: Search term
- `sort` (default: created_at): Field to sort by
- `order` (default: desc): Sort order (asc, desc)

#### Get Single Product

```http
GET /products/:id
```

#### Create Product

```http
POST /products
```

**Request Body:**

```json
{
  "name": "Product Name",
  "slug": "product-slug",
  "description": "Product description",
  "images": ["https://example.com/image1.jpg"],
  "price": 99.99,
  "category_id": "category-uuid",
  "status": "active"
}
```

#### Update Product

```http
PUT /products/:id
```

**Request Body:** Same as Create Product

#### Delete Product

```http
DELETE /products/:id
```

### Product Variations

#### Get Product Variations

```http
GET /products/:productId/variations
```

#### Create Variation

```http
POST /products/variations
```

**Request Body:**

```json
{
  "product_id": "product-uuid",
  "sku": "PROD-VAR-001",
  "options": {
    "color": "Red",
    "size": "Medium"
  },
  "price": 99.99,
  "stock": 10,
  "status": "active"
}
```

#### Update Variation

```http
PUT /products/variations/:id
```

**Request Body:** Same as Create Variation

#### Delete Variation

```http
DELETE /products/variations/:id
```

### Orders

#### Get All Orders

```http
GET /orders
```

**Query Parameters:**

- `page` (default: 1): Page number
- `limit` (default: 10): Items per page
- `status`: Filter by status
- `user_id`: Filter by user ID
- `sort` (default: created_at): Field to sort by
- `order` (default: desc): Sort order (asc, desc)

#### Get Single Order

```http
GET /orders/:id
```

#### Create Order

```http
POST /orders
```

**Request Body:**

```json
{
  "items": [
    {
      "product_id": "product-uuid",
      "variation_id": "variation-uuid",
      "quantity": 2,
      "unit_price": 99.99
    }
  ],
  "shipping_info": {
    "name": "John Doe",
    "address": "123 Main St",
    "city": "New York",
    "postal_code": "10001",
    "country": "USA",
    "phone": "+1234567890"
  }
}
```

#### Update Order Status

```http
PUT /orders/:id/status
```

**Request Body:**

```json
{
  "status": "processing",
  "payment_status": "paid"
}
```

#### Cancel Order

```http
PUT /orders/:id/cancel
```

### Reviews

#### Get All Reviews

```http
GET /reviews
```

**Query Parameters:**

- `page` (default: 1): Page number
- `limit` (default: 10): Items per page
- `status`: Filter by status
- `product_id`: Filter by product ID

#### Get Product Reviews

```http
GET /products/:productId/reviews
```

#### Create Review

```http
POST /reviews
```

**Request Body:**

```json
{
  "product_id": "product-uuid",
  "rating": 5,
  "comment": "Great product! Highly recommended."
}
```

#### Update Review

```http
PUT /reviews/:id
```

**Request Body:**

```json
{
  "rating": 4,
  "comment": "Updated review comment"
}
```

#### Approve Review

```http
PUT /reviews/:id/approve
```

#### Reject Review

```http
PUT /reviews/:id/reject
```

#### Delete Review

```http
DELETE /reviews/:id
```

### Settings

#### Get All Settings

```http
GET /settings
```

#### Get Specific Setting

```http
GET /settings/:key
```

#### Update Setting

```http
PUT /settings/:key
```

**Request Body:**

```json
{
  "value": "setting-value",
  "type": "string",
  "description": "Setting description"
}
```

#### Update Multiple Settings

```http
PUT /settings
```

**Request Body:**

```json
{
  "settings": {
    "setting_key_1": {
      "value": "value1",
      "type": "string",
      "description": "Description 1"
    },
    "setting_key_2": {
      "value": true,
      "type": "boolean",
      "description": "Description 2"
    }
  }
}
```

### Site Information

#### Get Site Information

```http
GET /settings/site/info
```

#### Update Site Information

```http
PUT /settings/site/info
```

**Request Body:**

```json
{
  "site_name": "My Website",
  "logo_url": "https://example.com/logo.png",
  "description": "Website description",
  "contact_email": "contact@example.com",
  "phone": "+1234567890",
  "address": "123 Main St, City, Country",
  "social_icons": [
    {
      "name": "Facebook",
      "icon": "facebook",
      "url": "https://facebook.com/mypage"
    }
  ]
}
```

## Error Handling

All API endpoints return a consistent error format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

Common HTTP status codes:

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Pagination

Endpoints that return multiple items support pagination with the following response format:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. Current limits:

- 100 requests per 15-minute window per IP address

When rate limited, you'll receive a `429 Too Many Requests` response.

## Webhooks

The system supports webhooks for real-time notifications of events:

- `order.created`: When a new order is created
- `order.updated`: When an order status changes
- `product.low_stock`: When a product reaches low stock threshold

Configure webhooks in the admin dashboard under Settings > Webhooks.

## SDK Examples

### JavaScript/TypeScript

```javascript
import { createClient } from 'dc-cms-client';

const client = createClient({
  apiUrl: 'https://your-api-domain.com/api',
  token: 'your-jwt-token'
});

// Get all products
const getProducts = async () => {
  try {
    const response = await client.products.list({
      limit: 20,
      status: 'active'
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

// Create a new post
const createPost = async () => {
  try {
    const response = await client.posts.create({
      title: 'New Post',
      content: 'Post content',
      status: 'published'
    });
    console.log('Post created:', response.data);
  } catch (error) {
    console.error('Error creating post:', error);
  }
};
```

### PHP

```php
<?php
require_once 'vendor/autoload.php';

use DCCMS\Client;

$client = new Client([
  'api_url' => 'https://your-api-domain.com/api',
  'token' => 'your-jwt-token'
]);

// Get all products
try {
  $products = $client->products->list([
    'limit' => 20,
    'status' => 'active'
  ]);
  print_r($products->data);
} catch (Exception $e) {
  echo 'Error: ' . $e->getMessage();
}

// Create a new post
try {
  $post = $client->posts->create([
    'title' => 'New Post',
    'content' => 'Post content',
    'status' => 'published'
  ]);
  echo 'Post created: ' . $post->data->id;
} catch (Exception $e) {
  echo 'Error: ' . $e->getMessage();
}
```

## Conclusion

This API documentation provides a comprehensive guide to interacting with the DC CMS API. For additional support or questions, please contact our support team.