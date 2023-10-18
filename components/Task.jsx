"use client"
import { useStore } from "@store"
import { Draggable } from "@hello-pangea/dnd"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import TaskEditor from "./TaskEditor"
import { FileEdit } from "lucide-react"

export default function Task({ id, index }) {
  const task = useStore((store) => store.tasks.find((task) => task.id === id))

  const { removeTask } = useStore()

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`${
            snapshot.isDragging
              ? "bg-gray-200 dark:bg-gray-700 opacity-50"
              : "bg-gray-100 dark:bg-gray-800"
          } rounded-xl min-h-[2rem] text-left px-2 py-1 flex flex-col justify-between cursor-move mb-2`}
        >
          <Dialog>
            <ContextMenu>
              <ContextMenuTrigger>
                <DialogTrigger>
                  <h2 className='break-words overflow-hidden h-full whitespace-pre-wrap'>
                    {task.title}
                  </h2>
                </DialogTrigger>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <DialogTrigger asChild>
                  <ContextMenuItem>Edit</ContextMenuItem>
                </DialogTrigger>
                <ContextMenuItem>
                  <span onClick={() => removeTask(task.id)}>Delete</span>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  <div className='flex gap-2 items-center'>
                    <FileEdit className='h-6 w-6' />
                    Edit task
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div>
                <TaskEditor
                  title={task.title}
                  description={task.description}
                  id={task.id}
                  index={index}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </Draggable>
  )
}
