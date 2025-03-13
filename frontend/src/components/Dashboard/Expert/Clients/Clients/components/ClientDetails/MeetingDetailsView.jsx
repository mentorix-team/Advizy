export function MeetingDetailsView({ session }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Client</h3>
          <p className="mt-1">{session.clientName}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Service</h3>
          <p className="mt-1">{session.service}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
          <p className="mt-1">{session.date} at {session.time}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Duration</h3>
          <p className="mt-1">{session.duration}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Topic</h3>
          <p className="mt-1">{session.title}</p>
        </div>
      </div>

      {session.notes && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Meeting Notes</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">{session.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}