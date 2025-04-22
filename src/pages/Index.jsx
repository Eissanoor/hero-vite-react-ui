
import React from 'react';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/sections/HeroSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import ComponentsShowcase from '../components/sections/ComponentsShowcase';
import CTASection from '../components/sections/CTASection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <ComponentsShowcase />
      <CTASection />
    </Layout>
  );
};

export default Index;
