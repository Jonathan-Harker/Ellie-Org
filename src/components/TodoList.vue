<template>
    <div>
        <h1>The Ellie Org</h1>
    
    <div class="tab-container">
      <div class="tab" :class="{ active: activeTab === 'tasks' }" @click="handleTabClick('tasks')">Tasks</div>
      <div class="tab" :class="{ active: activeTab === 'completed' }" @click="handleTabClick('completed')">Completed</div>
    </div>

    <div v-if="activeTab === 'tasks'">
      <div class="add-task">
      <label for="newTaskDescription">Description:</label>
      <input id="newTaskDescription" v-model="newTaskDescription" @keyup.enter="addTask" placeholder="Add a new task" />
      
      <label for="newTaskImportance">Importance:</label>
      <input id="newTaskImportance" type="number" v-model="newTaskImportance" placeholder="Importance (1-5)" min="1" max="5" />
      
      <label for="newTaskUrgency">Urgency:</label>
      <input id="newTaskUrgency" type="number" v-model="newTaskUrgency" placeholder="Urgency (1-5)" min="1" max="5" />

      <label for="newTaskEffort">Effort:</label>
      <select v-model="newTaskEffort"> 
        <option v-for="option in fibonacciOptions" :value="option" :key="option">{{ option }}</option>      
      </select>
      
      <button @click="addTask">Add Task</button>
    </div>


      <ul class="task-list">
      <li v-for="(task, index) in filteredTasks" :key="index">
    <div class="task-item">
      <input type="checkbox" v-model="task.completed" @change="markTaskCompleted(index)" />
      <span :class="{ completed: task.completed }">{{ task.description }}</span>
      <div class="task-actions">
        <input type="number" v-model="task.importance" min="1" max="5" @input="updateImportance(index, task.importance)" />
        <input type="number" v-model="task.urgency" min="1" max="5" @input="updateUrgency(index, task.urgency)" />
        <select v-model="task.effort" @input="updateEffort(index, task.effort)"> 
          <option v-for="option in fibonacciOptions" :value="option" :key="option">{{ option }}</option>      
      </select>
        <button @click="removeTask(index)">Remove</button>
      </div>
    </div>
  </li>
</ul>

<h2>Eisenhower Matrix</h2>
      <div class="matrix-container">
      <div class="matrix-quadrant" v-for="(quadrant, index) in sortedQuadrants" :key="index">
        <h3>{{ quadrant.title }}</h3>
        <!-- <button @click="sortQuadrant(quadrant)">Sort by Importance</button>
        <button @click="sortQuadrantByUrgency(quadrant)">Sort by Urgency</button> -->
        <ul>
          <li v-for="(task, taskIndex) in quadrant.tasks" :key="taskIndex">{{ task.description }}</li>
        </ul>
      </div>
      </div>

</div>
<div v-else-if="activeTab === 'completed'">
<ul class="task-list">
  <li v-for="(tasksInWeek, weekKey) in completedTasksByWeek" :key="weekKey">
    <h3>{{ weekKey }}</h3>
    <p>Total Effort: {{ completedTasksEffortTotal[weekKey] }}</p>
    <ul>
      <li v-for="(task, index) in tasksInWeek" :key="index" class="completed-task">
        <div class="task-item">
          <input type="checkbox" v-model="task.completed" />
          <span :class="{ completed: task.completed }">{{ task.description }}</span>
          <div class="task-actions">
            <input type="number" v-model="task.importance" min="1" max="5" @input="updateImportance(index, task.importance)" />
            <input type="number" v-model="task.urgency" min="1" max="5" @input="updateUrgency(index, task.urgency)" />
            <select v-model="task.effort" @input="updateEffort(index, task.effort)"> 
          <option v-for="option in fibonacciOptions" :value="option" :key="option">{{ option }}</option>      
      </select>
            <button @click="removeTask(index)">Remove</button>
          </div>
        </div>
      </li>
    </ul>
  </li>
</ul>
</div>
    </div>
  </template>
 
 <style src="../styles/TodoList.css"></style>

<script>
import TodoList from '../scripts/TodoList.js'; // Adjust the path accordingly

export default {
  mixins: [TodoList],
};

  </script>
  