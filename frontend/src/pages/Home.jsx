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

  const fetchAndCacheNews = async (category, setter) => {
    const apiBase = import.meta.env.VITE_API_BASE;
    const cacheKey = `${category}_1`;
    const now = Date.now();

    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        const cacheTime = 8 * 60 * 60 * 1000
        if (now - parsed.timestamp < cacheTime) {
          if (parsed.data?.articles?.length > 0) {
            setter(parsed.data.articles.slice(0, 3));
            return parsed.data.articles[0];
          }
        }
      }

      const res = await fetch(`${apiBase}/category/${category}/1`);
      const data = await res.json();

      if (data.articles?.length > 0) {
        sessionStorage.setItem(
          cacheKey,
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
    const categoriesToFetch = [
      { category: 'business', setter: setBusinessData },
      { category: 'entertainment', setter: setEntertainmentData },
      { category: 'technology', setter: setTechnologyData },
      { category: 'health', setter: setHealthData }
    ];

    const getInitialNews = async () => {
      setLoadingBanner(true);
      const bannerArticles = [];
      const isAnyCategoryMissing = categoriesToFetch.some(
        (cat) => !sessionStorage.getItem(`${cat.category}_1`)
      );

      const delayBetweenFetches = isAnyCategoryMissing ? 1100 : 0;
      const delay = (ms) => new Promise((res) => setTimeout(res, ms));

      for (const { category, setter } of categoriesToFetch) {
        const bannerArticle = await fetchAndCacheNews(category, setter);
        if (bannerArticle) {
          bannerArticles.push(bannerArticle);
        }
        await delay(delayBetweenFetches);
      }

      setBannerNews(bannerArticles);
      setLoadingBanner(false);
    };

    getInitialNews();
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
