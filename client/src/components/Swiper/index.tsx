import { useEffect, useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSwiper } from "../../services/swiper";
import Card from "../Card";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "./style.css";

interface Service {
  id: number;
  title: string;
  description: string;
  picture: string;
  type?: string;
}

interface ServiceSwiperProps {
  itemsToShow?: number;
  type?: string;
}

export default function ServiceSwiper({
  itemsToShow,
  type,
}: ServiceSwiperProps) {
  const isSwiperActive = useSwiper();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3310/api/service");
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des services");
        }
        const data: Service[] = await response.json();

        const filteredServices = type
          ? data.filter((item) => item.type === type)
          : data;

        setServices(filteredServices);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [type]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  const displayedServices = itemsToShow
    ? services.slice(0, itemsToShow)
    : services;

  return (
    <article className="imageContainer">
      {isSwiperActive ? (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          pagination={{ clickable: true, type: "bullets" }}
          autoplay={{ delay: 3000, disableOnInteraction: true }}
          loop={displayedServices.length > 4}
          spaceBetween={50}
          slidesPerView={1}
          className="mySwiper"
        >
          {displayedServices.map((service) => (
            <SwiperSlide key={service.id} className="swiperImg">
              <Card
                figureClass="crlImgContainer"
                title={service.title}
                description={service.description}
                picture={service.picture}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        displayedServices.map((service) => (
          <Card
            key={service.id}
            figureClass="cardDesktop"
            title={service.title}
            description={service.description}
            picture={service.picture}
          />
        ))
      )}
    </article>
  );
}
