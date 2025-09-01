import z from "zod";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "@/lib/api";

import { Eye, EyeOff} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TabsContent} from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const doctorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  specialization: z.string().min(1, 'Please select a specialization'),
  photo_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});
type DoctorForm = z.infer<typeof doctorSchema>;

const RegisterForm = ({
    specializations,
    showPassword,
    isLoading,
    isError,
    setShowPassword,
    setIsLoading,
}) => {

    const navigate = useNavigate();
    const doctorForm = useForm<DoctorForm>({
        resolver: zodResolver(doctorSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            specialization: '',
            photo_url: '',
        },
    });
    const onDoctorSubmit = async (data: DoctorForm) => {
        setIsLoading(true);
        try {
            await authApi.registerDoctor({
                ...data,
                photo_url: data.photo_url || undefined,
            });

            toast({
                title: "Registration successful!",
                description: "Please sign in with your credentials.",
            });

            navigate("/login");
        } catch (error: any) {
            toast({
                title: "Registration failed",
                description:
                    error.response?.data?.message || "Something went wrong",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <TabsContent value="doctor" className="space-y-4 mt-6">
            <Form {...doctorForm}>
                <form
                    onSubmit={doctorForm.handleSubmit(onDoctorSubmit)}
                    className="space-y-4"
                >
                    <FormField
                        control={doctorForm.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Dr. Your Name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={doctorForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={doctorForm.control}
                        name="specialization"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Specialization</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your specialization" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {specializations.length > 0 ? (
                                            specializations.map(
                                                (spec: string) => (
                                                    <SelectItem
                                                        key={spec}
                                                        value={spec}
                                                    >
                                                        {spec}
                                                    </SelectItem>
                                                )
                                            )
                                        ) : (
                                            <SelectItem
                                                value="general"
                                                disabled
                                            >
                                                {isError
                                                    ? "Failed to load specializations"
                                                    : "Loading..."}
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={doctorForm.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Create a password"
                                            {...field}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={doctorForm.control}
                        name="photo_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Photo URL (Optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Profile photo URL"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full medical-button"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? "Creating Account..."
                            : "Create Doctor Account"}
                    </Button>
                </form>
            </Form>
        </TabsContent>
    );
};

export default RegisterForm;
