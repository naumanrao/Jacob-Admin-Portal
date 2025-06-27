// Authentication check for admin portal
// Add this script to the top of your admin portal HTML

;(() => {
  // Check if user is authenticated
  function checkAuth() {
    const token = sessionStorage.getItem("authToken")
    const userInfo = sessionStorage.getItem("userInfo")

    if (!token || !userInfo) {
      // Redirect to login if not authenticated
      window.location.href = "login.html"
      return false
    }

    // Check if token is expired (optional)
    if (isTokenExpired()) {
      logout()
      return false
    }

    return true
  }

  // Check token expiration
  function isTokenExpired() {
    const loginTime = sessionStorage.getItem("loginTime")
    if (!loginTime) return true

    const loginDate = new Date(loginTime)
    const now = new Date()
    const hoursDiff = (now - loginDate) / (1000 * 60 * 60)

    // Token expires after 24 hours
    return hoursDiff > 24
  }

  // Logout function
  function logout() {
    sessionStorage.removeItem("authToken")
    sessionStorage.removeItem("userInfo")
    sessionStorage.removeItem("loginTime")
    window.location.href = "login.html"
  }

  // Make logout function globally available
  window.logout = logout

  // Check auth on page load
  document.addEventListener("DOMContentLoaded", () => {
    if (!checkAuth()) {
      return
    }

    // Display user info in navbar (optional)
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
    if (userInfo) {
      // You can update the navbar to show user name
      console.log("Logged in as:", userInfo.name)
    }
  })

  // Add logout functionality to existing admin portal
  // You can add this to your existing navbar actions
  function addLogoutButton() {
    const navbarActions = document.querySelector(".navbar-actions")
    if (navbarActions) {
      const logoutBtn = document.createElement("button")
      logoutBtn.className = "btn btn-outline-secondary ms-2"
      logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt me-1"></i>Logout'
      logoutBtn.onclick = logout
      navbarActions.appendChild(logoutBtn)
    }
  }

  // Add logout button when DOM is ready
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(addLogoutButton, 100)
  })
})()
