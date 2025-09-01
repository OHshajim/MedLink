import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Calendar, MapPin, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { doctorsApi, specializationsApi } from '@/lib/api';
import { BookAppointmentDialog } from '@/components/patient/BookAppointmentDialog';
import { Link } from 'react-router-dom';
import DoctorCards from '@/components/patient/DoctorCards';
import { handleNextPage, handlePrevPage } from '@/service/paginations';

interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  photo_url?: string;
}

export const PatientDashboard = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  const { data: specializationsResponse } = useQuery({
    queryKey: ['specializations'],
    queryFn: () => specializationsApi.getAll(),
  });

  // Handle different possible API response structures
  const specializations = Array.isArray(specializationsResponse?.data) 
    ? specializationsResponse.data 
    : Array.isArray(specializationsResponse) 
    ? specializationsResponse 
    : [];

  const { data: doctorsData, isLoading } = useQuery({
    queryKey: ['doctors', page, search, specialization],
    queryFn: () =>
        doctorsApi.getAll({
        page,
        limit: 6,
        search: search || undefined,
        specialization: specialization || undefined,
      }),
    select: (data) => data.data,
  });

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingDialog(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingDialog(false);
    setSelectedDoctor(null);
  };

  return (
      <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
              <div>
                  <h1 className="text-3xl font-bold text-primary">
                      Find Your Doctor
                  </h1>
                  <p className="text-muted-foreground mt-2">
                      Browse our network of qualified healthcare professionals
                  </p>
              </div>
              <Button asChild>
                  <Link to="/patient/appointments">
                      <Calendar className="mr-2 h-4 w-4" />
                      My Appointments
                  </Link>
              </Button>
          </div>

          {/* Search and Filters */}
          <Card className="medical-card">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Search Doctors
                  </CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="flex gap-4 flex-wrap">
                      <div className="flex-1 min-w-[200px]">
                          <Input
                              placeholder="Search by doctor name..."
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              className="w-full"
                          />
                      </div>
                      <div className="min-w-[200px]">
                          <Select
                              value={specialization}
                              onValueChange={setSpecialization}
                          >
                              <SelectTrigger>
                                  <SelectValue placeholder="Filter by specialization" />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value=" ">
                                      All Specializations
                                  </SelectItem>
                                  {Array.isArray(specializations) &&
                                      specializations.length > 0 &&
                                      specializations.map((spec: string) => (
                                          <SelectItem key={spec} value={spec}>
                                              {spec}
                                          </SelectItem>
                                      ))}
                              </SelectContent>
                          </Select>
                      </div>
                      <Button
                          variant="outline"
                          onClick={() => {
                              setSearch("");
                              setSpecialization("");
                          }}
                      >
                          <Filter className="mr-2 h-4 w-4" />
                          Clear
                      </Button>
                  </div>
              </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-4">
              <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                      Available Doctors ({doctorsData?.total || 0})
                  </h2>
              </div>

              {isLoading ? (
                  <div className="w-16 h-16 rounded-full animate-shimmer bg-muted"></div>
              ) : (
                  <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {doctorsData?.data?.map((doctor: Doctor) => (
                              <DoctorCards
                                  key={doctor.id}
                                  doctor={doctor}
                                  handleBookAppointment={handleBookAppointment}
                              />
                          ))}
                      </div>

                      {/* Pagination */}
                      {doctorsData?.totalPages > 1 && (
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
                                  Page {page} of {doctorsData.totalPages}
                              </span>
                              <Button
                                  variant="outline"
                                  disabled={page === doctorsData.totalPages}
                                  onClick={() => handleNextPage({ page, totalPages: doctorsData.totalPages, setPage })}
                                  className="transition-all duration-300 ease-out hover:translate-x-1 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                  Next ▶
                              </Button>
                          </div>
                      )}
                  </>
              )}
          </div>

          {/* Book Appointment Dialog */}
          <BookAppointmentDialog
              open={showBookingDialog}
              onOpenChange={setShowBookingDialog}
              doctor={selectedDoctor}
              onSuccess={handleBookingSuccess}
          />
      </div>
  );
};