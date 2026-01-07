import { useState } from "react";

export default function AdminSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Settings</h2>

      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
        <h3 className="font-medium">Language</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Select your preferred language.</p>
        <div className="mt-3" id="google_translate_element"></div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
        <h3 className="font-medium">Preferences</h3>
        <div className="mt-4 space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
            />
            <span>Email notifications</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={smsNotifications}
              onChange={(e) => setSmsNotifications(e.target.checked)}
            />
            <span>SMS notifications</span>
          </label>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
        <h3 className="font-medium">Danger zone</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Be careful with destructive actions.</p>
        <button className="mt-4 inline-flex items-center rounded-md bg-red-600 text-white px-4 py-2 text-sm hover:bg-red-700">
          Reset demo data
        </button>
      </div>
    </div>
  );
}
