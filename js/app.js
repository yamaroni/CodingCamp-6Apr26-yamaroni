// Productivity Dashboard Application

/**
 * LocalStorageManager - Handles all interactions with browser's Local Storage API
 * 
 * Responsibilities:
 * - Serialize/deserialize data to/from JSON
 * - Provide type-safe storage operations
 * - Handle storage errors gracefully (quota exceeded, parse errors)
 */
class LocalStorageManager {
  /**
   * Save data to Local Storage
   * @param {string} key - Storage key
   * @param {any} data - Data to store (will be JSON serialized)
   * @returns {boolean} - Success status
   */
  save(key, data) {
    try {
      const jsonString = JSON.stringify(data);
      localStorage.setItem(key, jsonString);
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('LocalStorage quota exceeded. Unable to save data.', error);
      } else {
        console.error('Error saving to LocalStorage:', error);
      }
      return false;
    }
  }

  /**
   * Load data from Local Storage
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default if key doesn't exist
   * @returns {any} - Parsed data or default value
   */
  load(key, defaultValue) {
    try {
      const jsonString = localStorage.getItem(key);
      if (jsonString === null) {
        return defaultValue;
      }
      return JSON.parse(jsonString);
    } catch (error) {
      console.warn('Error parsing data from LocalStorage:', error);
      return defaultValue;
    }
  }

  /**
   * Remove data from Local Storage
   * @param {string} key - Storage key
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from LocalStorage:', error);
    }
  }

  /**
   * Clear all application data
   */
  clearAll() {
    try {
      // Clear only application-specific keys
      localStorage.removeItem('productivity-dashboard-tasks');
      localStorage.removeItem('productivity-dashboard-links');
    } catch (error) {
      console.error('Error clearing LocalStorage:', error);
    }
  }
}

console.log('Productivity Dashboard loaded');

/**
 * GreetingManager - Manages time-based greeting logic
 * 
 * Responsibilities:
 * - Calculate current time and date
 * - Determine appropriate greeting based on time of day
 * - Format time in 12-hour format with AM/PM
 * - Format date with day of week, month, and day
 */
class GreetingManager {
  /**
   * Get current time in 12-hour format
   * @returns {string} - Formatted time (e.g., "3:45 PM")
   */
  getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Determine AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // 0 should be 12
    
    // Format minutes with leading zero
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    return `${hours}:${formattedMinutes} ${period}`;
  }

  /**
   * Get current date
   * @returns {string} - Formatted date (e.g., "Monday, January 15")
   */
  getCurrentDate() {
    const now = new Date();
    
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayOfWeek = daysOfWeek[now.getDay()];
    const month = months[now.getMonth()];
    const day = now.getDate();
    
    return `${dayOfWeek}, ${month} ${day}`;
  }

  /**
   * Get time-based greeting
   * @returns {string} - Greeting message
   */
  getGreeting() {
    const now = new Date();
    const hours = now.getHours();
    
    // 5:00 AM - 11:59 AM: "Good morning"
    if (hours >= 5 && hours < 12) {
      return 'Good morning';
    }
    // 12:00 PM - 4:59 PM: "Good afternoon"
    else if (hours >= 12 && hours < 17) {
      return 'Good afternoon';
    }
    // 5:00 PM - 8:59 PM: "Good evening"
    else if (hours >= 17 && hours < 21) {
      return 'Good evening';
    }
    // 9:00 PM - 4:59 AM: "Good night"
    else {
      return 'Good night';
    }
  }
}

/**
 * GreetingUI - Renders greeting display and manages updates
 * 
 * Responsibilities:
 * - Render time, date, and greeting to DOM
 * - Update display every second using setInterval
 */
class GreetingUI {
  /**
   * Initialize greeting display
   * @param {HTMLElement} container - DOM container element
   * @param {GreetingManager} greetingManager - Business logic instance
   */
  constructor(container, greetingManager) {
    this.container = container;
    this.greetingManager = greetingManager;
    this.intervalId = null;
  }

  /**
   * Manually update display
   */
  update() {
    const time = this.greetingManager.getCurrentTime();
    const date = this.greetingManager.getCurrentDate();
    const greeting = this.greetingManager.getGreeting();

    this.container.innerHTML = `
      <div class="greeting-text">${greeting}</div>
      <div class="time-text">${time}</div>
      <div class="date-text">${date}</div>
    `;
  }

  /**
   * Start automatic updates (every 1 second)
   */
  start() {
    // Update immediately
    this.update();
    
    // Set up interval for automatic updates
    this.intervalId = setInterval(() => {
      this.update();
    }, 1000);
  }

