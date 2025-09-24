import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import './AuthModal.css';
import {
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  CloudSync as CloudSyncIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import AuthModal from './AuthModal';

const LandingPage: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const theme = useTheme();

  const features = [
    {
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      title: 'Smart Inventory',
      description: 'Track stock levels, manage products, and automate reordering with intelligent alerts.',
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      title: 'Advanced Analytics',
      description: 'Get insights with real-time reports, sales trends, and performance metrics.',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      title: 'Growth Tracking',
      description: 'Monitor business growth with detailed revenue and profit analysis.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with role-based access and data protection.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Lightning Fast',
      description: 'Optimized performance for quick data processing and seamless user experience.',
    },
    {
      icon: <CloudSyncIcon sx={{ fontSize: 40 }} />,
      title: 'Cloud Sync',
      description: 'Access your data anywhere with real-time cloud synchronization.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Operations Manager',
      company: 'TechCorp Inc.',
      avatar: 'SJ',
      rating: 5,
      comment: 'This inventory system transformed our operations. We reduced stock-outs by 80% and improved efficiency dramatically.',
    },
    {
      name: 'Michael Chen',
      role: 'Supply Chain Director',
      company: 'Global Logistics',
      avatar: 'MC',
      rating: 5,
      comment: 'The analytics and reporting features are outstanding. We now make data-driven decisions with confidence.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Business Owner',
      company: 'Retail Plus',
      avatar: 'ER',
      rating: 5,
      comment: 'Easy to use, powerful features, and excellent support. Highly recommend for any business size.',
    },
  ];

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Background Elements */}
        <Box
          className="float-animation"
          sx={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: alpha('#ffffff', 0.1),
          }}
        />
        <Box
          className="float-animation-reverse"
          sx={{
            position: 'absolute',
            bottom: '20%',
            left: '5%',
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: alpha('#ffffff', 0.05),
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Chip
                  label="🚀 New: AI-Powered Insights"
                  sx={{
                    mb: 3,
                    backgroundColor: alpha('#ffffff', 0.2),
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
                
                <Typography
                  variant="h2"
                  component="h1"
                  fontWeight="bold"
                  mb={3}
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.2,
                  }}
                >
                  <span style={{ color: '#FFD700' }}>Rapid Sort</span>
                  <br />
                  Smart Inventory
                </Typography>
                
                <Typography
                  variant="h5"
                  mb={4}
                  sx={{
                    opacity: 0.9,
                    fontWeight: 300,
                    lineHeight: 1.6,
                  }}
                >
                  Streamline your business operations with Rapid Sort's intelligent inventory system. 
                  Track, analyze, and optimize your stock levels with lightning speed.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => openAuthModal('signup')}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      backgroundColor: '#FFD700',
                      color: '#333',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: '#FFC107',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Get Started Free
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => openAuthModal('login')}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': {
                        borderColor: '#FFD700',
                        backgroundColor: alpha('#FFD700', 0.1),
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Sign In
                  </Button>
                </Box>

                <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} sx={{ color: '#FFD700', fontSize: 20 }} />
                    ))}
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 1, fontWeight: 500, color: 'white' }}>
                    Trusted by 10,000+ businesses worldwide
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 500,
                    height: 300,
                    borderRadius: 3,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    transform: 'perspective(1000px) rotateY(-15deg)',
                    transition: 'transform 0.3s ease',
                    background: 'linear-gradient(135deg, #f0f2f5 0%, #e1e5e9 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      transform: 'perspective(1000px) rotateY(0deg)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src="/dashboard-preview.png"
                    alt="Rapid Sort Dashboard Preview"
                    loading="lazy"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'best-fit',
                      borderRadius: 3,
                      border: '1px solid rgba(0,0,0,0.06)'
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" component="h2" fontWeight="bold" mb={3}>
            Powerful Features for Modern Business
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Everything you need to manage your inventory efficiently and grow your business
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      color: 'primary.main',
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ backgroundColor: '#f8f9fa', py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" component="h2" fontWeight="bold" mb={3}>
              What Our Customers Say
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Join thousands of satisfied businesses
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%', p: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role} at {testimonial.company}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} sx={{ color: '#FFD700', fontSize: 18 }} />
                      ))}
                    </Box>
                    
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      "{testimonial.comment}"
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 10,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" fontWeight="bold" mb={3}>
            Ready to Transform Your Business?
          </Typography>
          <Typography variant="h6" mb={4} sx={{ opacity: 0.9 }}>
            Join thousands of businesses already using our platform to streamline their operations
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => openAuthModal('signup')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                backgroundColor: '#FFD700',
                color: '#333',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#FFC107',
                },
              }}
            >
              Start Free Trial
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: '#FFD700',
                  backgroundColor: alpha('#FFD700', 0.1),
                },
              }}
            >
              Contact Sales
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />


    </Box>
  );
};

export default LandingPage;