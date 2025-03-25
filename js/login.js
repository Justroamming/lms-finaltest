// login.js
// Wait for DOM to load before adding event listener
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const email = document.getElementById('emailname').value;
            const password = document.getElementById('password').value;

            try {
                const loginButton = document.getElementById('loginButton');
                if (loginButton) loginButton.classList.add('loading');
                
                const loginSuccess = await login(email, password);

                if (loginButton) loginButton.classList.remove('loading');

                if (loginSuccess) {
                    const currentUser = getCurrentUser();
                    localStorage.setItem('token', currentUser.token);
                    
                    // Hiển thị thông báo thành công nếu hàm showNotification tồn tại
                    if (typeof window.showNotification === 'function') {
                        window.showNotification('success', 'Đăng nhập thành công!');
                    }
                    
                    // Chuyển hướng sau khi đăng nhập thành công
                    setTimeout(() => {
                        if (currentUser.role === 'Admin') {
                            window.location.href = 'admin-dashboard.html';
                        }
                        if (currentUser.role === 'Teacher') {
                            window.location.href = 'teacher-dashboard.html';
                        }
                        if (currentUser.role === 'Student') {
                            window.location.href = 'student-dashboard.html';
                        }
                    }, 1500);
                } else {
                    // Hiển thị thông báo lỗi nếu hàm showNotification tồn tại
                    if (typeof window.showNotification === 'function') {
                        window.showNotification('error', 'Sai tên đăng nhập hoặc mật khẩu!');
                    }
                    console.error('Email hoặc mật khẩu không đúng!');
                }
            } catch (error) {
                const loginButton = document.getElementById('loginButton');
                if (loginButton) loginButton.classList.remove('loading');
                
                // Hiển thị thông báo lỗi nếu hàm showNotification tồn tại
                if (typeof window.showNotification === 'function') {
                    window.showNotification('error', 'Lỗi đăng nhập: ' + error.message);
                }
                console.error('Error during login:', error);
            }
        });
    } else {
        console.log('Login form not found - this is expected on non-login pages');
    }
});

const login = async (email, password) => {
    try {
        const response = await fetch(`https://localhost:7231/Logins/LoginProcess?email=${email}&password=${password}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        sessionStorage.setItem('currentUser', JSON.stringify({ ...data.user, role: data.role, token: data.token }));
        return true;
    } catch (error) {
        console.error(`Failed to login with ${email}:`, error);
        return false;
    }
};

const getCurrentUser = () => JSON.parse(sessionStorage.getItem('currentUser'));

const logout = () => {
    sessionStorage.clear();
    window.location.href = 'login.html';
};

const checkAuth = (role) => getCurrentUser()?.role === role;