document.addEventListener('DOMContentLoaded', () => {
    const categories = ["밥", "공부", "운동"];
    const categoryButton = document.getElementById('category-button');
    const categoryDropdown = document.getElementById('category-dropdown');
    const categoryList = document.getElementById('category-list');
    const addCategoryButton = document.getElementById('add-category-button');
    const todoInput = document.getElementById('todo-input');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const todoItemContainer = document.querySelector('.todo-item-container');
    
    // 카테고리 목록을 렌더링하는 함수
    function renderCategories() {
        categoryList.innerHTML = ''; // 기존 목록 초기화
        categories.forEach((category) => {
            const categoryItem = document.createElement('div');
            categoryItem.textContent = category;
            categoryItem.style.padding = '10px';
            categoryItem.style.cursor = 'pointer';
            categoryItem.style.backgroundColor = '#f2e1df';
            categoryItem.style.marginBottom = '5px';
            categoryItem.style.borderRadius = '5px';
            categoryItem.addEventListener('click', () => {
                categoryButton.textContent = category; // 버튼 텍스트 업데이트
                categoryDropdown.classList.add('hidden'); // 드롭다운 숨기기
            });
            categoryList.appendChild(categoryItem);
        });
    }

    // 카테고리 버튼 클릭 시 드롭다운 표시/숨기기
    categoryButton.addEventListener('click', (event) => {
        event.stopPropagation(); // 이벤트 버블링 방지
        categoryDropdown.classList.toggle('hidden');
        renderCategories();
    });

    // 새로운 카테고리 추가 기능
    addCategoryButton.addEventListener('click', (event) => {
        event.stopPropagation(); // 이벤트 버블링 방지
        const newCategory = prompt('새로운 카테고리를 입력하세요:');
        if (newCategory && !categories.includes(newCategory)) {
            categories.push(newCategory);
            renderCategories();
        }
    });

    // 페이지의 다른 부분 클릭 시 드롭다운 숨기기
    document.addEventListener('click', (event) => {
        if (!categoryDropdown.classList.contains('hidden')) {
            categoryDropdown.classList.add('hidden');
        }
    });

    // 새로운 ToDo 항목 추가
    addTodoBtn.addEventListener('click', () => {
        const todoText = todoInput.value.trim();
        if (todoText !== '') {
            const todoCategory = categoryButton.textContent.trim() || 'Uncategorized';
            const todoDate = new Date().toISOString().split('T')[0]; // 오늘 날짜
            
            const todoItem = document.createElement('div');
            todoItem.className = 'todo-item';

            todoItem.innerHTML = `
                <div class="todo-title-date">
                    <span class="todo-category">${todoCategory}</span>
                    <span class="todo-date">${todoDate}</span>
                </div>
                <div class="todo-description">${todoText}</div>
                <div class="todo-actions">
                    <button class="complete-btn">✔</button>
                    <button class="edit-btn">✎</button>
                    <button class="delete-btn">🗑</button>
                </div>
            `;

            todoItemContainer.appendChild(todoItem);
            todoInput.value = ''; // 입력 필드 초기화
            todoItemContainer.style.display = 'block'; // 투두리스트 항목이 추가될 때 컨테이너 표시
        }
    });

    // 투두리스트 초기 상태를 숨김
    todoItemContainer.style.display = 'none';

    renderCategories(); // 초기 렌더링
});




