import React from 'react';

export default function InvitationCard() {
  const invitation = {
    email: "naseem@lpu.in",
    status: "pending",
    role: "admin",
    plan: "pro",
    invitedBy: "umair@lpu.in",
  };

  // Status color mapping
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    declined: "bg-red-100 text-red-800",
    expired: "bg-gray-100 text-gray-800",
  };

  // Plan color mapping
  const planColors = {
    basic: "bg-blue-100 text-blue-800",
    pro: "bg-purple-100 text-purple-800",
    enterprise: "bg-indigo-100 text-indigo-800",
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4 border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
              {invitation.email.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <h2 className="font-semibold text-gray-800">{invitation.email}</h2>
              <p className="text-sm text-gray-500">Invited user</p>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[invitation.status]}`}>
            {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <p className="text-xs text-gray-500 uppercase">Role</p>
            <p className="font-medium">{invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Plan</p>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${planColors[invitation.plan]}`}>
              {invitation.plan.charAt(0).toUpperCase() + invitation.plan.slice(1)}
            </span>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-500 uppercase">Invited By</p>
            <p className="font-medium">{invitation.invitedBy}</p>
          </div>
        </div>
        
        <div className="flex justify-end mt-6 space-x-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Resend
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            Revoke
          </button>
        </div>
      </div>
    </div>
  );
}