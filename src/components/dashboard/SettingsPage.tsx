import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Bell, User, Save, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { authAPI, facultyAPI } from "../../utils/api";

export function SettingsPage() {
  // Visibility Settings
  const [profileVisible, setProfileVisible] = useState(true);
  const [papersVisible, setPapersVisible] = useState(true);
  const [patentsVisible, setPatentsVisible] = useState(true);
  const [projectsVisible, setProjectsVisible] = useState(true);
  const [contactInfoVisible, setContactInfoVisible] = useState(true);

  // Password Settings
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [searchNotifications, setSearchNotifications] = useState(false);
  const [collaborationRequests, setCollaborationRequests] = useState(true);

  // Success Messages
  const [visibilitySaved, setVisibilitySaved] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [notificationsSaved, setNotificationsSaved] = useState(false);
  const [visibilityError, setVisibilityError] = useState("");
  const [isLoadingVisibility, setIsLoadingVisibility] = useState(true);
  const [isSavingVisibility, setIsSavingVisibility] = useState(false);

  useEffect(() => {
    const loadVisibility = async () => {
      setIsLoadingVisibility(true);
      setVisibilityError("");
      try {
        const me = await authAPI.me();
        if (typeof me?.profile_visibility === "boolean") {
          setProfileVisible(me.profile_visibility);
        } else if (typeof me?.profileVisibility === "boolean") {
          setProfileVisible(me.profileVisibility);
        }
      } catch (err: any) {
        setVisibilityError(err?.message || "Unable to load visibility settings.");
      } finally {
        setIsLoadingVisibility(false);
      }
    };

    loadVisibility();
  }, []);

  const handleSaveVisibility = async () => {
    setIsSavingVisibility(true);
    setVisibilitySaved(false);
    setVisibilityError("");
    try {
      await facultyAPI.updateMe({
        profile_visibility: profileVisible,
      });
      setVisibilitySaved(true);
      setTimeout(() => setVisibilitySaved(false), 3000);
    } catch (err: any) {
      setVisibilityError(err?.message || "Unable to save visibility settings.");
    } finally {
      setIsSavingVisibility(false);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }
    // In a real app, this would update the password in the backend
    setPasswordChanged(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordChanged(false), 3000);
  };

  const handleSaveNotifications = () => {
    // In a real app, this would save to the backend
    setNotificationsSaved(true);
    setTimeout(() => setNotificationsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-light text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600 font-light">
          Manage your account settings and profile visibility
        </p>
      </div>

      {/* Profile Visibility Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#8b0000] rounded-lg flex items-center justify-center">
            <Eye className="w-5 h-5 text-[#ffd100]" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-900">Profile Visibility</h2>
            <p className="text-sm text-gray-600">Control what information is visible to external users</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Profile Information</p>
              <p className="text-sm text-gray-600">Name, title, department, and bio</p>
            </div>
            <button
              onClick={() => setProfileVisible(!profileVisible)}
              disabled={isLoadingVisibility || isSavingVisibility}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                profileVisible ? "bg-[#8b0000]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  profileVisible ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Research Papers</p>
              <p className="text-sm text-gray-600">Published papers and publications</p>
            </div>
            <button
              onClick={() => setPapersVisible(!papersVisible)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                papersVisible ? "bg-[#8b0000]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  papersVisible ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Patents</p>
              <p className="text-sm text-gray-600">Patent filings and intellectual property</p>
            </div>
            <button
              onClick={() => setPatentsVisible(!patentsVisible)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                patentsVisible ? "bg-[#8b0000]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  patentsVisible ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Projects</p>
              <p className="text-sm text-gray-600">Current and past research projects</p>
            </div>
            <button
              onClick={() => setProjectsVisible(!projectsVisible)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                projectsVisible ? "bg-[#8b0000]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  projectsVisible ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Contact Information</p>
              <p className="text-sm text-gray-600">Email and phone number</p>
            </div>
            <button
              onClick={() => setContactInfoVisible(!contactInfoVisible)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                contactInfoVisible ? "bg-[#8b0000]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  contactInfoVisible ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button
            onClick={handleSaveVisibility}
            disabled={isLoadingVisibility || isSavingVisibility}
            className="bg-[#8b0000] hover:bg-[#6b0000] text-[#ffd100]"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSavingVisibility ? "Saving..." : "Save Visibility Settings"}
          </Button>
          {visibilitySaved && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">Settings saved!</span>
            </div>
          )}
          {visibilityError && (
            <div className="text-sm text-red-600">{visibilityError}</div>
          )}
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#8b0000] rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-[#ffd100]" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-900">Change Password</h2>
            <p className="text-sm text-gray-600">Update your account password</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              className="bg-[#8b0000] hover:bg-[#6b0000] text-[#ffd100]"
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
            {passwordChanged && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Password updated successfully!</span>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#8b0000] rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-[#ffd100]" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-900">Notification Preferences</h2>
            <p className="text-sm text-gray-600">Manage how you receive notifications</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive email updates about your account</p>
            </div>
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                emailNotifications ? "bg-[#8b0000]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  emailNotifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Search Alerts</p>
              <p className="text-sm text-gray-600">Get notified when someone searches for your expertise</p>
            </div>
            <button
              onClick={() => setSearchNotifications(!searchNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                searchNotifications ? "bg-[#8b0000]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  searchNotifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Collaboration Requests</p>
              <p className="text-sm text-gray-600">Receive notifications for collaboration opportunities</p>
            </div>
            <button
              onClick={() => setCollaborationRequests(!collaborationRequests)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                collaborationRequests ? "bg-[#8b0000]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  collaborationRequests ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button
            onClick={handleSaveNotifications}
            className="bg-[#8b0000] hover:bg-[#6b0000] text-[#ffd100]"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Notification Settings
          </Button>
          {notificationsSaved && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">Settings saved!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
