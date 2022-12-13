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
    TasksArr.forEach((element) => {
      const newTask = document.createElement('li');
      newTask.classList.add('task');
      newTask.setAttribute('taskId', element.id);
      newTask.innerHTML = `
        <div class="divider"></div>
        <div class="task-content">
          <div class="inputs">
            <div class="task-title">
              <label class="task-checbox">
                <input type="checkbox" ${element.checked ? 'checked' : ''} onclick="MarkCompleted(this)"/>
                <span></span>
              </label>
              <span style="text-decoration:${element.checked ? 'line-through' : 'none'}" class="title-text">${element.title}</span>
            </div>
            <input type="text" class="edit-task hide" onkeypress="editEnter(event, this)">
            <div class="task-date">${element.date}</div>
          </div>
          <div class=buttons>
            <button class="btn-floating edit-btn" onclick='editEle(this)'><i class="material-icons">edit</i></button>
            <button class="btn-floating remove-btn" onclick='removeEle(this)'><i class="material-icons">close</i></button>
          </div>
        </div>`;
      if(element.checked){
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
          <button class="btn-floating edit-btn" onclick='editEle(this)'><i class="material-icons">edit</i></button>
          <button class="btn-floating remove-btn" onclick='removeEle(this)'><i class="material-icons">close</i></button>
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

function removeEle(ele){
  const parent = ele.parentNode.parentNode.parentNode;
  parent.lastElementChild.classList.add('remove');
  parent.lastElementChild.addEventListener('animationend', () => {
    const taskId = TasksArr.findIndex(item => item.id == parent.getAttribute('taskId'));
    TasksArr.splice(taskId, 1);
    window.localStorage.setItem('TasksArr', JSON.stringify(TasksArr));
    parent.remove();
    check();
  })
}

function editEle(ele){
  const parent = ele.parentNode.parentNode;
  const taskTitle = parent.querySelector('.title-text');
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
      const taskId = TasksArr.findIndex(item => item.id == parent.parentNode.getAttribute('taskId'));
      TasksArr[taskId].title = taskEditInput.value;
      window.localStorage.setItem('TasksArr', JSON.stringify(TasksArr));
    }
    ele.children[0].innerText = 'edit';
  }
  ele.classList.toggle('pulse');
  taskEditInput.classList.toggle('hide');
  taskEditInput.focus();
  parent.querySelector('.task-title').classList.toggle('hide');
}

filterInp.addEventListener('keyup', () =>{
  const tasks = [...ongoingTasks.children];
  const comTasks = [...completedTasks.children];
  let cnt1 = 0, cnt2 = 0;
  for(let i = 0; i < tasks.length; i++){
    const taskTitle = tasks[i].querySelector('.title-text');
    if(!taskTitle.textContent.toLowerCase().includes(filterInp.value.toLowerCase())){
      tasks[i].classList.add('hide');
      cnt1++;
    } else{
      tasks[i].children[1].classList.remove('show');
      tasks[i].classList.remove('hide');
    }
  }
  for(let i = 0; i < comTasks.length; i++){
    if(!comTasks[i].children[1].firstElementChild.firstElementChild.textContent.toLowerCase().includes(filterInp.value.toLowerCase())){
      comTasks[i].classList.add('hide');
      cnt2++;
    } else{
      comTasks[i].children[1].classList.remove('show');
      comTasks[i].classList.remove('hide');
    }
  }
  if(tasks.length != 0){
    if(cnt1 == tasks.length){
      ongoingNothing.classList.remove('hide');
    } else ongoingNothing.classList.add('hide');
  }
  if(comTasks.length != 0){
    if(cnt2 == comTasks.length){
      completeNothing.classList.remove('hide');
    } else completeNothing.classList.add('hide');
  }

  check();
})

function MarkCompleted(element){
  const parent = element.parentNode.parentNode.parentNode.parentNode.parentNode;
  const taskId = TasksArr.findIndex(item => item.id == parent.getAttribute('taskId'));
  const taskTitle = element.parentNode.nextElementSibling;
  if(element.checked == true){
    taskTitle.style.textDecoration = 'line-through';
    TasksArr[taskId].checked = true;
    completedTasks.append(parent);
  } else {
    taskTitle.style.textDecoration = 'none';
    TasksArr[taskId].checked = false;
    if(completedTasks.children[0] == parent){
      completedTasks.firstElementChild.firstElementChild.classList.remove('hide');
    }
    ongoingTasks.append(parent);
  }
  check();
  window.localStorage.setItem('TasksArr', JSON.stringify(TasksArr));
}

input.addEventListener('keypress', (event) => {
  if(event.key == 'Enter') btn.click();
});

function editEnter(event, ele) {
  if(event.key == 'Enter') ele.parentNode.parentNode.children[1].children[0].click();
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
