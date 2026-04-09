// Node.js test for TaskManager
// Simulates browser localStorage API

// Mock localStorage
global.localStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  removeItem(key) {
    delete this.data[key];
  },
  clear() {
    this.data = {};
  }
};

// Load the app.js code (LocalStorageManager and TaskManager classes)
const fs = require('fs');
const appCode = fs.readFileSync('js/app.js', 'utf8');
eval(appCode);

// Test suite
let testCount = 0;
let passCount = 0;

function test(name, condition, message = '') {
  testCount++;
  if (condition) {
    passCount++;
    console.log(`✓ ${name}`);
  } else {
    console.log(`✗ ${name}${message ? ': ' + message : ''}`);
  }
}

console.log('TaskManager Test Suite\n');

// Clear localStorage before tests
localStorage.clear();

// Test 1: Constructor and initialization
const storage = new LocalStorageManager();
const taskManager = new TaskManager(storage);
test('Constructor initializes correctly', 
  taskManager.tasks !== undefined && Array.isArray(taskManager.tasks));

// Test 2: getTasks returns empty array initially
test('getTasks returns empty array initially', 
  taskManager.getTasks().length === 0);

// Test 3: addTask with valid text
const task1 = taskManager.addTask('Buy groceries');
test('addTask creates task with valid text', 
  task1 !== null && task1.text === 'Buy groceries');

// Test 4: Task has required properties
test('Task has id, text, completed, createdAt', 
  task1.id && task1.text && task1.completed === false && task1.createdAt);

// Test 5: addTask trims whitespace
const task2 = taskManager.addTask('  Write code  ');
test('addTask trims whitespace', 
  task2 !== null && task2.text === 'Write code');

// Test 6: addTask rejects empty string
const task3 = taskManager.addTask('');
test('addTask rejects empty string', 
  task3 === null);

// Test 7: addTask rejects whitespace-only string
const task4 = taskManager.addTask('   ');
test('addTask rejects whitespace-only string', 
  task4 === null);

// Test 8: getTasks returns correct count
test('getTasks returns correct count', 
  taskManager.getTasks().length === 2);

// Test 9: editTask with valid text
const editSuccess = taskManager.editTask(task1.id, 'Buy groceries and milk');
test('editTask updates text successfully', 
  editSuccess === true && task1.text === 'Buy groceries and milk');

// Test 10: editTask trims whitespace
taskManager.editTask(task1.id, '  Updated text  ');
test('editTask trims whitespace', 
  task1.text === 'Updated text');

// Test 11: editTask rejects empty string
const editFail1 = taskManager.editTask(task1.id, '');
test('editTask rejects empty string', 
  editFail1 === false && task1.text === 'Updated text');

// Test 12: editTask rejects whitespace-only
const editFail2 = taskManager.editTask(task1.id, '   ');
test('editTask rejects whitespace-only', 
  editFail2 === false && task1.text === 'Updated text');

// Test 13: editTask returns false for non-existent ID
const editFail3 = taskManager.editTask('nonexistent', 'New text');
test('editTask returns false for non-existent ID', 
  editFail3 === false);

// Test 14: toggleTask changes completion status
taskManager.toggleTask(task1.id);
test('toggleTask sets completed to true', 
  task1.completed === true);

// Test 15: toggleTask toggles back
taskManager.toggleTask(task1.id);
test('toggleTask sets completed back to false', 
  task1.completed === false);

// Test 16: toggleTask with non-existent ID doesn't crash
try {
  taskManager.toggleTask('nonexistent');
  test('toggleTask handles non-existent ID gracefully', true);
} catch (e) {
  test('toggleTask handles non-existent ID gracefully', false, e.message);
}

// Test 17: deleteTask removes task
const beforeDelete = taskManager.getTasks().length;
taskManager.deleteTask(task1.id);
test('deleteTask removes task from array', 
  taskManager.getTasks().length === beforeDelete - 1);

// Test 18: deleteTask with non-existent ID doesn't crash
const beforeDelete2 = taskManager.getTasks().length;
taskManager.deleteTask('nonexistent');
test('deleteTask handles non-existent ID gracefully', 
  taskManager.getTasks().length === beforeDelete2);

// Test 19: Unique ID generation
const taskA = taskManager.addTask('Task A');
const taskB = taskManager.addTask('Task B');
test('Generated IDs are unique', 
  taskA.id !== taskB.id);

// Test 20: saveTasks and loadTasks persistence
taskManager.saveTasks();
const newTaskManager = new TaskManager(storage);
newTaskManager.loadTasks();
test('loadTasks retrieves saved tasks', 
  newTaskManager.getTasks().length === taskManager.getTasks().length);

// Test 21: Loaded tasks have correct properties
const loadedTasks = newTaskManager.getTasks();
const hasCorrectProps = loadedTasks.every(t => 
  t.id && t.text && typeof t.completed === 'boolean' && t.createdAt
);
test('Loaded tasks have correct properties', hasCorrectProps);

// Summary
console.log(`\nResults: ${passCount}/${testCount} tests passed`);
process.exit(passCount === testCount ? 0 : 1);
