"use client"
import { useStore } from "@store"
import { useEffect, useRef, useState } from "react"
import { Draggable } from "@hello-pangea/dnd"

export default function Task({ id, index }) {
  const [context, setContext] = useState(false)
  const [xYPosistion, setXyPosistion] = useState({ x: 0, y: 0 })
  const contextRef = useRef(null)

  const task = useStore((store) => store.tasks.find((task) => task.id === id))

  const { removeTask } = useStore()

  const showMenu = (e) => {
    e.preventDefault()
    setContext(true)
    setXyPosistion({ x: e.pageX, y: e.pageY - 5 * 16 }) // Subtracting 4rem (16 pixels per rem)
    console.log("Mouse Coordinates:", e.pageX, e.pageY)
  }

  const closeMenu = () => {
    setContext(false)
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contextRef.current && !contextRef.current.contains(e.target)) {
        setContext(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [contextRef])

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onContextMenu={showMenu}
          onClick={closeMenu}
          className={`${
            snapshot.isDragging
              ? "bg-gray-200 dark:bg-gray-700 opacity-50"
              : "bg-gray-100 dark:bg-gray-800"
          } rounded-xl min-h-[2rem] text-left px-2 py-1 flex flex-col justify-between cursor-move mb-2`}
        >
          {context && (
            <div
              style={{ top: xYPosistion.y, left: xYPosistion.x }}
              className='absolute bg-gray-200 dark:bg-gray-900 border border-gray-400 dark:border-gray-700 rounded-lg p-2 text-sm shadow-lg'
              ref={contextRef}
            >
              <button
                className='hover:bg-gray-100 p-2 rounded-lg hover:dark:bg-gray-800 transition-all'
                onClick={() => {
                  removeTask(task.id)
                  console.log(task.id)
                }}
              >
                Delete
              </button>
            </div>
          )}
          <h2 className='break-words overflow-hidden h-full whitespace-pre-wrap'>
            {task.title}
          </h2>
        </div>
      )}
    </Draggable>
  )
}
