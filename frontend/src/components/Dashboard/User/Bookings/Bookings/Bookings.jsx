import { useState } from 'react'
import ExpertProfileInSchedule from './ExpertProfileInSchedule'
import Calendar from './components/Calendar/Calendar'
import TimeSlots from './TimeSlots/TimeSlots'
import './Bookings.css'

function Bookings() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const expert = {
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
    name: 'Dr. John Maxwell',
    title: 'Career Strategy Expert',
    sessionDuration: 90,
    price: 200,
    description: 'Personalized guidance for your career growth and technical challenges',
    includes: [
      'Line-by-line review',
      'ATS optimization',
      'Format and structure feedback',
      'Content improvement suggestions',
      'Two revision rounds'
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col lg:grid lg:grid-cols-[minmax(320px,400px),1fr] gap-6 lg:gap-8">
        <ExpertProfileInSchedule expert={expert} />
        
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h2 className="text-xl font-semibold mb-6">Schedule Your Session</h2>
          <Calendar 
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
          <TimeSlots selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  )
}

export default Bookings