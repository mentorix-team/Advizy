const DEFAULT_STATUS = "scheduled";

const STATUS_LABELS = {
    scheduled: "Scheduled",
    ongoing: "Ongoing",
    completed: "Completed",
    ended: "Completed",
    done: "Done",
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

const POSITIVE_STATUSES = new Set(["ongoing", "attended", "completed", "ended", "done"]);

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

    if (status === "completed" || status === "done") {
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

/**
 * Map Dyte session status (or other provider session statuses) to internal normalized values.
 * This function is defensive and accepts many possible string forms.
 */
const mapExternalSessionStatus = (raw) => {
    if (!raw) return null;
    const s = String(raw).trim().toLowerCase();
    // Common provider statuses (defensive mapping)
    if (s.includes("active") || s.includes("running") || s === "in_session" || s === "started") return "ongoing";
    if (s.includes("ended") || s.includes("finished") || s === "ended") return "completed";
    if (s.includes("created") || s.includes("scheduled") || s === "not_started" || s === "pending") return "scheduled";
    if (s.includes("failed") || s.includes("error") || s.includes("closed")) return "completed";
    return null;
};

/**
 * Derive meeting status using a combination of:
 *  - stored meeting fields (scheduledAt, duration)
 *  - presence info (active participant count, first/last join timestamps)
 *  - external session status (e.g., Dyte's GetActiveSession status)
 *
 * presence shape (recommended):
 * {
 *   activeCount: number,
 *   firstJoinAt: string|Date|null,
 *   lastSeenAt: string|Date|null,
 * }
 */
export const deriveMeetingStatus = (meeting = {}, presence = {}, now = new Date(), opts = {}) => {
    const { graceMinutes = 5, emptyTimeoutMinutes = 10 } = opts;

    // If meeting explicitly has an admin status, honour it first
    const explicit = pickStatusValue(meeting.status) || pickStatusValue(meeting.meetingStatus) || pickStatusValue(meeting.sessionStatus);
    const explicitNorm = explicit ? normalizeStatus(String(explicit)) : null;
    if (explicitNorm && ["cancelled", "rescheduled", "no-show"].includes(explicitNorm)) {
        return explicitNorm;
    }

    // If there is an explicit attendance indicator from server/store, respect it.
    const attendanceIndicator = pickStatusValue(meeting.attendanceStatus) || pickStatusValue(meeting.attendance_status) || pickStatusValue(meeting.meetingAttendanceStatus) || pickStatusValue(meeting.meeting_attendance_status) || (meeting.attended !== undefined ? (meeting.attended ? 'attended' : 'not-attended') : null) || (meeting.isAttended !== undefined ? (meeting.isAttended ? 'attended' : 'not-attended') : null);
    if (attendanceIndicator) {
        const ai = normalizeStatus(String(attendanceIndicator));
        if (ai === 'attended' || ai === 'present' || ai === 'yes' || ai === 'true') return 'attended';
        if (ai === 'not-attended' || ai === 'no-show' || ai === 'absent' || ai === 'false' || ai === 'no') return 'not-attended';
        // otherwise if it matches known statuses map it
        if (['ongoing','completed','scheduled','cancelled'].includes(ai)) return ai;
    }

    // External session status (Dyte) can be authoritative if present
    const dyteStatus = meeting.dyteSession?.status || meeting.sessionStatus || meeting.session?.status || meeting.externalSessionStatus || null;
    const mapped = mapExternalSessionStatus(dyteStatus);

    const nowDate = (now instanceof Date) ? now : new Date(now);

    const activeCount = Number(presence.activeCount || 0);
    const firstJoinAt = presence.firstJoinAt ? new Date(presence.firstJoinAt) : null;
    const lastSeenAt = presence.lastSeenAt ? new Date(presence.lastSeenAt) : null;

    // If external session reports ongoing/complete, trust it unless presence contradicts
    if (mapped === "ongoing") return "ongoing";
    if (mapped === "completed") {
        // if provider says completed but there were never any participants, treat as not-attended
        const hasParticipants = (meeting.participants && meeting.participants.length > 0);
        if (!firstJoinAt && !hasParticipants && (meeting.scheduledAt || meeting.daySpecific?.date)) {
            return "not-attended";
        }
        // If someone joined (firstJoinAt or participants recorded), mark as done
        if (firstJoinAt || hasParticipants) return "done";
        return "not-attended";
    }

    // If there are active participants, it's ongoing
    if (activeCount > 0) return "ongoing";

    // Evaluate based on scheduled time and joins
    const scheduledAtRaw = meeting.scheduledAt || meeting.startAt || meeting.daySpecific?.date || meeting.scheduled_at;
    const durationMinutes = meeting.durationMinutes || meeting.duration || meeting.duration_min || 30;
    const scheduledAt = scheduledAtRaw ? new Date(scheduledAtRaw) : null;

    if (scheduledAt) {
        const graceMs = graceMinutes * 60 * 1000;
        const endMs = (durationMinutes || 0) * 60 * 1000;
        const scheduledEnd = new Date(scheduledAt.getTime() + endMs);

        if (nowDate < scheduledAt) return "scheduled";
        if (nowDate >= scheduledAt && nowDate <= new Date(scheduledAt.getTime() + graceMs) && !firstJoinAt) return "scheduled";
        if (nowDate > new Date(scheduledAt.getTime() + graceMs) && !firstJoinAt) return "not-attended";
        if (scheduledEnd && nowDate > scheduledEnd) {
            const hasParticipants = (meeting.participants && meeting.participants.length > 0);
            if (firstJoinAt || hasParticipants) return "done";
            return "not-attended";
        }
    }

    if (firstJoinAt) {
            if (lastSeenAt) {
            const emptyMs = emptyTimeoutMinutes * 60 * 1000;
            if ((nowDate - lastSeenAt) > emptyMs) return "done";
        }
        return "ongoing";
    }

    // default fallback
    return DEFAULT_STATUS;
};

