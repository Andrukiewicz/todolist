"use client"

import Column from "../components/Column"
import { v4 as uuidv4 } from "uuid"
import { useStore } from "@/store"
import { DragDropContext, Droppable } from "@hello-pangea/dnd"

export default function Home() {
  const { addColumn, moveTask, columns, moveColumn } = useStore()

  // const columns = useStore((store) =>
  //   [...store.columns].sort((a, b) => a.order - b.order)
  // )

  const handleAddColumn = () => {
    const newColumnID = uuidv4() // Generate a new unique ID for the column
    const newColumnName = "Click to rename" // You can set an initial name if you'd like
    addColumn(newColumnID, newColumnName)
  }

  const handleOnDragEnd = (result) => {
    const { destination, source, draggableId, type } = result
    if (!destination) {
      return
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }
    if (type === "task") {
      moveTask(
        source.index,
        destination.index,
        draggableId,
        destination.droppableId
      )
    }
    if (type === "column") {
      moveColumn(
        source.index,
        destination.index,
        draggableId,
        destination.droppableId
      )
    }
  }

  return (
    <main
      id='content-wrapper'
      className='h-[calc(100vh-4rem)] relative z-[1] w-full'
    >
      <div
        id='board'
        className='bottom-0 left-0 overflow-x-scroll w-full overflow-y-hidden pb-4 absolute right-0 top-0 select-none whitespace-nowrap mt-6 pl-4'
      >
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable
            droppableId='all-columns'
            direction='horizontal'
            type='column'
          >
            {(provided, snapshot) => (
              <div
                className={`${
                  snapshot.isDraggingOver
                    ? "bg-gray-300 dark:bg-gray-900 rounded-lg bg-opacity-10"
                    : "bg-opacity-100"
                } w-full h-full transition-all`}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {columns.map((state, index) => (
                  <Column key={state.id} state={state} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <button
        className='bottom-0 right-0 absolute hover:scale-110 shadow-highlight hover:bg-gray-300 dark:hover:bg-gray-800 transition-all m-8 text-2xl align-top h-fit px-4 py-2 bg-gray-200 dark:bg-gray-950 rounded-full'
        onClick={handleAddColumn}
      >
        + Add new list
      </button>
    </main>
  )
}
