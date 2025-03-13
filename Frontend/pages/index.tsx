import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import Navbar from '@/components/Navbar';
import CreateJobForm from '@/components/CreateJobForm';
import JobBoard from '@/components/JobBoard';
import jobService, { JobDetails } from '@/services/jobService';

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [jobs, setJobs] = useState<JobDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const fetchedJobs = await jobService.getAllJobs();
        setJobs(fetchedJobs);
      } catch (error) {
        console.error(error);
        notifications.show({
          title: 'Error',
          message: 'Failed to fetch jobs',
          color: 'red'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSubmit = (data: JobDetails) => {
    setJobs((prevJobs) => [...prevJobs, data]);
    setOpened(false);
  };

  return (
    <>
      <Navbar onCreateJobClick={() => setOpened(true)} />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <JobBoard jobs={jobs} />
      )}
      <CreateJobForm
        opened={opened}
        onClose={() => setOpened(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}