import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { appointmentsApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const appointmentSchema = z.object({
  date: z.date().refine(val => val, {
    message: 'Please select an appointment date',
  }),
  time: z.string().min(1, 'Please select an appointment time'),
});

type AppointmentForm = z.infer<typeof appointmentSchema>;

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  photo_url?: string;
}

interface BookAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor: Doctor | null;
  onSuccess: () => void;
}

export const BookAppointmentDialog = ({
  open,
  onOpenChange,
  doctor,
  onSuccess,
}: BookAppointmentDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const queryClient = useQueryClient();

  const form = useForm<AppointmentForm>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      time: '',
    },
  });

  const bookMutation = useMutation({
    mutationFn: (data: { doctorId: string; date: string }) =>
      appointmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-appointments'] });
      toast({
        title: 'Appointment booked successfully!',
        description: `Your appointment with Dr. ${doctor?.name} has been scheduled.`,
      });
      onSuccess();
      form.reset();
      setSelectedDate(undefined);
    },
    onError: (error) => {
      toast({
        title: 'Failed to book appointment',
        description: error.response?.data?.message || 'Something went wrong',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = async (data: AppointmentForm) => {
    if (!doctor) return;
    
    setIsLoading(true);
    
    // Combine date and time
    const [hours, minutes] = data.time.split(':');
    const appointmentDate = new Date(data.date);
    appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    try {
      await bookMutation.mutateAsync({
        doctorId: doctor.id,
        date: appointmentDate.toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3); // 3 months from now

  if (!doctor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Book Appointment
          </DialogTitle>
          <DialogDescription>
            Schedule your appointment with the doctor
          </DialogDescription>
        </DialogHeader>

        {/* Doctor Info */}
        <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
          <Avatar className="w-12 h-12">
            <AvatarImage src={doctor.photo_url} alt={doctor.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {doctor.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">Dr. {doctor.name}</h3>
            <Badge variant="secondary">{doctor.specialization}</Badge>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Date</FormLabel>
                  <FormControl>
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setSelectedDate(date);
                      }}
                      disabled={(date) => 
                        date < today || date > maxDate || date.getDay() === 0 // Disable past dates and Sundays
                      }
                      initialFocus
                      className={cn('p-3 pointer-events-auto border rounded-md')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedDate && (
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Time</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            type="button"
                            variant={field.value === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => field.onChange(time)}
                            className="justify-center"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            {time}
                          </Button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !selectedDate}
                className="medical-button"
              >
                {isLoading ? 'Booking...' : 'Book Appointment'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};