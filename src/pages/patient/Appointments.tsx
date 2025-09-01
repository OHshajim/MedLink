import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { appointmentsApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import AppointmentCards from '@/components/patient/AppointmentCards';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Appointment {
  id: string;
  date: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  doctor: {
    id: string;
    name: string;
    specialization: string;
    photo_url?: string;
  };
}

export const PatientAppointments = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  
  const queryClient = useQueryClient();

  const { data: appointmentsData, isLoading } = useQuery({
    queryKey: ['patient-appointments', page, statusFilter],
    queryFn: () => appointmentsApi.getPatientAppointments({
      page,
      status: statusFilter || undefined,
    }),
    select: (data) => data.data,
  });
  console.log(appointmentsData);
  

  const cancelMutation = useMutation({
    mutationFn: (appointmentId: string) =>
      appointmentsApi.updateStatus({
        appointment_id: appointmentId,
        status: 'CANCELLED',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-appointments'] });
      toast({
        title: 'Appointment cancelled',
        description: 'Your appointment has been cancelled successfully.',
      });
      setCancellingId(null);
    },
    onError: (error: any ) => {
      toast({
        title: 'Failed to cancel appointment',
        description: error.response?.data?.message || 'Something went wrong',
        variant: 'destructive',
      });
      setCancellingId(null);
    },
  });

  const handleCancelAppointment = (appointmentId: string) => {
    cancelMutation.mutate(appointmentId);
  };

  return (
      <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
              <div>
                  <h1 className="text-3xl font-bold text-primary">
                      My Appointments
                  </h1>
                  <p className="text-muted-foreground mt-2">
                      Manage and track your medical appointments
                  </p>
              </div>
              <Button asChild>
                  <Link to="/patient/dashboard">
                      <Calendar className="mr-2 h-4 w-4" />
                      Book New Appointment
                  </Link>
              </Button>
          </div>

          {/* Filters */}
          <Card className="medical-card">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filter Appointments
                  </CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="flex gap-4">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=" ">All Status</SelectItem>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                          variant="outline"
                          onClick={() => setStatusFilter("")}
                      >
                          Clear Filters
                      </Button>
                  </div>
              </CardContent>
          </Card>

          {/* Appointments List */}
          <div className="space-y-4">
              <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                      Appointments ({appointmentsData?.totalPages || 0})
                  </h2>
              </div>

              {isLoading ? (
                  <div className="w-16 h-16 rounded-full animate-shimmer bg-muted"></div>
              ) : appointmentsData?.data === 0 ? (
                  <Card className="medical-card">
                      <CardContent className="p-12 text-center">
                          <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">
                              No appointments found
                          </h3>
                          <p className="text-muted-foreground mb-6">
                              {statusFilter
                                  ? `No ${statusFilter.toLowerCase()} appointments found.`
                                  : "You haven't booked any appointments yet."}
                          </p>
                          <Button asChild>
                              <Link to="/patient/dashboard">
                                  Book Your First Appointment
                              </Link>
                          </Button>
                      </CardContent>
                  </Card>
              ) : (
                  <>
                      <div className="space-y-4">
                          {appointmentsData?.data?.map(
                              (appointment: Appointment) => (
                                  <AppointmentCards
                                      key={appointment.id}
                                      appointment={appointment}
                                      setCancellingId={setCancellingId}
                                  />
                              )
                          )}
                      </div>

                      {/* Pagination */}
                      {appointmentsData?.totalPages > 1 && (
                          <div className="flex justify-center gap-2 mt-8">
                              <Button
                                  variant="outline"
                                  disabled={page === 1}
                                  onClick={() => setPage(page - 1)}
                              >
                                  Previous
                              </Button>
                              <span className="flex items-center px-4">
                                  Page {page} of {appointmentsData.totalPages}
                              </span>
                              <Button
                                  variant="outline"
                                  disabled={page >= appointmentsData.totalPages}
                                  onClick={() => setPage(page + 1)}
                              >
                                  Next
                              </Button>
                          </div>
                      )}
                  </>
              )}
          </div>

          {/* Cancel Confirmation Dialog */}
          <AlertDialog
              open={!!cancellingId}
              onOpenChange={(open) => !open && setCancellingId(null)}
          >
              <AlertDialogContent>
                  <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
                      <AlertDialogDescription>
                          Are you sure you want to cancel this appointment? This
                          action cannot be undone.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                      <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                      <AlertDialogAction
                          onClick={() =>
                              cancellingId &&
                              handleCancelAppointment(cancellingId)
                          }
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                          Yes, Cancel Appointment
                      </AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
      </div>
  );
};