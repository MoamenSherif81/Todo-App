const btn = document.getElementById('add-task');
const input = document.getElementById('task-title');
const taskCont = document.querySelector('.tasks');
const ongoingTasks = document.querySelector('.ongoing-tasks');
const ongoingNothing = document.querySelector('.ongoing-nothing');
const completedTasks = document.querySelector('.completed-tasks');
const completeNothing = document.querySelector('.complete-nothing');
const filterCont = document.querySelector('.filter');
const filterInp = document.querySelector('.filter-input');
if(window.localStorage['number'] == undefined) window.localStorage['number'] = 0;
let TasksArr = JSON.parse(localStorage.getItem("TasksArr") || '[]');
input.focus();

window.addEventListener('load', () =>{
  if(TasksArr.length != 0){
    TasksArr.forEach((task) => {
      const newTask = document.createElement('li');
      newTask.classList.add('task');
      newTask.setAttribute('taskId', task.id);
      newTask.innerHTML = `
        <div class="divider"></div>
        <div class="task-content">
          <div class="inputs">
            <div class="task-title">
              <label class="task-checbox">
                <input type="checkbox" ${task.checked ? 'checked' : ''} onclick="MarkCompleted(this)"/>
                <span></span>
              </label>
              <span style="text-decoration:${task.checked ? 'line-through' : 'none'}" class="title-text">${task.title}</span>
            </div>
            <input type="text" class="edit-task hide" onkeypress="editEnter(event, this)">
            <div class="task-date">${task.date}</div>
          </div>
          <div class=buttons>
            <button class="btn-floating edit-btn" onclick='editEle(this)'>
              <i class="material-icons">edit</i>
            </button>
            <button class="btn-floating remove-btn" onclick='removeEle(this)'>
              <i class="material-icons">close</i>
            </button>
          </div>
        </div>`;
      if(task.checked){
        completedTasks.append(newTask);
        if(completedTasks.children.length == 1){
          completedTasks.firstElementChild.firstElementChild.classList.add('hide');
        }
      }else{
        ongoingTasks.append(newTask);
      }
      check();
    });
  }
})

btn.addEventListener('click', () => {
  if(input.value.trim().length === 0){
    Swal.fire({icon: 'error', title: 'Error', text:'Enter the task name!'});
  } else {
    const date = new Date();
    const newTask = document.createElement('li');
    newTask.classList.add('task');
    newTask.setAttribute('taskId', window.localStorage.number);
    newTask.innerHTML = `
      <div class="divider"></div>
      <div class="task-content show">
        <div class="inputs">
          <div class="task-title">
            <label class="task-checbox">
              <input type="checkbox" onclick="MarkCompleted(this)"/>
              <span></span>
            </label>
            <span class="title-text">${input.value}</span>
          </div>
          <input type="text" class="edit-task hide" onkeypress="editEnter(event, this)">
          <div class="task-date">${date.toLocaleDateString() + ' ' + date.toLocaleTimeString()}</div>
        </div>
        <div class=buttons>
          <button class="btn-floating edit-btn" onclick='editEle(this)'>
            <i class="material-icons">edit</i>
          </button>
          <button class="btn-floating remove-btn" onclick='removeEle(this)'>
            <i class="material-icons">close</i>
          </button>
        </div>
      </div>`;
    ongoingTasks.append(newTask);
    TasksArr.push({id: (window.localStorage.number++), title: input.value, date: date.toLocaleDateString() + ' ' + date.toLocaleTimeString(), checked: false});
    window.localStorage['TasksArr'] = JSON.stringify(TasksArr);
    newTask.children[1].addEventListener('transitionend', () => {newTask.children[1].classList.remove('show')});
    input.value = '';
    input.focus();
  }
  check();
});

function removeEle(removeBtn){
  const task = removeBtn.parentNode.parentNode.parentNode;
  task.lastElementChild.classList.add('remove');
  task.lastElementChild.addEventListener('animationend', () => {
    const taskInd = TasksArr.findIndex((item) => item.id == task.getAttribute('taskId'));
    TasksArr.splice(taskInd, 1);
    window.localStorage.setItem('TasksArr', JSON.stringify(TasksArr));
    task.remove();
    check();
  })
}

