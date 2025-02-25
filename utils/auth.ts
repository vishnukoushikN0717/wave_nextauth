export const logout = () => {
  try {
    // Clear localStorage
    localStorage.clear();
    
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Redirect to login page
    window.location.href = '/auth/otp-login';
  } catch (error) {
    console.error("Logout error:", error);
    // Optionally throw the error to handle it in the component
    throw new Error("Failed to logout");
  }
}; 