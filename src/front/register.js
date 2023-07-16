// register.js

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;
  
    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username, active: 1 }),
      });
  
      const data = await response.json();
      console.log(data);
  
      if (response.ok) {
        // Redirect to the login page
        window.location.href = 'login.html';
      } else {
        // Display the error message
        alert(data.error);
      }
    } catch (error) {
      console.log(error);
      alert('An error occurred. Please try again.');
    }
  });
  