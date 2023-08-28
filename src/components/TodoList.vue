<template>
    <div>
        <h1>Todo List</h1>
    <div class="add-tasgk">
      <label for="newTaskDescription">Description:</label>
      <input
        id="newTaskDescription"
        v-model="newTaskDescription"
        @keyup.enter="addTask"
        placeholder="Add a new task"
      />
      <label for="newTaskImportance">Importance:</label>
      <input
        id="newTaskImportance"
        type="number"
        v-model="newTaskImportance"
        placeholder="Importance (1-5)"
        min="1"
        max="5"
      />
      <label for="newTaskUrgency">Urgency:</label>
      <input
        id="newTaskUrgency"
        type="number"
        v-model="newTaskUrgency"
        placeholder="Urgency (1-5)"
        min="1"
        max="5"
      />
      <button @click="addTask">Add Task</button>
    </div>
      <ul class="task-list">
      <todo-item
        v-for="(task, index) in tasks"
        :key="index"
        :task="task"
        @remove="removeTask(index)"
        @updateImportance="updateImportance(index, $event)"
        @updateUrgency="updateUrgency(index, $event)"
      />
    </ul>
      <h2>Eisenhower Matrix</h2>
      <div class="matrix-quadrant" v-for="(quadrant, index) in sortedQuadrants" :key="index">
        <h3>{{ quadrant.title }}</h3>
        <button @click="sortQuadrant(quadrant)">Sort by Importance</button>
        <button @click="sortQuadrantByUrgency(quadrant)">Sort by Urgency</button>
        <ul>
          <li v-for="(task, taskIndex) in quadrant.tasks" :key="taskIndex">{{ task.description }}</li>
        </ul>
      </div>
    </div>
  </template>
  <style scoped>
  .todo-app {
    font-family: 'Arial', sans-serif;
    padding: 20px;
    background-color: #f7f5f2;
    color: #333;
  }
  
  .add-task {
    margin-bottom: 20px;
  }
  
  .add-task label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .add-task input[type="text"],
  .add-task input[type="number"],
  .add-task button {
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 10px;
  }
  
  .add-task button {
    background-color: #f39458;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .add-task button:hover {
    background-color: #e07642;
  }
  
  .task-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  .task-list li {
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    margin: 10px 0;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .task-list li input[type="checkbox"] {
    margin-right: 10px;
  }
  
  .task-list li input[type="number"] {
    width: 40px;
  }
  
  .task-list li button {
    background-color: #f39458;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .task-list li button:hover {
    background-color: #e07642;
  }
  </style>
  <script>
  import TodoItem from "./TodoItem.vue";
  
  export default {
    components: {
      TodoItem,
    },
    data() {
      return {
        newTaskDescription: "",
        newTaskImportance: 1,
        newTaskUrgency: 1,
        tasks: [],
      };
    },
    created() {
      this.loadTasks();
    },
    computed: {
      quadrants() {
        return [
      {
        title: "Important / Urgent",
        tasks: this.tasks.filter(task => task.importance >= 4 && task.urgency >= 4),
      },
      {
        title: "Important / Not Urgent",
        tasks: this.tasks.filter(task => task.importance >= 4 && task.urgency < 4),
      },
      {
        title: "Not Important / Urgent",
        tasks: this.tasks.filter(task => task.importance < 4 && task.urgency >= 4),
      },
      {
        title: "Not Important / Not Urgent",
        tasks: this.tasks.filter(task => task.importance < 4 && task.urgency < 4),
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
    methods: {
      addTask() {
        if (this.newTaskDescription.trim() !== "") {
          this.tasks.push({
            description: this.newTaskDescription,
            importance: parseInt(this.newTaskImportance),
            urgency: parseInt(this.newTaskUrgency),
            completed: false,
            timestamp: new Date().toISOString(),
          });
          this.saveTasks();
          this.newTaskDescription = "";
          this.newTaskImportance = 1;
          this.newTaskUrgency = 1;
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
      updateTask(index, editedTask) {
      this.tasks[index] = editedTask;
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
    },
  };
  </script>
  
  <style>
  .matrix-quadrant {
    margin-top: 20px;
    border: 1px solid #ccc;
    padding: 10px;
  }
  </style>
  