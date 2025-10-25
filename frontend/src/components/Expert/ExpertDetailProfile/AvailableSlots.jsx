import React from 'react';

const DAYS_OF_WEEK = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
];

const getTimeZoneLabel = (timeZone) => {
    if (!timeZone) return '';
    if (typeof timeZone === 'string') return timeZone;
    if (typeof timeZone === 'object') {
        const label = timeZone.label || timeZone.value || '';
        const offset = timeZone.offset ? ` (UTC${timeZone.offset})` : '';
        return `${label}${offset}`.trim();
    }
    return String(timeZone);
};

const normalizeTime = (timeLike) => {
    if (!timeLike) return '';

    if (typeof timeLike === 'object') {
        const candidate = timeLike.value ?? timeLike.label ?? '';
        if (!candidate) return '';
        return normalizeTime(String(candidate));
    }

    if (typeof timeLike !== 'string') return '';

    const trimmed = timeLike.trim();
    if (!trimmed) return '';

    // Already in 12-hour format with AM/PM
    if (/(AM|PM)$/i.test(trimmed)) {
        return trimmed.toUpperCase();
    }

    const timeParts = trimmed.split(':');
    if (timeParts.length < 2) return trimmed;

    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10) || 0;
    if (Number.isNaN(hours) || hours < 0 || hours > 23) return trimmed;

    const period = hours >= 12 ? 'PM' : 'AM';
    const normalizedHour = hours % 12 === 0 ? 12 : hours % 12;
    const paddedMinutes = minutes.toString().padStart(2, '0');

    return `${normalizedHour}:${paddedMinutes} ${period}`;
};

const AvailableSlots = ({ selectedAvailability }) => {
    if (!selectedAvailability?.availability) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 my-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Time Slots</h3>
                <p className="text-gray-500 text-center py-8">No availability information available</p>
            </div>
        );
    }

    const availability = selectedAvailability.availability;
    const weeklyAvailability = availability?.weeklyAvailability;
    const daySpecific = Array.isArray(availability?.daySpecific)
        ? availability.daySpecific
        : [];
    const timeZoneLabel = getTimeZoneLabel(availability?.timeZone || availability?.timezone);

    const getDayData = (day) => {
        const daySpecificEntry = daySpecific.find(
            (entry) => entry?.day?.toLowerCase() === day.label.toLowerCase()
        );

        if (
            daySpecificEntry &&
            Array.isArray(daySpecificEntry.slots) &&
            daySpecificEntry.slots.length > 0
        ) {
            const normalizedSlots = daySpecificEntry.slots
                .map((slot) => ({
                    startTime: normalizeTime(slot.startTime),
                    endTime: normalizeTime(slot.endTime),
                }))
                .filter((slot) => slot.startTime && slot.endTime);

            if (normalizedSlots.length > 0) {
                return {
                    enabled: true,
                    slots: normalizedSlots,
                };
            }
        }

        const weeklyEntry = weeklyAvailability?.[day.key];
        if (
            weeklyEntry?.enabled &&
            Array.isArray(weeklyEntry.slots) &&
            weeklyEntry.slots.length > 0
        ) {
            const normalizedSlots = weeklyEntry.slots
                .map((slot) => ({
                    startTime: normalizeTime(slot.startTime),
                    endTime: normalizeTime(slot.endTime),
                }))
                .filter((slot) => slot.startTime && slot.endTime);

            if (normalizedSlots.length > 0) {
                return {
                    enabled: true,
                    slots: normalizedSlots,
                };
            }
        }

        return { enabled: false, slots: [] };
    };

    const hasAnyAvailability = DAYS_OF_WEEK.some((day) => {
        const dayData = getDayData(day);
        return dayData.enabled && dayData.slots.length > 0;
    });

    if (!hasAnyAvailability) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 my-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Time Slots</h3>
                <p className="text-gray-500 text-center py-8">No available slots configured</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 my-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Available Time Slots</h3>
                {/* {timeZoneLabel && (
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {timeZoneLabel}
          </span>
        )} */}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {DAYS_OF_WEEK.map((day) => {
                    const { enabled, slots } = getDayData(day);

                    if (!enabled || slots.length === 0) {
                        return (
                            <div key={day.key} className="border border-gray-200 rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-2">{day.label}</h4>
                                <p className="text-sm text-gray-500">Not available</p>
                            </div>
                        );
                    }

                    return (
                        <div key={day.key} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3">{day.label}</h4>
                            <div className="space-y-2">
                                {slots.map((slot, index) => (
                                    <div key={index} className="bg-green-50 border border-green-200 rounded px-3 py-2">
                                        <span className="text-sm font-medium text-green-800">
                                            {slot.startTime} - {slot.endTime}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                    Times shown are in {timeZoneLabel || "expert's local timezone"}.
                    Actual booking availability may vary based on existing appointments.
                </p>
            </div>
        </div>
    );
};

export default AvailableSlots;