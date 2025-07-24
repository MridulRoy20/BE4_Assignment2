const express = require("express")
const app = express();

const Recipe = require("./models/recipe.model")

app.use(express.json())

const {initializeDatabase} = require("./db/db.connect")

initializeDatabase();

async function createRecipe(newRecipe){
    try {
        const recipe = new Recipe(newRecipe)
        const savedRecipe = recipe.save();
        return savedRecipe;
    } catch (error) {
        throw error;
    }
}
app.post("/recipe", async (req, res) => {
    try {
        const savedData = await createRecipe(req.body)
        if(savedData){
            res.status(200).json(savedData)
        } else {
            res.status(404).json({error: "Unable to add data."})
        }
    } catch (error) {
        res.status(500).json({error: "Unable to fetch data."})
    }
})

async function readAllRecipe(){
    try {
        const recipes = await Recipe.find()
        return recipes;
    } catch (error) {
        throw error;
    }
}
app.get("/recipes", async (req, res) => {
    try {
        const recipeData = await readAllRecipe()
        if(recipeData.length != 0){
            res.status(200).json(recipeData)
        } else {
            res.status(404).json({error: "Recipe not found."})
        }
    } catch (error) {
        res.status(500).json({error: "Unable to fetch data."})
    }
})
// 7. Create an API to get a recipe's details by its title. Make sure to handle errors properly.

async function readRecipeByTitle(title){
    try {
        const recipe = await Recipe.findOne({title: title})
        return recipe;
    } catch (error) {
        throw error;
    }
}
app.get("/recipes/:title", async (req, res) => {
    try {
        const recipeData = await readRecipeByTitle(req.params.title);
        if(recipeData){
            res.status(200).json(recipeData)
        } else {
            res.status(404).json({error: "Recipe not found!"})
        }
    } catch (error) {
        res.status(500).json({error: "Unable to fetch data."})
    }
})

// 8. Create an API to get details of all the recipes by an author. Make sure to handle errors properly.

async function readAllRecipeByAuthor(author){
    try {
        const recipe = await Recipe.find({author : author});
        return recipe;
    } catch (error) {
        throw error;
    }
}
app.get("/recipes/author/:authorName", async (req, res) => {
    try {
        const recipeData = await readAllRecipeByAuthor(req.params.authorName)
        if(recipeData.length != 0){
            res.status(200).json(recipeData)
        } else {
            res.status(404).json({error: "Recipe not found!"})
        }
    } catch (error) {
        res.status(500).json({error: "Unable to fetch data."})
    }
})
// 9. Create an API to get all the recipes that are of "Easy" difficulty level.

async function readAllRecipeEasy(difficulty){
    try {
        const recipe = await Recipe.find({difficulty : difficulty})
        return recipe;
    } catch (error) {
        throw error;
    }
}
app.get("/recipes/difficulty/easy", async (req, res) => {
    try {
        const recipeData = await readAllRecipeEasy("Easy")
        if(recipeData.length != 0){
            res.status(200).json(recipeData)
        } else {
            res.status(404).json({error: "Recipe not found!"})
        }
    } catch (error) {
        res.status(500).json({error: "Unable to fetch data."})
    }
})

// 10. Create an API to update a recipe's difficulty level with the help of its id. Update the 
// difficulty of "Spaghetti Carbonara" from "Intermediate" to "Easy". 
// Send an error message "Recipe not found" if the recipe is not found. Make sure to handle errors properly.

async function updateRecipeDifficulty(recipeId, dataToUpdate){
    try {
        const recipe = await Recipe.findByIdAndUpdate(recipeId, dataToUpdate, {new : true})
        return recipe;
    } catch (error) {
        throw error;
    }
}
app.post("/recipes/difficulty/:recipeId", async (req, res) => {
    try {
        const recipe = await updateRecipeDifficulty(req.params.recipeId, req.body)
        if(recipe){
            res.status(200).json({message: "Recipe updated successfully!", recipe: recipe})
        } else {
            res.status(404).json({error: "Recipe not found!"})
        }
    } catch (error) {
        res.status(500).json({error: "Unable to fetch data."})
    }
})
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
})

// 11. Create an API to update a recipe's prep time and cook time with the help of its title. 
// Update the details of the recipe "Chicken Tikka Masala". Send an error message "Recipe not found" if the recipe is not found. 
// Make sure to handle errors properly.

// Updated recipe data: { "prepTime": 40, "cookTime": 45 }

async function updateRecipeByTitle(title, dataToUpdate){
    try {
        const data = await Recipe.findOneAndUpdate({title: title}, dataToUpdate, {new : true});
        return data;
    } catch (error) {
        throw error;
    }
}
app.post("/recipes/time/:recipeTitle", async(req, res) => {
    try {
        const savedData = await updateRecipeByTitle(req.params.recipeTitle, req.body);
        if(savedData){
            res.status(200).json(savedData);
        } else {
            res.status(404).json({error: "Recipe not found."})
        }
    } catch (error) {
        res.status(500).json({error: "Unable to fetch data."})
    }
})

// 12. Create an API to delete a recipe with the help of a recipe id. 
// Send an error message "Recipe not found" if the recipe does not exist. Make sure to handle errors properly.

async function deleteRecipeById(id){
    try {
        const recipe = await Recipe.findByIdAndDelete(id);
        return recipe;
    } catch (error) {
        throw error;
    }
}

app.delete("/recipes/:recipeId", async(req, res)=> {
    try {
        const recipeData = await deleteRecipeById(req.params.recipeId)
        if(recipeData){
            res.status(200).json({message: "Recipe deleted successfully.", recipe: recipeData})
        } else {
            res.status(404).json({error: "Recipe not found."})
        }
    } catch (error) {
        res.status(500).json({error: "Unable to fetch data."})
    }
})