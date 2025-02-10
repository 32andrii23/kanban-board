import { type FC, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import confetti from 'canvas-confetti';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { ColumnDto } from '@/types';

interface AddTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (createTaskDto: {
    title: string;
    description?: string;
    columnId: string;
  }) => void;
  columns: ColumnDto[];
}

const formSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .max(100, 'Task title must be 100 characters or less'),
  description: z.string().optional(),
  columnId: z.string().min(1, 'Column is required'),
});

const AddTaskDialog: FC<AddTaskDialogProps> = ({
  isOpen,
  onClose,
  onAdd,
  columns,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      columnId: '',
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      setIsSubmitting(true);

      onAdd(values);

      setIsSubmitting(false);

      onClose();

      form.reset();

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    },
    [onAdd, onClose, form],
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="max-h-[200px]"
                      placeholder="Enter task description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="columnId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Column</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {columns.map((column) => (
                        <label
                          key={column.id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="radio"
                            {...field}
                            checked={field.value === column.id}
                            onChange={() => field.onChange(column.id)}
                          />
                          <span>{column.title}</span>
                        </label>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Task'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
