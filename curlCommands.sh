#!/bin/bash

# =============================================================================
# Dietician Slots
# =============================================================================

# POST: Update Nutritionist's Slot Availability
curl -X POST http://localhost:3000/nutritionist/slots \
  -H "Content-Type: application/json" \
  -d '{
    "nutritionist_id": 1,
    "date": "2025-04-13",
    "SlotID": [
      { "SlotID": 101, "available": true },
      { "SlotID": 102, "available": false }
    ]
  }'

# GET: Fetch Nutritionist's Available Slots for a Specific Date
curl -X GET http://localhost:3000/nutritionist/slots/1/2025-04-13

# =============================================================================
# Diet Plans
# =============================================================================

# POST: Create a new diet plan
curl -X POST http://localhost:3000/dietplans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "nutritionist_id": 1,
    "client_id": 2,
    "start_date": "2025-04-13",
    "end_date": "2025-04-20",
    "notes": "Sample diet plan notes",
    "meals": [
      {
        "day_of_week": "Monday",
        "meal_type": "Breakfast",
        "food_item_id": 101,
        "template_id": null,
        "quantity": 1
      },
      {
        "day_of_week": "Monday",
        "meal_type": "Lunch",
        "food_item_id": null,
        "template_id": 201,
        "quantity": 2
      }
    ]
  }'

# GET: Get all diet plans for a nutritionist
curl -X GET http://localhost:3000/dietplans/nutritionist/1 \
  -H "Authorization: Bearer <your_token>"

# GET: Get a single diet plan
curl -X GET http://localhost:3000/dietplans/1 \
  -H "Authorization: Bearer <your_token>"

# PUT: Update a diet plan
curl -X PUT http://localhost:3000/dietplans/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "start_date": "2025-04-14",
    "end_date": "2025-04-21",
    "notes": "Updated diet plan notes",
    "meals": [
      {
        "day_of_week": "Tuesday",
        "meal_type": "Dinner",
        "food_item_id": 102,
        "template_id": null,
        "quantity": 1
      }
    ]
  }'

# DELETE: Delete a diet plan
curl -X DELETE http://localhost:3000/dietplans/1 \
  -H "Authorization: Bearer <your_token>"

# =============================================================================
# Diet Templates
# =============================================================================

# POST: Create a new diet template
curl -X POST http://localhost:3000/diettemplates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "nutritionist_id": 1,
    "name": "Weight Loss Plan",
    "description": "A diet template for weight loss",
    "meals": [
      {
        "day_of_week": "Monday",
        "meal_type": "Breakfast",
        "food_item_id": 101,
        "template_id": null,
        "quantity": 1
      },
      {
        "day_of_week": "Monday",
        "meal_type": "Lunch",
        "food_item_id": null,
        "template_id": 201,
        "quantity": 2
      }
    ]
  }'

# GET: Get all diet templates for a nutritionist
curl -X GET http://localhost:3000/diettemplates/nutritionist/1 \
  -H "Authorization: Bearer <your_token>"

# GET: Get a single diet template
curl -X GET http://localhost:3000/diettemplates/1 \
  -H "Authorization: Bearer <your_token>"

# PUT: Update a diet template
curl -X PUT http://localhost:3000/diettemplates/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "name": "Updated Weight Loss Plan",
    "description": "An updated diet template for weight loss",
    "meals": [
      {
        "day_of_week": "Tuesday",
        "meal_type": "Dinner",
        "food_item_id": 102,
        "template_id": null,
        "quantity": 1
      }
    ]
  }'

# DELETE: Delete a diet template
curl -X DELETE http://localhost:3000/diettemplates/1 \
  -H "Authorization: Bearer <your_token>"

# =============================================================================
# Exercise
# =============================================================================

# POST: Create Exercise
curl -X POST http://localhost:3000/exercise \
  -H "Content-Type: application/json" \
  -d '{
    "exerciseName": "Push-Up",
    "type": "Strength",
    "videoLink": "https://example.com/push-up",
    "muscleType": "Chest",
    "workoutSteps": "1. Get into a plank position. 2. Lower your body. 3. Push back up."
  }'

# PUT: Update Exercise
curl -X PUT http://localhost:3000/exercise/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "exerciseName": "Updated Push-Up",
    "type": "Strength",
    "videoLink": "https://example.com/updated-push-up",
    "muscleType": "Chest",
    "workoutSteps": "1. Get into a plank position. 2. Lower your body. 3. Push back up slowly."
  }'

# POST: Add Exercise to User
curl -X POST http://localhost:3000/add-exercise \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "exerciseId": 1,
    "date": "2025-04-13"
  }'

