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

  const fetchAndCache = async (key, category, setter) => {
    const apiBase = import.meta.env.VITE_API_BASE;
    const cached = sessionStorage.getItem(key);
    const now = Date.now();

    if (cached) {
      const parsed = JSON.parse(cached);

      if (now - parsed.timestamp < 10800000) {
        if (parsed.data.articles && Array.isArray(parsed.data.articles)) {
          setter(parsed.data.articles.slice(0, 3));
          return parsed.data.articles[0];
        }
      }
    }

    try {
      const res = await fetch(`${apiBase}/category/${category}`);
      const data = await res.json();

      if (data.articles && Array.isArray(data.articles)) {
        sessionStorage.setItem(
          key,
          JSON.stringify({ timestamp: now, data })
        );
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

      const categories = [
        { key: 'business', setter: setBusinessData },
        { key: 'entertainment', setter: setEntertainmentData },
        { key: 'technology', setter: setTechnologyData },
        { key: 'health', setter: setHealthData }
      ];

      const results = [];

      for (const { key, setter } of categories) {
        const data = await fetchAndCache(key, key, setter);
        if (data) results.push(data);
        await delay(500);
      }

      setBannerNews(results);
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