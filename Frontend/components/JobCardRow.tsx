'use client';

import { Flex } from '@mantine/core';
import JobCard from './JobCard';
import { rem } from '@mantine/core';


export default function JobCardRow() {
  return (
    <Flex
  direction="row"
  gap={rem(16)}
  wrap="wrap"
  justify="center"
  style={{
    maxWidth: rem(1312),
    width: '100%',
    margin: '32px auto 0', // top margin, auto left/right for centering
  }}
>
  <JobCard />
  <JobCard />
  <JobCard />
  <JobCard />
</Flex>

  );
}
