import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { statusColors } from "../patient/AppointmentCards"; // assumes you’ve got colors mapped

// ✅ Strongly typed props (better DX if using TS)
const AppointmentCards = ({ appointment, handleUpdateStatus }) => {
    const { id, patient, date, status } = appointment;

    const formattedDate = format(new Date(date), "PPP");
    const formattedTime = format(new Date(date), "p");

    return (
        <Card
            key={id}
            className="medical-card hover:shadow-md transition-shadow"
        >
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    {/* Left Section: Patient Info */}
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16 border">
                            <AvatarImage
                                src={patient.photo_url}
                                alt={patient.name}
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                {patient.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                                {patient.name}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                {patient.email}
                            </p>

                            <div className="flex items-center mt-2 space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {formattedDate}
                                </div>
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {formattedTime}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Status + Actions */}
                    <div className="flex items-center space-x-3">
                        <Badge className={statusColors[status]}>{status}</Badge>

                        {status === "PENDING" && (
                            <div className="flex space-x-2">
                                <Button
                                    size="sm"
                                    onClick={() =>
                                        handleUpdateStatus(id, "COMPLETED")
                                    }
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                    aria-label="Mark appointment as complete"
                                >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Complete
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                        handleUpdateStatus(id, "CANCELLED")
                                    }
                                    className="text-red-600 border-red-600 hover:text-red-800 hover:bg-red-50"
                                    aria-label="Cancel appointment"
                                >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AppointmentCards;
