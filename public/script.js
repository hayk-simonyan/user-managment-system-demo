async function fetchUsers() {
  const response = await fetch('/api/users');
  const users = await response.json();
  const userList = document.getElementById('userList');

  userList.innerHTML = users
    .map(
      (user) => `
        <div class="user-card">
            <h3>${user.name}</h3>
            <p>Email: ${user.email}</p>
            <p>Role: ${user.role}</p>
            <button onclick="deleteUser(${user.id})">Delete</button>
        </div>
    `
    )
    .join('');
}

async function addUser() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const role = document.getElementById('role').value.trim();

  if (!name || !email || !role) {
    alert('All fields are required');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address');
    return;
  }

  const validRoles = ['user', 'admin'];
  if (!validRoles.includes(role.toLowerCase())) {
    alert('Role must be either "user" or "admin"');
    return;
  }

  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, role }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('role').value = '';
    fetchUsers();
  } catch (error) {
    alert(error.message);
  }
}

async function deleteUser(id) {
  await fetch(`/api/users/${id}`, {
    method: 'DELETE',
  });
  fetchUsers();
}

document.addEventListener('DOMContentLoaded', fetchUsers);
