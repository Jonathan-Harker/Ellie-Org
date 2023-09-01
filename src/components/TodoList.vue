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
 
 <style src="./TodoList.css"></style>

<script>
  export default {
    data() {
      return {
        fibonacciOptions: [1, 2, 3, 5, 8, 13, 21],
        activeTab: 'tasks',
        newTaskDescription: "",
        newTaskImportance: 1,
        newTaskUrgency: 1,
        newTaskEffort: 1,
        tasks: [
        {
        description: "Task 1",
        completed: false,
        timestamp: null,
      },
        ],
      };
    },
    created() {
      this.loadTasks();
    },
    computed: {
      completedTasksEffortTotal() {
    const totalByWeek = {};
    for (const weekKey in this.completedTasksByWeek) {
      const tasksInWeek = this.completedTasksByWeek[weekKey];
      const totalEffort = tasksInWeek.reduce((total, task) => total + task.effort, 0);
      totalByWeek[weekKey] = totalEffort;
    }
    return totalByWeek;
  },
      completedTasksByWeek() {
    const completedTasks = this.tasks.filter(task => task.completed);
    completedTasks.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const tasksByWeek = {};
    completedTasks.forEach(task => {
      const weekKey = new Date(task.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
      if (!tasksByWeek[weekKey]) {
        tasksByWeek[weekKey] = [];
      }
      tasksByWeek[weekKey].push(task);
    });

    return tasksByWeek;
  },
      filteredTasks() {
    if (this.activeTab === 'completed') {
      const completedTasks = this.tasks.filter(task => task.completed);
      completedTasks.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      const tasksByWeek = {};
      completedTasks.forEach(task => {
        const weekKey = new Date(task.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
        if (!tasksByWeek[weekKey]) {
          tasksByWeek[weekKey] = [];
        }
        tasksByWeek[weekKey].push(task);
      });

      return tasksByWeek;
    } else {
      return this.tasks.filter(task => !task.completed);
    }
  },
      quadrants() {
        return [
      {
        title: "Important / Urgent",
        tasks: this.tasks.filter(task => !task.completed && task.importance >= 3 && task.urgency >= 3),
      },
      {
        title: "Important / Not Urgent",
        tasks: this.tasks.filter(task => !task.completed && task.importance >= 3 && task.urgency < 3),
      },
      {
        title: "Not Important / Urgent",
        tasks: this.tasks.filter(task => !task.completed && task.importance < 3 && task.urgency >= 3),
      },
      {
        title: "Not Important / Not Urgent",
        tasks: this.tasks.filter(task => !task.completed && task.importance < 3 && task.urgency < 3),
      },
    ];
      },
      sortedQuadrants() {
        return this.quadrants.slice().sort((a, b) => {
          // Sort by the number of tasks in each quadrant
          return a.tasks.length - b.tasks.length;
        });
      },
    },
    methods: 
    {
      markTaskCompleted(index) {
    this.tasks[index].completed = true;
    this.tasks[index].timestamp = new Date().toISOString(); // or any suitable timestamp format
    this.saveTasks();
  },
      handleTabClick(tab) {
    console.log('Tab clicked:', tab);
    this.activeTab = tab;
  },
      addTask() {
        if (this.newTaskDescription.trim() !== "") {
          this.tasks.push({
            description: this.newTaskDescription,
            importance: parseInt(this.newTaskImportance),
            urgency: parseInt(this.newTaskUrgency),
            effort: parseInt(this.newTaskEffort),
            completed: false,
            timestamp: new Date().toISOString(),
          });
          this.saveTasks();
          this.newTaskDescription = "";
          this.newTaskImportance = 1;
          this.newTaskUrgency = 1;
          this.newTaskEffort = 1;
        }
      },
      removeTask(index) {
        this.tasks.splice(index, 1);
        this.saveTasks();
      },
      loadTasks() {
        const storedTasks = localStorage.getItem("tasks");
        if (storedTasks) {
          this.tasks = JSON.parse(storedTasks);
        }
      },
      updateTask(index) {
        this.tasks[index].completed = !this.tasks[index].completed;
    this.saveTasks();
    },
      saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
      },
      sortQuadrant(quadrant) {
        quadrant.tasks.sort((a, b) => b.importance - a.importance);
      },
      sortQuadrantByUrgency(quadrant) {
        quadrant.tasks.sort((a, b) => b.urgency - a.urgency);
      },
      updateImportance(index, importance) {
      this.tasks[index].importance = importance;
      this.saveTasks();
    },
    updateUrgency(index, urgency) {
      this.tasks[index].urgency = urgency;
      this.saveTasks();
    },
    updateEffort(index, effort) {
      this.tasks[index].effort = effort;
      this.saveTasks();
    },
    },
  };
  </script>
  