  /**
   * Stop automatic updates
   */
  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

/**
 * TimerManager - Manages timer state and countdown logic
 * 
 * Responsibilities:
 * - Track timer state (stopped, running)
 * - Manage remaining time
 * - Handle start, stop, reset operations
 * - Countdown logic
 */
class TimerManager {
  /**
   * Initialize timer with 25 minutes (1500 seconds)
   */
  constructor() {
    this.remainingSeconds = 1500;
    this.running = false;
    this.intervalId = null;
  }

  /**
   * Start countdown
   */
  start() {
    this.running = true;
  }

  /**
   * Stop/pause countdown
   */
  stop() {
    this.running = false;
  }

  /**
   * Reset to 25 minutes
   */
  reset() {
    this.remainingSeconds = 1500;
    this.running = false;
  }

  /**
   * Decrement timer by 1 second
   * @returns {boolean} - True if timer reached 0
   */
  tick() {
    if (this.remainingSeconds > 0) {
      this.remainingSeconds--;
      
      // Automatically stop when reaching 0
      if (this.remainingSeconds === 0) {
        this.running = false;
        return true;
      }
    }
    return false;
  }

  /**
   * Get remaining time in MM:SS format
   * @returns {string} - Formatted time
   */
  getFormattedTime() {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;
    
    // Format with leading zeros
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  /**
   * Check if timer is running
   * @returns {boolean}
   */
  isRunning() {
    return this.running;
  }
}

/**
 * TimerUI - Renders timer display and controls
 * 
 * Responsibilities:
 * - Render timer display and buttons
 * - Handle button click events
 * - Update display every second when running
 */
class TimerUI {
  /**
   * Initialize timer UI
   * @param {HTMLElement} container - DOM container element
   * @param {TimerManager} timerManager - Business logic instance
   */
  constructor(container, timerManager) {
    this.container = container;
    this.timerManager = timerManager;
    this.intervalId = null;
    this.displayElement = null;
    this.startButton = null;
    this.stopButton = null;
    this.resetButton = null;
  }

  /**
   * Render initial UI
   */
  render() {
    // Create timer display
    this.displayElement = document.createElement('div');
    this.displayElement.className = 'timer-display';
    this.displayElement.textContent = this.timerManager.getFormattedTime();

    // Create control buttons container
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'timer-controls';

    // Create Start button
    this.startButton = document.createElement('button');
    this.startButton.textContent = 'Start';
    this.startButton.className = 'timer-btn timer-start';
    this.startButton.addEventListener('click', () => this.handleStart());

    // Create Stop button
    this.stopButton = document.createElement('button');
    this.stopButton.textContent = 'Stop';
    this.stopButton.className = 'timer-btn timer-stop';
    this.stopButton.addEventListener('click', () => this.handleStop());

    // Create Reset button
    this.resetButton = document.createElement('button');
    this.resetButton.textContent = 'Reset';
    this.resetButton.className = 'timer-btn timer-reset';
    this.resetButton.addEventListener('click', () => this.handleReset());

    // Append buttons to controls container
    controlsContainer.appendChild(this.startButton);
    controlsContainer.appendChild(this.stopButton);
    controlsContainer.appendChild(this.resetButton);

    // Find or create timer display and controls containers in the section
    let timerDisplayContainer = this.container.querySelector('#timer-display');
    let timerControlsContainer = this.container.querySelector('#timer-controls');

    if (timerDisplayContainer) {
      timerDisplayContainer.innerHTML = '';
      timerDisplayContainer.appendChild(this.displayElement);
    } else {
      this.container.appendChild(this.displayElement);
    }

    if (timerControlsContainer) {
      timerControlsContainer.innerHTML = '';
      timerControlsContainer.appendChild(controlsContainer);
    } else {
      this.container.appendChild(controlsContainer);
    }
  }

  /**
   * Update time display
   */
  updateDisplay() {
    if (this.displayElement) {
      this.displayElement.textContent = this.timerManager.getFormattedTime();
    }
  }

  /**
   * Handle start button click
   */
  handleStart() {
    if (!this.timerManager.isRunning()) {
      this.timerManager.start();
      
      // Start interval to update display and tick timer
      this.intervalId = setInterval(() => {
        if (this.timerManager.isRunning()) {
          const reachedZero = this.timerManager.tick();
          this.updateDisplay();
          
          // Stop interval if timer reached zero
          if (reachedZero) {
            this.stopInterval();
          }
        }
      }, 1000);
    }
  }

