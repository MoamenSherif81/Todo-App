let btn = document.getElementById('add-task');
let input = document.getElementById('task-title');
let taskCont = document.querySelector('.tasks');

btn.addEventListener('click', () => {
  if(input.value == '' || input.value.trim().length === 0){
    Swal.fire({icon: 'error', title: 'Error', text:'Enter the task name!'});
  } else {
    let date = new Date();
    let newTask = document.createElement('li');
    newTask.classList.add('task', 'show');
    newTask.innerHTML = `
      <div class="inputs">
        <div class="task-title">${input.value}</div>
        <input type="text" class="edit-task hide" onkeypress="editEnter(event, this)">
        <div class="task-date">${date.toLocaleDateString() + ' ' + date.toLocaleTimeString()}</div>
      </div>
      <div class=buttons>
        <button class="btn-floating edit-btn" onclick='editEle(this)'><i class="material-icons">edit</i></button>
        <button class="btn-floating remove-btn" onclick='removeEle(this)'><i class="material-icons">close</i></button>
      </div>`;
    if(taskCont.children[0].children[0].className == 'no-tasks') {
      taskCont.innerHTML = '';
      taskCont.append(newTask);
    }else{
      taskCont.lastElementChild.classList.remove('show');
      let divider = document.createElement('div');
      divider.classList.add('divider'); 
      taskCont.append(divider);
      taskCont.append(newTask);
    }
    input.value = '';
  }
});

function removeEle(ele){
  let parent = ele.parentNode.parentNode;
  parent.classList.add('remove');
  parent.addEventListener('animationend', () => {
    if(parent.nextElementSibling != null){
      parent.nextElementSibling.remove();
    }else if(parent.previousElementSibling != null){
      parent.previousElementSibling.remove();
    }
    parent.remove();
    if(taskCont.children[0] == null){
      taskCont.innerHTML = `<li><h1 class="no-tasks">No Tasks Yet</h1></li>`;
    }
  })
}

function editEle(ele){
  let parent = ele.parentNode.parentNode;
  let taskTitle = parent.children[0].children[0];
  let taskEditInput = parent.children[0].children[1];
  if(taskEditInput.classList.contains('hide')){
    let tasks = document.querySelectorAll('.task');
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
    if(taskEditInput.value == '' || taskEditInput.value.trim().length == 0){
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

