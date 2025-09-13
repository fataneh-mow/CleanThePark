"use strict";
// a. Variables
// Keep track of levels, trash count, recycled trash, and trash items.
// Trash types as emojis:
// const trashTypes = ["🍌","🍕","💩","🥑","🤡"];

let level = 1;
let trashCount = 0;
let recycledTrash = 0;
let trashItems = [];
const trashTypes = ["🍌", "🍕", "💩", "🥑", "🤡"];


// b. Trash Items
// Create a function createTrash(num) to spawn trash items.
// Trash items should:
// Have random sizes (smaller as levels increase)
// Be clickable to “catch”
// Be draggable to the bin

// Function to create trash items
function createTrash(num) {
    for (let i = 0; i < num; i++) {
        const trash = document.createElement("div");
        trash.classList.add("trash");
    
        const emoji = trashTypes[Math.floor(Math.random() * trashTypes.length)];   // picking a random emoji from trashTypes using Math.random
        trash.textContent = emoji;
  
      // Making its size random - but smaller as level invreases
      let baseSize = Math.max(40, 80 - level * 5); // minimum 40px
      const size = baseSize + Math.floor(Math.random() * 20);
      trash.style.fontSize = `${size}px`;
  
      // amking a random positon in the screen viewport
      const x = Math.random() * (window.innerWidth - 100);
      const y = Math.random() * (window.innerHeight - 200); // avoiding from footer area 
      trash.style.position = "absolute";
      trash.style.left = `${x}px`;
      trash.style.top = `${y}px`;
  
      trash.setAttribute("draggable", true); // making it draggable
  
      trash.addEventListener("click", () => { //evenListener for when being clicjked
        recycleTrash(trash);
      });
  
      trash.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", "trash");
        e.dataTransfer.setDragImage(trash, 25, 25); // ghost image offset
        trash.classList.add("dragging");
      });
  
      trash.addEventListener("dragend", () => {
        trash.classList.remove("dragging");
      });
  
      document.body.appendChild(trash); //  adding it to teh DOM and the track
      trashItems.push(trash);
      trashCount++;
    }
  }
  

// c. Drag & Drop
// Implement drag-and-drop on the bin.
// When a trash item is dropped:
// Play a catch sound
// Remove the trash item from the screen
// Update recycled counter and messages
// Animate the bin (scale up briefly)

const bin = document.getElementById("bin");
const catchSound = document.getElementById("catch-sound");

const scoreBoard = document.getElementById("score");

bin.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  
bin.addEventListener("drop", (e) => {
e.preventDefault();
  
    const dragging = document.querySelector(".dragging");
    if (dragging) {
      //Playing teh sound
      catchSound.currentTime = 0; 
      catchSound.play();
  
      // Removing trashs items
      recycleTrash(dragging);
  
      // Animated bin
      bin.classList.add("dropped");
      setTimeout(() => bin.classList.remove("dropped"), 300);
  
      // Updating scoreboard
      if (scoreBoard) {
        scoreBoard.textContent = `Recycled: ${recycledTrash}`;
      }
    }
});

function recycleTrash(trash) {
    trash.remove();
    recycledTrash++;
    trashCount--;
  
    // Optional console log for debugging
    // console.log(`Recycled: ${recycledTrash}, Remaining: ${trashCount}`);   don'r need this for now
}



  
// d. Levels
// Start at level 1 with 3 trash items.
// Increase trash count and speed on each level.
// Update level display and show messages like:
// "Level up! New trash incoming..."
const levelDisplay = document.getElementById("level");
const messageDisplay = document.getElementById("message");

function startLevel() {
    // Clear existing trash
    trashItems.forEach(trash => trash.remove());
    trashItems = [];
    trashCount = 0;

    // Number of trash items increases with level
    const numTrash = 3 + level; // Level 1 = 4 items, Level 2 = 5, etc.
    
    // Create the trash items
    createTrash(numTrash);

    // Update level display
    if (levelDisplay) {
        levelDisplay.textContent = `Level ${level}`;
    }

    // Show message
    if (messageDisplay) {
        messageDisplay.textContent = `Level ${level}! Trash incoming...`;
        setTimeout(() => messageDisplay.textContent = "", 2000); // hide after 2 sec
    }
}

function levelUp() {
    level++;
    startLevel();
}

function recycleTrash(trash) {
    trash.remove();
    recycledTrash++;
    trashCount--;

    // Update score message (optional)
    messageDisplay.textContent = `Recycled: ${recycledTrash}`;

    // Check if all trash is collected
    if (trashCount === 0) {
        setTimeout(() => {
            levelUp(); // move to next level
        }, 1000); // 1 second delay before next level
    }
}



