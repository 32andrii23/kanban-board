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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';

interface AddBoardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Board name is required')
    .max(50, 'Board name must be 50 characters or less'),
});

const AddBoardDialog: FC<AddBoardDialogProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      setIsSubmitting(true);

      onAdd(values.name);

      setIsSubmitting(false);

      onClose();

      form.reset();

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    },
    [onAdd, onClose, form],
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Board</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Board Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter board name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Board'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBoardDialog;
