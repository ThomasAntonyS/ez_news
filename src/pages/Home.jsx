import Banner from '../components/Banner'
import Footer from '../components/Footer';
import Header from '../components/Header'
import HomeSliders from '../components/HomeSliders'
import NewSection from '../components/NewSection'

const Home = () => {
  document.title = "EZ NEWS | Home";

  const businessData = [
    {
      image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Scaling Your Startup',
      description: 'Learn strategies for scaling your business effectively in competitive markets.',
    },
    {
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Investor Talks: Raising Capital',
      description: 'Hear from top VCs and angel investors on what they look for in a pitch.',
    },
    {
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Investor Talks: Raising Capital',
      description: 'Hear from top VCs and angel investors on what they look for in a pitch.',
    },    
  ];

  const entertainmentData = [
    {
      image: 'https://images.pexels.com/photos/799137/pexels-photo-799137.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Behind the Scenes: Film Production',
      description: 'Go inside the making of blockbuster movies and indie hits.',
    },
    {
      image: 'https://images.pexels.com/photos/1647169/pexels-photo-1647169.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Music Trends in 2025',
      description: 'Explore the future of sound and the tech shaping today’s music scene.',
    },
    {
      image: 'https://images.pexels.com/photos/1647169/pexels-photo-1647169.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Music Trends in 2025',
      description: 'Explore the future of sound and the tech shaping today’s music scene.',
    },
  ];

  const technologyData = [
    {
      image: 'https://images.pexels.com/photos/3861959/pexels-photo-3861959.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'AI in Everyday Life',
      description: 'How artificial intelligence is transforming consumer technology.',
    },
    {
      image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Cybersecurity Trends',
      description: 'Tips to protect your personal data and emerging threats to watch.',
    },
    {
      image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Cybersecurity Trends',
      description: 'Tips to protect your personal data and emerging threats to watch.',
    },
  ];

  return (
    <div>
      <Header />
      <Banner />
      <NewSection />

      {/* Dummy podcast sections */}
      <HomeSliders sectionTitle="Business" podcastData={businessData} />
      <HomeSliders sectionTitle="Entertainment" podcastData={entertainmentData} />
      <HomeSliders sectionTitle="Technology" podcastData={technologyData} />
      <HomeSliders sectionTitle="Health" podcastData={technologyData} />

      <Footer/>
    </div>
  );
};

export default Home;
