import { useEffect, useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import { useStore } from "@store"
import Task from "./Task"
import { ArrowRightIcon, TrashIcon } from "@heroicons/react/24/solid"
import { Droppable, Draggable } from "@hello-pangea/dnd"

export default function Column({ state, index }) {
  const [columnName, setColumnName] = useState(state.name)
  const [isEditing, setIsEditing] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const inputRef = useRef(null)
  const columnRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  const tasks = useStore((store) =>
    store.tasks
      .filter((task) => task.state === state.id)
      .sort((a, b) => a.order - b.order)
  )

  const { addTask, updateColumnName, removeColumn, toggleColumnCollapse } =
    useStore()

  const handleDeleteColumn = () => {
    if (tasks.length === 0) {
      removeColumn(state.id)
    } else {
      // Show a message or take some action to indicate that there are tasks in the column
    }
  }

  const handleNameChange = (e) => {
    setColumnName(e.target.value)
  }

  const handleKeyDownColumn = (e) => {
    if (e.key === "Enter") {
      setIsEditing(false)
      updateColumnName(state.id, columnName)
      console.log(columnName + " new name front")
      useStore.persist.rehydrate()
    } else if (e.key === "Escape") {
      setIsEditing(false)
      setColumnName(state.name)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (newTaskTitle.length >= 1) {
        const newID = uuidv4()
        addTask(newID, newTaskTitle, state.id)
        setShowInput(false)
        setNewTaskTitle("")
        useStore.persist.rehydrate()
      }
    } else if (e.key === "Escape") {
      setShowInput(false)
      setNewTaskTitle("")
    }
  }

  useEffect(() => {
    if (showInput) {
      inputRef.current.focus()
    }
  }, [showInput])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowInput(false)
        setNewTaskTitle("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [inputRef])

  useEffect(() => {
    const handleClickOutsideColumn = (e) => {
      if (columnRef.current && !columnRef.current.contains(e.target)) {
        setIsEditing(false)
        setColumnName(state.name)
      }
    }

    document.addEventListener("mousedown", handleClickOutsideColumn)

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideColumn)
    }
  }, [columnRef])

  useEffect(() => {
    // hydrate persisted store after on mount
    useStore.persist.rehydrate()
    setLoaded(true)
  }, [])

  const handleColumnTitleClick = () => {
    setColumnName(state.name)
    if (!state.collapsed) {
      setIsEditing(true)
    }
  }

  const handleToggleCollapse = (id) => {
    toggleColumnCollapse(id)
  }

  const handleResize = (e) => {
    e.target.style.height = "auto"
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  return (
    <>
      {loaded ? (
        <Draggable draggableId={state.id} index={index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              className={`${
                state.collapsed ? "w-[3rem]" : "w-[16rem]"
              }  inline-block min-w-64 text-center scroll-m-2 align-top whitespace-nowrap mx-2 rounded-lg h-fit bg-gray-50 dark:bg-gray-950`}
            >
              <div
                {...provided.dragHandleProps}
                className={`${
                  state.collapsed
                    ? "rounded-lg flex-col justify-start"
                    : "flex-row justify-center"
                } ${
                  snapshot.isDragging ? "bg-gray-300 dark:bg-gray-800" : ""
                } flex items-center justify-between rounded-t-lg p-2 w-full font-medium text-center gap-4`}
              >
                <button
                  transition={{ ease: "easeOut", duration: 0.1 }}
                  animate={{ rotate: state.collapsed ? 90 : 0 }}
                  onClick={() => handleToggleCollapse(state.id)}
                  className={`${
                    state.collapsed ? "rotate-90" : "rotate-0"
                  } flex items-center transition-all justify-center h-8 w-8 p-2 top-0 left-0 rounded-full bg-white text-gray-950`}
                >
                  <ArrowRightIcon className='h-4 w-4' />
                </button>
                {isEditing ? (
                  <input
                    id={state.id}
                    type='text'
                    ref={columnRef}
                    value={columnName}
                    onChange={handleNameChange}
                    onKeyDown={handleKeyDownColumn}
                    maxLength={15}
                    className='w-full rounded-lg font-medium text-center'
                    autoFocus
                  />
                ) : (
                  <h1
                    className={`${
                      state.collapsed ? " [writing-mode:vertical-lr]" : "h-full"
                    } flex truncate items-center`}
                    onClick={handleColumnTitleClick}
                  >
                    {state.name}
                  </h1>
                )}
                {state.collapsed ? (
                  <button
                    className={`${
                      state.collapsed ? "opacity-50" : ""
                    } flex items-center justify-center h-8 w-8 p-2 top-0 left-0 rounded-full bg-white text-gray-950`}
                    disabled={state.collapsed}
                    title={
                      state.collapsed ? "Cannot delete collapsed column" : ""
                    }
                  >
                    <TrashIcon className='w-4 h-4' />
                  </button>
                ) : (
                  <button
                    className={`${
                      tasks.length != 0 ? "opacity-50" : ""
                    } flex items-center justify-center h-8 w-8 p-2 top-0 left-0 rounded-full bg-white text-gray-950`}
                    disabled={tasks.length != 0}
                    onClick={() => handleDeleteColumn(state.id)}
                    title={
                      tasks.length != 0 ? "Cannot delete column with tasks" : ""
                    }
                  >
                    <TrashIcon className='w-4 h-4' />
                  </button>
                )}
              </div>
              <div
                className={`rounded-b-lg p-2 text-center flex flex-col  ${
                  state.collapsed ? "hidden" : ""
                }`}
              >
                <Droppable droppableId={state.id} type='task'>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`${
                        snapshot.isDraggingOver
                          ? "bg-gray-300 dark:bg-gray-600"
                          : ""
                      } max-h-96 transition-colors p-2 rounded-lg overflow-y-auto overflow-x-hidden`}
                    >
                      {tasks.map((task, index) => (
                        <div key={task.id}>
                          <Task title={task.title} id={task.id} index={index} />
                        </div>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                {showInput ? (
                  <div className='flex items-center w-full flex-row h-fit'>
                    <textarea
                      id='newTask'
                      ref={inputRef}
                      type='text'
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onInput={handleResize}
                      className='bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-lg flex-1 break-words h-fit block overflow-hidden resize-y'
                      maxLength={100}
                      placeholder='New task name...'
                      autoFocus
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setShowInput(true)}
                    className='px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all rounded-lg flex w-full text-center justify-center'
                  >
                    + Add a card
                  </button>
                )}
              </div>
            </div>
          )}
        </Draggable>
      ) : (
        ""
      )}
    </>
  )
}
