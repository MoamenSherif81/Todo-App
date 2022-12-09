const btn = document.getElementById('add-task');
const input = document.getElementById('task-title');
const taskCont = document.querySelector('.tasks');
const filterCont = document.querySelector('.filter');
const filterInp = document.querySelector('.filter-input');
let TasksArr;
if(window.localStorage['number'] == undefined) window.localStorage['number'] = 0;
TasksArr = JSON.parse(localStorage.getItem("TasksArr") || "[]");
input.focus();

window.addEventListener('load', () =>{
  if(TasksArr.length != 0){
    taskCont.children[0].classList.toggle('hide');
    taskCont.children[1].classList.toggle('hide');
    TasksArr.forEach((element) => {
      const newTask = document.createElement('li');
      newTask.classList.add('task');
      newTask.setAttribute('taskId', element.id);
      newTask.innerHTML = `
        <div class="divider"></div>
        <div class="task-content">
          <div class="inputs">
            <div class="task-title">${element.title}</div>
            <input type="text" class="edit-task hide" onkeypress="editEnter(event, this)">
            <div class="task-date">${element.date}</div>
          </div>
          <div class=buttons>
            <button class="btn-floating edit-btn" onclick='editEle(this)'><i class="material-icons">edit</i></button>
            <button class="btn-floating remove-btn" onclick='removeEle(this)'><i class="material-icons">close</i></button>
          </div>
        </div>`;
      taskCont.append(newTask);
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
    newTask.setAttribute('taskId', window.localStorage.number++);
    newTask.innerHTML = `
      <div class="divider"></div>
      <div class="task-content show">
        <div class="inputs">
          <div class="task-title">${input.value}</div>
          <input type="text" class="edit-task hide" onkeypress="editEnter(event, this)">
          <div class="task-date">${date.toLocaleDateString() + ' ' + date.toLocaleTimeString()}</div>
        </div>
        <div class=buttons>
          <button class="btn-floating edit-btn" onclick='editEle(this)'><i class="material-icons">edit</i></button>
          <button class="btn-floating remove-btn" onclick='removeEle(this)'><i class="material-icons">close</i></button>
        </div>
      </div>`;
    if(taskCont.children.length == 2) {
      taskCont.children[0].classList.toggle('hide');
      taskCont.children[1].classList.toggle('hide');
    }else{
      taskCont.lastElementChild.children[1].classList.remove('show');
    }
    taskCont.append(newTask);
    TasksArr.push({id: (window.localStorage.number)-1, title: input.value, date: date.toLocaleDateString() + ' ' + date.toLocaleTimeString()});
    window.localStorage['TasksArr'] = JSON.stringify(TasksArr);
    console.log(TasksArr);
    input.value = '';
    input.focus(); 
  }
});

function removeEle(ele){
  const parent = ele.parentNode.parentNode.parentNode;
  parent.lastElementChild.classList.add('remove');
  parent.lastElementChild.addEventListener('animationend', () => {
    const taskId = TasksArr.findIndex(item => item.id == parent.getAttribute('taskId'));
    TasksArr.splice(taskId, 1);
    window.localStorage.setItem('TasksArr', JSON.stringify(TasksArr));
    parent.remove();
    if(taskCont.children.length == 2){
      taskCont.children[0].classList.toggle('hide');
      taskCont.children[1].classList.toggle('hide');
    }
  })
  console.log(TasksArr);
}

function editEle(ele){
  const parent = ele.parentNode.parentNode;
  const taskTitle = parent.children[0].children[0];
  const taskEditInput = parent.children[0].children[1];
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
    ele.children[0].innerText = 'done';
  } else {
    if(taskEditInput.value.trim().length == 0){
      Swal.fire({icon: 'error', title: 'Error', text:'Enter a valid task name!'});
    } else {
      taskTitle.innerHTML = taskEditInput.value;
    }
    ele.children[0].innerText = 'edit';
  }
  ele.classList.toggle('pulse');
  taskTitle.classList.toggle('hide');
  taskEditInput.classList.toggle('hide');
}

filterInp.addEventListener('keyup', () =>{
  const tasks = [...taskCont.children];
  for(let i = 2; i < tasks.length; i++){
    if(!tasks[i].children[1].firstElementChild.firstElementChild.textContent.toLowerCase().includes(filterInp.value.toLowerCase())){
      tasks[i].classList.add('hide');
    } else{
      tasks[i].children[1].classList.remove('show');
      tasks[i].classList.remove('hide');
    }
  }
})

input.addEventListener('keypress', (event) => {
  if(event.key == 'Enter'){
    btn.click();
  }
});

function editEnter(event, ele) {
  if(event.key == 'Enter'){
    ele.parentNode.parentNode.children[1].children[0].click();
  }
};

