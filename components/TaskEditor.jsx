import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form"
import { Input } from "@components/ui/input"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "./ui/button"
import TipTap from "./TipTap"
import { useStore } from "@store"
import { DialogClose } from "./ui/dialog"

export default function TaskEditor({ id, title, description }) {
  const formSchema = z.object({
    title: z
      .string()
      .min(3, "Title is too short")
      .max(150, "Title is too long"),
    description: z
      .string()
      .min(5, "Description is too short")
      .max(1000, "Description is too long")
      .trim(),
  })
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      id,
      title,
      description,
    },
  })

  const { updateTask } = useStore()

  function onSubmit(data) {
    updateTask(id, data.title, data.description)
  }

  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-6'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <TipTap
                  description={field.value}
                  onChange={field.onChange}
                  withTypographyExtension={true}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <div>
          <DialogClose asChild>
            <Button type='submit'>Save</Button>
          </DialogClose>
        </div>
      </form>
    </Form>
  )
}
