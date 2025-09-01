import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Star } from "lucide-react";

const DoctorCards = ({ doctor, handleBookAppointment }) => {
    return (
        <div>
            <Card
                key={doctor.id}
                className="medical-card group transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl"
            >
                <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                        <Avatar className="w-16 h-16 ring-2 ring-primary/40 transition duration-300 group-hover:ring-primary">
                            <AvatarImage
                                src={doctor.photo_url}
                                alt={doctor.name}
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                {doctor.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-card-foreground truncate transition-colors duration-300 group-hover:text-primary">
                                Dr. {doctor.name}
                            </h3>
                            <Badge
                                variant="secondary"
                                className="mt-1 animate-fadeIn"
                            >
                                {doctor.specialization}
                            </Badge>
                            <div className="flex items-center mt-2 text-sm text-muted-foreground">
                                <Star className="h-4 w-4 mr-1 text-warning animate-pulse" />
                                4.8 (120 reviews)
                            </div>
                            <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4 mr-1 animate-bounce" />
                                Available today
                            </div>
                        </div>
                    </div>
                    <Button
                        className="w-full mt-4 medical-button transition-all duration-300 ease-out hover:translate-y-[-2px] hover:shadow-lg"
                        onClick={() => handleBookAppointment(doctor)}
                    >
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Appointment
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default DoctorCards;
