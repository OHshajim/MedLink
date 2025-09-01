import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Stethoscope, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { specializationsApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import RegisterForm from '@/components/doctor/RegisterForm';
import RegistrationForm from '@/components/patient/RegistrationForm';

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('patient');

  const { data: specializations, isError } = useQuery({
      queryKey: ["specializations"],
      queryFn: () => specializationsApi.getAll(),
      select(data) {
        return data.data.data;
      },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calendar className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary">MediCare</h1>
          <p className="text-muted-foreground mt-2">Create your account</p>
        </div>

        <Card className="medical-card">
          <CardHeader>
            <CardTitle>Join MediCare</CardTitle>
            <CardDescription>
              Register as a patient or healthcare provider
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="patient" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Patient
                </TabsTrigger>
                <TabsTrigger value="doctor" className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Doctor
                </TabsTrigger>
              </TabsList>

              <RegistrationForm
                setIsLoading={setIsLoading}
                isLoading={isLoading}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />

              <RegisterForm
                setIsLoading={setIsLoading}
                specializations={specializations || []}
                isLoading={isLoading}
                isError={isError}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};