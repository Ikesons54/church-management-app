import React, { useState } from 'react';
import { Card, Form, DatePicker, Select, Space, Radio } from 'antd';
import moment from 'moment';

const ServiceSelection = ({ onServiceSelect }) => {
  const [serviceType, setServiceType] = useState('physical');

  // Physical services - only Sunday service
  const physicalServices = [
    { 
      id: 'sunday_service', 
      name: 'Sunday Service (11:30 AM)',
      day: 0, // Sunday
      time: '11:30'
    }
  ];

  // Online services
  const onlineServices = [
    {
      id: 'battle_ground',
      name: 'Battle Ground Service (Online)',
      time: '22:00', // 10:00 PM
      day: 5 // Friday
    },
    {
      id: 'begin_with_jesus',
      name: 'Begin Your Day with Jesus (Online)',
      time: '05:00', // 5:00 AM
      days: [1, 4] // Monday and Thursday
    },
    {
      id: 'time_with_jesus',
      name: 'Time with Jesus (Online)',
      time: '20:00', // 8:00 PM
      day: 3 // Wednesday
    }
  ];

  // Enhanced filter for available services
  const getAvailableServices = (selectedDate) => {
    const dayOfWeek = selectedDate.day();
    
    if (serviceType === 'physical') {
      return physicalServices.filter(service => service.day === dayOfWeek);
    } else {
      return onlineServices.filter(service => {
        if (service.days) {
          // For services that occur on multiple days (like Begin Your Day with Jesus)
          return service.days.includes(dayOfWeek);
        }
        return service.day === dayOfWeek;
      });
    }
  };

  // Function to check if time is within service hours
  const isServiceTime = (service, currentTime) => {
    const serviceTime = moment(service.time, 'HH:mm');
    const diffMinutes = moment(currentTime).diff(serviceTime, 'minutes');
    
    // Allow attendance marking 30 minutes before and 2 hours after service starts
    return diffMinutes >= -30 && diffMinutes <= 120;
  };

  return (
    <Card title="Select Service">
      <Form layout="vertical">
        <Form.Item label="Service Type">
          <Radio.Group 
            value={serviceType} 
            onChange={(e) => setServiceType(e.target.value)}
          >
            <Radio.Button value="physical">Physical Service</Radio.Button>
            <Radio.Button value="online">Online Service</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Date">
          <DatePicker 
            onChange={(date) => {
              onServiceSelect({ 
                date,
                availableServices: getAvailableServices(date)
              });
            }}
            defaultValue={moment()} 
            disabledDate={(current) => {
              const day = current.day();
              const availableDays = serviceType === 'physical' 
                ? [0] // Only Sunday for physical
                : [1, 3, 4, 5] // Mon, Wed, Thu, Fri for online
              return !availableDays.includes(day);
            }}
          />
        </Form.Item>

        <Form.Item label="Service">
          <Select 
            style={{ width: 300 }}
            onChange={(type) => onServiceSelect({ serviceType: type })}
            placeholder="Select service type"
          >
            {getAvailableServices(moment()).map(service => {
              const isAvailable = isServiceTime(service, moment());
              return (
                <Select.Option 
                  key={service.id} 
                  value={service.id}
                  disabled={!isAvailable}
                >
                  {service.name}
                  {!isAvailable && " (Not within service hours)"}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ServiceSelection;