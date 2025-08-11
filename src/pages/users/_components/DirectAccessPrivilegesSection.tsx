import React from "react";
import {
  ShieldPlus,
  Search,
  Edit3,
  Save,
  X,
  Calendar,
  Users,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Mock applications data
const mockApplications = [
  {
    id: 1,
    name: "Akademik",
    code: "akademik",
    icon: "calendar",
    description: "Academic management system",
    permissions: [
      {
        id: 1,
        name: "Access Akademik",
        action: "access",
        code: "akademik.access",
      },
    ],
    menus: [
      {
        id: 1,
        name: "Administrator",
        permissions: [
          {
            id: 2,
            name: "View Administrator",
            action: "view",
            code: "akademik.administrator.view",
          },
          {
            id: 3,
            name: "Create Administrator",
            action: "create",
            code: "akademik.administrator.create",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Penerimaan Mahasiswa Baru",
    code: "pmb",
    icon: "users",
    description: "Student admission management system",
    permissions: [
      { id: 4, name: "Access PMB", action: "access", code: "pmb.access" },
    ],
    menus: [
      {
        id: 2,
        name: "Pendaftaran",
        permissions: [
          {
            id: 5,
            name: "View Pendaftaran",
            action: "view",
            code: "pmb.pendaftaran.view",
          },
          {
            id: 6,
            name: "Create Pendaftaran",
            action: "create",
            code: "pmb.pendaftaran.create",
          },
          {
            id: 7,
            name: "Edit Pendaftaran",
            action: "edit",
            code: "pmb.pendaftaran.edit",
          },
        ],
      },
    ],
  },
];

const privilegeSchema = z.object({
  selectedApplications: z.array(z.number()),
  selectedPermissions: z.array(z.number()),
  notes: z.string().max(1000, "Notes must not exceed 1000 characters"),
  expiration: z.string().optional(),
});

type PrivilegeFormData = z.infer<typeof privilegeSchema>;

const DirectAccessPrivilegesSection: React.FC = () => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [searchQueries, setSearchQueries] = React.useState<
    Record<number, string>
  >({});
  const [expandedApps, setExpandedApps] = React.useState<
    Record<number, boolean>
  >({});
  const [selectedApplications, setSelectedApplications] = React.useState<
    number[]
  >([]);
  const [selectedPermissions, setSelectedPermissions] = React.useState<
    number[]
  >([1, 2]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PrivilegeFormData>({
    resolver: zodResolver(privilegeSchema),
    defaultValues: {
      selectedApplications: [],
      selectedPermissions: [1, 2],
      notes: "",
      expiration: "",
    },
  });

  const notes = watch("notes");

  // Update form values when state changes
  React.useEffect(() => {
    setValue("selectedApplications", selectedApplications);
    setValue("selectedPermissions", selectedPermissions);
  }, [selectedApplications, selectedPermissions, setValue]);

  const handleAppToggle = (appId: number) => {
    setSelectedApplications((prev) =>
      prev.includes(appId)
        ? prev.filter((id) => id !== appId)
        : [...prev, appId]
    );
  };

  const handlePermToggle = (permId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId)
        ? prev.filter((id) => id !== permId)
        : [...prev, permId]
    );
  };

  const toggleAppExpansion = (appId: number) => {
    setExpandedApps((prev) => ({
      ...prev,
      [appId]: !prev[appId],
    }));
  };

  const handleSearch = (appId: number, query: string) => {
    setSearchQueries((prev) => ({
      ...prev,
      [appId]: query,
    }));
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      view: "bg-blue-100 text-blue-800",
      create: "bg-green-100 text-green-800",
      edit: "bg-yellow-100 text-yellow-800",
      delete: "bg-red-100 text-red-800",
      access: "bg-purple-100 text-purple-800",
    };
    return colors[action] || "bg-gray-100 text-gray-800";
  };

  const getAppIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      calendar: <Calendar className="h-4 w-4" />,
      users: <Users className="h-4 w-4" />,
    };
    return icons[iconName] || <Calendar className="h-4 w-4" />;
  };

  const filterPermissions = (permissions: any[], appId: number) => {
    const query = searchQueries[appId]?.toLowerCase() || "";
    if (!query) return permissions;

    return permissions.filter(
      (perm) =>
        perm.name.toLowerCase().includes(query) ||
        perm.code.toLowerCase().includes(query) ||
        perm.action.toLowerCase().includes(query)
    );
  };

  const onSave = (data: PrivilegeFormData) => {
    console.log("Saving privileges:", data);
    setIsEditing(false);
  };

  const onCancel = () => {
    setIsEditing(false);
    setSelectedApplications([]);
    setSelectedPermissions([1, 2]);
    setSearchQueries({});
    setExpandedApps({});
  };

  const clearAllSelections = () => {
    setSelectedApplications([]);
    setSelectedPermissions([]);
  };

  const totalSelected =
    selectedApplications.length + selectedPermissions.length;

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
              <ShieldPlus className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Direct Access Privileges</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Grant specific application and menu access to this user
              </p>
            </div>
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
        {/* Selection Summary */}
        {totalSelected > 0 && (
          <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="text-sm font-medium text-purple-700">
              {totalSelected} items selected
            </div>
            {isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllSelections}
                className="text-red-600 hover:text-red-800"
              >
                Clear all selections
              </Button>
            )}
          </div>
        )}

        {/* Applications List */}
        <div className="space-y-4">
          <Label>Available Applications ({mockApplications.length})</Label>

          {mockApplications.map((app) => (
            <div
              key={app.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* App Header */}
              <div className="bg-gray-50 p-4">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedApplications.includes(app.id)}
                    onCheckedChange={() => isEditing && handleAppToggle(app.id)}
                    disabled={!isEditing}
                  />
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                    {getAppIcon(app.icon)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {app.name}
                    </div>
                    <div className="text-sm text-gray-500">@{app.code}</div>
                    <div className="text-sm text-gray-500">
                      {app.description}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditing && (
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          value={searchQueries[app.id] || ""}
                          onChange={(e) => handleSearch(app.id, e.target.value)}
                          className="pl-10 w-48"
                          placeholder="Search permissions..."
                        />
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAppExpansion(app.id)}
                    >
                      {expandedApps[app.id] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* App Content */}
              {expandedApps[app.id] && (
                <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
                  {/* App Permissions */}
                  {app.permissions.length > 0 && (
                    <div className="border-l-4 border-purple-200 pl-4">
                      <h4 className="text-sm font-medium mb-3 text-purple-700">
                        Application Permissions ({app.permissions.length})
                      </h4>
                      <div className="space-y-2">
                        {filterPermissions(app.permissions, app.id).map(
                          (perm) => (
                            <label
                              key={perm.id}
                              className="flex items-center gap-3 p-3 hover:bg-purple-50 rounded-lg cursor-pointer"
                            >
                              <Checkbox
                                checked={selectedPermissions.includes(perm.id)}
                                onCheckedChange={() =>
                                  isEditing && handlePermToggle(perm.id)
                                }
                                disabled={!isEditing}
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium">
                                    {perm.name}
                                  </span>
                                  <Badge
                                    className={`text-xs ${getActionColor(
                                      perm.action
                                    )}`}
                                  >
                                    {perm.action}
                                  </Badge>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {perm.code}
                                </div>
                              </div>
                            </label>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Menu Permissions */}
                  {app.menus.map((menu) => (
                    <div
                      key={menu.id}
                      className="border-l-4 border-indigo-200 pl-4"
                    >
                      <h4 className="text-sm font-medium mb-3 text-indigo-700">
                        {menu.name} ({menu.permissions.length} permissions)
                      </h4>
                      <div className="space-y-2">
                        {filterPermissions(menu.permissions, app.id).map(
                          (perm) => (
                            <label
                              key={perm.id}
                              className="flex items-center gap-3 p-3 hover:bg-indigo-50 rounded-lg cursor-pointer"
                            >
                              <Checkbox
                                checked={selectedPermissions.includes(perm.id)}
                                onCheckedChange={() =>
                                  isEditing && handlePermToggle(perm.id)
                                }
                                disabled={!isEditing}
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium">
                                    {perm.name}
                                  </span>
                                  <Badge
                                    className={`text-xs ${getActionColor(
                                      perm.action
                                    )}`}
                                  >
                                    {perm.action}
                                  </Badge>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {perm.code}
                                </div>
                              </div>
                            </label>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Advanced Settings */}
        {isEditing && (
          <div className="space-y-6 border-t pt-6">
            <Label>Advanced Settings</Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Expiration Date (Optional)</Label>
                <Input
                  {...register("expiration")}
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                />
                <p className="text-xs text-gray-500">
                  Leave empty for permanent access
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Administrative Notes</Label>
              <Textarea
                {...register("notes")}
                rows={4}
                placeholder="Document why this user needs direct access..."
                className="resize-none"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Good documentation helps with security audits</span>
                <span
                  className={
                    notes?.length > 900 ? "text-orange-600 font-medium" : ""
                  }
                >
                  {notes?.length || 0}/1000
                </span>
              </div>
              {errors.notes && (
                <p className="text-sm text-red-500">{errors.notes.message}</p>
              )}
            </div>
          </div>
        )}

        {/* Security Warning */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-800">
            <p className="font-medium mb-2">Security Best Practices:</p>
            <ul className="text-xs space-y-1 list-disc list-inside ml-4">
              <li>
                Apply principle of least privilege - grant only necessary access
              </li>
              <li>Set expiration dates for temporary access requirements</li>
              <li>
                Document clear business justification in administrative notes
              </li>
              <li>Review and audit direct privileges regularly</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DirectAccessPrivilegesSection;