# GET: Fetch All Exercises
curl -X GET http://localhost:3000/exercise

# =============================================================================
# FAQs
# =============================================================================

# POST: Create FAQ
curl -X POST http://localhost:3000/faq \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "question": "What is the purpose of this API?",
    "answer": "This API is used to manage FAQs."
  }'

# GET: Fetch All FAQs
curl -X GET http://localhost:3000/faq

# DELETE: Delete FAQ by ID
curl -X DELETE http://localhost:3000/faq/1 \
  -H "Authorization: Bearer <your_token>"

# =============================================================================
# Flyer
# =============================================================================

# POST: Create Flyer
curl -X POST http://localhost:3000/flyer \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Promotional Flyer",
    "imageUrl": "https://example.com/flyer-image.jpg",
    "description": "This is a promotional flyer for our new product.",
    "url": "https://example.com/product"
  }'

# GET: Fetch All Flyers
curl -X GET http://localhost:3000/flyer

# =============================================================================
# Food Items
# =============================================================================

# GET all food items
curl -X GET http://localhost:3000/fooditems

# GET food items by meal type
curl -X GET http://localhost:3000/fooditems/breakfast

# POST a new food item
curl -X POST http://localhost:3000/fooditems \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Oatmeal",
    "quantity": "1 bowl",
    "kcal": 150,
    "p": 5,
    "c": 27,
    "f": 3,
    "image": "https://example.com/oatmeal.jpg",
    "isVeg": true,
    "isSelected": false,
    "mealType": "breakfast"
  }'

# PUT (update) a food item
curl -X PUT http://localhost:3000/fooditems/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Oatmeal",
    "kcal": 160,
    "isSelected": true
  }'

# DELETE a food item
curl -X DELETE http://localhost:3000/fooditems/1

# =============================================================================
# Food Templates
# =============================================================================

# POST: Create a new food template
curl -X POST http://localhost:3000/foodtemplates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "name": "Healthy Breakfast",
    "description": "A nutritious breakfast template",
    "nutritionist_id": 1,
    "food_items": [
      { "food_item_id": 101, "quantity": 2 },
      { "food_item_id": 102, "quantity": 1 }
    ]
  }'

# GET: Get all food templates for a nutritionist
curl -X GET http://localhost:3000/foodtemplates/nutritionist/1 \
  -H "Authorization: Bearer <your_token>"

# GET: Get a single food template
curl -X GET http://localhost:3000/foodtemplates/1 \
  -H "Authorization: Bearer <your_token>"

# PUT: Update a food template
curl -X PUT http://localhost:3000/foodtemplates/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "name": "Updated Breakfast",
    "description": "Updated description for breakfast",
    "food_items": [
      { "food_item_id": 103, "quantity": 3 },
      { "food_item_id": 104, "quantity": 2 }
    ]
  }'

# DELETE: Delete a food template
curl -X DELETE http://localhost:3000/foodtemplates/1 \
  -H "Authorization: Bearer <your_token>"

# =============================================================================
# General Information
# =============================================================================

# POST: Add or update daily track data
curl -X POST http://localhost:3000/dailytrack \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "selectedDate": "2025-04-13",
    "sleepHours": 8,
    "waterIntake": 2.5,
    "steps": 10000
  }'

# GET: Get general information by ID
curl -X GET http://localhost:3000/geninfo?id=1 \
  -H "Authorization: Bearer <your_token>"

# =============================================================================
# Nutritionists
# =============================================================================

# POST: Create a new Nutritionist
curl -X POST http://localhost:3000/nutritionists \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone_number": "1234567890",
    "specialty": "Weight Loss",
    "years_of_experience": 5,
    "current_organisation": "HealthPro",
    "address": "123 Wellness St"
  }'

# POST: Nutritionist Sign-Up
curl -X POST http://localhost:3000/nutritionists/signup \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane.smith@example.com",
    "password": "securepassword",
    "phone_number": "9876543210",
    "specialty": "Sports Nutrition",
    "years_of_experience": 8,
    "current_organisation": "FitLife",
    "address": "456 Fitness Ave"
  }'

# GET: Get all Nutritionists
curl -X GET http://localhost:3000/nutritionists

# GET: Get a single Nutritionist by ID
curl -X GET http://localhost:3000/nutritionists/1

# PUT: Update a Nutritionist
curl -X PUT http://localhost:3000/nutritionists/1 \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Updated Name",
    "specialty": "Updated Specialty"
  }'

# DELETE: Delete a Nutritionist
curl -X DELETE http://localhost:3000/nutritionists/1

