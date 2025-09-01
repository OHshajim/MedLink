"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";

const DoctorStats = ({ data = [] }) => {
    // Helper: get today's date (only YYYY-MM-DD)
    const todayStr = format(new Date(), "yyyy-MM-dd");

    const stats = {
        today: data.filter(
            (a) => format(new Date(a.date), "yyyy-MM-dd") === todayStr
        ).length,
        pending: data.filter((a) => a.status === "PENDING").length,
        completed: data.filter((a) => a.status === "COMPLETE").length,
    };

    const cards = [
        {
            icon: <Calendar className="h-8 w-8 text-primary" />,
            label: "Total Today",
            value: stats.today,
        },
        {
            icon: <Clock className="h-8 w-8 text-warning" />,
            label: "Pending",
            value: stats.pending,
        },
        {
            icon: <CheckCircle className="h-8 w-8 text-success" />,
            label: "Completed",
            value: stats.completed,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card, idx) => (
                <Card
                    key={idx}
                    className="medical-card hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
                >
                    <CardContent className="p-6 flex items-center">
                        {card.icon}
                        <div className="ml-4">
                            <p className="text-sm font-medium text-muted-foreground">
                                {card.label}
                            </p>
                            <p className="text-2xl font-bold animate-in fade-in zoom-in duration-500">
                                {card.value}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default DoctorStats;
