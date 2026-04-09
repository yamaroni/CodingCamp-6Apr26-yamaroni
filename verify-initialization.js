// Verification script for app initialization
// Run this in the browser console after loading index.html

console.log('=== App Initialization Verification ===');

// Check if all classes are defined
const classes = [
  'LocalStorageManager',
  'GreetingManager',
  'GreetingUI',
  'TimerManager',
  'TimerUI',
  'TaskManager',
  'TaskUI',
  'LinkManager',
  'LinkUI'
];

console.log('\n1. Class Definitions:');
classes.forEach(className => {
  const exists = typeof window[className] !== 'undefined';
  console.log(`  ${exists ? '✓' : '✗'} ${className}`);
});

// Check if DOM elements exist
console.log('\n2. DOM Elements:');
const elements = [
  'greeting-display',
  'timer-section',
  'timer-display',
  'timer-controls',
  'todo-section',
  'add-task-form',
  'task-input',
  'task-list',
  'links-section',
  'add-link-form',
  'link-url-input',
  'link-name-input',
  'link-list'
];

elements.forEach(id => {
  const element = document.getElementById(id);
  console.log(`  ${element ? '✓' : '✗'} #${id}`);
});

// Check if UI components are rendered
console.log('\n3. UI Components Rendered:');

const greetingRendered = document.getElementById('greeting-display').innerHTML.trim() !== '';
console.log(`  ${greetingRendered ? '✓' : '✗'} Greeting Display`);

const timerRendered = document.querySelector('.timer-display') !== null;
console.log(`  ${timerRendered ? '✓' : '✗'} Timer Display`);

const timerButtons = document.querySelectorAll('.timer-btn').length;
console.log(`  ${timerButtons === 3 ? '✓' : '✗'} Timer Controls (${timerButtons}/3 buttons)`);

// Check Local Storage
console.log('\n4. Local Storage:');
const tasksKey = 'productivity-dashboard-tasks';
const linksKey = 'productivity-dashboard-links';

const tasksData = localStorage.getItem(tasksKey);
const linksData = localStorage.getItem(linksKey);

console.log(`  Tasks: ${tasksData ? JSON.parse(tasksData).length + ' items' : 'empty'}`);
console.log(`  Links: ${linksData ? JSON.parse(linksData).length + ' items' : 'empty'}`);

console.log('\n=== Verification Complete ===');
