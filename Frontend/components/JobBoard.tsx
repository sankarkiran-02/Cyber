import { useState } from 'react';
import { Flex } from '@mantine/core';
import JobCard from './JobCard';
import { JobDetails } from '@/services/jobService';

interface JobBoardProps {
  jobs: JobDetails[];
}

export default function JobBoard({ jobs }: JobBoardProps) {
  const [jobList, setJobList] = useState<JobDetails[]>(jobs);

  // Handle job deletion
  const handleDeleteJob = (jobId: string) => {
    setJobList(prevJobs => 
      prevJobs.filter(job => job._id !== jobId)
    );
  };

  // Handle case when jobs array is empty
  if (!jobList || jobList.length === 0) {
    return (
      <Flex
        direction="row"
        gap={16}
        wrap="wrap"
        justify="center"
        style={{
          maxWidth: '1312px',
          width: '100%',
          margin: '32px auto 0',
        }}
      >
        <div>No jobs available</div>
      </Flex>
    );
  }

  return (
    <Flex
      direction="row"
      gap={16}
      wrap="wrap"
      justify="center"
      style={{
        maxWidth: '1312px',
        width: '100%',
        margin: '32px auto 0',
      }}
    >
      {jobList.map((job) => (
        <JobCard 
          key={job._id}
          {...job}
          // onDelete={handleDeleteJob}
        />
      ))}
    </Flex>
  );
}