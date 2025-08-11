import React from "react";
import { User, Mail, Phone, UserCircle, Edit3, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  phoneNumber: z.string().optional(),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

const PersonalInformationSection: React.FC = () => {
  const [isEditing, setIsEditing] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "Selvi",
      lastName: "Ekawati",
      username: "selvi1231234124",
      email: "selvi.ekawati@gmail.com",
      phoneNumber: "082346187259",
    },
  });

  const onSave = (data: PersonalInfoFormData) => {
    console.log("Saving:", data);
    setIsEditing(false);
  };

  const onCancel = () => {
    setIsEditing(false);
    reset();
  };

  return (
    <Card>
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10  rounded-lg flex items-center justify-center">
              <User className="h-6 w-6" />
            </div>
            <CardTitle>Personal Information</CardTitle>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={onCancel}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSubmit(onSave)}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>First Name *</Label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                {...register("firstName")}
                disabled={!isEditing}
                className="pl-10"
                placeholder="Enter first name"
              />
            </div>
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Last Name *</Label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                {...register("lastName")}
                disabled={!isEditing}
                className="pl-10"
                placeholder="Enter last name"
              />
            </div>
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Username *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              {...register("username")}
              disabled={!isEditing}
              className="pl-10"
              placeholder="Enter username"
            />
          </div>
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
          <p className="text-xs text-gray-500">
            Only letters, numbers, and underscores allowed
          </p>
        </div>

        <div className="space-y-2">
          <Label>Email Address *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              {...register("email")}
              type="email"
              disabled={!isEditing}
              className="pl-10"
              placeholder="Enter email address"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              {...register("phoneNumber")}
              type="tel"
              disabled={!isEditing}
              className="pl-10"
              placeholder="Enter phone number"
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInformationSection;
