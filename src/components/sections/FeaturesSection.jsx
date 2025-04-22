
import React from 'react';
import { Card } from '../HeroUI';
import { 
  SparklesIcon, 
  CubeIcon, 
  PuzzlePieceIcon, 
  ArrowPathIcon 
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Beautiful Design',
    description: 'Professionally designed components that look great out of the box.',
    icon: SparklesIcon,
  },
  {
    name: 'Tailwind Powered',
    description: 'Built with Tailwind CSS for easy customization to match your brand.',
    icon: CubeIcon,
  },
  {
    name: 'Modular Components',
    description: 'Use only what you need with our modular component approach.',
    icon: PuzzlePieceIcon,
  },
  {
    name: 'Regular Updates',
    description: 'Constantly improved with new components and features.',
    icon: ArrowPathIcon,
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="hero-container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to build amazing UIs
          </h2>
          <p className="mx-auto mt-6 max-w-prose text-lg text-gray-600">
            HeroUI provides all the essential components to create beautiful and functional interfaces.
          </p>
        </div>
        
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.name} className="animate-fade">
              <Card.Content className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-hero-primary/10 text-hero-primary">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">{feature.name}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
