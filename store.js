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
  tasks: [
    {
      id: "e9ea77a6-4031-4429-9534-2709f7bc07c6",
      order: 0,
      state: "3",
      title: "I'm hired? Oh thanks 😘",
      description: "",
    },
    {
      id: "g4ea77a6-4031-4529-9535-2709f7dd07c6",
      order: 0,
      state: "1",
      title: "Move tasks inside one list",
      description: "",
    },
    {
      id: "6gss77a6-4031-4529-9535-6666f7ddbafs",
      order: 1,
      state: "1",
      title: "Move me up!",
      description: "",
    },
    {
      id: "6gs553a6-4031-4529-9faf-6666f55fbafs",
      order: 1,
      state: "1",
      title: "Right click to edit or delete!",
      description: "",
    },
    {
      id: "3810e834-5aac-43b3-96da-9b5823dfcd72",
      order: 0,
      state: "2",
      title: "Move tasks between lists",
      description: "",
    },
    {
      id: "62b14093-7e8f-4c34-bfa1-db31476276d7",
      order: 1,
      state: "2",
      title: "Try to change the order of lists",
      description: "",
    },
    {
      id: "62b535093-7e8f-4c34-hs7a1-db314jsj76d7",
      order: 2,
      state: "2",
      title: "Click me to add description",
      description: "",
    },
  ],
  addTask: (id, title, state) =>
    set(
      produce((store) => {
        const order = store.tasks.length // Assign the order based on the current number of tasks
        store.tasks.push({ id, title, state, order, description: "" })
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
  updateTask: (id, title, description) =>
    set(
      produce((store) => {
        const taskToUpdate = store.tasks.find((task) => task.id === id)
        if (taskToUpdate) {
          taskToUpdate.title = title
          taskToUpdate.description = description
        }
      }),
      false,
      "Update Task data"
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
        const newTaskIds = [...store.tasks]

        // Find the moved task
        const movedTask = newTaskIds.find((task) => task.id === draggableId)

        if (movedTask) {
          const removedTaskFromArray = newTaskIds.filter(
            (task) => task.id !== draggableId
          )

          // Find the tasks in the same column
          const tasksWithDestinationId = removedTaskFromArray.filter(
            (task) => task.state === destinationDroppableId
          )

          // Determine the new order for the moved task
          let newOrder = destinationIndex

          // Ensure the newOrder is within bounds
          if (newOrder < 0) {
            newOrder = 0
          } else if (newOrder > tasksWithDestinationId.length) {
            newOrder = tasksWithDestinationId.length
          }

          // Update the state and order of the moved task
          movedTask.state = destinationDroppableId
          movedTask.order = newOrder

          // Insert the moved task at the desired index
          tasksWithDestinationId.splice(newOrder, 0, movedTask)

          // Update the order of the other tasks in the same column
          tasksWithDestinationId.forEach((task, index) => {
            task.order = index
          })

          // Remove tasks with the same destinationDroppableId from original task array
          const tasksWithoutDestinationId = removedTaskFromArray.filter(
            (task) => task.state !== destinationDroppableId
          )

          // Concatenate the filtered tasks and the tasks in the same column
          store.tasks = [
            ...tasksWithoutDestinationId,
            ...tasksWithDestinationId,
          ]
        }
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
