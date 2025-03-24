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
                const loginSuccess = await login(email, password);

                if (loginSuccess) {
                    const currentUser = getCurrentUser();
                    localStorage.setItem('token', currentUser.token);

                    if (currentUser.role === 'Admin') {
                        window.location.href = 'admin-dashboard.html';
                    }
                    if (currentUser.role === 'Teacher') {
                        window.location.href = 'teacher-dashboard.html';
                    }
                    if (currentUser.role === 'Student') {
                        window.location.href = 'student-dashboard.html';
                    }
                } else {
                    alert('Email hoặc mật khẩu không đúng!');
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('Đã xảy ra lỗi, vui lòng thử lại sau!');
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

<<<<<<< HEAD:Lms-test4/js/login.js
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
=======
        if (response.ok) {
            const student = await response.json();
            // Lưu thông tin học sinh vào localStorage
            localStorage.setItem('currentStudent', JSON.stringify(student));
            window.location.href = 'student-dashboard.html';
        } else {
            alert('Email, mật khẩu hoặc không đúng!');
>>>>>>> 303703d2e13d4d23372b1f345b45542aaae87393:js/login.js
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