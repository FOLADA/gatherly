import { useState, useCallback } from 'react';

interface EventDetails {
  id: string | number;
  title: string;
  description: string;
  heroImage: {
    src: string;
    alt: string;
    highRes?: boolean;
  };
  duration: {
    hours: number;
    minutes: number;
    formatted: string;
  };
  ageGroup: {
    min: number;
    max: number;
    formatted: string;
  };
  datetime: {
    date: string;
    time: string;
    timezone?: string;
    timestamp?: number;
  };
  location: {
    venue?: string;
    address: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

interface UseEventModalReturn {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  eventDetails: EventDetails | null;
  openModal: (eventId: string | number) => void;
  closeModal: () => void;
}

// Mock data for demonstration - replace with actual API calls
const mockEventDetails: Record<string | number, EventDetails> = {
  1: {
    id: 1,
    title: "შეხვედრა",
    description: "ეს არის საინტერესო შეხვედრა, სადაც შეგიძლიათ გაიცნოთ ახალი ადამიანები და გაიზიაროთ თქვენი გამოცდილება. ღონისძიება მოიცავს ინტერაქტიულ აქტივობებს, ქსელური კავშირების შექმნას და საინტერესო დისკუსიებს. მოდით ერთად და შექმნით ახალი მეგობრობები!",
    heroImage: {
      src: "/src/assets/geometric-background.jpg",
      alt: "შეხვედრა"
    },
    duration: {
      hours: 3,
      minutes: 0,
      formatted: "3 საათი"
    },
    ageGroup: {
      min: 18,
      max: 65,
      formatted: "18-65 წელი"
    },
    datetime: {
      date: "20 აპრილი",
      time: "10:00 საათი"
    },
    location: {
      venue: "კულტურის სახლი",
      address: "რუსთავის გამზირი 108, თბილისი 0112",
      city: "თბილისი"
    }
  },
  2: {
    id: 2,
    title: "კონცერტი",
    description: "დაუვიწყარი მუსიკალური საღამო ქართული და საერთაშორისო მუსიკით. კონცერტში მონაწილეობას მიიღებენ ცნობილი მუსიკოსები და ახალგაზრდა ტალანტები. ღონისძიება გაიმართება ღია ცის ქვეშ და შექმნის განსაკუთრებულ ატმოსფეროს.",
    heroImage: {
      src: "/src/assets/geometric-background.jpg",
      alt: "კონცერტი"
    },
    duration: {
      hours: 4,
      minutes: 30,
      formatted: "4 საათი 30 წუთი"
    },
    ageGroup: {
      min: 16,
      max: 99,
      formatted: "16+ წელი"
    },
    datetime: {
      date: "4 მაისი",
      time: "20:00 საათი"
    },
    location: {
      venue: "ღია ცის თეატრი",
      address: "მთაწმინდის პარკი, თბილისი",
      city: "თბილისი"
    }
  },
  3: {
    id: 3,
    title: "წიგნების საღამოების დღე",
    description: "ლიტერატურის მოყვარულებისთვის განკუთვნილი განსაკუთრებული ღონისძიება. საღამოს განმავლობაში შეგიძლიათ მოისმინოთ ავტორების წაკითხვები, მონაწილეობა მიიღოთ დისკუსიებში და გაიცნოთ თანამოაზრე ადამიანები.",
    heroImage: {
      src: "/src/assets/geometric-background.jpg",
      alt: "წიგნების საღამოების დღე"
    },
    duration: {
      hours: 2,
      minutes: 30,
      formatted: "2 საათი 30 წუთი"
    },
    ageGroup: {
      min: 18,
      max: 80,
      formatted: "18-80 წელი"
    },
    datetime: {
      date: "24 აპრილი",
      time: "19:00 საათი"
    },
    location: {
      venue: "ეროვნული ბიბლიოთეკა",
      address: "გურამ ფანჯიკიძის ქუჩა 5, თბილისი 0108",
      city: "თბილისი"
    }
  },
  4: {
    id: 4,
    title: "ფერების ფესტივალი",
    description: "ყველაზე ფერადი და მხიარული ღონისძიება წელს! ფესტივალი მოიცავს ხელოვნების გამოფენას, ინტერაქტიულ ვორქშოფებს, მუსიკას და ბევრ სხვა საინტერესო აქტივობას. მოიტანეთ თეთრი ტანსაცმელი და მოემზადეთ ფერების ზღვისთვის!",
    heroImage: {
      src: "/src/assets/geometric-background.jpg",
      alt: "ფერების ფესტივალი"
    },
    duration: {
      hours: 6,
      minutes: 0,
      formatted: "6 საათი"
    },
    ageGroup: {
      min: 5,
      max: 99,
      formatted: "ყველა ასაკი"
    },
    datetime: {
      date: "18 აპრილი",
      time: "14:00 საათი"
    },
    location: {
      venue: "რიკე პარკი",
      address: "რიკე პარკი, თბილისი",
      city: "თბილისი"
    }
  },
  5: {
    id: 5,
    title: "შეხვედრა",
    description: "პროფესიონალური ქსელური კავშირების შექმნის ღონისძიება ბიზნეს სფეროს წარმომადგენლებისთვის. შეხვედრაზე შეგიძლიათ გაიცნოთ ახალი პარტნიორები, გაიზიაროთ იდეები და შექმნათ ღირებული კონტაქტები.",
    heroImage: {
      src: "/src/assets/geometric-background.jpg",
      alt: "შეხვედრა"
    },
    duration: {
      hours: 2,
      minutes: 0,
      formatted: "2 საათი"
    },
    ageGroup: {
      min: 25,
      max: 65,
      formatted: "25-65 წელი"
    },
    datetime: {
      date: "30 მაისი",
      time: "11:00 საათი"
    },
    location: {
      venue: "ბიზნეს ცენტრი",
      address: "ვაჟა-ფშაველას გამზირი 25, თბილისი 0177",
      city: "თბილისი"
    }
  },
  6: {
    id: 6,
    title: "შეხვედრა",
    description: "კრეატიული ინდუსტრიების წარმომადგენლებისთვის განკუთვნილი შეხვედრა. ღონისძიება მოიცავს პრეზენტაციებს, ვორქშოფებს და ქსელური კავშირების შექმნის შესაძლებლობას. იდეალურია დიზაინერებისთვის, მარკეტერებისთვის და კრეატიული სფეროს სხვა სპეციალისტებისთვის.",
    heroImage: {
      src: "/src/assets/geometric-background.jpg",
      alt: "შეხვედრა"
    },
    duration: {
      hours: 3,
      minutes: 30,
      formatted: "3 საათი 30 წუთი"
    },
    ageGroup: {
      min: 20,
      max: 50,
      formatted: "20-50 წელი"
    },
    datetime: {
      date: "29 აპრილი",
      time: "12:00 საათი"
    },
    location: {
      venue: "კრეატიული სივრცე",
      address: "აღმაშენებლის გამზირი 15, თბილისი 0102",
      city: "თბილისი"
    }
  }
};

export const useEventModal = (): UseEventModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);

  const openModal = useCallback(async (eventId: string | number) => {
    setIsOpen(true);
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const details = mockEventDetails[eventId];
      if (details) {
        setEventDetails(details);
      } else {
        throw new Error('ღონისძიება ვერ მოიძებნა');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'უცნობი შეცდომა');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEventDetails(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    isOpen,
    isLoading,
    error,
    eventDetails,
    openModal,
    closeModal
  };
};
