import { Box, rem, Image, Anchor, Burger, TextInput, Select, Button, Flex, Text, RangeSlider  } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';

interface NavbarProps {
  onCreateJobClick: () => void;
}

export default function Navbar({ onCreateJobClick }: NavbarProps) {
  const [opened, { toggle }] = useDisclosure(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Box
      component="header"
      w="100%"
      bg="white"
      style={{
        boxShadow: '0px 0px 14px 0px #C6BFBF40',
        position: 'relative',
        height: rem(214),
        padding: 0,
      }}
    >
      {/* Navbar Box */}
      <Box
        w="100%"
        maw={rem(890)}
        mx="auto"
        h={rem(80)}
        style={{
          position: 'relative',
          top: rem(21),
          borderRadius: rem(122),
          background: '#FFFFFF',
          border: '1px solid #FCFCFC',
          boxShadow: '0px 0px 20px 0px #7F7F7F26',
        }}
      >
        {/* Inner Content Container */}
        <Box
          w="100%"
          maw={rem(838)}
          h={rem(48)}
          mx="auto"
          mt={rem(16)}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Box
            w={rem(44)}
            h={rem(44.6769)}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Image src="/assets/Group.png" alt="Logo" width="100%" height="100%" fit="contain" />
          </Box>

          {/* Nav Items Wrapper */}
          {!isMobile && (
            <Box
              w={rem(613)}
              h={rem(48)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: rem(11.14) }}
            >
              {[{ label: 'Home' }, { label: 'Find Jobs' }, { label: 'Find Talents' }, { label: 'About Us' }, { label: 'Testimonials' }].map((item, index) => (
                <Box
                  key={index}
                  px={rem(5)}
                  style={{ borderRadius: rem(12), display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Anchor href="#" size="sm" c="gray.8" fw={500}>
                    {item.label}
                  </Anchor>
                </Box>
              ))}
            </Box>
          )}

          {/* Button */}
          {!isMobile && (
            <Box
              w={rem(123)}
              h={rem(38)}
              style={{
                borderRadius: rem(30),
                paddingTop: rem(8),
                paddingBottom: rem(8),
                paddingLeft: rem(24),
                paddingRight: rem(24),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(180deg, #A128FF 0%, #6100AD 113.79%)',
                color: 'white',
                fontWeight: 500,
                fontSize: rem(14),
                cursor: 'pointer',
              }}
              onClick={onCreateJobClick}
            >
              Create Job
            </Box>
          )}

          {/* Mobile Menu Icon */}
          {isMobile && <Burger opened={opened} onClick={toggle} aria-label="Toggle navigation" />}
        </Box>
      </Box>

      {/* Filters Section */}
      <Box
        w="100%"
        maw={1200}
        mx="auto"
        bg="white"
        p={24}
        mt={36}
      >
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'stretch', md: 'center' }}
          justify="space-between"
          gap={16}
        >
          {/* Search By Job Title */}
          <TextInput
            placeholder="Search by Job Title, Role"
            w={{ base: '100%', md: 240 }}
            leftSection={<Image src="/assets/search.png" alt="Search" width={16} height={16} />}
            styles={{
              input: {
                background: 'transparent',
                border: 'none',
                outline: 'none',
              }
            }}
          />

          {/* Preferred Location */}
          <Select
            placeholder="Preferred Location"
            data={["Onsite", "Offsite"]}
            w={{ base: '100%', md: 180 }}
            leftSection={<Image src="/assets/Location.png" alt="Search" width={16} height={16} />}
            styles={{
              input: {
                background: 'transparent',
                border: 'none',
                outline: 'none',
              }
            }}
          />

          {/* Job Type Dropdown */}
          <Select
            placeholder="Job Type"
            data={["Full-time", "Part-time", "Contract"]}
            w={{ base: '100%', md: 180 }}
            leftSection={<Image src="/assets/type.png" alt="Search" width={16} height={16} />}
            styles={{
              input: {
                background: 'transparent',
                border: 'none',
                outline: 'none',
              }
            }}
          />

          {/* Salary Filter */}
          <Box w={{ base: '100%', md: 240 }}>
            <Text fw={500} c="gray.8" mb={4}>Salary Range</Text>
            <RangeSlider
              defaultValue={[20, 60]}
              min={0}
              max={100}
              step={1}
              label={(value) => `₹${value}k`}
              styles={{
                thumb: {
                  height: 16,
                  width: 16,
                  background: 'linear-gradient(90deg, #000000 0%, #222222 100%)',
                  outline: 'none',
                  boxShadow: 'none',
                },
                track: {
                  background: 'linear-gradient(90deg, #000000 0%, #222222 100%)',
                },
                bar: {
                  background: 'linear-gradient(90deg, #000000 0%, #222222 100%)',
                },
              }}
            />
          </Box>
        </Flex>
      </Box>
      
    </Box>
  );
}