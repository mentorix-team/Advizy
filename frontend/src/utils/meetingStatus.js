const DEFAULT_STATUS = "scheduled";

const STATUS_LABELS = {
    scheduled: "Scheduled",
    ongoing: "Ongoing",
    completed: "Completed",
    ended: "Completed",
    cancelled: "Cancelled",
    "no-show": "No Show",
    rescheduled: "Rescheduled",
    attended: "Attended",
    "not-attended": "Not Attended",
    "not-attending": "Not Attending",
};

const NEGATIVE_STATUSES = new Set([
    "not-attended",
    "not-attending",
    "no-show",
    "cancelled",
]);

const POSITIVE_STATUSES = new Set(["ongoing", "attended", "completed", "ended"]);

const pickStatusValue = (raw) => {
    if (!raw) return undefined;

    if (typeof raw === "string") {
        return raw;
    }

    if (typeof raw === "number") {
        return String(raw);
    }

    if (Array.isArray(raw) && raw.length) {
        return pickStatusValue(raw[raw.length - 1]);
    }

    if (typeof raw === "object") {
        const candidates = [raw.value, raw.status, raw.currentStatus, raw.state];
        for (const candidate of candidates) {
            if (typeof candidate === "string" && candidate.trim()) {
                return candidate;
            }
        }
    }

    return undefined;
};

const toSentenceCase = (value) => {
    if (!value || typeof value !== "string") return "";
    const normalized = value.replace(/_/g, " ").replace(/-/g, " ");
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const normalizeStatus = (rawStatus) => {
    if (!rawStatus || typeof rawStatus !== "string") {
        return DEFAULT_STATUS;
    }
    return rawStatus.trim().toLowerCase();
};

export const extractMeetingStatus = (meeting = {}) => {
    const {
        status,
        sessionStatus,
        meetingStatus,
        attendanceStatus,
        attendance_status,
        meetingAttendanceStatus,
        meeting_attendance_status,
    } = meeting || {};

    const candidates = [
        pickStatusValue(status),
        pickStatusValue(attendanceStatus),
        pickStatusValue(attendance_status),
        pickStatusValue(meetingAttendanceStatus),
        pickStatusValue(meeting_attendance_status),
        pickStatusValue(meetingStatus),
        pickStatusValue(meeting?.meeting_status),
        pickStatusValue(sessionStatus),
        pickStatusValue(meeting?.session_status),
    ];

    const selected = candidates.find((value) => typeof value === "string" && value.trim());

    return normalizeStatus(selected || DEFAULT_STATUS);
};

export const getMeetingStatusLabel = (meeting) => {
    const status = extractMeetingStatus(meeting);
    return STATUS_LABELS[status] || toSentenceCase(status);
};

export const getMeetingStatusPillTone = (meeting) => {
    const status = extractMeetingStatus(meeting);

    if (status === "ongoing") {
        return "bg-blue-100 text-blue-700";
    }

    if (status === "scheduled" || status === "rescheduled" || status === "attended") {
        return "bg-green-50 text-green-600";
    }

    if (NEGATIVE_STATUSES.has(status)) {
        return "bg-red-100 text-red-700";
    }

    if (status === "completed") {
        return "bg-emerald-50 text-emerald-600";
    }

    return "bg-gray-100 text-gray-600";
};

export const getInvoiceAttendanceLabel = (meeting) => {
    const status = extractMeetingStatus(meeting);

    if (status === "ongoing") {
        return "Ongoing";
    }

    if (POSITIVE_STATUSES.has(status)) {
        return "Attended and Completed";
    }

    if (NEGATIVE_STATUSES.has(status)) {
        return "Not Attended";
    }

    return STATUS_LABELS[status] || toSentenceCase(status);
};

export const isNegativeAttendanceStatus = (meeting) => {
    const status = extractMeetingStatus(meeting);
    return NEGATIVE_STATUSES.has(status);
};

export const isPositiveAttendanceStatus = (meeting) => {
    const status = extractMeetingStatus(meeting);
    return POSITIVE_STATUSES.has(status);
};
