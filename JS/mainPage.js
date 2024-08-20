document.addEventListener('DOMContentLoaded', () => {
    const categories = ["Study", "Exercise", "Promise", "Eat"];
    const categoryButton = document.getElementById('category-button');
    const categoryDropdown = document.getElementById('category-dropdown');
    const categoryList = document.getElementById('category-list');
    const addCategoryButton = document.getElementById('add-category-button');
    const todoInput = document.getElementById('todo-input');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const todoItemContainer = document.querySelector('.todo-item-container');
    const completedTasksElement = document.querySelector('.completed-tasks span');
    const pendingTasksElement = document.querySelector('.pending-tasks span');
    const calendarButton = document.getElementById('calendar-button');
    const overlay = document.getElementById('overlay');
    const calendarTodoDisplay = document.querySelector('.calendar-box h2'); 
    const searchInput = document.querySelector('input[placeholder="Search by name"]'); // 검색창
    const todoData = {}; 
    let currentDisplayedDate = ''; 
    const datesContainer = document.querySelector('.dates');
    let selectedDateElement = null;

    const dateInput = document.getElementById('date-input');
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    dateInput.value = formattedToday;
    currentDisplayedDate = formattedToday;

    calendarButton.addEventListener('click', () => {
        overlay.classList.toggle('visible'); 
    });

    function renderCategories() {
        categoryList.innerHTML = ''; 
        categories.forEach((category) => {
            const categoryItem = document.createElement('div');
            categoryItem.textContent = category;
            categoryItem.style.padding = '10px';
            categoryItem.style.cursor = 'pointer';
            categoryItem.style.backgroundColor = '#5691A8';
            categoryItem.style.color = '#ffffff';
            categoryItem.style.marginBottom = '5px';
            categoryItem.style.borderRadius = '5px';
            categoryItem.addEventListener('click', () => {
                categoryButton.textContent = category; 
                categoryDropdown.classList.add('hidden'); 
            });
            categoryList.appendChild(categoryItem);
        });
    }

    categoryButton.addEventListener('click', (event) => {
        event.stopPropagation(); 
        categoryDropdown.classList.toggle('hidden');
        renderCategories();
    });

    addCategoryButton.addEventListener('click', (event) => {
        event.stopPropagation(); 
        const newCategory = prompt('새로운 카테고리를 입력하세요:');
        if (newCategory && !categories.includes(newCategory)) {
            categories.push(newCategory);
            renderCategories();
        }
    });

    document.addEventListener('click', (event) => {
        if (!categoryDropdown.classList.contains('hidden')) {
            categoryDropdown.classList.add('hidden');
        }
    });

    $(dateInput).datepicker({
        dateFormat: 'yy-mm-dd',
        onSelect: function(dateText) {
            dateInput.value = dateText; 
        }
    });

    addTodoBtn.addEventListener('click', () => {
        const todoText = todoInput.value.trim();
        const selectedDate = dateInput.value.trim(); 

        if (todoText !== '' && selectedDate !== '') {
            const todoCategory = categoryButton.textContent.trim() || 'Uncategorized';
            const todoItem = document.createElement('div');
            todoItem.className = 'todo-item';

            todoItem.innerHTML = `
                <div class="todo-title-date">
                    <span class="todo-category">${todoCategory}</span>
                    <span class="todo-date">${selectedDate}</span> 
                </div>
                <div class="todo-description">${todoText}</div>
                <div class="todo-actions">
                    <button class="complete-btn">✔</button>
                    <button class="edit-btn">✎</button>
                    <button class="delete-btn">🗑</button>
                </div>
            `;

            todoItemContainer.appendChild(todoItem);
            todoItemContainer.style.display = 'block'; 

            if (!todoData[selectedDate]) {
                todoData[selectedDate] = [];
            }
            todoData[selectedDate].push({
                category: todoCategory,
                description: todoText
            });

            pendingTasks++;
            updateTaskCounter();
            todoInput.value = '';

            if (selectedDate === currentDisplayedDate) {
                renderTodoList(selectedDate);
            }
        }
    });

    function renderTodoList(date) {
        if (todoData[date]) {
            const todoList = todoData[date]
            .map(item => `
                <div class="todo-list-item">
                    <span class="todo-description">${item.description}</span>
                    <span class="todo-category">${item.category}</span>
                </div>
                <hr>
            `)
            .join(''); // 항목 간 구분선을 추가
            calendarTodoDisplay.innerHTML = todoList;
        } else {
            calendarTodoDisplay.innerHTML = '<img src="../img/question-person.jpg" alt="No Data" style="width: 60%; height: auto;"/>';
        }
    }

    datesContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI' && !event.target.classList.contains('inactive')) {
            const selectedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(event.target.textContent).padStart(2, '0')}`;
            currentDisplayedDate = selectedDate;

            if (selectedDateElement) {
                selectedDateElement.classList.remove('selected');
            }
            event.target.classList.add('selected');
            selectedDateElement = event.target;

            renderTodoList(selectedDate);
        }
    });

    // 검색창에서 검색 기능 구현
    searchInput.addEventListener('input', () => {
        const searchText = searchInput.value.toLowerCase();
        const todoItems = todoItemContainer.querySelectorAll('.todo-item');

        todoItems.forEach(item => {
            const description = item.querySelector('.todo-description').textContent.toLowerCase();
            if (description.includes(searchText)) {
                item.style.display = ''; // 검색어와 일치하는 항목은 보이게
            } else {
                item.style.display = 'none'; // 검색어와 일치하지 않는 항목은 숨기기
            }
        });
    });

    todoItemContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('complete-btn')) {
            const todoItem = event.target.closest('.todo-item');
            if (todoItem.classList.contains('completed')) {
                todoItem.classList.remove('completed');
                completedTasks--;
                pendingTasks++;
            } else {
                todoItem.classList.add('completed');
                completedTasks++;
                pendingTasks--;
            }
            updateTaskCounter();
        }
    });

    todoItemContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-btn')) {
            const todoItem = event.target.closest('.todo-item');
            const todoDescription = todoItem.querySelector('.todo-description');

            if (!todoItem.classList.contains('editing')) {
                todoItem.classList.add('editing');
                const currentText = todoDescription.textContent.trim();
                const inputField = document.createElement('input');
                inputField.type = 'text';
                inputField.value = currentText;
                inputField.className = 'edit-input';
                todoDescription.innerHTML = '';  
                todoDescription.appendChild(inputField);
                inputField.focus(); 

                inputField.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        saveEdit(inputField, todoDescription, todoItem);
                    }
                });

                inputField.addEventListener('blur', () => {
                    saveEdit(inputField, todoDescription, todoItem);
                });
            }
        }

        if (event.target.classList.contains('delete-btn')) {
            const todoItem = event.target.closest('.todo-item');
            const selectedDate = todoItem.querySelector('.todo-date').textContent.trim();

            if (!todoItem.classList.contains('completed')) {
                pendingTasks--;
            } else {
                completedTasks--;
            }

            todoItem.remove(); 

            const todoText = todoItem.querySelector('.todo-description').textContent.trim();
            todoData[selectedDate] = todoData[selectedDate].filter(item => item.description !== todoText);

            if (todoData[selectedDate].length === 0) {
                delete todoData[selectedDate];
            }

            if (currentDisplayedDate === selectedDate) {
                renderTodoList(selectedDate);
            }

            if (todoItemContainer.children.length === 0) {
                todoItemContainer.style.display = 'none';
            }

            updateTaskCounter();
        }
    });

    function saveEdit(inputField, todoDescription, todoItem) {
        const updatedText = inputField.value.trim();
        const selectedDate = todoItem.querySelector('.todo-date').textContent.trim();
        const previousText = todoDescription.textContent.trim();

        todoItem.classList.remove('editing'); 

        if (updatedText !== '') {
            todoDescription.textContent = updatedText;
            const itemIndex = todoData[selectedDate].findIndex(item => item.description === previousText);
            if (itemIndex !== -1) {
                todoData[selectedDate][itemIndex].description = updatedText;
            }

            if (currentDisplayedDate === selectedDate) {
                renderTodoList(selectedDate);
            }
        } else {
            todoDescription.textContent = '할 일을 입력하세요'; 
        }
    }

    let completedTasks = 0;
    let pendingTasks = 0;

    function updateTaskCounter() {
        completedTasksElement.textContent = completedTasks.toString().padStart(2, '0');
        pendingTasksElement.textContent = pendingTasks.toString().padStart(2, '0');
    }

    todoItemContainer.style.display = 'none';

    renderCategories(); 
});
