import React, { useState } from 'react';
import {
  ChakraProvider,
  Flex,
  Box,
  Button,
  Text,
  Image,
} from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';
import { kStyleGlobal } from '../theme/theme';

const onboardingData = [
  {
    title: "Welcome to WiseSolver",
    description: "Your intelligent learning companion, ready to answer your questions anytime, anywhere",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    buttonText: "Continue"
  },
  {
    title: "Smart AI Assistant",
    description: "Powered by advanced AI technology for quick and accurate problem solving",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    buttonText: "Continue"
  },
  {
    title: "Professional Knowledge Base",
    description: "Access vast quality learning resources to accelerate your growth",
    image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e",
    buttonText: "Continue"
  },
  {
    title: "Expert Network",
    description: "Connect with industry leaders for professional guidance",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
    buttonText: "Continue"
  },
  {
    title: "Personalized Experience",
    description: "Smart customized learning plans tailored to your needs",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    buttonText: "Get Started"
  }
];

const OnboardingScreen: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const swiperRef = React.useRef<any>(null);

  const handleContinue = () => {
    if (currentStep === onboardingData.length - 1) {
      navigate('/home');
    } else {
      swiperRef.current?.swiper.slideNext();
    }
  };

  return (
    <Flex
      direction="column"
      h="100vh"
      bg="gray.50"
    >
      <Flex
        justify="flex-end"
        p={6}
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/login')}
        >
          <Text
            fontSize="sm"
            color="gray.600"
          >
            Skip
          </Text>
        </Button>
      </Flex>
      
      <Box flex="1" position="relative">
        <Swiper
          modules={[Pagination]}
          pagination={{
            clickable: true,
            bulletActiveClass: 'swiper-pagination-bullet-active',
            bulletClass: 'swiper-pagination-bullet',
            modifierClass: 'swiper-pagination-',
            renderBullet: function (index: number, className: string): string {
              return `<span class="${className}" style="
                width: ${index === currentStep ? '20px' : '6px'};
                height: 6px;
                border-radius: 3px;
                background-color: ${index === currentStep ? kStyleGlobal.colors.primary[500] : 'rgba(0,0,0,0.2)'};
                margin: 0 4px;
                transition: width 0.3s ease;
              "></span>`;
            },
          }}
          onSlideChange={(swiper: SwiperType) => setCurrentStep(swiper.activeIndex)}
          style={{ height: '100%' }}
          ref={swiperRef}
        >
          {onboardingData.map((slide, index) => (
            <SwiperSlide key={index}>
              <Flex
                direction="column"
                align="center"
                justify="center"
                px={8}
                py={6}
                h="full"
              >
                <Flex
                  direction="column"
                  align="center"
                  maxW="420px"
                  w="full"
                >
                  <Box
                    mb={10}
                    w="full"
                    h="300px"
                    overflow="hidden"
                    borderRadius="3xl"
                    boxShadow="xl"
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                    />
                  </Box>
                  <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    mb={4}
                    textAlign="center"
                    color="gray.900"
                  >
                    {slide.title}
                  </Text>
                  <Text
                    fontSize="md"
                    color="gray.600"
                    textAlign="center"
                    mb={8}
                    lineHeight="tall"
                  >
                    {slide.description}
                  </Text>
                  <Button
                    size="lg"
                    w="full"
                    h="56px"
                    bg={kStyleGlobal.colors.primary[500]}
                    color="white"
                    borderRadius="2xl"
                    _hover={{
                      transform: "translateY(-1px)",
                      boxShadow: "lg"
                    }}
                    transition="all 0.2s"
                    onClick={handleContinue}
                  >
                    {slide.buttonText}
                  </Button>
                </Flex>
              </Flex>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Flex>
  );
};

export default OnboardingScreen;
