export interface ResourceAllocationManagerProps {
  contractorId: string;
}

export interface Resource {
  id: string;
  title: string;
  businessHours: {
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
  };
}

export interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  resourceId: string;
}