# Implementation Plan: Productivity Dashboard

## Overview

This plan implements a client-side productivity dashboard using vanilla HTML, CSS, and JavaScript. The application features a greeting display, 25-minute focus timer, to-do list manager, and quick links collection, with all data persisted in browser Local Storage. Implementation follows a layered architecture (Storage → Business Logic → UI) with incremental validation through property-based and unit tests.

## Tasks

- [x] 1. Set up project structure and HTML foundation
  - Create directory structure: `css/` and `js/` folders
  - Create `index.html` with semantic structure and all required sections (greeting, timer, to-do, links)
  - Add meta tags, title, and link to CSS/JS files
  - Include all necessary DOM containers with proper IDs for JavaScript access
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [ ] 2. Implement storage layer
  - [x] 2.1 Create LocalStorageManager class in `js/app.js`
    - Implement `save(key, data)` method with JSON serialization
    - Implement `load(key, defaultValue)` method with JSON parsing
    - Implement `remove(key)` and `clearAll()` methods
    - Add error handling for quota exceeded and parse errors
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 6.1, 6.2_
  
  - [ ]* 2.2 Write property test for storage round-trip preservation
    - **Property 11: Task Storage Round-Trip Preservation**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**
  
  - [ ]* 2.3 Write property test for link storage round-trip preservation
    - **Property 15: Link Storage Round-Trip Preservation**
    - **Validates: Requirements 6.1, 6.2, 6.3**
  
  - [ ]* 2.4 Write unit tests for LocalStorageManager
    - Test save/load with specific examples
    - Test error handling (quota exceeded, parse errors)
    - Test default value behavior when key doesn't exist

- [ ] 3. Implement greeting display component
  - [x] 3.1 Create GreetingManager class
    - Implement `getCurrentTime()` returning 12-hour format with AM/PM
    - Implement `getCurrentDate()` returning day of week, month, and day
    - Implement `getGreeting()` with time-based logic (morning/afternoon/evening/night)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_
  
  - [ ]* 3.2 Write property test for time formatting correctness
    - **Property 1: Time Formatting Correctness**
    - **Validates: Requirements 1.1**
  
  - [ ]* 3.3 Write property test for date formatting correctness
    - **Property 2: Date Formatting Correctness**
    - **Validates: Requirements 1.2**
  
  - [ ]* 3.4 Write property test for greeting time-based logic
    - **Property 3: Greeting Time-Based Logic**
    - **Validates: Requirements 1.3, 1.4, 1.5, 1.6**
  
  - [x] 3.5 Create GreetingUI class
    - Implement constructor accepting container element and GreetingManager
    - Implement `update()` method to render time, date, and greeting to DOM
    - Implement `start()` method with setInterval (1 second) for automatic updates
    - Implement `stop()` method to clear interval
    - _Requirements: 1.7_
  
  - [ ]* 3.6 Write unit tests for GreetingManager
    - Test specific time examples for each greeting period
    - Test boundary conditions (4:59 AM, 5:00 AM, 11:59 AM, 12:00 PM, etc.)
    - Test midnight rollover

- [ ] 4. Checkpoint - Verify greeting display
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement focus timer component
  - [x] 5.1 Create TimerManager class
    - Initialize with 1500 seconds (25 minutes)
    - Implement `start()`, `stop()`, and `reset()` methods
    - Implement `tick()` method to decrement by 1 second
    - Implement `getFormattedTime()` returning MM:SS format
    - Implement `isRunning()` state tracking
    - Add automatic stop when reaching 0
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_
  
  - [ ]* 5.2 Write property test for timer display formatting
    - **Property 4: Timer Display Formatting**
    - **Validates: Requirements 2.2**
  
  - [ ]* 5.3 Write property test for timer reset idempotence
    - **Property 5: Timer Reset Idempotence**
    - **Validates: Requirements 2.5**
  
  - [x] 5.4 Create TimerUI class
    - Implement constructor accepting container element and TimerManager
    - Implement `render()` method to create timer display and control buttons
    - Implement `handleStart()`, `handleStop()`, `handleReset()` event handlers
    - Implement `updateDisplay()` method with setInterval (1 second when running)
    - _Requirements: 2.3, 2.4, 2.5_
  
  - [ ]* 5.5 Write unit tests for TimerManager
    - Test initialization to 1500 seconds
    - Test start/stop/reset operations
    - Test tick() countdown behavior
    - Test automatic stop at 0
    - Test rapid start/stop/reset sequences

