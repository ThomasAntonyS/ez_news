import { useEffect, useState } from 'react';
import Banner from '../components/Banner';
import Footer from '../components/Footer';
import Header from '../components/Header';
import HomeSliders from '../components/HomeSliders';
import NewSection from '../components/NewSection';

const Home = () => {
  document.title = "EZ NEWS | Home";

  const [businessData, setBusinessData] = useState([]);
  const [entertainmentData, setEntertainmentData] = useState([]);
  const [technologyData, setTechnologyData] = useState([]);
  const [healthData, setHealthData] = useState([]);
  const [bannerNews, setBannerNews] = useState([]);

  const API_KEY = import.meta.env.VITE_API;

  const fetchAndCache = async (key, category, setter) => {
    const cached = sessionStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      setter(parsed);
      return parsed[0]; // return top article
    }

    try {
      const res = await fetch(`https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&max=3&apikey=${API_KEY}`);
      const data = await res.json();

      if (data.articles) {
        sessionStorage.setItem(key, JSON.stringify(data.articles));
        setter(data.articles);
        return data.articles[0];
      }
    } catch (error) {
      console.error(`Error fetching ${category} news:`, error);
    }

    return null;
  };

  useEffect(() => {
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    const getAllNews = async () => {
      const business = await fetchAndCache('business', 'business', setBusinessData);
      await delay(2000);
      const entertainment = await fetchAndCache('entertainment', 'entertainment', setEntertainmentData);
      await delay(2000);
      const technology = await fetchAndCache('technology', 'technology', setTechnologyData);
      await delay(2000);
      const health = await fetchAndCache('health', 'health', setHealthData);

      setBannerNews([business, entertainment, technology, health].filter(Boolean));
    };

    getAllNews();
  }, []);

  return (
    <div>
      <Header />
      <Banner newsItems={bannerNews} />
      <NewSection />

      <HomeSliders sectionTitle="Business" categoryPath="business" podcastData={businessData} />
      <HomeSliders sectionTitle="Entertainment" categoryPath="entertainment" podcastData={entertainmentData} />
      <HomeSliders sectionTitle="Technology" categoryPath="technology" podcastData={technologyData} />
      <HomeSliders sectionTitle="Health" categoryPath="health" podcastData={healthData} />

      <Footer />
    </div>
  );
};

export default Home;