function editEle(editBtn){
  const taskContent = editBtn.parentNode.parentNode;
  const taskTitle = taskContent.querySelector('.title-text');
  const taskEditInput = taskContent.children[0].children[1];
  if(taskEditInput.classList.contains('hide')){
    const tasks = document.querySelectorAll('.task');
    for(let i = 0; i < tasks.length; i++){
      if(!tasks[i].querySelector('.edit-task').classList.contains('hide')){
        tasks[i].querySelector('.edit-task').classList.toggle('hide');
        tasks[i].querySelector('.task-title').classList.toggle('hide');
        tasks[i].querySelector('.edit-btn').classList.toggle('pulse');
        tasks[i].querySelector('.edit-btn').children[0].innerText = 'edit';
      }
    }
    taskEditInput.value = taskTitle.innerHTML;
    editBtn.children[0].innerText = 'done';
  } else {
    if(taskEditInput.value.trim().length == 0){
      Swal.fire({icon: 'error', title: 'Error', text:'Enter a valid task name!'});
    } else {
      taskTitle.innerHTML = taskEditInput.value;
      const taskInd = TasksArr.findIndex(item => item.id == taskContent.parentNode.getAttribute('taskId'));
      TasksArr[taskInd].title = taskEditInput.value;
      window.localStorage.setItem('TasksArr', JSON.stringify(TasksArr));
    }
    editBtn.children[0].innerText = 'edit';
  }
  editBtn.classList.toggle('pulse');
  taskEditInput.classList.toggle('hide');
  taskEditInput.focus();
  taskContent.querySelector('.task-title').classList.toggle('hide');
}

filterInp.addEventListener('keyup', () =>{
  const tasks = [...ongoingTasks.children];
  const comTasks = [...completedTasks.children];
  let onGoingCounter = 0, completedCounter = 0;
  for(let i = 0; i < tasks.length; i++){
    const taskTitle = tasks[i].querySelector('.title-text');
    if(!taskTitle.textContent.toLowerCase().includes(filterInp.value.toLowerCase()) && filterInp.value.trim() != ''){
      tasks[i].classList.add('hide');
      onGoingCounter++;
    } else{
      tasks[i].children[1].classList.remove('show');
      tasks[i].classList.remove('hide');
    }
  }
  for(let i = 0; i < comTasks.length; i++){
    const taskTitle = comTasks[i].querySelector('title-text');
    if(!taskTitle.textContent.toLowerCase().includes(filterInp.value.toLowerCase()) && filterInp.value.trim() != ''){
      comTasks[i].classList.add('hide');
      completedCounter++;
    } else{
      comTasks[i].children[1].classList.remove('show');
      comTasks[i].classList.remove('hide');
    }
  }
  if(tasks.length != 0){
    if(onGoingCounter == tasks.length)
      ongoingNothing.classList.remove('hide');
    else
      ongoingNothing.classList.add('hide');
  }
  if(comTasks.length != 0){
    if(completedCounter == comTasks.length)
      completeNothing.classList.remove('hide');
    else
      completeNothing.classList.add('hide');
  }

  check();
})

function MarkCompleted(checkBox){
  const task = checkBox.parentNode.parentNode.parentNode.parentNode.parentNode;
  const taskInd = TasksArr.findIndex(item => item.id == task.getAttribute('taskId'));
  const taskTitle = checkBox.parentNode.nextElementSibling;
  if(checkBox.checked == true){
    taskTitle.style.textDecoration = 'line-through';
    TasksArr[taskInd].checked = true;
    completedTasks.append(task);
  } else {
    taskTitle.style.textDecoration = 'none';
    TasksArr[taskInd].checked = false;
    if(completedTasks.children[0] == task){
      completedTasks.firstElementChild.firstElementChild.classList.remove('hide');
    }
    ongoingTasks.append(task);
  }
  check();
  window.localStorage.setItem('TasksArr', JSON.stringify(TasksArr));
}

input.addEventListener('keypress', (event) => {
  if(event.key == 'Enter') btn.click();
});

function editEnter(event, editInput) {
  if(event.key == 'Enter') editInput.parentNode.parentNode.querySelector('.edit-btn').click();
};

function check(){
  if(ongoingTasks.children.length == 0 && completedTasks.children.length == 0){
    taskCont.children[1].classList.remove('hide');
    filterCont.classList.add('hide');
    completedTasks.parentNode.classList.add('hide');
  } else if(ongoingTasks.children.length == 0){
    completedTasks.parentNode.classList.remove('hide');
    completedTasks.previousElementSibling.classList.add('hide');
    taskCont.children[1].classList.remove('hide');
    filterCont.classList.remove('hide');
  } else if(completedTasks.children.length == 0) {
    completedTasks.parentNode.classList.remove('hide');
    completedTasks.previousElementSibling.classList.remove('hide');
    taskCont.children[1].classList.add('hide');
    filterCont.classList.remove('hide');
  } else {
    completedTasks.previousElementSibling.classList.add('hide');
    completedTasks.parentNode.classList.remove('hide');
    taskCont.children[1].classList.add('hide');
    filterCont.classList.remove('hide');
  }
  if(completedTasks.children.length != 0){
    completedTasks.children[0].firstElementChild.classList.add('hide');
  }
}
