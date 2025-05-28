import Banner from '../components/Banner'
import Header from '../components/Header'

const Home = () => {

  document.title="EZ NEWS | Home"

  return (
    <div className=''>
      <Header/>
      <Banner/>
    </div>
  )
}

export default Home