document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Stop instant reload

    // Show spinner
    document.getElementById("loadingSpinner").style.display = "block";

    // Disable login button
    const loginBtn = this.querySelector(".login-btn");
    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";

    // Gather form data
    const formData = new FormData(this);
    const payload = Object.fromEntries(formData);

    // Send login request
    fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (!res.ok) throw new Error("Login failed");
        return res.json();
    })
    .then(data => {
        // Redirect or handle success
        window.location.href = "/dashboard"; 
    })
    .catch(err => {
        alert(err.message);
        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
        document.getElementById("loadingSpinner").style.display = "none";
    });
});
