import { useState } from "react";
import { Link, useNavigate } from "react-router";

import DirectAccessPrivilegesSection from "./_components/DirectAccessPrivilegesSection";
import RoleAssignmentSection from "./_components/RoleAssignmentSection";
import SecurityInformationSection from "./_components/SecurityInformationSection";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserCreateInfo from "./_components/UserCreateInfo";
import PersonalInformationSection from "./_components/PersonalInformationSection";

const UserDetail = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/users"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Users
          </Link>
          <div className="h-4 w-px bg-gray-300" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              Detail User
            </h1>
            <p className="text-sm text-gray-600">Update information for</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/users")}
            disabled={false}
          >
            Cancel
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <PersonalInformationSection />
          </div>
          <div>
            <SecurityInformationSection />
          </div>
          <div>
            <RoleAssignmentSection />
          </div>
          <div>
            <DirectAccessPrivilegesSection />
          </div>
        </div>
        <div className="lg:col-span-1">
          <UserCreateInfo onQuickAction={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