  /**
   * Handle stop button click
   */
  handleStop() {
    this.timerManager.stop();
    this.stopInterval();
  }

  /**
   * Handle reset button click
   */
  handleReset() {
    this.timerManager.reset();
    this.stopInterval();
    this.updateDisplay();
  }

  /**
   * Stop the update interval
   * @private
   */
  stopInterval() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

/**
 * TaskManager - Manages task collection and persistence
 * 
 * Responsibilities:
 * - Manage task array (add, edit, delete, toggle)
 * - Validate task input (reject empty/whitespace)
 * - Generate unique IDs using timestamps
 * - Persist tasks to Local Storage
 */
class TaskManager {
  /**
   * Initialize task manager
   * @param {LocalStorageManager} storageManager - Storage instance
   */
  constructor(storageManager) {
    this.storageManager = storageManager;
    this.tasks = [];
    this.storageKey = 'productivity-dashboard-tasks';
  }

  /**
   * Load tasks from storage
   */
  loadTasks() {
    this.tasks = this.storageManager.load(this.storageKey, []);
  }

  /**
   * Get all tasks
   * @returns {Array<Task>}
   */
  getTasks() {
    return this.tasks;
  }

  /**
   * Add new task
   * @param {string} text - Task text
   * @returns {Task|null} - Created task or null if invalid
   */
  addTask(text) {
    // Validate: reject empty or whitespace-only text
    if (typeof text !== 'string' || text.trim() === '') {
      return null;
    }

    // Create new task with unique ID
    const task = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now()
    };

    this.tasks.push(task);
    this.saveTasks();
    
    return task;
  }

  /**
   * Edit task text
   * @param {string} id - Task ID
   * @param {string} newText - New task text
   * @returns {boolean} - Success status
   */
  editTask(id, newText) {
    // Validate: reject empty or whitespace-only text
    if (typeof newText !== 'string' || newText.trim() === '') {
      return false;
    }

    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      return false;
    }

    task.text = newText.trim();
    this.saveTasks();
    
    return true;
  }

  /**
   * Toggle task completion
   * @param {string} id - Task ID
   */
  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
    }
  }

  /**
   * Delete task
   * @param {string} id - Task ID
   */
  deleteTask(id) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      this.saveTasks();
    }
  }

  /**
   * Save tasks to storage
   */
  saveTasks() {
    this.storageManager.save(this.storageKey, this.tasks);
  }
}

/**
 * TaskUI - Renders task list and handles user interactions
 * 
 * Responsibilities:
 * - Render task list with controls
 * - Handle form submission for adding tasks
 * - Handle edit, toggle, delete operations
 * - Use event delegation for dynamic task elements
 * - Apply visual distinction for completed tasks
 */
class TaskUI {
  /**
   * Initialize task UI
   * @param {HTMLElement} container - DOM container element (todo-section)
   * @param {TaskManager} taskManager - Business logic instance
   */
  constructor(container, taskManager) {
    this.container = container;
    this.taskManager = taskManager;
    this.form = null;
    this.taskList = null;
    this.taskInput = null;
  }

  /**
   * Render task list and set up event listeners
   */
  render() {
    // Get references to existing DOM elements
    this.form = this.container.querySelector('#add-task-form');
    this.taskList = this.container.querySelector('#task-list');
    this.taskInput = this.container.querySelector('#task-input');

    // Set up form submission handler
    if (this.form) {
      this.form.addEventListener('submit', (event) => this.handleAddTask(event));
    }

    // Set up event delegation on task list
    if (this.taskList) {
      this.taskList.addEventListener('click', (event) => {
        const target = event.target;
        const taskItem = target.closest('.task-item');
        
        if (!taskItem) return;
        
        const taskId = taskItem.dataset.taskId;

        // Handle toggle (checkbox)
        if (target.classList.contains('task-toggle') || target.type === 'checkbox') {
          this.handleToggleTask(taskId);
        }
        // Handle edit button
        else if (target.classList.contains('task-edit-btn')) {
          this.handleEditTask(taskId);
        }
        // Handle delete button
        else if (target.classList.contains('task-delete-btn')) {
          this.handleDeleteTask(taskId);
        }
      });
    }

    // Initial render of tasks
    this.renderTasks();
  }

  /**
   * Render all tasks to the DOM
   */
  renderTasks() {
    if (!this.taskList) return;

    // Clear existing tasks
    this.taskList.innerHTML = '';

    // Get all tasks and render each one
    const tasks = this.taskManager.getTasks();
    tasks.forEach(task => {
      const taskItem = this.createTaskElement(task);
      this.taskList.appendChild(taskItem);
    });
  }

