document.querySelector('.cta-button').addEventListener('click', () => {
    alert('Welcome to Student Score Management!');
    window.location.href = 'login.html';
});

// Function to fetch system stats
async function getSystemStats() {
    try {
        const studentsResponse = await fetch('https://scoreapi-1zqy.onrender.com/Index/GetNumberofStudents');
        const studentsData = await studentsResponse.json();
        const students = studentsData.data || [];
        
        const teachersResponse = await fetch('https://scoreapi-1zqy.onrender.com/Index/GetNumberofTeachers');
        const teachersData = await teachersResponse.json();
        const teachers = teachersData.data || [];


        return {
            students,
            teachers
        };
    } catch (error) {
        console.error("Error fetching system stats:", error);
        return { students: 0, teachers: 0 };
    }
}

// Function to animate counters
function animateCounter(counter, target) {
    let count = 0;
    const increment = target / 100; // Adjust speed here
    const updateCount = () => {
        count += increment;
        counter.innerText = Math.floor(count);
        if (count < target) {
            requestAnimationFrame(updateCount);
        } else {
            counter.innerText = target;
        }
    };
    updateCount();
}

// Fetch stats and update UI
document.addEventListener("DOMContentLoaded", async function () {
    const stats = await getSystemStats();

    const studentCounter = document.querySelector('.stat-item:nth-child(1) .counter');
    const teacherCounter = document.querySelector('.stat-item:nth-child(2) .counter');

    if (studentCounter) animateCounter(studentCounter, stats.students);
    if (teacherCounter) animateCounter(teacherCounter, stats.teachers);
});

// Tab Navigation
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
});
