function validateLogin() {
    // Validate username (email format)
    var usernameInput = document.getElementById("username");
    var usernameValue = usernameInput.value;
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(usernameValue)) {
        alert("Please enter a valid email address for the username.");
        return;
    }

    // Validate password
    var passwordInput = document.getElementById("password");
    var passwordValue = passwordInput.value;
    var passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@]+$/;
    if (!passwordRegex.test(passwordValue)) {
        alert("Password should include at least one uppercase letter, one lowercase letter, one number, and the characters '@'");
        return;
    }

    // If validation passes, you can proceed with further actions (e.g., submitting the form)
    if (passwordValue === "SmartServTest@123" && passwordRegex.test(passwordValue)) {
        // Simulate redirect to dashboard (replace with actual redirection logic)
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid password. Please try again.");
    }
}