
"use strict";

// ELEMENTS
const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");
const generateBtn = document.getElementById("generateBtn");
const passwordOutput = document.getElementById("passwordOutput");
const copyBtn = document.getElementById("copyBtn");
const message = document.getElementById("message");

const advancedToggle = document.getElementById("advancedToggle");
const advancedPanel = document.getElementById("advancedPanel");

const themeToggle = document.getElementById("themeToggle");

const checkPassword = document.getElementById("checkPassword");
const showPassword = document.getElementById("showPassword");


// CHARACTER SETS
const characterSets = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{};:,.<>?"
};

const similarCharacters = "il1Lo0O";


// CRYPTOGRAPHIC RANDOM NUMBER
function secureRandom(max) {
    if (!Number.isInteger(max) || max < 1) {
        throw new Error("Invalid random range.");
    }

    const range = 0x100000000;
    const limit = range - (range % max);
    const values = new Uint32Array(1);

    do {
        crypto.getRandomValues(values);
    } while (values[0] >= limit);

    return values[0] % max;
}


// SHUFFLE
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = secureRandom(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}


// GENERATE PASSWORD
function generatePassword() {
    const length = Number(lengthSlider.value);

    const excludeSimilar =
        document.getElementById("excludeSimilar").checked;

    const excludeDuplicates =
        document.getElementById("excludeDuplicates").checked;

    let selectedSets = [];

    Object.entries(characterSets).forEach(([key, characters]) => {
        if (document.getElementById(key).checked) {
            if (excludeSimilar) {
                characters = [...characters]
                    .filter(char => !similarCharacters.includes(char))
                    .join("");
            }

            selectedSets.push(characters);
        }
    });

    if (selectedSets.length === 0) {
        passwordOutput.value = "";
        message.textContent = "Select at least one character type.";
        updateStrength("");
        return;
    }

    if (length < selectedSets.length) {
        message.textContent =
            "Password length is too short for selected options.";
        return;
    }

    let availableCharacters = selectedSets.join("");

    if (excludeDuplicates) {
        availableCharacters = [...new Set(availableCharacters)].join("");
        selectedSets = selectedSets.map(set =>
            [...set].join("")
        );
    }

    const passwordCharacters = [];

    // Include at least one character from every selected category
    selectedSets.forEach(set => {
        passwordCharacters.push(set[secureRandom(set.length)]);
    });

    // Fill remaining positions
    while (passwordCharacters.length < length) {
        const character =
            availableCharacters[secureRandom(availableCharacters.length)];

        if (excludeDuplicates && passwordCharacters.includes(character)) {
            continue;
        }

        passwordCharacters.push(character);
    }

    shuffle(passwordCharacters);

    const password = passwordCharacters.join("");

    passwordOutput.value = password;
    message.textContent = "Your password is ready!";

    updateStrength(password);
}


// LENGTH SLIDER
lengthSlider.addEventListener("input", () => {
    lengthValue.textContent = lengthSlider.value;
});


// ADVANCED SETTINGS
advancedToggle.addEventListener("change", () => {
    advancedPanel.classList.toggle("show", advancedToggle.checked);
});


// THEME
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    themeToggle.textContent =
        document.body.classList.contains("light-mode") ? "☾" : "☀";
});


// GENERATE BUTTON
generateBtn.addEventListener("click", generatePassword);


// COPY BUTTON
copyBtn.addEventListener("click", async () => {
    const password = passwordOutput.value;

    if (!password) {
        message.textContent = "Generate a password first.";
        return;
    }

    try {
        await navigator.clipboard.writeText(password);

        copyBtn.textContent = "Copied!";
        message.textContent = "Password copied successfully!";

        setTimeout(() => {
            copyBtn.textContent = "Copy";
        }, 1600);

    } catch {
        message.textContent =
            "Copy unavailable. Please select and copy manually.";
    }
});


// PASSWORD STRENGTH
function getStrength(password) {
    if (!password) {
        return { score: 0, label: "Not generated", color: "#9658e9" };
    }

    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) {
        return { score: 25, label: "Weak", color: "#f16e7a" };
    }

    if (score <= 4) {
        return { score: 50, label: "Fair", color: "#efb45e" };
    }

    if (score <= 5) {
        return { score: 75, label: "Good", color: "#b8d46c" };
    }

    return { score: 100, label: "Strong", color: "#65d69b" };
}


// UPDATE STRENGTH METER
function updateStrength(password) {
    const result = getStrength(password);

    document.getElementById("strengthText").textContent =
        result.label;

    document.getElementById("strengthText").style.color =
        result.color;

    document.getElementById("strengthFill").style.width =
        result.score + "%";

    document.getElementById("strengthFill").style.background =
        result.color;
}


// REQUIREMENT CHECKS
const requirements = {
    reqLength: password => password.length >= 8,
    reqUpper: password => /[A-Z]/.test(password),
    reqLower: password => /[a-z]/.test(password),
    reqNumber: password => /[0-9]/.test(password),
    reqSymbol: password => /[^a-zA-Z0-9\s]/.test(password)
};


// CHECKER
function checkPasswordStrength() {
    const password = checkPassword.value;
    const suggestion = document.getElementById("suggestion");

    let passed = 0;
    const missing = [];

    const messages = {
        reqLength: "at least 8 characters",
        reqUpper: "an uppercase letter",
        reqLower: "a lowercase letter",
        reqNumber: "a number",
        reqSymbol: "a special character"
    };

    Object.entries(requirements).forEach(([id, test]) => {
        const valid = test(password);
        const element = document.getElementById(id);

        element.classList.toggle("valid", valid);
        element.querySelector("span").textContent = valid ? "✓" : "○";

        if (valid) {
            passed++;
        } else {
            missing.push(messages[id]);
        }
    });

    if (!password) {
        suggestion.textContent =
            "Start typing to receive password suggestions.";
    } else if (passed === 5) {
        suggestion.textContent =
            "All basic requirements are met. Consider using a unique password with sufficient length.";
    } else {
        suggestion.textContent =
            "Try adding " + missing.join(", ") + ".";
    }
}

checkPassword.addEventListener("input", checkPasswordStrength);


// SHOW / HIDE CHECKER PASSWORD
showPassword.addEventListener("click", () => {
    const hidden = checkPassword.type === "password";

    checkPassword.type = hidden ? "text" : "password";
    showPassword.textContent = hidden ? "Hide" : "Show";
});


// INITIALIZE
updateStrength("");
