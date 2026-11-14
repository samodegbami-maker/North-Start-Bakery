/*
    North Star Bakery
    Touchstone 4
    Interactivity and Client-Side Data
*/


/* ========================================
   PRODUCT DATA
   ======================================== */

const bakeryProducts = [
    {
        id: "bread",
        name: "Handmade Breads",
        category: "Bread"
    },
    {
        id: "pastries",
        name: "Fresh Pastries",
        category: "Pastry"
    },
    {
        id: "cakes",
        name: "Celebration Cakes",
        category: "Cake"
    }
];

const storageKeys = {
    favorites: "northStarFavorites",
    customerName: "northStarCustomerName",
    requestType: "northStarRequestType"
};


/* ========================================
   FAVORITES FEATURE
   ======================================== */

function getFavorites() {
    const savedFavorites =
        localStorage.getItem(storageKeys.favorites);

    if (savedFavorites) {
        return JSON.parse(savedFavorites);
    }

    return [];
}


function saveFavorites(favorites) {
    localStorage.setItem(
        storageKeys.favorites,
        JSON.stringify(favorites)
    );
}


function getProductName(productId) {
    const product = bakeryProducts.find(
        item => item.id === productId
    );

    if (product) {
        return product.name;
    }

    return "Bakery Item";
}


function toggleFavorite(productId) {
    let favorites = getFavorites();

    if (favorites.includes(productId)) {
        favorites = favorites.filter(
            id => id !== productId
        );
    } else {
        favorites.push(productId);
    }

    saveFavorites(favorites);
    updateFavoritesDisplay();
}


function updateFavoritesDisplay() {
    const favoritesList =
        document.getElementById("favorites-list");

    const favoritesMessage =
        document.getElementById("favorites-message");

    const favoriteButtons =
        document.querySelectorAll(".favorite-button");

    if (!favoritesList || !favoritesMessage) {
        return;
    }

    const favorites = getFavorites();

    favoritesList.innerHTML = "";

    favoriteButtons.forEach(button => {
        const productId = button.dataset.product;

        if (favorites.includes(productId)) {
            button.textContent = "Remove Favorite";
            button.classList.add("saved");
            button.setAttribute("aria-pressed", "true");
        } else {
            button.textContent = "Add to Favorites";
            button.classList.remove("saved");
            button.setAttribute("aria-pressed", "false");
        }
    });

    if (favorites.length === 0) {
        favoritesMessage.textContent =
            "You have not saved any bakery favorites yet.";

        return;
    }

    favoritesMessage.textContent =
        "Your saved favorites:";

    favorites.forEach(productId => {
        const listItem = document.createElement("li");

        listItem.textContent =
            getProductName(productId);

        favoritesList.appendChild(listItem);
    });
}


function initializeFavorites() {
    const favoriteButtons =
        document.querySelectorAll(".favorite-button");

    if (favoriteButtons.length === 0) {
        return;
    }

    favoriteButtons.forEach(button => {
        button.addEventListener("click", function () {
            toggleFavorite(this.dataset.product);
        });
    });

    updateFavoritesDisplay();
}


/* ========================================
   FORM STORAGE
   ======================================== */

function saveFormPreferences() {
    const nameInput =
        document.getElementById("name");

    const requestType =
        document.getElementById("request-type");

    if (nameInput) {
        localStorage.setItem(
            storageKeys.customerName,
            nameInput.value.trim()
        );
    }

    if (requestType) {
        localStorage.setItem(
            storageKeys.requestType,
            requestType.value
        );
    }
}


function loadFormPreferences() {
    const nameInput =
        document.getElementById("name");

    const requestType =
        document.getElementById("request-type");

    const savedName =
        localStorage.getItem(
            storageKeys.customerName
        );

    const savedRequestType =
        localStorage.getItem(
            storageKeys.requestType
        );

    if (nameInput && savedName) {
        nameInput.value = savedName;
    }

    if (requestType && savedRequestType) {
        requestType.value = savedRequestType;
    }
}


/* ========================================
   VALIDATION
   ======================================== */

