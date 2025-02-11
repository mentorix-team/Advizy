export function SessionContent({ notes, attachments, feedback }) {
  return (
    <div className="mt-4 space-y-4">
      {/* {notes && (
        // <div>
        //   <h4 className="text-sm font-medium text-[#169544] mb-2">Session Notes</h4>
        //   <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded break-words">{notes}</p>
        // </div>
      )} */}

      {/* {attachments && attachments.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-[#169544] mb-2">Attachments</h4>
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-600 truncate">{attachment.name}</span>
                <button className="px-3 py-1 text-sm text-blue-600 hover:bg-gray-100 rounded whitespace-nowrap ml-2">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {feedback && (
        <div>
          <h4 className="text-sm font-medium text-[#169544] mb-2">Client Feedback</h4>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded break-words">{feedback}</p>
        </div>
      )}
    </div>
  );
}