# POST: Nutritionist Login
curl -X POST http://localhost:3000/nutritionists/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.smith@example.com",
    "password": "securepassword"
  }'

# GET: Get all clients for a Nutritionist
curl -X GET http://localhost:3000/nutritionists/1/clients \
  -H "Authorization: Bearer <your_token>"

# POST: Add a new client to a Nutritionist
curl -X POST http://localhost:3000/nutritionists/1/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "clientId": 2,
    "notes": "New client added for weight loss program"
  }'

# PUT: Update client status or notes
curl -X PUT http://localhost:3000/nutritionists/1/clients/2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "status": "Active",
    "notes": "Updated notes for the client"
  }'

# DELETE: Remove a client from a Nutritionist
curl -X DELETE http://localhost:3000/nutritionists/1/clients/2 \
  -H "Authorization: Bearer <your_token>"

# =============================================================================
# Products
# =============================================================================

# POST: Create a new product
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Protein Bar",
    "description": "A healthy protein snack",
    "price": 2.99,
    "stock_quantity": 100,
    "category": "Snacks",
    "image_url": "http://example.com/images/protein-bar.jpg"
  }'

# GET: Fetch all products (with optional filters)
curl -X GET "http://localhost:3000/products?category=Snacks&min_price=1&max_price=5"

# PUT: Update product details
curl -X PUT http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Protein Bar",
    "price": 3.49,
    "stock_quantity": 120
  }'

# DELETE: Delete a product
curl -X DELETE http://localhost:3000/products/1

# =============================================================================
# Track Meal Controller
# =============================================================================

# POST: Add a meal
curl -X POST http://localhost:3000/addmeal \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "mealDate": "2025-04-13",
    "name": "Grilled Chicken",
    "quantity": 1,
    "kcal": 250,
    "p": 30,
    "c": 5,
    "f": 10,
    "image": "http://example.com/images/grilled-chicken.jpg",
    "isVeg": false,
    "mealType": "Lunch"
  }'

# GET: Track meals by date
curl -X GET "http://localhost:3000/trackmeal?date=2025-04-13" \
  -H "Authorization: Bearer <your_token>"

# DELETE: Delete a meal
curl -X DELETE http://localhost:3000/trackmeal \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "mealId": 1
  }'

# PUT: Select a meal
curl -X PUT http://localhost:3000/selectmeal \
  -H "Content-Type: application/json" \
  -d '{
    "mealId": 1,
    "isSelected": true
  }'

# POST: Add a target meal
curl -X POST http://localhost:3000/addtargetmeal \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "mealDate": "2025-04-13",
    "name": "Target Meal",
    "quantity": 1,
    "kcal": 300,
    "p": 25,
    "c": 20,
    "f": 15,
    "image": "http://example.com/images/target-meal.jpg",
    "isVeg": true,
    "mealType": "Dinner"
  }'

# =============================================================================
# User Calls
# =============================================================================

# POST: Schedule a Call between User and Nutritionist
curl -X POST "http://localhost:3000/call" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "scheduled_date": "2025-04-15",
    "scheduled_time": "10:00"
  }'

# GET: Fetch User's Scheduled Calls
curl -X GET "http://localhost:3000/calls" \
  -H "Authorization: Bearer <your_token>"

# PUT: Update the status or time of an existing call
curl -X PUT "http://localhost:3000/call/<call_id>" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "scheduled_date": "2025-04-16",
    "scheduled_time": "12:00",
    "status": "confirmed"
  }'

# =============================================================================
# User Login API
# =============================================================================

# POST: Sign up a new user
curl -X POST "http://localhost:3000/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "securepassword"
  }'

# GET: Fetch all users
curl -X GET "http://localhost:3000/users"

# POST: Login user and get JWT token
curl -X POST "http://localhost:3000/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securepassword"
  }'

# POST: Update user data (or insert if not exists)
curl -X POST "http://localhost:3000/userdata" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "gender": "male",
    "dob": "1990-01-01",
    "height": 180,
    "weight": 75,
    "medical": "None",
    "goal": "Muscle Gain",
    "bodyfat": 15,
    "workout": "5 times a week",
    "food": "Balanced",
    "occupation": "Engineer",
    "onboarded": true,
    "targetWeight": 80
  }'

# POST: Verify user by token
curl -X POST "http://localhost:3000/verifyuser" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "<your_jwt_token>"
  }'

# GET: Fetch API version
curl -X GET "http://localhost:3000/version"

# =============================================================================
# User Meta
# =============================================================================

# GET: Fetch user metadata
curl -X GET "http://localhost:3000/usermeta" \
  -H "Authorization: Bearer <your_token>"