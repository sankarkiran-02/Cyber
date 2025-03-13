import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Modal, Box, Button, TextInput, Textarea, Group, Grid, Select } from '@mantine/core';
import jobService, { JobDetails } from '@/services/jobService';
import { notifications } from '@mantine/notifications';

interface FormValues {
  jobTitle: string;
  companyName: string;
  location: string;
  jobType: string;
  minSalary: string;
  maxSalary: string;
  deadline: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
}

interface CreateJobFormProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: JobDetails) => void;
}

export default function CreateJobForm({ opened, onClose, onSubmit }: CreateJobFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ 
    mode: 'onChange' 
  });

  const handleFormSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const jobData: JobDetails = {
        jobTitle: data.jobTitle,
        companyName: data.companyName,
        location: data.location,
        jobType: data.jobType,
        salaryRange: {
          min: Number(data.minSalary),
          max: Number(data.maxSalary)
        },
        applicationDeadline: new Date(data.deadline).toISOString(),
        jobDescription: data.description,
        requirements: data.requirements ? [data.requirements] : [],
        responsibilities: data.responsibilities ? [data.responsibilities] : []
      };

      const createdJob = await jobService.createJob(jobData);
      
      // Show success notification
      notifications.show({
        title: 'Job Created',
        message: 'Job posting created successfully!',
        color: 'green'
      });

      // Call parent component's submit handler
      onSubmit(createdJob);
      
      // Reset form and close modal
      reset();
      onClose();
    } catch (error: any) {
      // Show error notification
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create job posting',
        color: 'red'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="auto"
      closeButtonProps={{ display: 'none' }}
      withCloseButton={false}
      styles={{
        content: {
          width: 748,
          height: 779,
          borderRadius: 16,
          background: '#FFFFFF',
          boxShadow: '0px 0px 24px 0px #A9A9A940',
          padding: '30px'
        }
      }}
    >
      <Box style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', marginTop: '-10px' }}>
        Create Job Opening
      </Box>

      <form onSubmit={handleSubmit(handleFormSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Grid gutter="md">
          <Grid.Col span={6}>
            <TextInput
              label="Job Title"
              placeholder="Full Stack Developer"
              {...register('jobTitle', { required: 'Job title is required' })}
              error={errors.jobTitle?.message}
            />

            <Controller
              control={control}
              name="location"
              rules={{ required: 'Location is required' }}
              render={({ field }) => (
                <Select
                  label="Location"
                  placeholder="Select Location"
                  data={['Onsite', 'Offsite']}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.location?.message}
                  mt="md"
                  styles={{ input: { height: '58px' } }}
                />
              )}
            />

            <Group mt="md" grow>
              <TextInput
                label="Salary Range"
                placeholder="₹0"
                type="number"
                {...register('minSalary', { required: 'Minimum salary is required' })}
                error={errors.minSalary?.message}
              />
              <TextInput
                label=" "
                placeholder="₹12,00,000"
                type="number"
                {...register('maxSalary', { required: 'Maximum salary is required' })}
                error={errors.maxSalary?.message}
              />
            </Group>
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput
              label="Company Name"
              placeholder="Enter Company"
              {...register('companyName', { required: 'Company is required' })}
              error={errors.companyName?.message}
            />

            <Controller
              control={control}
              name="jobType"
              rules={{ required: 'Job type is required' }}
              render={({ field }) => (
                <Select
                  label="Job Type"
                  placeholder="Select job type"
                  data={['Full-time', 'Part-time', 'Contract', 'Internship']}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.jobType?.message}
                  mt="md"
                  styles={{ input: { height: '58px' } }}
                />
              )}
            />

            <TextInput
              label="Application Deadline"
              type="date"
              {...register('deadline', { required: 'Application deadline is required' })}
              error={errors.deadline?.message}
              mt="md"
            />
          </Grid.Col>
        </Grid>

        <Textarea
          label="Job Description"
          placeholder="Please share details about the role..."
          {...register('description', { required: 'Job description is required' })}
          error={errors.description?.message}
          minRows={6}
          mt="md"
        />

        <Group justify="space-between" mt="md" style={{ position: 'absolute', bottom: '30px', width: 'calc(100% - 60px)' }}>
          <Button 
            variant="outline" 
            color="gray" 
            onClick={onClose} 
            style={{ height: '48px' }}
          >
            Save Draft
          </Button>
          <Button
            type="submit"
            color="blue"
            loading={isSubmitting}
            style={{
              height: '48px',
              fontWeight: 'bold'
            }}
          >
            Publish
          </Button>
        </Group>
      </form>
    </Modal>
  );
}