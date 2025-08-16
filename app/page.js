import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedEvents from "../components/FeaturedEvents";
import TicketBookingForm from "../components/TicketBookingForm";
import Footer from "../components/Footer";
import EventList from "@/components/EventList";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <EventList />
      {/* <TicketBookingForm /> */}
      <Footer/>
    </>
  );
}
