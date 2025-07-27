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
  const [loadingBanner, setLoadingBanner] = useState(true);

  const API_KEY = import.meta.env.VITE_API;

  const fetchAndCache = async (key, category, setter) => {
    const cached = sessionStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.articles && Array.isArray(parsed.articles)) {
        setter(parsed.articles.slice(0, 3));
        return parsed.articles[0];
      }
    }

    try {
      const res = await fetch(`https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&apikey=${API_KEY}`);
      const data = await res.json();

      if (data.articles && Array.isArray(data.articles)) {
        sessionStorage.setItem(key, JSON.stringify(data));
        const displayArticles = data.articles.slice(0, 3);
        setter(displayArticles);
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
      setLoadingBanner(true);
      const business = await fetchAndCache('business', 'business', setBusinessData);
      await delay(2000);
      const entertainment = await fetchAndCache('entertainment', 'entertainment', setEntertainmentData);
      await delay(2000);
      const technology = await fetchAndCache('technology', 'technology', setTechnologyData);
      await delay(2000);
      const health = await fetchAndCache('health', 'health', setHealthData);

      setBannerNews([business, entertainment, technology, health].filter(Boolean));
      setLoadingBanner(false);
    };

    getAllNews();
  }, []);

  return (
    <div>
      <Header />
      <Banner newsItems={bannerNews} loading={loadingBanner} />
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