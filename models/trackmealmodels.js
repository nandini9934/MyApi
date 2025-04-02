// Commenting out the Mongoose schema
/*
const mongoose = require("mongoose");
const { type } = require("os");

const trackmealSchema = new mongoose.Schema(
  {
    id: { type: Number },
    mealbydate: [
      {
        date: { type: String },
        meallist: [
          {
            name: { type: String },
            quantity: { type: Number }, //don't want
            kcal: { type: String },
            p: { type: String },
            c: { type: String },
            f: { type: String },
            image: { type: String },
            isVeg: { type: Number },
            isSelected: { type: Boolean }, //don't want
            mealType: { type: String },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("trackyourmeal", trackmealSchema);
*/

// This is a Sequelize model for a meal tracking application
// It defines the structure of the Meal table in the database
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Ensure this points to your Sequelize instance

const Meal = sequelize.define("Meal", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // Ensure a default value is set
    validate: {
      notNull: { msg: "ID cannot be null" },
      isInt: { msg: "ID must be an integer" },
      min: { args: [1], msg: "ID must be greater than 0" } // Optional: Ensure ID is positive
    }
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => new Date().toISOString().split('T')[0], // Default to today's date
    validate: {
      notNull: { msg: "Date cannot be null" },
      notEmpty: { msg: "Date cannot be empty" },
      isDate: { msg: "Date must be in a valid format (YYYY-MM-DD)" } // Optional: Validate date format
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  kcal: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  p: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  c: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  f: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true, // explicitly allow null
    defaultValue: null // set default to null
  },
  isVeg: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  mealType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  hooks: {
    beforeValidate: (meal) => {
      // Ensure undefined fields are set to null
      Object.keys(meal.dataValues).forEach(key => {
        if (meal[key] === undefined) {
          meal[key] = null;
        }
      });
      console.log("Before validation:", meal.dataValues);
    },
    beforeCreate: (meal) => {
      console.log("Before create:", meal.dataValues);
    }
  }
});

module.exports = Meal;
