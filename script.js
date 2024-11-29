const API_URL = 'http://localhost:3000/api/v1/Recipes';
 
const recipeForm = document.getElementById('recipeForm');

// Fetch recipe from the database
 async function loadRecipes() {
    try {
        const response = await fetch(API_URL);
        const recipes = await response.json();
        displayRecipeList(recipes.data);
    } catch (error) {
        console.log(error.message);
    }
 };
 
//  Display each recipe in a list on the recipeList 
 function displayRecipeList(recipes) {
    const recipeList = document.getElementById('recipeList');
    recipeList.innerHTML = '';
    recipes.forEach(recipe => {
        const li = document.createElement('li');
        li.textContent = recipe.name;
        li.onclick = () => viewRecipe(recipe._id);
        recipeList.appendChild(li);
    });
 };

//  Function to display the data for each list using the id
 async function viewRecipe(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const recipe = await response.json();
        displayRecipeDetails(recipe.data);    
    } catch (error) {
        console.log('Error viewing recipe:', error.message);
    }
 };
 
//  Function assigning tag for each data collected
 function displayRecipeDetails(recipe) {
    document.getElementById('recipeDetails').innerHTML = `
        <h3>${recipe.name}</h3>
        <p><strong>Ingredients:</strong> ${recipe.ingredient}</p>
        <p><strong>Instructions:</strong> ${recipe.instruction}</p>
        <p><strong>Meal Type:</strong> ${recipe.mealType}</p>
        <p><strong>Favorite:</strong> ${recipe.favorite ? 'Yes' : 'No'}</p>

        <button id="editRecipe" onclick="editRecipe('${recipe._id}')">Edit</button>
        <button id="deleteRecipe" onclick="deleteRecipe('${recipe._id}')">Delete</button>`;
 };

//  Edit function to edit the data and send to the database
  function editRecipe(id){
    currentRecipeId = id;
    
    document.getElementById('formTitle').textContent = 'Edit Recipe';
    const recipeDetails = document.getElementById('recipeDetails');

    const name = recipeDetails.querySelector('h3').textContent;
    const ingredient = recipeDetails.querySelector('p:nth-child(2)').textContent.replace('Ingredients: ', '');
    const instruction = recipeDetails.querySelector('p:nth-child(3)').textContent.replace('Instructions: ', '');
    const mealType = recipeDetails.querySelector('p:nth-child(4)').textContent.replace('Meal Type: ', '');
    const favorite = recipeDetails.querySelector('p:nth-child(5)').textContent.includes('Yes');

    // Pre-fill the form with selected recipe data
    document.getElementById('name').value = name;
    document.getElementById('ingredient').value = ingredient;
    document.getElementById('instruction').value = instruction;
    document.getElementById('mealType').value = mealType;
    document.getElementById('favorite').checked = favorite;
 };

//  function to handle the submit event when save Recipe is clicked
 async function handleFormSubmit(event) {
    event.preventDefault();
    const name =  document.getElementById('name').value;
    const ingredient = document.getElementById('ingredient').value;
    const instruction = document.getElementById('instruction').value;
    const mealType = document.getElementById('mealType').value;
    const favorite = document.getElementById('favorite').checked;
    const recipeData = {name, ingredient, instruction, mealType, favorite};
    try { 
        if(currentRecipeId) {
            // Update existing recipe
            await fetch(`${API_URL}/${currentRecipeId}`,{
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recipeData),
            });
        //    const update = window.confirm("Recipe Updated successfully");
        //    if(update)return;
            document.getElementById('formTitle').textContent = 'Add New Recipe';
            clearForm(); 
            loadRecipes();
        } else {
            // Add new recipe
            await fetch(`${API_URL}/add`,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recipeData),
            });
        }
        loadRecipes(); // Refresh the list
        clearForm();   // Clear the form
    } catch (error) {
        console.log(error);
    }
}
 // Delete Recipe Handler
 async function deleteRecipe(id) {
    currentRecipeId = id;  
     if (!currentRecipeId) {
         alert('Please select a recipe to delete.');
         return;
     }
     const confirmDelete = confirm('Are you sure you want to delete this recipe?');
     if (!confirmDelete) return;
     try {
         await fetch(`${API_URL}/${currentRecipeId}`, {
             method: 'DELETE',
         });
         loadRecipes(); // Refresh the list
         document.getElementById('recipeDetails').innerHTML = ''; 
         currentRecipeId = null; // Reset current recipe ID
     } catch (error) {
         console.log('Error deleting recipe:', error);
     }
 }

 // Clear Form After Submission
 function clearForm() {
     document.getElementById('recipeForm').reset();
     currentRecipeId = null;
 }

loadRecipes();
// Event Listeners
recipeForm.addEventListener('submit', handleFormSubmit);