// e. Escape Logic
// Trash should move away when the mouse comes close.
// Add a slight “wiggle” for fun.

document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    trashItems.forEach(trash => {
        // Get current trash position
        const rect = trash.getBoundingClientRect();
        const trashX = rect.left + rect.width / 2;
        const trashY = rect.top + rect.height / 2;

        // Calculate distance to mouse
        const dx = mouseX - trashX;
        const dy = mouseY - trashY;
        const distance = Math.sqrt(dx*dx + dy*dy);

        const escapeRadius = 100; // pixels

        if (distance < escapeRadius) {
            // Move trash away from mouse
            const moveX = -dx / distance * 10; // speed factor
            const moveY = -dy / distance * 10;

            let newX = rect.left + moveX;
            let newY = rect.top + moveY;

            // Keep trash inside window
            newX = Math.min(Math.max(newX, 0), window.innerWidth - rect.width);
            newY = Math.min(Math.max(newY, 0), window.innerHeight - rect.height);

            trash.style.left = `${newX}px`;
            trash.style.top = `${newY}px`;

            // Slight wiggle
            const wiggle = Math.sin(Date.now() / 100) * 5;
            trash.style.transform = `rotate(${wiggle}deg)`;
        } else {
            trash.style.transform = `rotate(0deg)`; // reset rotation
        }
    });
});


// f. Random Chaos
// Occasionally show a cat paw (🐾) to shuffle trash positions.

function showCatPaw() {
    const paw = document.createElement("div");
    paw.classList.add("cat-paw");
    paw.textContent = "🐾";

    // Random position on screen
    const x = Math.random() * (window.innerWidth - 50);
    const y = Math.random() * (window.innerHeight - 50);
    paw.style.position = "absolute";
    paw.style.left = `${x}px`;
    paw.style.top = `${y}px`;
    paw.style.fontSize = "3rem";
    paw.style.pointerEvents = "none"; // so it doesn't block trash
    document.body.appendChild(paw);

    // Shuffle trash positions
    shuffleTrash();

    // Remove paw after short time
    setTimeout(() => paw.remove(), 1000);
}

function shuffleTrash() {
    trashItems.forEach(trash => {
        const rect = trash.getBoundingClientRect();
        const newX = Math.random() * (window.innerWidth - rect.width);
        const newY = Math.random() * (window.innerHeight - rect.height);
        trash.style.left = `${newX}px`;
        trash.style.top = `${newY}px`;
    });
}

// Every 8–15 seconds, trigger random chaos
setInterval(() => {
    if (trashItems.length > 0) {
        showCatPaw();
    }
}, 8000 + Math.random() * 7000); // 8s + 0-7s


// g. Sounds
// Add a common catch sound for trash items.
// Add looping background music that starts on the first click to allow autoplay.
// Step 4: Initialization
// Display the starting level and instructions.
// Call createTrash(trashCount) to spawn the first trash items.
// Start the random chaos loop with requestAnimationFrame.

// const catchSound = document.getElementById("catchSound");
const bgMusic = document.getElementById("bgMusic");

let musicStarted = false;

document.addEventListener("click", () => {
    if (!musicStarted) {
        bgMusic.volume = 0.3; // lower volume
        bgMusic.play();
        musicStarted = true;
    }
}, { once: true });

function recycleTrash(trash) {
    trash.remove();
    recycledTrash++;
    trashCount--;

    // Play catch sound
    catchSound.currentTime = 0;
    catchSound.play();

    // Update score or message display
    if (messageDisplay) {
        messageDisplay.textContent = `Recycled: ${recycledTrash}`;
    }

    // Check for level completion
    if (trashCount === 0) {
        setTimeout(() => levelUp(), 1000);
    }
}

function initGame() {
    level = 1;
    recycledTrash = 0;

    // Display starting level and instructions
    if (levelDisplay) levelDisplay.textContent = `Level ${level}`;
    if (messageDisplay) messageDisplay.textContent = "Drag trash into the bin!";

    // Spawn initial trash
    const initialTrash = 3; // Level 1
    createTrash(initialTrash);

    // Start random chaos loop
    function chaosLoop() {
        if (trashItems.length > 0) {
            // Random chance to trigger chaos
            if (Math.random() < 0.002) { // ~0.2% per frame
                showCatPaw();
            }
        }
        requestAnimationFrame(chaosLoop);
    }
    requestAnimationFrame(chaosLoop);
}

initGame();


