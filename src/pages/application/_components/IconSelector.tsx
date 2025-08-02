import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Globe,
  Users,
  Shield,
  Settings,
  FileText,
  BarChart,
  ShoppingCart,
  HelpCircle,
  Database,
  Mail,
  Calendar,
  Image,
  Lock,
  CreditCard,
  Truck,
  Check,
} from "lucide-react";
import { AVAILABLE_ICONS } from "@/types/application";

interface IconSelectorProps {
  selectedIcon: string;
  onIconChange: (iconName: string) => void;
  disabled?: boolean;
}

const IconSelector: React.FC<IconSelectorProps> = ({
  selectedIcon,
  onIconChange,
  disabled = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Icon mapping for visual display
  const iconComponents: { [key: string]: React.ReactNode } = {
    globe: <Globe className="h-5 w-5" />,
    users: <Users className="h-5 w-5" />,
    shield: <Shield className="h-5 w-5" />,
    settings: <Settings className="h-5 w-5" />,
    "file-text": <FileText className="h-5 w-5" />,
    "bar-chart": <BarChart className="h-5 w-5" />,
    "shopping-cart": <ShoppingCart className="h-5 w-5" />,
    "help-circle": <HelpCircle className="h-5 w-5" />,
    database: <Database className="h-5 w-5" />,
    mail: <Mail className="h-5 w-5" />,
    calendar: <Calendar className="h-5 w-5" />,
    image: <Image className="h-5 w-5" />,
    lock: <Lock className="h-5 w-5" />,
    "credit-card": <CreditCard className="h-5 w-5" />,
    truck: <Truck className="h-5 w-5" />,
  };

  // Filter icons based on search
  const filteredIcons = AVAILABLE_ICONS.filter(
    (icon) =>
      icon.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      icon.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      icon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleIconSelect = (iconName: string) => {
    if (!disabled) {
      onIconChange(iconName);
    }
  };

  const getIconComponent = (iconName: string) => {
    return iconComponents[iconName] || <Globe className="h-5 w-5" />;
  };

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search icons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          disabled={disabled}
        />
      </div>

      {/* Selected Icon Display */}
      {selectedIcon && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              {getIconComponent(selectedIcon)}
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">
                {AVAILABLE_ICONS.find((icon) => icon.name === selectedIcon)
                  ?.label || "Selected Icon"}
              </p>
              <p className="text-xs text-blue-700">
                {AVAILABLE_ICONS.find((icon) => icon.name === selectedIcon)
                  ?.description || selectedIcon}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleIconSelect("")}
              disabled={disabled}
              className="ml-auto text-blue-600 hover:text-blue-800"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Icon Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-64 overflow-y-auto border rounded-lg p-3">
        {filteredIcons.map((icon) => {
          const isSelected = selectedIcon === icon.name;

          return (
            <button
              key={icon.name}
              type="button"
              onClick={() => handleIconSelect(icon.name)}
              disabled={disabled}
              className={`
                relative p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105
                ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
              title={`${icon.label} - ${icon.description}`}
            >
              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-white" />
                </div>
              )}

              {/* Icon */}
              <div className="flex flex-col items-center gap-1">
                {getIconComponent(icon.name)}
                <span className="text-xs font-medium truncate w-full text-center">
                  {icon.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* No Results */}
      {filteredIcons.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <Image className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No icons found matching "{searchQuery}"</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchQuery("")}
            className="mt-2"
            disabled={disabled}
          >
            Clear search
          </Button>
        </div>
      )}

      {/* Icon Guidelines */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border">
        <p className="font-medium mb-1">Icon Selection Tips:</p>
        <ul className="space-y-1">
          <li>
            • Choose icons that clearly represent your application's purpose
          </li>
          <li>
            • Icons help users quickly identify applications in navigation
          </li>
          <li>• Leave empty to use the default globe icon</li>
          <li>• You can always change the icon later</li>
        </ul>
      </div>
    </div>
  );
};

export default IconSelector;
