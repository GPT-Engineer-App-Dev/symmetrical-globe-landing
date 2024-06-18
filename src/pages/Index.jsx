import { Container, Text, VStack, Box, Heading, Flex, Spacer, Button, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaGlobe, FaClock } from "react-icons/fa";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import axios from "axios";
import _ from "lodash";

const Index = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    initGlobe();
  }, []);

  function calculateTimeLeft() {
    const difference = +new Date("2024-07-27") - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  function initGlobe() {
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true });

      renderer.setSize(window.innerWidth, window.innerHeight);
      const globeContainer = document.getElementById("globe-container");

      if (!globeContainer) {
        console.error("Globe container not found");
        return;
      }

      globeContainer.innerHTML = ""; // Clear any existing content
      globeContainer.appendChild(renderer.domElement);

      const geometry = new THREE.SphereGeometry(5, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
      const globe = new THREE.Mesh(geometry, material);

      scene.add(globe);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;

      camera.position.z = 10;

      const animate = function () {
        requestAnimationFrame(animate);

        globe.rotation.y += 0.01;

        controls.update();
        renderer.render(scene, camera);
      };

      animate();
    } catch (error) {
      console.error("Error initializing globe:", error);
    }
  }

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span key={interval}>
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" bgGradient="linear(to-r, gray.300, gray.600)">
      <VStack spacing={4} width="100%">
        <Flex width="100%" p={4} bg="gray.700" color="white" alignItems="center">
          <Heading as="h1" size="lg">Teleses.ai</Heading>
          <Spacer />
          <HStack spacing={4}>
            <Button variant="ghost" colorScheme="whiteAlpha">Home</Button>
            <Button variant="ghost" colorScheme="whiteAlpha">About</Button>
            <Button variant="ghost" colorScheme="whiteAlpha">Contact</Button>
          </HStack>
        </Flex>
        <Heading as="h1" size="2xl" color="white" textTransform="lowercase">
          teleses.ai, coming soon
        </Heading>
        <Box id="globe-container" width="100%" height="400px" />
        <Text fontSize="xl" color="white">
          <FaClock /> countdown to demo day: {timerComponents.length ? timerComponents : <span>Time's up!</span>}
        </Text>
      </VStack>
    </Container>
  );
};

export default Index;