function showError(fieldId, message) {
    const errorElement =
        document.getElementById(
            fieldId + "-error"
        );

    const field =
        document.getElementById(fieldId);

    if (errorElement) {
        errorElement.textContent = message;
    }

    if (field) {
        field.classList.add("input-error");
        field.setAttribute("aria-invalid", "true");
    }
}


function clearError(fieldId) {
    const errorElement =
        document.getElementById(
            fieldId + "-error"
        );

    const field =
        document.getElementById(fieldId);

    if (errorElement) {
        errorElement.textContent = "";
    }

    if (field) {
        field.classList.remove("input-error");
        field.removeAttribute("aria-invalid");
    }
}


function validateName() {
    const name =
        document.getElementById("name");

    if (!name) {
        return true;
    }

    clearError("name");

    if (name.value.trim() === "") {
        showError(
            "name",
            "Please enter your name."
        );

        return false;
    }

    if (name.value.trim().length < 2) {
        showError(
            "name",
            "Name must contain at least 2 characters."
        );

        return false;
    }

    return true;
}


function validateEmail() {
    const email =
        document.getElementById("email");

    if (!email) {
        return true;
    }

    clearError("email");

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.value.trim() === "") {
        showError(
            "email",
            "Please enter your email address."
        );

        return false;
    }

    if (!emailPattern.test(email.value.trim())) {
        showError(
            "email",
            "Please enter a valid email address."
        );

        return false;
    }

    return true;
}


function validateRequestType() {
    const requestType =
        document.getElementById("request-type");

    if (!requestType) {
        return true;
    }

    clearError("request-type");

    if (requestType.value === "") {
        showError(
            "request-type",
            "Please select a request type."
        );

        return false;
    }

    return true;
}


function validateItemDetails() {
    const details =
        document.getElementById("item-details");

    if (!details) {
        return true;
    }

    clearError("item-details");

    if (details.value.trim().length < 5) {
        showError(
            "item-details",
            "Please provide at least 5 characters of request details."
        );

        return false;
    }

    return true;
}


function validateForm(event) {
    event.preventDefault();

    const nameValid =
        validateName();

    const emailValid =
        validateEmail();

    const requestValid =
        validateRequestType();

    const detailsValid =
        validateItemDetails();

        const pickupDateValid =
            validatePickupDate();

    if (
        nameValid &&
        emailValid &&
        pickupDateValid &&
        requestValid &&
        detailsValid
    ) {
        saveFormPreferences();

        const successMessage =
            document.getElementById(
                "form-success"
            );

        if (successMessage) {
            successMessage.textContent =
                "Your request is ready to submit. Thank you for contacting North Star Bakery!";
        }
    } else {
        const successMessage =
            document.getElementById(
                "form-success"
            );

        if (successMessage) {
            successMessage.textContent = "";
        }
    }
}


/* ========================================
   CONTACT FORM INITIALIZATION
   ======================================== */

function initializeForm() {
    const form =
        document.getElementById(
            "preorder-form"
        );

    if (!form) {
        return;
    }

    loadFormPreferences();

    form.addEventListener(
        "submit",
        validateForm
    );

    const name =
        document.getElementById("name");

    const email =
        document.getElementById("email");

    const requestType =
        document.getElementById(
            "request-type"
        );

    const itemDetails =
        document.getElementById(
            "item-details"
        );

    if (name) {
        name.addEventListener(
            "input",
            validateName
        );

        name.addEventListener(
            "change",
            saveFormPreferences
        );
    }

    if (email) {
        email.addEventListener(
            "input",
            validateEmail
        );
    }

    if (requestType) {
        requestType.addEventListener(
            "change",
            function () {
                validateRequestType();
                saveFormPreferences();
            }
        );
    }

    if (itemDetails) {
        itemDetails.addEventListener(
            "input",
            validateItemDetails
        );
    }
}

function validatePickupDate() {
    const pickupDate =
        document.getElementById("pickup-date");

    if (!pickupDate) {
        return true;
    }

    clearError("pickup-date");

    if (pickupDate.value === "") {
        showError(
            "pickup-date",
            "Please select a pickup date."
        );

        return false;
    }

    return true;
}


/* ========================================
   START APPLICATION
   ======================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {
        initializeFavorites();
        initializeForm();
    }
);