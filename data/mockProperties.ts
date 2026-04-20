export type PropertyType = 'House' | 'Apartment' | 'Villa' | 'Penthouse' | 'Studio';

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  currency: string;
  priceType?: '/mo';
  beds: number;
  baths: number;
  area: number; // in m²
  imageUrl: string;
  type: PropertyType;
  status: 'FOR SALE' | 'FOR RENT';
  badges?: string[];
}

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'The Glass Pavilion',
    location: 'Beverly Hills, California',
    price: 5250000,
    currency: '$',
    beds: 5,
    baths: 4.5,
    area: 4200,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCra-FKp81t0_OM8bWD55m2o9OOSnR_v7D0UilyExMImxyIcr9tIMZ2Py3HcC0ra_MtSsBkduMcwxUNKI9_iSXFFr_YRON1SF9hNM3fcYy-uG7N7uusL0Z367WINi1V7_GwfNQx-gsbUqLtzVi4ivFyqFQGb4qBs79bALeSFb6i3_ZnJnI1VVrN-VeZYHjfYyQI5C6zy90N3uxWZpwzIBhNoUDKKQjQ8EOEYPoyPTzhnh6b6AS3dkkFJ8t4xSDC6qjhMrQUoUPnAeM',
    type: 'Villa',
    status: 'FOR SALE',
    badges: ['Exclusive']
  },
  {
    id: '2',
    title: 'Azure Heights Penthouse',
    location: 'Downtown, Vancouver',
    price: 3800000,
    currency: '$',
    beds: 3,
    baths: 3,
    area: 2100,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDurAGHzg_fpQxFal-obkFVy1Q3WLPdueAQpz0itcQiRV-WfvulnBEDJbNeV8J06q4mX7PTtXYVJjX4-mHVr_khZLZxQ_s8f6fruGqzeqALyMu8wEHRK1EsOs9f4_jPmS7FxcdzrDkR88Wz0GjaPLXkTZRoJQfur59rxYRLi-WYcW-VU_gKS39CPLOMlftvqGvW0IOk5tXgst5mJ4WQM-ICN4vkdel9ido9YFUQga0OI10i6NSe5W4owt33-2YRi_b_ltdZW2QZC5s',
    type: 'Penthouse',
    status: 'FOR SALE',
    badges: ['New Arrival']
  },
  {
    id: '3',
    title: 'Modern Family Home',
    location: '123 Pine St, Seattle',
    price: 850000,
    currency: '$',
    beds: 3,
    baths: 2,
    area: 120,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuQ9M7U6euA6_cXmYuXnej-N5IuawAW8ds-4G1mzfqmiBc13qXsPhf9_j_zTB8gfEunrBHo8xMsxYwCw_pl8fsxbxRkmyvLR1N9Tiye5ZJG7fwlLn9MwyBanXYhE0emGwp59es1FEyQTRQbmXLUKO74Yj34ZHqrqIkOtMKhP8CmRFvfoHT5LAe10105vUhKNkxIBvtt530nfLigSUTemOOcJMVNmsgactntRJUwOBU_TZzND7BYtDklr8uZcNYlQOK5U74-ufIf-E',
    type: 'House',
    status: 'FOR SALE'
  },
  {
    id: '4',
    title: 'Urban Loft',
    location: '456 Elm Ave, Portland',
    price: 3200,
    currency: '$',
    priceType: '/mo',
    beds: 1,
    baths: 1,
    area: 85,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4zNatD3vePhIZAi6OHHJKmamYSgeBNSKjEt32tvkkf4s6aBXCF8R4LNfDfPa9leA0t6N1OKOcP358WwZrnosbCBxSM7EaY2_P7qkx3MinRgmHQn7RvleNTwy8cLigMoR3iv0u83chBVbZYI6BcNMcqv80W-l1pIUgIWZcDIXEqtUatrsojSGfM0lTNDZpkBntBUkRY6NB4ZUymYNYvTHXKbO8NZ6N6uoyuuHqcaRWKzHCNXkOR3p-_EVFAHR8QwijIY_m1mefPZ4',
    type: 'Apartment',
    status: 'FOR RENT'
  },
  {
    id: '5',
    title: 'Highland Retreat',
    location: '789 Mountain Rd, Bend',
    price: 620000,
    currency: '$',
    beds: 2,
    baths: 2,
    area: 98,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARQWC19e7mleUpjb8CWLztEv_svJeRFOaC2i-9r9GctFuX5Barzhfai9wNM1WW8bcGlqdFM32d3KPf7SItom5ijdHOz5rGGQPeT7PlWs8-y9LkfcsHLQqsLxalhxP94XJo76_mAMp7T2dVj3hPKHNzTDLLiS6ujSdSsyo3onxQthp4ZkVE8op92gyTLUUucaGaxO8vJvyhH3HuWB07EPqT1WsW0lr9Of5lUPonjG9eiqE1XiJXTqzXUZQt5JorfPwCO1MioZA_Zro',
    type: 'House',
    status: 'FOR SALE'
  },
  {
    id: '6',
    title: 'Sea View Penthouse',
    location: '321 Ocean Dr, Miami',
    price: 4500,
    currency: '$',
    priceType: '/mo',
    beds: 3,
    baths: 3,
    area: 180,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGq4Phm0uDzCnjHAsnWpYTBVpOds_M6iOsJuRQQA5eUZHkztGgtc7eh_OE6wBeyW1-iZh7yyhROnvvmqkAZ9tyAWFGXk0FG52zU4kZ_EDLA0U0cRszy7byNXTeWe0_hS53SYmtCTEV8Y1AM-WxiIC38UMa15QwFDjXtCGQOxoh35K0Ol_70vfsxm0VqDbaWkr8tcEbLTLy0NXH_GcpGK4lAXizgxYOIlFWGyau-4OIfPZRpjCBDbz_qu3VlN201UUJGiuM9ajVd-U',
    type: 'Penthouse',
    status: 'FOR RENT'
  },
  {
    id: '7',
    title: 'Central Studio',
    location: '555 Main St, Chicago',
    price: 550000,
    currency: '$',
    beds: 1,
    baths: 1,
    area: 50,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1w-Hb1289NqZKon3VK8bpmMiCDYYiAMT5egzTINo9m9wSZRHv-k-1IGTVoL1NT8YeZXJHa87JPNDIPrtrbP7jChHq0ypXF90uByhC6VA9O788_B4FY8JVg4chbWN9bcrn9-9FvVvfZX8Aj60Iqg_C8CsCA9DEnJqi2rJvzmK5UP5z-9XRTRjBneAPCa8iGgGWBD9yYKsziN6vn0ePBDGo3inieQtmbr46W31p6UfQ649XRxTm7ygOY2J-jxW1r0qWs8i97KGpkTE',
    type: 'Studio',
    status: 'FOR SALE'
  },
  {
    id: '8',
    title: 'Garden Villa',
    location: '999 Oak Ln, Austin',
    price: 2800,
    currency: '$',
    priceType: '/mo',
    beds: 2,
    baths: 2,
    area: 110,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfGXdY0g51ojSg0GMeTW9ndLY3mpKK3oMtWxo2nwd_dwi1pgn1Boi_ovaDGIFhUA7nwu3WdBch8ZuHxoHu3QfgM5ceAsp8pglRVyCROWNcy9zeDNP2wqLoevyKGcaEyFYHYpIx2KK46nLWthnHiHugmkKw48kJsL8IjMO1bL3T1Zwt8bvQDTTUHTgB3GqZ2RU2asRzF1jVg0rLw3LWXXTq0YF1CsbhlWpYOuCEpH5bB8zkBlbKXR4At_M46AL8rJqn5c6BrPD5PP8',
    type: 'Villa',
    status: 'FOR RENT'
  },
  {
    id: '9',
    title: 'Sunset Boulevard Estate',
    location: 'Los Angeles, California',
    price: 12500000,
    currency: '$',
    beds: 6,
    baths: 7,
    area: 8500,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Villa',
    status: 'FOR SALE',
    badges: ['Luxury', 'Pool']
  },
  {
    id: '10',
    title: 'Downtown Skyscraper Apt',
    location: 'New York City, NY',
    price: 8500,
    currency: '$',
    priceType: '/mo',
    beds: 2,
    baths: 2,
    area: 140,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Apartment',
    status: 'FOR RENT'
  },
  {
    id: '11',
    title: 'Lakefront Mansion',
    location: 'Lake Tahoe, Nevada',
    price: 6750000,
    currency: '$',
    beds: 5,
    baths: 5.5,
    area: 5200,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'House',
    status: 'FOR SALE',
    badges: ['Waterfront']
  },
  {
    id: '12',
    title: 'Minimalist Studio',
    location: 'San Francisco, CA',
    price: 2900,
    currency: '$',
    priceType: '/mo',
    beds: 1,
    baths: 1,
    area: 45,
    imageUrl: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Studio',
    status: 'FOR RENT'
  },
  {
    id: '13',
    title: 'Historic Townhouse',
    location: 'Boston, Massachusetts',
    price: 1850000,
    currency: '$',
    beds: 4,
    baths: 3,
    area: 2800,
    imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'House',
    status: 'FOR SALE'
  },
  {
    id: '14',
    title: 'Luxury Sky Penthouse',
    location: 'Dubai, UAE',
    price: 15000000,
    currency: '$',
    beds: 4,
    baths: 5,
    area: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Penthouse',
    status: 'FOR SALE',
    badges: ['Premium']
  },
  {
    id: '15',
    title: 'Cozy Suburban Home',
    location: 'Denver, Colorado',
    price: 3200,
    currency: '$',
    priceType: '/mo',
    beds: 3,
    baths: 2,
    area: 160,
    imageUrl: 'https://images.unsplash.com/photo-1600566753086-00f18efc2294?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'House',
    status: 'FOR RENT'
  },
  {
    id: '16',
    title: 'Tropical Beach Villa',
    location: 'Maui, Hawaii',
    price: 8900000,
    currency: '$',
    beds: 4,
    baths: 4.5,
    area: 3800,
    imageUrl: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Villa',
    status: 'FOR SALE',
    badges: ['Beachfront']
  },
  {
    id: '17',
    title: 'Modern Art Loft',
    location: 'London, UK',
    price: 4500,
    currency: '$',
    priceType: '/mo',
    beds: 2,
    baths: 2,
    area: 130,
    imageUrl: 'https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Apartment',
    status: 'FOR RENT'
  },
  {
    id: '18',
    title: 'Countryside Manor',
    location: 'Cotswolds, UK',
    price: 4200000,
    currency: '$',
    beds: 7,
    baths: 5,
    area: 6000,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'House',
    status: 'FOR SALE',
    badges: ['Historic']
  }
];
