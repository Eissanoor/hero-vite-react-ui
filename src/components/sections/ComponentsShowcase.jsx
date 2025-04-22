
import React from 'react';
import { Button, Card, Badge, Input, Avatar } from '../HeroUI';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

const ComponentsShowcase = () => {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="hero-container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Explore our components
          </h2>
          <p className="mx-auto mt-6 max-w-prose text-lg text-gray-600">
            A glimpse at some of the beautiful components you can use to build your next project.
          </p>
        </div>
        
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {/* Buttons showcase */}
          <Card className="animate-fade">
            <Card.Header>
              <Card.Title>Buttons</Card.Title>
              <Card.Description>
                Various button styles for different actions.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Default</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link Button</Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-4">
                <Button variant="default" size="sm">Small</Button>
                <Button variant="default">Default</Button>
                <Button variant="default" size="lg">Large</Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-4">
                <Button variant="default" icon={EnvelopeIcon}>With Icon</Button>
                <Button variant="outline" icon={EnvelopeIcon} iconPosition="right">Icon Right</Button>
              </div>
            </Card.Content>
          </Card>
          
          {/* Badges showcase */}
          <Card className="animate-fade">
            <Card.Header>
              <Card.Title>Badges</Card.Title>
              <Card.Description>
                Highlight information with colorful badges.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="flex flex-wrap gap-4">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-4">
                <Badge variant="default" size="sm">Small</Badge>
                <Badge variant="default">Default</Badge>
                <Badge variant="default" size="lg">Large</Badge>
              </div>
            </Card.Content>
          </Card>
          
          {/* Inputs showcase */}
          <Card className="animate-fade">
            <Card.Header>
              <Card.Title>Input Fields</Card.Title>
              <Card.Description>
                Form inputs for collecting user data.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div>
                  <label htmlFor="default-input" className="mb-2 block text-sm font-medium text-gray-700">
                    Default Input
                  </label>
                  <Input
                    id="default-input"
                    placeholder="Enter your text here..."
                    variant="default"
                  />
                </div>
                <div>
                  <label htmlFor="bordered-input" className="mb-2 block text-sm font-medium text-gray-700">
                    Bordered Input
                  </label>
                  <Input
                    id="bordered-input"
                    placeholder="Enter your text here..."
                    variant="bordered"
                  />
                </div>
                <div>
                  <label htmlFor="underlined-input" className="mb-2 block text-sm font-medium text-gray-700">
                    Underlined Input
                  </label>
                  <Input
                    id="underlined-input"
                    placeholder="Enter your text here..."
                    variant="underlined"
                  />
                </div>
              </div>
            </Card.Content>
          </Card>
          
          {/* Avatars showcase */}
          <Card className="animate-fade">
            <Card.Header>
              <Card.Title>Avatars</Card.Title>
              <Card.Description>
                User avatars with fallback options.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="flex flex-wrap items-center gap-4">
                <Avatar 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Avatar" 
                  fallback="JD" 
                  size="sm"
                />
                <Avatar 
                  src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Avatar" 
                  fallback="AS" 
                  size="md"
                />
                <Avatar 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Avatar" 
                  fallback="MJ" 
                  size="lg"
                />
                <Avatar 
                  src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Avatar" 
                  fallback="WS" 
                  size="xl"
                />
              </div>
              <div className="mt-6">
                <h4 className="mb-2 text-sm font-semibold">With Fallback</h4>
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar fallback="JD" size="md" />
                  <Avatar fallback="AS" size="md" />
                  <Avatar fallback="MJ" size="md" />
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ComponentsShowcase;
