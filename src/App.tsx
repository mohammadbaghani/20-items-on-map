import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  Paper,
  Divider,
  Grid
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Star as StarIcon,
  Restaurant as RestaurantIcon,
  Store as StoreIcon,
  LocalFlorist as ParkIcon,
  Theaters as CinemaIcon,
  MenuBook as LibraryIcon,
  FitnessCenter as GymIcon
} from '@mui/icons-material';
import './index.css';
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
}
const generateRandomLocations = (center, count = 20, radiusKm = 5) => {
  const locations = [];
  const itemTypes = ['رستوران', 'فروشگاه', 'بوستان', 'سینما', 'کتابخانه','تالار پذیرایی', 'باشگاه ورزشی'];
  const itemNames = [
    'طعم بهشت', 'گلستان', 'آفتاب', 'پارس', 'مهر', 'سپهر', 'نیکو', 'آرامش', 
    'بهار', 'راز', 'شکوه', 'طلوع', 'همدم', 'نسترن', 'لاله', 'یاس', 
  ];
  
  for (let i = 0; i < count; i++) {
    const radiusDegrees = radiusKm / 111.32;
    const randomAngle = Math.random() * 2 * Math.PI;
    const randomRadius = Math.random() * radiusDegrees;
    
    const lat = center.lat + randomRadius * Math.cos(randomAngle);
    const lng = center.lng + randomRadius * Math.sin(randomAngle);
    
    const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    const name = `${type} ${itemNames[Math.floor(Math.random() * itemNames.length)]}`;
    
    locations.push({
      id: i,
      position: [lat, lng],
      name: name,
      type: type,
      address: `خیابان نمونه، پلاک ${Math.floor(Math.random() * 100) + 1}`,
      phone: `0${Math.floor(Math.random() * 900000000) + 100000000}`,
      rating: (Math.random() * 2 + 3).toFixed(1),
      description: `این ${type} در موقعیت تصادفی ایجاد شده است.`,
      coordinates: { lat: lat.toFixed(6), lng: lng.toFixed(6) }
    });
  }
  return locations;
};


const ItemCard = ({ item, onClose }) => {
  if (!item) return null;  

  const getIconByType = (type) => {
    switch(type) {
      case 'رستوران': return <RestaurantIcon />;
      case 'فروشگاه': return <StoreIcon />;
      case 'پارک': return <ParkIcon />;
      case 'سینما': return <CinemaIcon />;
      case 'کتابخانه': return <LibraryIcon />;
      case 'باشگاه ورزشی': return <GymIcon />;
      default: return <LocationIcon />;
    }
  };  

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={i} sx={{ color: '#ffc107', fontSize: '18px' }} />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarIcon key="half" sx={{ color: '#ffc107', fontSize: '18px' }} />);
    }
    
    return stars;
  };
  
  return (
    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            {getIconByType(item.type)}
            <Typography variant="h6" component="h2" fontWeight="bold">
              {item.name}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
     
        
        <Box display="flex" alignItems="center" mb={2}>
          {renderStars(parseFloat(item.rating))}
          <Typography variant="body2" sx={{ ml: 1 }}>
            ({item.rating})
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box mb={2}>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
            <LocationIcon sx={{ fontSize: '18px', mr: 1, mt: 0.2 }} />
            <span>{item.address}</span>
          </Typography>
          
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PhoneIcon sx={{ fontSize: '18px', mr: 1 }} />
            <span>{item.phone}</span>
          </Typography>
          
          <Typography variant="body2">
            <strong>مختصات:</strong> {item.coordinates.lat}, {item.coordinates.lng}
          </Typography>
        </Box>
        
        <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'grey.50' }}>
          <Typography variant="body2" color="text.secondary">
            {item.description}
          </Typography>
        </Paper>
      </CardContent>
    </Card>
  );
};

const RandomItemsOnMap = () => {
  const [clickPosition, setClickPosition] = useState('');
  const [randomItems, setRandomItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  
  const initialPosition = [35.6892, 51.3890]; 
    const handleMapClick = (latlng) => {
    setClickPosition(latlng);
    const newItems = generateRandomLocations(latlng);
    setRandomItems(newItems);
    setSelectedItem('');
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    

    <Box sx={{ p: 3, bgcolor: 'grey.100', minHeight: '100vh' }}>
    
  
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary.main">
        نمایش 20 لوکیشن تصادفی روی نقشه
      </Typography>
      
      <Typography variant="body1" paragraph color="text.secondary">
        روی هر نقطه از نقشه کلیک کنید 20 لوکیشن تصادفی در اطراف آن نمایش داده می شود.
      </Typography>      
      <Grid container spacing={2} sx={{ height: '70vh' }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ height: '100%', borderRadius: 2, overflow: 'hidden' }}>
            <MapContainer
              center={initialPosition}
              zoom={10}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <MapClickHandler onMapClick={handleMapClick} />
              
              {clickPosition && (
                <Marker position={[clickPosition.lat, clickPosition.lng]}>
                  <Popup>شما اینجا کلیک کردید</Popup>
                </Marker>
              )}
              
              {randomItems.map((item) => (
                <Marker 
                  key={item.id} 
                  position={item.position}
                  eventHandlers={{
                    click: () => handleItemClick(item)
                  }}
                >
                  <Popup>
                    <Box sx={{ textAlign: 'right', direction: 'rtl' }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {item.name}
                      </Typography>
                      <Typography variant="body2">
                        {item.type}
                      </Typography>
                    </Box>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper  sx={{ height: '100%', p: 2, borderRadius: 2,}}>
            {selectedItem ? (
              <ItemCard 
                item={selectedItem} 
                onClose={() => setSelectedItem(null)} 
              />
            ) : (
              <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                height="100%"
                textAlign="center"
                color="text.secondary"
              >
                <LocationIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" gutterBottom>
                  یک آیتم را انتخاب کنید
                </Typography>
                <Typography variant="body2">
                  روی یکی از آیتم‌های روی نقشه کلیک کنید تا اطلاعات کامل آن نمایش داده شود.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>      
  
    </Box>
  );
};

export default RandomItemsOnMap;