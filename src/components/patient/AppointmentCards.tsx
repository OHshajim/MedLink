import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, Clock, X } from "lucide-react";

export const statusColors = {
    PENDING: "status-pending",
    COMPLETED: "status-completed",
    CANCELLED: "status-cancelled",
};

const AppointmentCards = ({ appointment, setCancellingId }) => {
    return (
        <Card key={appointment.id} className="medical-card">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16">
                            <AvatarImage
                                src={appointment.doctor.photo_url}
                                alt={appointment.doctor.name}
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                {appointment.doctor.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                                Dr. {appointment.doctor.name}
                            </h3>
                            <p className="text-muted-foreground">
                                {appointment.doctor.specialization}
                            </p>
                            <div className="flex items-center mt-2 space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {format(new Date(appointment.date), "PPP")}
                                </div>
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {format(new Date(appointment.date), "p")}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Badge className={statusColors[appointment.status]}>
                            {appointment.status}
                        </Badge>

                        {appointment.status === "PENDING" && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCancellingId(appointment.id)}
                                className="text-destructive hover:text-destructive"
                            >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AppointmentCards;
