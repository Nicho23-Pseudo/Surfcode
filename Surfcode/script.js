document.addEventListener('DOMContentLoaded', () => {
    // === AVATAR SELEKTOR ===
    const avatars = ["Image/avatar1.png", "Image/avatar2.png", "Image/avatar3.png"];
    let currentAvatarIndex = 0;

    function updateAvatar() {
        const avatarImg = document.getElementById("avatar");
        if (avatarImg) avatarImg.src = avatars[currentAvatarIndex];
    }

    const prevBtn = document.getElementById("prevAvatar");
    const nextBtn = document.getElementById("nextAvatar");
    const startGameBtn = document.getElementById("startGame");

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            currentAvatarIndex = (currentAvatarIndex - 1 + avatars.length) % avatars.length;
            updateAvatar();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            currentAvatarIndex = (currentAvatarIndex + 1) % avatars.length;
            updateAvatar();
        });
    }

    
    if (startGameBtn) {
        startGameBtn.addEventListener("click", () => {
            const playerName = document.getElementById("playerName")?.value.trim();
            if (!playerName) {
                alert("Please enter your name before starting the game.");
                return;
            }
            // Store player name and avatar in localStorage
            localStorage.setItem("playerName", playerName);
            localStorage.setItem("playerAvatar", avatars[currentAvatarIndex]);
            // Redirect to gameplay.html
            window.location.href = "gameplay.html";
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // --- Game State Variables ---
    let currentMoney = 50000; // Starting money
    let stats = { meal: 50, sleep: 50, hygiene: 50, happiness: 50, energy: 50 };
    const MAX_STAT = 100;
    const MIN_STAT = 0;
    const GREEN_THRESHOLD = 50;
    const RED_THRESHOLD = 25;
    let isGameOver = false; // Flag to track if the game has ended
    const GAME_DURATION = 120000; // 2 minutes in millisecond

    // --- Element References ---
    const moneyDisplay = document.getElementById('moneyDisplay');
    // Stat Bars
    const mealBar = document.getElementById('meal-bar');
    const sleepBar = document.getElementById('sleep-bar');
    const hygieneBar = document.getElementById('hygiene-bar');
    const happinessBar = document.getElementById('happiness-bar');
    const energyBar = document.getElementById('energy-bar');
    // Header Elements
    const greetingElement = document.getElementById('greeting');
    const dateTimeElement = document.getElementById('date-time');
    // Location Title & Navigation
    const locationTitle = document.getElementById('location-title');
    const arrowLeftBtn = document.getElementById('arrow-left');
    const arrowRightBtn = document.getElementById('arrow-right');
    // Action Buttons (Get all for easy disabling later)
    const allActionButtons = document.querySelectorAll('.action-button');

    // === Display Player's Name in Greeting ===
    const playerName = localStorage.getItem('playerName') || 'Adventurer'; // Retrieve the player name from localStorage
    const gameTitle = document.getElementById('gameTitle');
    if (gameTitle) {
        gameTitle.textContent = `✈️ ${playerName} Menjelajah Nusantara`;
    }
    if (greetingElement) {
        const hour = new Date().getHours();
        if (hour < 12) {
            greetingElement.textContent = `Good Morning, ${playerName}!`;
        } else if (hour < 18) {
            greetingElement.textContent = `Good Afternoon, ${playerName}!`;
        } else {
            greetingElement.textContent = `Good Evening, ${playerName}!`;
        }
    }

    // --- Location Data & State ---
    const locations = [
        { id: 'location-home', actionsId: 'home-actions', title: '🏠 You\'re at Home', element: document.getElementById('location-home') },
        { id: 'location-campus', actionsId: 'campus-actions', title: '🎓 You\'re at Campus', element: document.getElementById('location-campus') },
        { id: 'location-mall', actionsId: 'mall-actions', title: '🛍️ You\'re at the Mall', element: document.getElementById('location-mall') },
        { id: 'location-cafe', actionsId: 'cafe-actions', title: '☕ You\'re at the Cafe', element: document.getElementById('location-cafe') },
        { id: 'location-mountain', actionsId: 'mountain-actions', title: '⛰️ You\'re at the Mountain', element: document.getElementById('location-mountain') }
    ];
    let currentLocationIndex = 0;
    const actionPanels = locations.map(loc => document.getElementById(loc.actionsId));

    // --- Core Functions ---

    // Function to handle the game over state (Lose)
    // In the gameOverLose function, replace the current content with:
    function gameOverLose() {
        if (isGameOver) return;
        isGameOver = true;
        console.log("GAME OVER - Time ran out!");
    
        // Hide all action panels
        actionPanels.forEach(panel => {
            if (panel) panel.style.display = 'none';
        });
    
        // Disable all action buttons
        allActionButtons.forEach(button => {
            button.style.display = 'none';
        });
    
        // Disable navigation buttons
        arrowLeftBtn.style.display = 'none';
        arrowRightBtn.style.display = 'none';
    
        // Clear the location title area
        const actionContainer = document.querySelector('aside > div:last-child');
        actionContainer.innerHTML = '';
    
        // Create congratulations message
        const congratsMessage = document.createElement('div');
        congratsMessage.className = 'text-center py-4';
        congratsMessage.innerHTML = '<h2 class="text-2xl font-bold mb-4">👏😄 CONGRATULATIONS!! 😄👏</h2>';
    
        // Create and show the back button
        const backButton = document.createElement('button');
        backButton.textContent = 'Back to player page';
        backButton.id = 'backToPlayerPage';
        backButton.className = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mx-auto block';
        backButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    
        // Add elements to the container
        actionContainer.appendChild(congratsMessage);
        actionContainer.appendChild(backButton);
    }


    function updateStatusBar(barElement, value, statName) {
        // No updates if game over
        // if (isGameOver) return; // Decided against this, maybe show final stats?

        const percentage = Math.max(MIN_STAT, Math.min(MAX_STAT, value));
        barElement.style.width = `${percentage}%`;
        if (percentage < RED_THRESHOLD) barElement.style.backgroundColor = 'red';
        else if (percentage <= GREEN_THRESHOLD) barElement.style.backgroundColor = 'orange';
        else barElement.style.backgroundColor = 'lightgreen';

        // Optionally check for stat-based game over here too
        // if (percentage <= MIN_STAT && (statName === 'Energy' || statName === 'Meal')) {
        //    gameOverLose(); // Example: Lose if energy or meal hits 0
        // }
    }

    function updateAllStatusBars() {
        updateStatusBar(mealBar, stats.meal, 'Meal');
        updateStatusBar(sleepBar, stats.sleep, 'Sleep');
        updateStatusBar(hygieneBar, stats.hygiene, 'Hygiene');
        updateStatusBar(happinessBar, stats.happiness, 'Happiness');
        updateStatusBar(energyBar, stats.energy, 'Energy');
    }

    function updateMoneyDisplay() {
        moneyDisplay.textContent = currentMoney.toLocaleString('id-ID');
    }

    // Store interval ID to potentially clear it later
    let dateTimeIntervalId = null;
    function updateDateTime() {
        const now = new Date();
        const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        dateTimeElement.textContent = `${now.toLocaleDateString('en-GB', optionsDate)}, ${now.toLocaleTimeString('en-GB', optionsTime)}`;
    }

    function updateLocationUI(newIndex) {
        if (isGameOver) return; // Prevent navigation after game over

        const validIndex = (newIndex % locations.length + locations.length) % locations.length;
        locations.forEach(loc => loc.element?.classList.remove('border-4', 'border-blue-500'));
        actionPanels.forEach(panel => { if (panel) panel.style.display = 'none'; });

        const currentLocation = locations[validIndex];
        currentLocation.element?.classList.add('glow', 'border-4', 'border-blue-500');
        setTimeout(() => currentLocation.element?.classList.remove('glow'), 600);

        const currentActionPanel = document.getElementById(currentLocation.actionsId);
        if (currentActionPanel) currentActionPanel.style.display = 'flex';
        else console.warn(`Action panel with ID ${currentLocation.actionsId} not found.`);
        locationTitle.textContent = currentLocation.title;
        currentLocationIndex = validIndex;
        arrowLeftBtn.disabled = false;
        arrowRightBtn.disabled = false;
    }

    // Helper function for actions involving cost and energy
    function performAction(cost, energyCost, statChanges = {}, successMessage = "Action successful!") {
        if (isGameOver) return false; // Check if game has ended

        if (currentMoney < cost) {
            alert("Not enough money!");
            return false;
        }
        if (stats.energy < energyCost) {
            alert("Not enough energy!");
            return false;
        }
        currentMoney -= cost;
        stats.energy = Math.max(stats.energy - energyCost, MIN_STAT);
        for (const stat in statChanges) {
            if (stats.hasOwnProperty(stat)) {
                stats[stat] = Math.max(MIN_STAT, Math.min(MAX_STAT, stats[stat] + statChanges[stat]));
            }
        }
        console.log(successMessage);
        updateMoneyDisplay();
        updateAllStatusBars();
        return true;
    }

    // --- Event Listeners ---
    // Add the check 'if (isGameOver) return;' at the beginning of EVERY action listener

    // Home Actions
    document.getElementById('mealBtn')?.addEventListener('click', () => { if (isGameOver) return; performAction(0, 5, { meal: 40 }, "Action: Get some meal"); });
    document.getElementById('bathBtn')?.addEventListener('click', () => { if (isGameOver) return; performAction(0, 5, { hygiene: 50 }, "Action: Take a bath"); });
    document.getElementById('sleepBtn')?.addEventListener('click', () => {
        if (isGameOver) return;
        console.log("Action: Sleep");
        stats.sleep = MAX_STAT;
        stats.energy = Math.min(stats.energy + 70, MAX_STAT);
        stats.meal = Math.max(stats.meal - 10, MIN_STAT);
        stats.hygiene = Math.max(stats.hygiene - 5, MIN_STAT);
        updateAllStatusBars();
    });
    document.getElementById('choresBtn')?.addEventListener('click', () => {
        if (isGameOver) return;
        if (stats.energy >= 20) {
            currentMoney += 500;
            stats.energy = Math.max(stats.energy - 20, MIN_STAT);
            stats.happiness = Math.max(stats.happiness - 5, MIN_STAT);
            stats.hygiene = Math.max(stats.hygiene - 10, MIN_STAT);
            console.log("Action: Do chores (+500 gold)");
            updateMoneyDisplay();
            updateAllStatusBars();
        } else { alert("Not enough energy to do chores!"); }
    });

    // Campus Actions (Selector based - consider adding IDs)
    document.querySelector('#campus-actions button:nth-child(1)')?.addEventListener('click', () => { if (isGameOver) return; performAction(0, 25, { happiness: -5 }, "Action: Attending Class"); });
    document.querySelector('#campus-actions button:nth-child(2)')?.addEventListener('click', () => { if (isGameOver) return; performAction(1000, 5, { meal: 35 }, "Action: Get Some Meal at Campus"); });
    document.querySelector('#campus-actions button:nth-child(3)')?.addEventListener('click', () => { if (isGameOver) return; performAction(0, 15, { happiness: 20 }, "Action: Hang Out"); });

    // Mall Actions
    document.getElementById('buyClothesBtn')?.addEventListener('click', () => { if (isGameOver) return; performAction(5000, 5, { happiness: 20 }, "Action: Buy Clothes"); });
    document.getElementById('watchCinemaBtn')?.addEventListener('click', () => { if (isGameOver) return; performAction(2000, 10, { happiness: 25 }, "Action: Watch Cinema"); });
    document.getElementById('eatMallFoodBtn')?.addEventListener('click', () => { if (isGameOver) return; performAction(1000, 5, { meal: 30, happiness: 5 }, "Action: Eat Mall Food"); });
    document.getElementById('playArcadeBtn')?.addEventListener('click', () => { if (isGameOver) return; performAction(2000, 15, { happiness: 20 }, "Action: Play at Arcade"); });

    // Cafe Actions
    document.getElementById('BuyCoffeeBtn')?.addEventListener('click', () => { if (isGameOver) return; performAction(500, 0, { energy: 15, happiness: 5 }, "Action: Buy Coffee"); });
    document.getElementById('AssingmentBtn')?.addEventListener('click', () => { if (isGameOver) return; performAction(0, 30, { happiness: -10 }, "Action: Doing Assignment"); });
    document.getElementById('ReadingBtn')?.addEventListener('click', () => { if (isGameOver) return; performAction(0, 10, { happiness: 10 }, "Action: Read a Book"); });
    document.getElementById('WorkBtn')?.addEventListener('click', () => {
        if (isGameOver) return;
        const workEnergyCost = 40;
        if (stats.energy >= workEnergyCost) {
            currentMoney += 2000;
            stats.energy = Math.max(stats.energy - workEnergyCost, MIN_STAT);
            stats.happiness = Math.max(stats.happiness - 15, MIN_STAT);
            stats.hygiene = Math.max(stats.hygiene - 5, MIN_STAT);
            console.log("Action: Work Part Time (+2000 gold)");
            updateMoneyDisplay();
            updateAllStatusBars();
        } else { alert("Not enough energy to work part time!"); }
    });

    // Mountain Actions (Selector based - consider adding IDs)
    document.querySelector('#mountain-actions button:nth-child(1)')?.addEventListener('click', () => { if (isGameOver) return; performAction(0, 35, { happiness: 30, hygiene: -15 }, "Action: Camp"); });
    document.querySelector('#mountain-actions button:nth-child(2)')?.addEventListener('click', () => { if (isGameOver) return; performAction(0, 10, { meal: 40 }, "Action: Eat a Meal (Mountain)"); });
    document.querySelector('#mountain-actions button:nth-child(3)')?.addEventListener('click', () => { if (isGameOver) return; performAction(0, 20, { happiness: 15 }, "Action: Light a Campfire"); });


    // Map Navigation & Interaction
    arrowRightBtn?.addEventListener('click', () => updateLocationUI(currentLocationIndex + 1));
    arrowLeftBtn?.addEventListener('click', () => updateLocationUI(currentLocationIndex - 1));
    locations.forEach((loc, index) => {
        loc.element?.addEventListener('click', () => updateLocationUI(index));
    });


    // --- Initialization ---
    updateMoneyDisplay();
    updateAllStatusBars();
    updateDateTime(); // Initial call
    dateTimeIntervalId = setInterval(updateDateTime, 1000); // Update time every second
    updateLocationUI(currentLocationIndex); // Set initial view

    // Start the game over timer
    console.log(`Game will end in ${GAME_DURATION / 1000} seconds.`);
    setTimeout(gameOverLose, GAME_DURATION);

}); // End DOMContentLoaded
$('#playerName').on('input', function () {
    const name = $(this).val();
    $('.header h1').text(`Selamat Datang, ${name || 'Ucup'}!`);
});

