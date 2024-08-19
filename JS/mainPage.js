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

            // 비어있을 경우 실행되지 않는 걸 적용하기 위해 잔여 투두리스트 증가를 이 로직에서 실행.
            pendingTasks++;
            updateTaskCounter();

            
        }
    });


    // 이벤트 위임을 사용하여 동적으로 생성된 체크 버튼에 이벤트 리스너 추가
    todoItemContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('complete-btn')) {
            const todoItem = event.target.closest('.todo-item');
            if (todoItem.classList.contains('completed')) {
                // 이미 완료된 항목을 다시 미완료 상태로 변경
                todoItem.classList.remove('completed');
                completedTasks--;
                pendingTasks++;
            } else {
                // 미완료된 항목을 완료 상태로 변경
                todoItem.classList.add('completed');
                completedTasks++;
                pendingTasks--;
            }
            updateTaskCounter();
        }
    });
    
    
    
    // ToDo 항목 수정 및 삭제 기능
    todoItemContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-btn')) {
            const todoItem = event.target.closest('.todo-item');
            const todoDescription = todoItem.querySelector('.todo-description');

            if (!todoItem.classList.contains('editing')) {
                todoItem.classList.add('editing');

                // 기존 텍스트를 입력 필드로 변환
                const currentText = todoDescription.textContent.trim();
                const inputField = document.createElement('input');
                inputField.type = 'text';
                inputField.value = currentText;
                inputField.className = 'edit-input';
                todoDescription.innerHTML = '';  // 기존 텍스트 제거
                todoDescription.appendChild(inputField);
                inputField.focus();  // 입력 필드에 포커스

                // 엔터 키 또는 포커스 아웃 시 수정 내용 저장
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

    // ToDo 항목 삭제 기능
    if (event.target.classList.contains('delete-btn')) {
        const todoItem = event.target.closest('.todo-item');
        todoItem.remove();  // 항목 삭제
            
        // 모든 항목이 삭제되었는지 확인하고, 빈 컨테이너를 숨김
        if (todoItemContainer.children.length === 0) {
            todoItemContainer.style.display = 'none';
           }
        }
    });

    function saveEdit(inputField, todoDescription, todoItem) {
        const updatedText = inputField.value.trim();
        todoItem.classList.remove('editing');  // 수정 모드 종료

        if (updatedText !== '') {
            todoDescription.textContent = updatedText;
        } else {
            todoDescription.textContent = '할 일을 입력하세요';  // 빈 텍스트를 방지
        }
    }

    /* 투두리스트 완료 정도를 나타내는 기능*/

    let completedTasks = 0;
    let pendingTasks = 0;
    
    // 작업이 올라가고 삭제 될 때, 예를들면 1이 나오게 되면 01로 바꿔줌. 두자리수는 정상적으로 출력.
    function updateTaskCounter () {
        completedTasksElement.textContent = completedTasks.toString().padStart(2, '0');
        pendingTasksElement.textContent = pendingTasks.toString().padStart(2, '0');
    }

    // 투두리스트 삭제될 경우
    todoItemContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const todoItem = event.target.closest('.todo-item');
            if (todoItem.classList.contains('completed')) {
                completedTasks--;
            } else {
                pendingTasks--;
            }
        
        todoItem.remove();
        updateTaskCounter();
      }  
    });
    //작업 카운터 초기화
    updateTaskCounter();


    // 투두리스트 초기 상태를 숨김
    todoItemContainer.style.display = 'none';

    renderCategories(); // 초기 렌더링
});