- [ ] 6. Checkpoint - Verify timer functionality
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement to-do list component
  - [x] 7.1 Create TaskManager class
    - Implement constructor accepting LocalStorageManager
    - Implement `loadTasks()` to retrieve from storage
    - Implement `getTasks()` to return task array
    - Implement `addTask(text)` with validation (reject empty/whitespace)
    - Implement `editTask(id, newText)` with validation
    - Implement `toggleTask(id)` to flip completion status
    - Implement `deleteTask(id)` to remove from array
    - Implement `saveTasks()` to persist to storage
    - Generate unique IDs using timestamp
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.7, 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ]* 7.2 Write property test for task creation increases list size
    - **Property 6: Task Creation Increases List Size**
    - **Validates: Requirements 3.1**
  
  - [ ]* 7.3 Write property test for task edit preserves list size
    - **Property 7: Task Edit Preserves List Size**
    - **Validates: Requirements 3.2**
  
  - [ ]* 7.4 Write property test for task toggle idempotence
    - **Property 8: Task Toggle Idempotence**
    - **Validates: Requirements 3.3**
  
  - [ ]* 7.5 Write property test for task deletion decreases list size
    - **Property 9: Task Deletion Decreases List Size**
    - **Validates: Requirements 3.4**
  
  - [ ]* 7.6 Write property test for task validation rejects whitespace
    - **Property 10: Task Validation Rejects Whitespace**
    - **Validates: Requirements 3.7**
  
  - [x] 7.7 Create TaskUI class
    - Implement constructor accepting container element and TaskManager
    - Implement `render()` method to display all tasks with controls
    - Implement `handleAddTask(event)` to process form submission
    - Implement `handleEditTask(id)` to enable inline editing
    - Implement `handleToggleTask(id)` to update completion status
    - Implement `handleDeleteTask(id)` to remove task
    - Apply visual distinction for completed tasks (CSS class)
    - Use event delegation for dynamically created task elements
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  
  - [ ]* 7.8 Write unit tests for TaskManager
    - Test add/edit/delete/toggle with specific examples
    - Test empty list initialization
    - Test task ID generation uniqueness
    - Test validation with empty string, spaces, tabs, newlines
    - Test with special characters and emojis

- [ ] 8. Checkpoint - Verify to-do list functionality
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Implement quick links component
  - [x] 9.1 Create LinkManager class
    - Implement constructor accepting LocalStorageManager
    - Implement `loadLinks()` to retrieve from storage
    - Implement `getLinks()` to return link array
    - Implement `addLink(url, name)` with validation (reject empty/whitespace)
    - Implement `deleteLink(id)` to remove from array
    - Implement `saveLinks()` to persist to storage
    - Generate unique IDs using timestamp
    - _Requirements: 5.1, 5.3, 5.5, 6.1, 6.2, 6.3_
  
  - [ ]* 9.2 Write property test for link creation increases collection size
    - **Property 12: Link Creation Increases Collection Size**
    - **Validates: Requirements 5.1**
  
  - [ ]* 9.3 Write property test for link deletion decreases collection size
    - **Property 13: Link Deletion Decreases Collection Size**
    - **Validates: Requirements 5.3**
  
  - [ ]* 9.4 Write property test for link validation rejects whitespace
    - **Property 14: Link Validation Rejects Whitespace**
    - **Validates: Requirements 5.5**
  
  - [ ] 9.5 Create LinkUI class
    - Implement constructor accepting container element and LinkManager
    - Implement `render()` method to display all links with controls
    - Implement `handleAddLink(event)` to process form submission
    - Implement `handleLinkClick(url)` to open in new tab
    - Implement `handleDeleteLink(id)` to remove link
    - Use event delegation for dynamically created link elements
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [ ]* 9.6 Write unit tests for LinkManager
    - Test add/delete with specific examples
    - Test empty collection initialization
    - Test link ID generation uniqueness
    - Test validation with empty string, spaces, tabs, newlines
    - Test URLs with query parameters and fragments

- [ ] 10. Checkpoint - Verify quick links functionality
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement CSS styling
  - [x] 11.1 Create `css/styles.css` with complete styling
    - Add CSS reset/base styles
    - Style dashboard container with vertical layout
    - Style greeting section (typography, spacing)
    - Style timer section (large display, button layout)
    - Style to-do list section (form, task items, checkboxes)
    - Style quick links section (form, link items)
    - Add visual distinction for completed tasks (strikethrough, color)
    - Add hover states for all interactive elements
    - Add focus indicators for accessibility
    - Use color scheme: background #f5f5f5, text #333333, accent #4a90e2
    - Ensure sufficient contrast for readability (WCAG AA)
    - _Requirements: 7.2, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [ ] 12. Wire all components together
  - [ ] 12.1 Create application initialization in `js/app.js`
    - Add DOMContentLoaded event listener
    - Initialize LocalStorageManager
    - Initialize all manager classes (Greeting, Timer, Task, Link)
    - Load persisted data (tasks and links)
    - Initialize all UI classes with DOM containers
    - Start greeting automatic updates
    - Render initial state for all components
    - _Requirements: 1.7, 4.5, 6.3_
  
  - [ ]* 12.2 Write integration tests
    - Test complete user workflows (add task → edit → complete → delete)
    - Test data persistence across simulated page reloads
    - Test multiple components interacting simultaneously
    - Test Local Storage operations in real browser environment

- [ ] 13. Final checkpoint and validation
  - Ensure all tests pass, ask the user if questions arise.
  - Verify application loads and displays correctly
  - Verify all interactive features work as expected
  - Verify data persists across page reloads

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples and edge cases
- Integration tests verify browser API interactions and end-to-end workflows
- The application uses vanilla JavaScript (ES6+) with no frameworks or build tools
- All data persists in browser Local Storage with JSON serialization
