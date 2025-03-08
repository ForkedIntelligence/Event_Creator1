// EventForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const EventForm = () => {
  // Form state
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('technical');
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [description, setDescription] = useState('');
  
  // AI generation state
  const [generatedDescriptions, setGeneratedDescriptions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log({
      eventName,
      eventType,
      startDateTime,
      endDateTime,
      description
    });
    alert("Event created successfully!");
  };
  
  // Generate descriptions using the API
  const generateDescriptions = async () => {
    if (!eventName) {
      alert("Please enter an event name first");
      return;
    }
    
    setIsGenerating(true);
    try {
      console.log("Sending request to API...");
      
      const response = await axios.post('http://localhost:5000/api/event-description/multiple', {
        eventInfo: {
          name: eventName,
          type: eventType,
          startDateTime: startDateTime.toISOString(),
          endDateTime: endDateTime.toISOString(),
        },
        existingDescription: description,
      });
      
      console.log("Response received:", response.data);
      
      if (response.data && response.data.descriptions) {
        setGeneratedDescriptions(response.data.descriptions);
      } else {
        console.error('Invalid response format:', response.data);
        setGeneratedDescriptions([]);
        alert('Received an invalid response format from the server.');
      }
    } catch (error) {
      console.error('Error generating descriptions:', error);
      setGeneratedDescriptions([]);
      
      if (error.response) {
        console.error('Server error:', error.response.data);
        alert(`Server error: ${error.response.data.error || 'Unknown server error'}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('No response from server. Please check if the backend is running.');
      } else {
        console.error('Request setup error:', error.message);
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Select a description from the generated options
  const selectDescription = (index) => {
    if (generatedDescriptions && index >= 0 && index < generatedDescriptions.length) {
      setDescription(generatedDescriptions[index]);
      setGeneratedDescriptions([]);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="py-8 px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Create New Event</h2>
            <p className="mt-2 text-sm text-gray-600">
              Fill in the details below and let AI help you craft the perfect description
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Name */}
            <div>
              <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">
                Event Name
              </label>
              <input
                type="text"
                id="eventName"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
              />
            </div>
            
            {/* Event Type */}
            <div>
              <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">
                Event Type
              </label>
              <select
                id="eventType"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
              >
                <option value="technical">Technical</option>
                <option value="non-technical">Non-Technical</option>
                <option value="cultural">Cultural</option>
              </select>
            </div>
            
            {/* Date and Time Pickers */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date & Time
                </label>
                <DatePicker
                  id="startDate"
                  selected={startDateTime}
                  onChange={setStartDateTime}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date & Time
                </label>
                <DatePicker
                  id="endDate"
                  selected={endDateTime}
                  onChange={setEndDateTime}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            {/* Description */}
            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Event Description
                </label>
                <button
                  type="button"
                  onClick={generateDescriptions}
                  disabled={isGenerating || !eventName}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : 'Generate with AI'}
                </button>
              </div>
              <textarea
                id="description"
                rows={6}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a description or let AI generate one for you..."
              />
            </div>
            
            {/* AI Generated Descriptions */}
            {generatedDescriptions && generatedDescriptions.length > 0 && (
              <div className="border rounded-md p-4 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Choose a description</h3>
                <div className="space-y-3">
                  {generatedDescriptions.map((desc, index) => (
                    <div 
                      key={index} 
                      className="p-3 border rounded-md bg-white hover:bg-gray-50 cursor-pointer transition"
                      onClick={() => selectDescription(index)}
                    >
                      <p className="text-sm text-gray-600">{desc ? desc.substring(0, 150) + "..." : ""}</p>
                      <button 
                        type="button"
                        className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Use this description
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;