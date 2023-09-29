import { produce } from "immer"
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

const store = (set) => ({
  columns: [
    {
      id: "1",
      name: "Planned",
      order: 0,
      collapsed: false,
      state: "all-columns",
    },
    {
      id: "2",
      name: "Ongoing",
      order: 1,
      collapsed: false,
      state: "all-columns",
    },
    {
      id: "3",
      name: "Done",
      order: 2,
      collapsed: false,
      state: "all-columns",
    },
    // Add more default columns as needed
  ],
  tasks: [],
  addTask: (id, title, state) =>
    set(
      produce((store) => {
        const order = store.tasks.length // Assign the order based on the current number of tasks
        store.tasks.push({ id, title, state, order })
      }),
      false,
      "Add Task"
    ),
  removeTask: (id) =>
    set(
      (store) => ({
        tasks: store.tasks.filter((task) => task.id !== id),
      }),
      false,
      "Remove Task"
    ),
  setDraggedTask: (id) => set({ draggedTask: id }, false, "isDragged"),
  moveTask: (
    sourceIndex,
    destinationIndex,
    draggableId,
    destinationDroppableId
  ) =>
    set(
      produce((store) => {
        const newTaskIds = [...store.tasks] // Create a copy of task ids
        const [movedTask] = newTaskIds.splice(sourceIndex, 1) // Remove task from source index

        // Create a new task object with updated state
        const updatedTask = {
          ...movedTask,
          state: destinationDroppableId,
          order: destinationIndex,
        }

        newTaskIds.splice(destinationIndex, 0, updatedTask) // Insert task at destination index

        store.tasks = newTaskIds // Update tasks in the store
      }),
      false,
      "Task moved"
    ),
  moveColumn: (
    sourceIndex,
    destinationIndex,
    draggableId,
    destinationDroppableId
  ) =>
    set(
      produce((store) => {
        const newColumnIds = [...store.columns] // Create a copy of column ids
        const [movedColumn] = newColumnIds.splice(sourceIndex, 1) // Remove column from source index

        // Create a new task object with updated state
        const updatedColumn = {
          ...movedColumn,
        }

        newColumnIds.splice(destinationIndex, 0, updatedColumn) // Insert task at destination index

        console.log(newColumnIds)

        store.columns = newColumnIds // Update tasks in the store
      }),
      false,
      "Column moved"
    ),
  setTasks: (tasks) => set({ tasks }),
  addColumn: (id, name) =>
    set(
      produce((store) => {
        const order = store.columns.length // Assign the order based on the current number of columns
        store.columns.push({ id, name, order, collapsed: false }) // Push an object with id and name to the array
      }),
      false,
      "Add Column"
    ),
  removeColumn: (id) =>
    set(
      produce((store) => {
        store.columns = store.columns.filter((column) => column.id !== id) // Filter out the column with the provided id
        // Optionally, you may want to update tasks if they were associated with this column.
        store.tasks = store.tasks.map((task) => {
          if (task.state === id) {
            return { task }
          }
          return task
        })
      }),
      false,
      "Remove Column"
    ),
  updateColumnName: (id, newName) =>
    set(
      produce((store) => {
        const columnToUpdate = store.columns.find((column) => column.id === id)
        if (columnToUpdate) {
          columnToUpdate.name = newName
        }
      }),
      false,
      "Update Column Name"
    ),
  toggleColumnCollapse: (id) =>
    set(
      produce((store) => {
        const column = store.columns.find((column) => column.id === id)
        if (column) {
          column.collapsed = !column.collapsed
        }
      }),
      false,
      "Toggle Column Collapse"
    ),
})

const persistedState =
  typeof window !== "undefined" &&
  JSON.parse(localStorage.getItem("todolist-storage"))

export const useStore = create(
  persist(devtools(store), { name: "todolist-storage" }),
  (set) => ({
    ...store(set),
    ...persistedState,
  })
)
