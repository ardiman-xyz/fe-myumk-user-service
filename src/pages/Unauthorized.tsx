// src/pages/Unauthorized.tsx
import React from "react";
import { Shield, ArrowLeft, AlertTriangle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const UnauthorizedPage: React.FC = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleClearAndLogin = () => {
    // Clear all stored data
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to login
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-red-200 shadow-xl">
          <CardContent className="p-8 text-center">
            {/* Icon */}
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <Shield className="w-10 h-10 text-red-600" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 mb-6">
              You don't have sufficient privileges to access this system. Super
              Admin access is required.
            </p>

            {/* Error Details */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-sm font-medium text-red-800">
                  Error Code: INSUFFICIENT_PRIVILEGES
                </span>
              </div>
              <p className="text-xs text-red-700">
                Only users with Super Administrator privileges can access this
                application.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Primary Action - Login as Different User */}
              <Button
                onClick={handleClearAndLogin}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Login as Different User
              </Button>

              {/* Secondary Action - Go Back */}
              <Button
                variant="outline"
                onClick={handleGoBack}
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>

            {/* Help Text */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                If you believe this is an error, please contact your system
                administrator to verify your account permissions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact support at{" "}
            <a
              href="mailto:support@yourcompany.com"
              className="text-red-600 hover:text-red-700 font-medium"
            >
              support@yourcompany.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