  /**
   * Create a task list item element
   * @param {Object} task - Task object
   * @returns {HTMLElement} - Task list item
   */
  createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.completed) {
      li.classList.add('completed');
    }
    li.dataset.taskId = task.id;

    // Create checkbox for toggle
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-toggle';
    checkbox.checked = task.completed;

    // Create task text span
    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;

    // Create edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'task-edit-btn';
    editBtn.textContent = 'Edit';

    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-delete-btn';
    deleteBtn.textContent = 'Delete';

    // Append all elements
    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    return li;
  }

  /**
   * Handle form submission to add new task
   * @param {Event} event - Form submit event
   */
  handleAddTask(event) {
    event.preventDefault();

    if (!this.taskInput) return;

    const text = this.taskInput.value;
    const task = this.taskManager.addTask(text);

    if (task) {
      // Clear input field
      this.taskInput.value = '';
      // Re-render tasks
      this.renderTasks();
    }
  }

  /**
   * Handle edit task - enable inline editing
   * @param {string} id - Task ID
   */
  handleEditTask(id) {
    const taskItem = this.taskList.querySelector(`[data-task-id="${id}"]`);
    if (!taskItem) return;

    const textSpan = taskItem.querySelector('.task-text');
    const editBtn = taskItem.querySelector('.task-edit-btn');
    
    if (!textSpan || !editBtn) return;

    // Check if already editing
    if (editBtn.textContent === 'Save') {
      // Save mode - get the input value and save
      const input = taskItem.querySelector('.task-edit-input');
      if (input) {
        const newText = input.value;
        const success = this.taskManager.editTask(id, newText);
        
        if (success) {
          // Re-render tasks to show updated text
          this.renderTasks();
        } else {
          // If validation failed, just re-render to restore original state
          this.renderTasks();
        }
      }
    } else {
      // Edit mode - replace text with input field
      const currentText = textSpan.textContent;
      
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'task-edit-input';
      input.value = currentText;
      
      // Replace text span with input
      textSpan.replaceWith(input);
      
      // Change button text to "Save"
      editBtn.textContent = 'Save';
      
      // Focus the input
      input.focus();
      
      // Handle Enter key to save
      input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          editBtn.click();
        }
      });
    }
  }

  /**
   * Handle toggle task completion status
   * @param {string} id - Task ID
   */
  handleToggleTask(id) {
    this.taskManager.toggleTask(id);
    // Re-render to update visual state
    this.renderTasks();
  }

  /**
   * Handle delete task
   * @param {string} id - Task ID
   */
  handleDeleteTask(id) {
    this.taskManager.deleteTask(id);
    // Re-render to remove task from display
    this.renderTasks();
  }
}

/**
 * LinkManager - Manages link collection and persistence
 * 
 * Responsibilities:
 * - Manage link array (add, delete)
 * - Validate link input (reject empty/whitespace)
 * - Generate unique IDs using timestamps
 * - Persist links to Local Storage
 */
class LinkManager {
  /**
   * Initialize link manager
   * @param {LocalStorageManager} storageManager - Storage instance
   */
  constructor(storageManager) {
    this.storageManager = storageManager;
    this.links = [];
    this.storageKey = 'productivity-dashboard-links';
  }

  /**
   * Load links from storage
   */
  loadLinks() {
    this.links = this.storageManager.load(this.storageKey, []);
  }

  /**
   * Get all links
   * @returns {Array<Link>}
   */
  getLinks() {
    return this.links;
  }

  /**
   * Add new link
   * @param {string} url - Link URL
   * @param {string} name - Display name
   * @returns {Link|null} - Created link or null if invalid
   */
  addLink(url, name) {
    // Validate: reject empty or whitespace-only url or name
    if (typeof url !== 'string' || url.trim() === '' ||
        typeof name !== 'string' || name.trim() === '') {
      return null;
    }

    // Create new link with unique ID
    const link = {
      id: Date.now().toString(),
      url: url.trim(),
      name: name.trim(),
      createdAt: Date.now()
    };

    this.links.push(link);
    this.saveLinks();
    
    return link;
  }

  /**
   * Delete link
   * @param {string} id - Link ID
   */
  deleteLink(id) {
    const index = this.links.findIndex(l => l.id === id);
    if (index !== -1) {
      this.links.splice(index, 1);
      this.saveLinks();
    }
  }

  /**
   * Save links to storage
   */
  saveLinks() {
    this.storageManager.save(this.storageKey, this.links);
  }
}
