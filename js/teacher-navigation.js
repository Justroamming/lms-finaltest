class TeacherNavigation {
    constructor() {
        this.currentPage = 'dashboard';
    
        
        // Đảm bảo DOM đã tải xong trước khi gọi các phương thức hiển thị
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeTeacherNavigation();
                this.displayTeacherName();
            });
        } else {
            this.initializeTeacherNavigation();
            this.displayTeacherName();
        }
    }

    initializeTeacherNavigation() {
        document.querySelectorAll('.sidebar a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.getAttribute('href').substring(1);
                this.loadPage(page);
            });
        });

        // Load trang mặc định
        this.loadPage('dashboard');
    }

    async loadPage(page) {
        try {
            const response = await fetch(`components/teacher-${page}-content.html`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();
            const mainContent = document.querySelector('#pageContent');
            if (mainContent) {
                mainContent.innerHTML = content;
                this.initializeComponent(page);
                this.updateActiveLink(page);
                this.currentPage = page;
            } else {
                console.error('Main content container not found');
            }
        } catch (error) {
            console.error('Error loading page:', error);
        }
    }

    initializeComponent(page) {
        // Khởi tạo component tương ứng
        switch(page) {
            case 'dashboard':
                new TeacherDashboard();
                // Đảm bảo môn học được hiển thị khi vào dashboard
                setTimeout(() => this.displayTeacherName(), 500);
                break;
            case 'scores':
                new TeacherScores();
                break;
            case 'schedule':
                new TeacherSchedule();
                break;
            case 'profile':
                new TeacherProfile();
                break;
        }
    }

    updateActiveLink(page) {
        // Cập nhật trạng thái active cho menu
        document.querySelectorAll('.sidebar li').forEach(li => {
            li.classList.remove('active');
        });
        const activeLink = document.querySelector(`.sidebar a[href="#${page}"]`);
        if (activeLink) {
            activeLink.parentElement.classList.add('active');
        }
    }

    // Phương thức để làm mới tất cả các trang
    refreshAllPages() {
        // Tải lại trang hiện tại
        this.loadPage(this.currentPage);
    }

    // Hiển thị tên giáo viên trong header
    async displayTeacherName() {
        const teacher = JSON.parse(sessionStorage.getItem('currentUser'));
        const teacherNameElement = document.getElementById('teacherName');
        
        if (teacher && teacherNameElement) {
            // Xóa tất cả nội dung hiện tại trong teacherName để tránh bị lặp
            teacherNameElement.innerHTML = '';
            
            // Tạo phần tử mới cho fullname
            const fullnameElement = document.createElement('span');
            fullnameElement.className = 'teacher-fullname';
            teacherNameElement.appendChild(fullnameElement);
            
            // Tạo phần tử mới cho role
            const roleElement = document.createElement('span');
            roleElement.className = 'teacher-role';
            teacherNameElement.appendChild(roleElement);
            
            // Cập nhật tên giáo viên
            fullnameElement.textContent = `${teacher.lastName} ${teacher.firstName}`;        
        } else {
            console.error('Không tìm thấy thông tin giáo viên hoặc phần tử DOM');
        }
    }
}


