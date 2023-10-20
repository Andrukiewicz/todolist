"use client"
import { useStore } from "@store"
import { Draggable } from "@hello-pangea/dnd"
import {
  Dialog,
  DialogContent,
  DialogHeader,
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
        <Dialog>
          <ContextMenu>
            <ContextMenuTrigger>
              <DialogTrigger className='h-full flex w-full'>
                <div
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                  className={`${
                    snapshot.isDragging && "opacity-50"
                  } bg-gray-100 dark:bg-gray-800 my-1 rounded-lg text-left px-2 py-1 cursor-move flex w-full`}
                >
                  <h2 className='break-words overflow-hidden [text-wrap:balance] whitespace-pre-wrap'>
                    {task.title}
                  </h2>
                </div>
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
            <TaskEditor
              title={task.title}
              description={task.description}
              id={task.id}
              index={index}
            />
          </DialogContent>
        </Dialog>
      )}
    </Draggable>
  )
}
