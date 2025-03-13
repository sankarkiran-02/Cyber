import axios from 'axios';
import dotenv from 'dotenv';


dotenv.config();
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;


export interface JobDetails {
  _id?: string;
  jobTitle: string;
  companyName: string;
  location: string;
  jobType: string;
  salaryRange?: {
    min: number;
    max: number;
  };
  applicationDeadline?: string;
  jobDescription?: string;
  requirements?: string[];
  responsibilities?: string[];
  postedAt?: string | Date; // Add this field
}

class JobService {
  // Create a new job
  async createJob(jobData: JobDetails): Promise<JobDetails> {
    try {
      const response = await axios.post(API_BASE_URL, {
        ...jobData,
        requirements: jobData.requirements || [],
        responsibilities: jobData.responsibilities || []
      });
      return response.data.data;
    } catch (error: any) {
      this.handleError(error, 'Error creating job');
      throw error;
    }
  }

  // Get all jobs with detailed error handling
  async getAllJobs(): Promise<JobDetails[]> {
    try {
      const response = await axios.get(API_BASE_URL, {
        // Add timeout to prevent hanging requests
        timeout: 10000
      });

      // Validate response structure
      if (!response.data || !response.data.data) {
        throw new Error('Invalid response structure');
      }

      return response.data.data;
    } catch (error: any) {
      this.handleError(error, 'Error fetching jobs');
      throw error;
    }
  }

  // Generic error handler
  private handleError(error: any, defaultMessage: string) {
    if (axios.isAxiosError(error)) {
      // Axios-specific error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Server Error:', error.response.data);
        throw new Error(error.response.data.message || defaultMessage);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        throw new Error('No response from server');
      } else {
        // Something happened in setting up the request
        console.error('Request setup error:', error.message);
        throw new Error(defaultMessage);
      }
    } else {
      // Non-Axios error
      console.error('Unexpected error:', error);
      throw new Error(defaultMessage);
    }
  }
  // Update a job
  async updateJob(id: string, jobData: JobDetails): Promise<JobDetails> {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, jobData);
      return response.data.data;
    } catch (error: any) {
      // Handle validation errors
      if (error.response && error.response.data.errors) {
        throw new Error(error.response.data.errors.join(', '));
      }
      console.error('Error updating job:', error);
      throw error;
    }
  }

  // Delete a job
  async deleteJob(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error: any) {
      console.error('Error deleting job:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete job');
    }
  }
}

export default new JobService();