import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { appointmentsApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import AppointmentCards from '@/components/doctor/AppointmentCards';
import { handleNextPage, handlePrevPage } from '@/service/paginations';
import DoctorStats from '@/components/doctor/DoctorStats';

interface Appointment {
  id: string;
  date: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  patient: {
    id: string;
    name: string;
    email: string;
    photo_url?: string;
  };
}

export const DoctorDashboard = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [actionType, setActionType] = useState(null);
  
  const queryClient = useQueryClient();

  const { data: appointmentsData, isLoading } = useQuery({
    queryKey: ['doctor-appointments', page, statusFilter, dateFilter],
    queryFn: () => appointmentsApi.getDoctorAppointments({
      page,
      status: statusFilter || undefined,
      date: dateFilter || undefined,
    }),
    select: (data) => data.data,
  });
  console.log(appointmentsData);
  

  const updateStatusMutation = useMutation({
      mutationFn: ({
          appointment_id,
          status,
      }: {
          appointment_id: string;
          status: "COMPLETED" | "CANCELLED";
      }) =>
          appointmentsApi.updateStatus({
              status,
              appointment_id,
          }),
      onSuccess: (_, variables) => {
          queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
          const actionText =
              variables.status === "COMPLETED" ? "COMPLETED" : "cancelled";
          toast({
              title: `Appointment ${actionText}`,
              description: `The appointment has been ${actionText} successfully.`,
          });
          setActioningId(null);
          setActionType(null);
      },
      onError: (error: any) => {
          toast({
              title: "Failed to update appointment",
              description:
                  error.response?.data?.message || "Something went wrong",
              variant: "destructive",
          });
          setActioningId(null);
          setActionType(null);
      },
  });

  const handleUpdateStatus = (
      appointmentId: string,
      status: "COMPLETED" | "CANCELLED"
  ) => {
      setActioningId(appointmentId);
      setActionType(status);
  };

  const confirmAction = () => {
    console.log(actioningId, actionType);
    
    if (actioningId && actionType) {
      updateStatusMutation.mutate({ appointment_id: actioningId, status: actionType });
    }
  };

  const todayDate = format(new Date(), 'yyyy-MM-dd');

  return (
      <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div>
              <h1 className="text-3xl font-bold text-primary">
                  Doctor Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                  Manage your appointments and patient consultations
              </p>
          </div>

          {/* Stats Overview */}
          <DoctorStats data={appointmentsData?.data} />

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
                      <Select
                          value={statusFilter}
                          onValueChange={setStatusFilter}
                      >
                          <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value=" ">All Status</SelectItem>
                              <SelectItem value="PENDING">Pending</SelectItem>
                              <SelectItem value="COMPLETED">COMPLETE</SelectItem>
                              <SelectItem value="CANCELLED">
                                  Cancelled
                              </SelectItem>
                          </SelectContent>
                      </Select>

                      <Input
                          type="date"
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
                          className="w-[200px]"
                          placeholder="Filter by date"
                      />

                      <Button
                          variant="outline"
                          onClick={() => setDateFilter(todayDate)}
                      >
                          Today
                      </Button>

                      <Button
                          variant="outline"
                          onClick={() => {
                              setStatusFilter("");
                              setDateFilter("");
                          }}
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
                      Appointments ({appointmentsData?.pagination?.total || 0})
                  </h2>
              </div>

              {isLoading ? (
                  <div className="w-16 h-16 rounded-full animate-shimmer bg-muted"></div>
              ) : appointmentsData?.data?.length === 0 ? (
                  <Card className="medical-card">
                      <CardContent className="p-12 text-center">
                          <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">
                              No appointments found
                          </h3>
                          <p className="text-muted-foreground">
                              {statusFilter || dateFilter
                                  ? "No appointments match your current filters."
                                  : "No appointments scheduled at this time."}
                          </p>
                      </CardContent>
                  </Card>
              ) : (
                  <>
                      <div className="space-y-4">
                          {appointmentsData?.data?.map(
                              (appointment: Appointment) => (
                                  <AppointmentCards
                                      appointment={appointment}
                                      key={appointment.id}
                                      handleUpdateStatus={handleUpdateStatus}
                                  />
                              )
                          )}
                      </div>

                      {/* Pagination */}
                      {appointmentsData?.totalPages > 1 && (
                          <div className="flex justify-center gap-2 mt-8 animate-fadeIn">
                              <Button
                                  variant="outline"
                                  disabled={page === 1}
                                  onClick={() =>
                                      handlePrevPage({ page, setPage })
                                  }
                                  className="transition-all duration-300 ease-out hover:-translate-x-1 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                  ◀ Previous
                              </Button>
                              <span className="flex items-center px-4 text-sm font-medium text-muted-foreground transition-colors duration-300">
                                  Page {page} of {appointmentsData.totalPages}
                              </span>
                              <Button
                                  variant="outline"
                                  disabled={
                                      page === appointmentsData.totalPages
                                  }
                                  onClick={() =>
                                      handleNextPage({
                                          page,
                                          totalPages:
                                              appointmentsData.totalPages,
                                          setPage,
                                      })
                                  }
                                  className="transition-all duration-300 ease-out hover:translate-x-1 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                  Next ▶
                              </Button>
                          </div>
                      )}
                  </>
              )}
          </div>

          {/* Action Confirmation Dialog */}
          <AlertDialog
              open={!!actioningId}
              onOpenChange={(open) =>
                  !open && (setActioningId(null), setActionType(null))
              }
          >
              <AlertDialogContent>
                  <AlertDialogHeader>
                      <AlertDialogTitle>
                          {actionType === "COMPLETED"
                              ? "Complete Appointment"
                              : "Cancel Appointment"}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                          {actionType === "COMPLETED"
                              ? "Mark this appointment as COMPLETE? The patient will be notified."
                              : "Are you sure you want to cancel this appointment? The patient will be notified."}
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                          onClick={confirmAction}
                          className={
                              actionType === "COMPLETED"
                                  ? "bg-success hover:bg-success/90"
                                  : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          }
                      >
                          {actionType === "COMPLETED"
                              ? "Mark as Complete"
                              : "Yes, Cancel Appointment"}
                      </AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
      </div>
  );
};