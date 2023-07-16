// login.js

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log(data);
  
      if (response.ok) {
        // Redirect to the game page
        window.location.href = 'game.html';
      } else {
        // Display the error message
        alert(data.error);
      }
    } catch (error) {
      console.log(error);
      alert('An error occurred. Please try again.');
    }
  });
  